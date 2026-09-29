import { getAiProviderEnvironmentStatus, getAiProviderSettings, type AiProvider } from "@/lib/ai/settings";

type GeneratedContentData = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

type AiSuccess = {
  ok: true;
  data: GeneratedContentData;
  model: string;
  provider: AiProvider;
};

type AiFailure = {
  ok: false;
  status: number;
  message: string;
  model: string;
  provider: AiProvider;
  code?: string;
  requestId?: string;
};

type GeminiBody = {
  contents?: Array<{
    parts?: Array<
      | { text?: string }
      | { inlineData?: { mimeType?: string; data?: string } }
    >;
  }>;
  generationConfig?: {
    temperature?: number;
    responseMimeType?: string;
    responseSchema?: Record<string, unknown>;
    maxOutputTokens?: number;
  };
};

type OpenAiResponse = {
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
  error?: { message?: string; code?: string; type?: string };
};

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const TRANSIENT_STATUSES = new Set([408, 409, 429, 500, 502, 503, 504]);

function readResponseText(data: OpenAiResponse) {
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === "output_text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("")
    .trim();
}

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

const OPENAI_LIMIT_CODES = new Set([
  "credit_balance_exhausted",
  "organization_spend_limit_exceeded",
  "project_spend_limit_exceeded",
  "organization_usage_limit_exceeded",
  "insufficient_quota",
]);

function providerError(provider: AiProvider, status: number, message?: string, code?: string) {
  if (status === 429 && code && OPENAI_LIMIT_CODES.has(code)) {
    return "AI capacity is temporarily unavailable. Please try again shortly.";
  }
  if (status === 429) return `${provider === "openai" ? "OpenAI" : "Gemini"} is busy right now. Please try again shortly.`;
  if (status === 401 || status === 403) return `${provider === "openai" ? "OpenAI" : "Gemini"} is not authorized. Please check the server API key and billing access.`;
  if (status >= 500) return "AI generation is temporarily unavailable. Please try again in a few minutes.";
  return message?.trim() || "AI generation failed. Please check the input and try again.";
}

function logProviderFailure(failure: AiFailure, stage: "primary" | "fallback") {
  console.warn("AI provider request failed", {
    stage,
    provider: failure.provider,
    model: failure.model,
    status: failure.status,
    code: failure.code || "unknown",
    requestId: failure.requestId || "unknown",
  });
}

async function generateWithGemini(body: GeminiBody): Promise<AiSuccess | AiFailure> {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  const primaryModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL?.trim() || "gemini-2.5-flash-lite";
  const models = [...new Set([primaryModel, fallbackModel].filter(Boolean))];

  if (!apiKey) {
    return { ok: false, status: 503, message: "Gemini is selected but its API key is not configured.", model: primaryModel, provider: "gemini" };
  }

  let lastFailure: AiFailure | null = null;
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(55_000),
        },
      );
      const data = await readJson(response);
      if (response.ok) return { ok: true, data: (data || {}) as GeneratedContentData, model, provider: "gemini" };

      const providerErrorData = (data as { error?: { message?: string; status?: string } } | null)?.error;
      lastFailure = {
        ok: false,
        status: response.status,
        message: providerError("gemini", response.status, providerErrorData?.message, providerErrorData?.status),
        model,
        provider: "gemini",
        code: providerErrorData?.status,
      };
      if (!TRANSIENT_STATUSES.has(response.status)) return lastFailure;
    } catch {
      lastFailure = { ok: false, status: 502, message: "Gemini could not be reached. Please try again shortly.", model, provider: "gemini" };
    }
  }

  return lastFailure || { ok: false, status: 502, message: "Gemini generation failed.", model: primaryModel, provider: "gemini" };
}

function toOpenAiContent(body: GeminiBody) {
  const content: Array<Record<string, unknown>> = [];
  for (const item of body.contents || []) {
    for (const part of item.parts || []) {
      if ("text" in part && part.text) {
        content.push({ type: "input_text", text: part.text });
      } else if ("inlineData" in part && part.inlineData?.data && part.inlineData.mimeType) {
        const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        if (part.inlineData.mimeType.startsWith("image/")) {
          content.push({ type: "input_image", image_url: dataUrl, detail: "auto" });
        } else {
          content.push({ type: "input_file", file_data: dataUrl, filename: `upload.${part.inlineData.mimeType.split("/").pop() || "bin"}` });
        }
      }
    }
  }
  return content;
}

function normalizeJsonSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeJsonSchema);
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(source)) {
    normalized[key] = key === "type" && typeof child === "string"
      ? child.toLowerCase()
      : normalizeJsonSchema(child);
  }
  return normalized;
}

async function generateWithOpenAi(body: GeminiBody): Promise<AiSuccess | AiFailure> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const primaryModel = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";
  const fallbackModel = process.env.OPENAI_FALLBACK_MODEL?.trim() || "gpt-5-mini";
  const models = [...new Set([primaryModel, fallbackModel].filter(Boolean))];

  if (!apiKey) {
    return { ok: false, status: 503, message: "OpenAI is selected but its API key is not configured.", model: primaryModel, provider: "openai" };
  }

  const content = toOpenAiContent(body);
  if (!content.length) {
    return { ok: false, status: 400, message: "The AI request did not include any usable content.", model: primaryModel, provider: "openai" };
  }

  const config = body.generationConfig;
  const schema = config?.responseSchema ? normalizeJsonSchema(config.responseSchema) : null;
  let lastFailure: AiFailure | null = null;

  for (const model of models) {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          input: [{ role: "user", content }],
          max_output_tokens: config?.maxOutputTokens || 12_000,
          ...(schema
            ? { text: { format: { type: "json_schema", name: "tool_result", strict: false, schema } } }
            : {}),
        }),
        signal: AbortSignal.timeout(55_000),
      });
      const data = (await readJson(response)) as OpenAiResponse | null;
      if (response.ok && data) {
        const text = readResponseText(data);
        if (!text) {
          lastFailure = { ok: false, status: 502, message: "OpenAI returned an empty response.", model, provider: "openai" };
          continue;
        }
        return {
          ok: true,
          data: { candidates: [{ content: { parts: [{ text }] } }] },
          model,
          provider: "openai",
        };
      }

      const status = response.status;
      const code = data?.error?.code || data?.error?.type;
      lastFailure = {
        ok: false,
        status,
        message: providerError("openai", status, data?.error?.message, code),
        model,
        provider: "openai",
        code,
        requestId: response.headers.get("x-request-id") || undefined,
      };
      if (status === 429 && code && OPENAI_LIMIT_CODES.has(code)) return lastFailure;
      if (!TRANSIENT_STATUSES.has(status)) return lastFailure;
    } catch {
      lastFailure = { ok: false, status: 502, message: "OpenAI could not be reached. Please try again shortly.", model, provider: "openai" };
    }
  }

  return lastFailure || { ok: false, status: 502, message: "OpenAI generation failed.", model: primaryModel, provider: "openai" };
}

export async function generateAiContent(body: GeminiBody): Promise<AiSuccess | AiFailure> {
  const { provider } = await getAiProviderSettings();
  const environment = getAiProviderEnvironmentStatus();
  const primary = provider === "openai" ? generateWithOpenAi : generateWithGemini;
  const fallbackProvider: AiProvider = provider === "openai" ? "gemini" : "openai";
  const fallbackConfigured = fallbackProvider === "openai" ? environment.openai : environment.gemini;

  const primaryResult = await primary(body);
  if (primaryResult.ok) return primaryResult;
  logProviderFailure(primaryResult, "primary");

  if (!fallbackConfigured) return primaryResult;

  const fallback = fallbackProvider === "openai" ? generateWithOpenAi : generateWithGemini;
  const fallbackResult = await fallback(body);
  if (fallbackResult.ok) {
    console.info("AI provider fallback succeeded", {
      primaryProvider: provider,
      fallbackProvider,
      fallbackModel: fallbackResult.model,
    });
    return fallbackResult;
  }

  logProviderFailure(fallbackResult, "fallback");
  return {
    ...fallbackResult,
    status: fallbackResult.status >= 500 ? fallbackResult.status : 503,
    message: "AI services are temporarily unavailable. Please try again shortly.",
  };
}

export async function getAiRuntimeStatus() {
  const settings = await getAiProviderSettings();
  return { ...settings, ...getAiProviderEnvironmentStatus() };
}
