import { createHash } from "crypto";
import type { ResumeAnalysis } from "@/lib/resume/analysis";

type GeminiEnhancement = Pick<ResumeAnalysis, "grammarIssues" | "bulletSuggestions" | "improvedBullets" | "interviewQuestions">;

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

const cache = new Map<string, { expiresAt: number; value: GeminiEnhancement }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cleanText(value: unknown, max = 900) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanList(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(item)).filter(Boolean).slice(0, maxItems);
}

function cleanSuggestions(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const entry = item as Record<string, unknown>;
    const original = cleanText(entry.original);
    const suggestion = cleanText(entry.suggestion);
    const reason = cleanText(entry.reason);
    return original && suggestion ? [{ original, suggestion, reason: reason || "Improves clarity and relevance." }] : [];
  }).slice(0, maxItems);
}

function normalizeEnhancement(value: unknown): GeminiEnhancement | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  return {
    grammarIssues: cleanSuggestions(source.grammarIssues, 5),
    bulletSuggestions: cleanSuggestions(source.bulletSuggestions, 5),
    improvedBullets: cleanList(source.improvedBullets, 6),
    interviewQuestions: cleanList(source.interviewQuestions, 5),
  };
}

function redactPersonalData(value: string) {
  return value
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL REDACTED]")
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[PHONE REDACTED]")
    .replace(/https?:\/\/\S+|\b(?:www\.)?linkedin\.com\/\S+|\b(?:www\.)?github\.com\/\S+/gi, "[URL REDACTED]");
}

export async function enhanceResumeWithFreeGemini(input: {
  resumeText: string;
  targetRole: string;
  jobDescription?: string;
  missingKeywords: string[];
}): Promise<GeminiEnhancement | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.ATS_GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";
  const redactedResume = redactPersonalData(input.resumeText).slice(0, 16_000);
  const prompt = [
    "Improve a resume using only factual content already present below.",
    "Return JSON only. Never invent employers, credentials, tools, responsibilities, numbers, or achievements.",
    "For grammarIssues and bulletSuggestions, original must be an exact phrase from the resume.",
    "If a stronger bullet would require an unknown metric, improve wording without adding a number.",
    "Keep every item concise. Return an empty array when no defensible suggestion exists.",
    `Target role: ${input.targetRole}`,
    `Missing terms found by the local checker: ${input.missingKeywords.slice(0, 10).join(", ") || "None"}`,
    input.jobDescription ? `Job description excerpt: ${redactPersonalData(input.jobDescription).slice(0, 4_000)}` : "",
    "RESUME:",
    redactedResume,
  ].filter(Boolean).join("\n");
  const cacheKey = createHash("sha256").update(`${model}\n${prompt}`).digest("hex");
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: 1_500,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              grammarIssues: suggestionSchema(),
              bulletSuggestions: suggestionSchema(),
              improvedBullets: { type: "ARRAY", items: { type: "STRING" } },
              interviewQuestions: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["grammarIssues", "bulletSuggestions", "improvedBullets", "interviewQuestions"],
          },
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.warn("Free Gemini ATS enhancement skipped", { status: response.status, model });
      return null;
    }
    const data = await response.json() as GeminiResponse;
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;
    const enhancement = normalizeEnhancement(JSON.parse(rawText));
    if (!enhancement) return null;
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, value: enhancement });
    if (cache.size > 200) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    return enhancement;
  } catch (error) {
    console.warn("Free Gemini ATS enhancement unavailable", { model, error: error instanceof Error ? error.name : "unknown" });
    return null;
  }
}

function suggestionSchema() {
  return {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: { original: { type: "STRING" }, suggestion: { type: "STRING" }, reason: { type: "STRING" } },
      required: ["original", "suggestion", "reason"],
    },
  };
}
