import { z } from "zod";

export const scoreWeights = { Keywords: 20, Skills: 20, Projects: 15, Impact: 20, Structure: 10, Clarity: 15 } as const;
const score = z.number().finite().min(0).max(100);
const text = z.string().trim().min(1).max(1600);
const shortText = z.string().trim().min(1).max(100);
const list = z.array(text).max(20);
export const analysisSchema = z.object({
  atsScore: score,
  editableResumeText: z.string().trim().min(1).max(30000),
  roleFit: shortText, verdict: text, summary: text,
  missingKeywords: list, missingSkills: list, strengths: list, weakAreas: list,
  improvedBullets: list, projectsToAdd: list, interviewQuestions: list,
  roadmap: z.array(z.object({ week: text, focus: text, tasks: list })).max(6),
  salaryRange: text, recruiterChecklist: list, quickWins: list,
  componentScores: z.array(z.object({ label: z.enum(["Keywords", "Skills", "Projects", "Impact", "Structure", "Clarity"]), score, reason: text })).length(6)
    .refine((items) => new Set(items.map((item) => item.label)).size === 6, "Incomplete score breakdown"),
  matchedSkills: list,
  grammarIssues: z.array(z.object({ original: text, suggestion: text, reason: text })).max(10),
  formattingIssues: z.array(z.object({ issue: text, evidence: text, suggestion: text })).max(10),
  bulletSuggestions: z.array(z.object({ original: text, suggestion: text, reason: text })).max(8),
  jobRequirements: z.array(z.object({ keyword: text, status: z.enum(["matched", "partial", "missing"]), evidence: text })).max(24),
  formattingNote: text,
});

export type ResumeAnalysis = z.infer<typeof analysisSchema> & { jobMatchScore: number | null };

export function validateAnalysis(input: unknown, hasJobDescription: boolean): ResumeAnalysis {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Missing analysis");
  const source = input as Record<string, unknown>;
  const hasUsableSignal = typeof source.summary === "string" || Array.isArray(source.strengths) || Array.isArray(source.componentScores);
  if (!hasUsableSignal) throw new Error("Missing analysis content");

  const cleanText = (value: unknown, fallback: string, max = 1600) => {
    const next = String(value ?? "").replace(/\s+/g, " ").trim();
    return (next || fallback).slice(0, max);
  };
  const cleanResumeText = (value: unknown) => {
    const next = String(value ?? "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return (next || "Resume text could not be extracted. Paste the resume text to use the improvement workspace.").slice(0, 30000);
  };
  const cleanList = (value: unknown, max = 20) => Array.isArray(value)
    ? value.map((item) => cleanText(item, "", 1600)).filter(Boolean).slice(0, max)
    : [];
  const cleanScore = (value: unknown, fallback = 50) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.min(100, Math.max(0, numeric)) : fallback;
  };
  const cleanSuggestions = (value: unknown, max: number) => Array.isArray(value) ? value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const entry = item as Record<string, unknown>;
    const original = cleanText(entry.original, "", 1600);
    const suggestion = cleanText(entry.suggestion, "", 1600);
    if (!original || !suggestion) return [];
    return [{ original, suggestion, reason: cleanText(entry.reason, "This change improves clarity.", 1600) }];
  }).slice(0, max) : [];
  const labels = Object.keys(scoreWeights) as (keyof typeof scoreWeights)[];
  const rawScores = Array.isArray(source.componentScores) ? source.componentScores : [];
  const componentScores = labels.map((label) => {
    const match = rawScores.find((item) => item && typeof item === "object" && !Array.isArray(item) && (item as Record<string, unknown>).label === label) as Record<string, unknown> | undefined;
    return {
      label,
      score: cleanScore(match?.score),
      reason: cleanText(match?.reason, `${label} evidence was only partially available in the generated review.`),
    };
  });
  const formattingIssues = Array.isArray(source.formattingIssues) ? source.formattingIssues.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const entry = item as Record<string, unknown>;
    const issue = cleanText(entry.issue, "", 1600);
    if (!issue) return [];
    return [{ issue, evidence: cleanText(entry.evidence, "No specific example was returned.", 1600), suggestion: cleanText(entry.suggestion, "Review this section for consistency.", 1600) }];
  }).slice(0, 10) : [];
  const jobRequirements = Array.isArray(source.jobRequirements) ? source.jobRequirements.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const entry = item as Record<string, unknown>;
    const keyword = cleanText(entry.keyword, "", 1600);
    if (!keyword) return [];
    const rawStatus = String(entry.status || "missing");
    const status = rawStatus === "matched" || rawStatus === "partial" ? rawStatus : "missing";
    return [{ keyword, status, evidence: cleanText(entry.evidence, "No matching resume evidence was found.", 1600) }];
  }).slice(0, 24) : [];
  const roadmap = Array.isArray(source.roadmap) ? source.roadmap.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const entry = item as Record<string, unknown>;
    return [{ week: cleanText(entry.week, "Next step"), focus: cleanText(entry.focus, "Resume improvement"), tasks: cleanList(entry.tasks) }];
  }).slice(0, 6) : [];

  const parsed = analysisSchema.parse({
    atsScore: cleanScore(source.atsScore),
    editableResumeText: cleanResumeText(source.editableResumeText),
    roleFit: cleanText(source.roleFit, "General resume review", 100),
    verdict: cleanText(source.verdict, "Review the priority fixes below before applying."),
    summary: cleanText(source.summary, "Your resume was reviewed for role relevance, evidence, clarity, and ATS readability."),
    missingKeywords: cleanList(source.missingKeywords),
    missingSkills: cleanList(source.missingSkills),
    strengths: cleanList(source.strengths),
    weakAreas: cleanList(source.weakAreas),
    improvedBullets: cleanList(source.improvedBullets),
    projectsToAdd: cleanList(source.projectsToAdd),
    interviewQuestions: cleanList(source.interviewQuestions),
    roadmap,
    salaryRange: cleanText(source.salaryRange, "Salary varies by role, location, company, and interview performance."),
    recruiterChecklist: cleanList(source.recruiterChecklist),
    quickWins: cleanList(source.quickWins),
    componentScores,
    matchedSkills: cleanList(source.matchedSkills),
    grammarIssues: cleanSuggestions(source.grammarIssues, 10),
    formattingIssues,
    bulletSuggestions: cleanSuggestions(source.bulletSuggestions, 8),
    jobRequirements,
    formattingNote: cleanText(source.formattingNote, "Formatting feedback is based on the resume content available to the checker."),
  });
  const atsScore = Math.round(parsed.componentScores.reduce((total, item) => total + item.score * scoreWeights[item.label] / 100, 0));
  const requirements = hasJobDescription ? parsed.jobRequirements : [];
  return {
    ...parsed,
    atsScore,
    jobRequirements: requirements,
    jobMatchScore: requirements.length ? Math.round(requirements.reduce((sum, item) => sum + (item.status === "matched" ? 1 : item.status === "partial" ? 0.5 : 0), 0) / requirements.length * 100) : null,
  };
}

export function reportSections(analysis: ResumeAnalysis): [string, string[]][] {
  return [
    ["Summary", [analysis.summary, analysis.verdict]],
    ["Score breakdown", analysis.componentScores.map((item) => `${item.label}: ${item.score}/100${item.reason ? ` - ${item.reason}` : ""}`)],
    ["Top fixes", analysis.quickWins],
    ["Job description match", analysis.jobMatchScore == null ? ["No job description supplied. Keywords are based on the target role."] : [`Requirement coverage: ${analysis.jobMatchScore}/100`, ...analysis.jobRequirements.map((item) => `${item.keyword} (${item.status}): ${item.evidence}`)]],
    ["Matched skills", analysis.matchedSkills || []],
    ["Missing keywords", analysis.missingKeywords],
    ["Missing skills", analysis.missingSkills],
    ["Strengths", analysis.strengths],
    ["Areas to improve", analysis.weakAreas],
    ["Grammar and writing", (analysis.grammarIssues || []).map((item) => `Original: ${item.original}\nSuggestion: ${item.suggestion}\nWhy: ${item.reason}`)],
    ["Formatting review", [analysis.formattingNote || "Layout was not verified.", ...(analysis.formattingIssues || []).map((item) => `${item.issue}\nEvidence: ${item.evidence}\nFix: ${item.suggestion}`)]],
    ["Bullet suggestions", (analysis.bulletSuggestions || []).map((item) => `Original: ${item.original}\nSuggestion: ${item.suggestion}\nWhy: ${item.reason}`)],
    ["Improved bullets", analysis.improvedBullets],
    ["Recruiter tips", analysis.recruiterChecklist],
    ["Optional project ideas", analysis.projectsToAdd],
    ["Interview practice", analysis.interviewQuestions],
    ["Career roadmap", analysis.roadmap.flatMap((item) => [`${item.week}: ${item.focus}`, ...item.tasks])],
    ["Salary context", [analysis.salaryRange]],
    ["About this assessment", ["KASA calculates readiness with fixed local rules and may use Gemini free-tier assistance for writing suggestions. This is not an employer's ATS result or an interview guarantee. Readiness is a weighted average: Keywords 20%, Skills 20%, Projects 15%, Impact 20%, Structure 10%, Clarity 15%. Job match measures the extracted requirements only; partial matches count as half. Add skills and achievements only when true."]],
  ];
}
