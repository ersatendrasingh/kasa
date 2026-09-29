const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function load(relative, mocks) {
  const filename = path.resolve(__dirname, "..", relative);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith("@/")) return load(`${id.slice(2)}.ts`, mocks);
    return require(id);
  };
  new Function("require", "module", "exports", source)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const originalFetch = global.fetch;
const originalWarn = console.warn;
const originalInfo = console.info;
const originalOpenAiKey = process.env.OPENAI_API_KEY;
const originalGeminiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  global.fetch = originalFetch;
  console.warn = originalWarn;
  console.info = originalInfo;
  if (originalOpenAiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalOpenAiKey;
  if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiKey;
});

function gateway(primaryProvider = "openai") {
  process.env.OPENAI_API_KEY = "test-openai-key";
  process.env.GEMINI_API_KEY = "test-gemini-key";
  console.warn = () => {};
  console.info = () => {};
  return load("lib/ai/gateway.ts", {
    "@/lib/ai/settings": {
      getAiProviderSettings: async () => ({ provider: primaryProvider }),
      getAiProviderEnvironmentStatus: () => ({
        openai: true,
        gemini: true,
        openaiModel: "gpt-test",
        geminiModel: "gemini-test",
      }),
    },
  });
}

const body = {
  contents: [{ parts: [{ text: "Analyze this test resume." }] }],
  generationConfig: { responseMimeType: "application/json" },
};

test("falls back to Gemini when OpenAI credits or limits reject the request", async () => {
  const urls = [];
  global.fetch = async (url) => {
    urls.push(String(url));
    if (String(url).includes("api.openai.com")) {
      return new Response(JSON.stringify({ error: { type: "insufficient_quota", code: "credit_balance_exhausted" } }), {
        status: 429,
        headers: { "content-type": "application/json", "x-request-id": "req_test" },
      });
    }
    return Response.json({ candidates: [{ content: { parts: [{ text: '{"score":83}' }] } }] });
  };

  const result = await gateway().generateAiContent(body);

  assert.equal(result.ok, true);
  assert.equal(result.provider, "gemini");
  assert.equal(urls.length, 2);
  assert.match(urls[0], /api\.openai\.com/);
  assert.match(urls[1], /generativelanguage\.googleapis\.com/);
});

test("keeps OpenAI as primary when it succeeds", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return Response.json({ output: [{ content: [{ type: "output_text", text: '{"score":91}' }] }] });
  };

  const result = await gateway().generateAiContent(body);

  assert.equal(result.ok, true);
  assert.equal(result.provider, "openai");
  assert.equal(calls, 1);
});

test("returns a provider-neutral message only when both configured providers fail", async () => {
  global.fetch = async (url) => {
    if (String(url).includes("api.openai.com")) {
      return Response.json({ error: { code: "project_spend_limit_exceeded" } }, { status: 429 });
    }
    return Response.json({ error: { status: "RESOURCE_EXHAUSTED" } }, { status: 429 });
  };

  const result = await gateway().generateAiContent(body);

  assert.equal(result.ok, false);
  assert.equal(result.status, 503);
  assert.equal(result.message, "AI services are temporarily unavailable. Please try again shortly.");
});
