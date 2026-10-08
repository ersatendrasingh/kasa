const assert = require("node:assert/strict");
const { afterEach, test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadModule() {
  const filename = path.resolve(__dirname, "..", "lib/resume/gemini-enhancement.ts");
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const loadedModule = { exports: {} };
  new Function("require", "module", "exports", source)(require, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const originalFetch = global.fetch;
const originalKey = process.env.GEMINI_API_KEY;
const originalGoogleKey = process.env.GOOGLE_API_KEY;
const originalModel = process.env.ATS_GEMINI_MODEL;
const originalWarn = console.warn;

afterEach(() => {
  global.fetch = originalFetch;
  console.warn = originalWarn;
  if (originalKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = originalKey;
  if (originalGoogleKey === undefined) delete process.env.GOOGLE_API_KEY; else process.env.GOOGLE_API_KEY = originalGoogleKey;
  if (originalModel === undefined) delete process.env.ATS_GEMINI_MODEL; else process.env.ATS_GEMINI_MODEL = originalModel;
});

const input = {
  resumeText: "Asha Sharma\nasha@example.com | +91 98765 43210\nEXPERIENCE\n- Built a React dashboard for students.",
  targetRole: "Frontend Developer",
  missingKeywords: ["TypeScript"],
};

test("skips Gemini cleanly when no free API key is configured", async () => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
  let calls = 0;
  global.fetch = async () => { calls += 1; return Response.json({}); };
  const result = await loadModule().enhanceResumeWithFreeGemini(input);
  assert.equal(result, null);
  assert.equal(calls, 0);
});

test("uses only Gemini Flash-Lite and redacts contact details", async () => {
  process.env.GEMINI_API_KEY = "free-test-key";
  delete process.env.ATS_GEMINI_MODEL;
  let requestUrl = "";
  let requestBody = "";
  global.fetch = async (url, init) => {
    requestUrl = String(url);
    requestBody = String(init.body);
    return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify({
      grammarIssues: [],
      bulletSuggestions: [{ original: "Built a React dashboard", suggestion: "Developed a React dashboard for students", reason: "Uses a stronger action verb." }],
      improvedBullets: ["Developed a React dashboard for students."],
      interviewQuestions: ["How did you design the dashboard?"],
    }) }] } }] });
  };
  const result = await loadModule().enhanceResumeWithFreeGemini(input);
  assert.match(requestUrl, /generativelanguage\.googleapis\.com/);
  assert.match(requestUrl, /gemini-2\.5-flash-lite/);
  assert.doesNotMatch(requestUrl, /openai/i);
  assert.doesNotMatch(requestBody, /asha@example\.com/);
  assert.doesNotMatch(requestBody, /98765 43210/);
  assert.equal(result.improvedBullets.length, 1);
});

test("returns local fallback signal when Gemini free quota is exhausted", async () => {
  process.env.GEMINI_API_KEY = "free-test-key";
  console.warn = () => {};
  global.fetch = async () => Response.json({ error: { status: "RESOURCE_EXHAUSTED" } }, { status: 429 });
  const result = await loadModule().enhanceResumeWithFreeGemini({ ...input, targetRole: "React Developer" });
  assert.equal(result, null);
});
