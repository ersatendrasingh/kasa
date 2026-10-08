import { NextRequest, NextResponse } from "next/server";
import { atsVisitorCookieName, getAtsVisitorIdentity, recordAtsCheck } from "@/lib/ats/analytics";
import { analyzeResumeLocally, type LocalResumeInput } from "@/lib/resume/local-analysis";
import { enhanceResumeWithFreeGemini } from "@/lib/resume/gemini-enhancement";
import { validateAnalysis } from "@/lib/resume/analysis";

type ResumeAtsRequest = LocalResumeInput & {
  fileName?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  experienceLevel?: string;
};

function cleanNumber(value: unknown, fallback: number, min: number, max: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(Math.max(numeric, min), max) : fallback;
}

function cleanString(value: unknown, fallback: string, max = 400) {
  const text = String(value || fallback).replace(/\s+/g, " ").trim();
  return (text || fallback).slice(0, max);
}

function normalizeRequest(input: Partial<ResumeAtsRequest>): ResumeAtsRequest {
  return {
    resumeText: String(input.resumeText || "").trim().slice(0, 30_000),
    jobDescription: String(input.jobDescription || "").trim().slice(0, 12_000),
    fileName: cleanString(input.fileName, "", 160),
    candidateName: cleanString(input.candidateName, "", 100),
    candidateEmail: cleanString(input.candidateEmail, "", 160).toLowerCase(),
    candidatePhone: cleanString(input.candidatePhone, "", 40),
    targetRole: cleanString(input.targetRole, "General resume review", 80),
    roleFamily: cleanString(input.roleFamily, "Software Engineering", 80),
    yearsExperience: cleanNumber(input.yearsExperience, 0, 0, 20),
    experienceLevel: cleanString(input.experienceLevel, "Fresher", 60),
    currentSkills: cleanString(input.currentSkills, "Not specified", 600),
    targetPackage: cleanNumber(input.targetPackage, 8, 0, 100),
    dailyHours: cleanNumber(input.dailyHours, 2, 1, 10),
    language: cleanString(input.language, "English", 30),
  };
}

export async function POST(request: NextRequest) {
  const visitor = getAtsVisitorIdentity(request.cookies.get(atsVisitorCookieName)?.value);
  const respond = (body: unknown, status = 200) => {
    const response = NextResponse.json(body, { status });
    if (visitor.isNew) response.cookies.set(atsVisitorCookieName, visitor.visitorKey, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/",
    });
    return response;
  };

  let payload: ResumeAtsRequest;
  try {
    const raw = await request.text();
    if (raw.length > 50_000) {
      await recordAtsCheck({ visitorKey: visitor.visitorKey, status: "INVALID_INPUT", errorCode: "REQUEST_TOO_LARGE" });
      return respond({ error: "Resume or job description is too long." }, 413);
    }
    const input = JSON.parse(raw);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid body");
    payload = normalizeRequest(input);
  } catch {
    await recordAtsCheck({ visitorKey: visitor.visitorKey, status: "INVALID_INPUT", errorCode: "INVALID_REQUEST" });
    return respond({ error: "Invalid request body." }, 400);
  }

  if (payload.resumeText.length < 300) {
    await recordAtsCheck({ visitorKey: visitor.visitorKey, status: "INVALID_INPUT", resumeText: payload.resumeText, errorCode: "RESUME_TOO_SHORT" });
    return respond({ error: "Please use a text-based PDF, DOCX, TXT, or paste at least 300 characters." }, 400);
  }

  try {
    const localAnalysis = analyzeResumeLocally(payload);
    const enhancement = await enhanceResumeWithFreeGemini({
      resumeText: payload.resumeText,
      targetRole: payload.targetRole || "General resume review",
      jobDescription: payload.jobDescription,
      missingKeywords: localAnalysis.missingKeywords,
    });
    const analysis = enhancement
      ? validateAnalysis({ ...localAnalysis, ...enhancement }, Boolean(payload.jobDescription))
      : localAnalysis;
    await recordAtsCheck({
      visitorKey: visitor.visitorKey, status: "COMPLETED", resumeText: payload.resumeText, fileName: payload.fileName,
      candidateName: payload.candidateName, candidateEmail: payload.candidateEmail, candidatePhone: payload.candidatePhone,
      targetRole: payload.targetRole, roleFamily: payload.roleFamily, experienceLevel: payload.experienceLevel,
      hasJobDescription: Boolean(payload.jobDescription), atsScore: analysis.atsScore, jobMatchScore: analysis.jobMatchScore,
    });
    return respond({ analysis, engine: enhancement ? "local+gemini-free" : "local" });
  } catch (error) {
    console.error("Local ATS analysis failed", error);
    await recordAtsCheck({ visitorKey: visitor.visitorKey, status: "FAILED", resumeText: payload.resumeText, fileName: payload.fileName, errorCode: "LOCAL_ANALYSIS" });
    return respond({ error: "The resume could not be analyzed. Please check the extracted text and retry." }, 500);
  }
}
