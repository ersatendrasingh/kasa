import { NextRequest, NextResponse } from "next/server";
import { generateAiContent } from "@/lib/ai/gateway";

type ResumeProfileRequest = {
  resumeText?: string;
  fileData?: string;
  fileMimeType?: string;
  fileName?: string;
};

type ResumeProfileResponse = {
  candidateName: string;
  detectedRole: string;
  roleFamily: string;
  yearsExperience: number;
  experienceLevel: string;
  skills: string[];
  summary: string;
};

function cleanString(value: unknown, fallback: string, max = 300) {
  const text = String(value || fallback).replace(/\s+/g, " ").trim();
  return (text || fallback).slice(0, max);
}

function cleanNumber(value: unknown, fallback: number, min: number, max: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(Math.max(numeric, min), max);
}

function cleanList(value: unknown, maxItems: number, maxLength = 80) {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .map((item) => cleanString(item, "", maxLength))
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxItems);
}

function normalizeRequest(input: Partial<ResumeProfileRequest>) {
  const fileMimeType = cleanString(input.fileMimeType, "", 120);
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  return {
    resumeText: String(input.resumeText || "").replace(/\s+/g, " ").trim().slice(0, 12000),
    fileData: String(input.fileData || "").slice(0, 5_500_000),
    fileMimeType: allowedMimeTypes.includes(fileMimeType) ? fileMimeType : "",
    fileName: cleanString(input.fileName, "", 160),
  };
}

function experienceLabel(years: number) {
  if (years <= 0) return "Fresher / entry level";
  if (years <= 1) return "0-1 year experience";
  if (years <= 3) return "1-3 years experience";
  if (years <= 6) return "3-6 years experience";
  if (years <= 10) return "6-10 years experience";
  return "10+ years senior experience";
}

function normalizeProfile(value: Partial<ResumeProfileResponse>): ResumeProfileResponse {
  const yearsExperience = cleanNumber(value.yearsExperience, 0, 0, 20);
  return {
    candidateName: cleanString(value.candidateName, "Candidate", 100),
    detectedRole: cleanString(value.detectedRole, "Software Engineer", 100),
    roleFamily: cleanString(value.roleFamily, "Software Engineering", 80),
    yearsExperience,
    experienceLevel: cleanString(value.experienceLevel, experienceLabel(yearsExperience), 60),
    skills: cleanList(value.skills, 18, 60),
    summary: cleanString(value.summary, `Detected ${experienceLabel(yearsExperience)} profile from the resume.`, 900),
  };
}

export async function POST(request: NextRequest) {
  let payload: ReturnType<typeof normalizeRequest>;
  try {
    payload = normalizeRequest(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (payload.resumeText.length < 300 && !payload.fileData) {
    return NextResponse.json({ error: "Upload a resume file or paste at least 300 characters first." }, { status: 400 });
  }
  if (payload.fileData && !payload.fileMimeType) {
    return NextResponse.json({ error: "Unsupported resume file type. Upload PDF, DOC, DOCX, or TXT." }, { status: 400 });
  }
  if (payload.fileMimeType === "application/msword" && payload.resumeText.length < 300) {
    return NextResponse.json({ error: "This DOC file could not be read as text. Please upload PDF/DOCX/TXT or paste the resume text." }, { status: 400 });
  }

  const prompt = [
    "You are an expert resume parser. Extract factual profile data from the uploaded resume.",
    "Return only valid JSON. Do not guess wildly. Prefer evidence inside the resume.",
    "Extract candidateName from the resume header or contact section.",
    "If experience is present in job dates or summary, calculate approximate total professional years.",
    "If the resume says 11+ years, do not return fresher. If dates show senior work history, return a senior experience value.",
    "Choose one roleFamily from: Software Engineering, Data & AI, Product & Design, Cloud & DevOps, Cybersecurity, Business & Marketing, Finance & Operations.",
    "",
    payload.fileName ? `File name: ${payload.fileName}` : "",
    "Resume text:",
    payload.resumeText || "Resume file is attached. Extract resume content from the file.",
  ].join("\n");

  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [{ text: prompt }];
  const canInlineFile = payload.fileMimeType !== "application/msword";
  if (payload.fileData && payload.fileMimeType && canInlineFile) {
    parts.push({ inlineData: { mimeType: payload.fileMimeType, data: payload.fileData } });
  }

  const result = await generateAiContent({
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1_200,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          candidateName: { type: "STRING" },
          detectedRole: { type: "STRING" },
          roleFamily: { type: "STRING" },
          yearsExperience: { type: "NUMBER" },
          experienceLevel: { type: "STRING" },
          skills: { type: "ARRAY", items: { type: "STRING" } },
          summary: { type: "STRING" },
        },
        required: ["candidateName", "detectedRole", "roleFamily", "yearsExperience", "experienceLevel", "skills", "summary"],
      },
    },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  const data = result.data as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof rawText !== "string") {
    return NextResponse.json({ error: "AI returned an empty profile response." }, { status: 502 });
  }

  try {
    const parsed = JSON.parse(rawText) as Partial<ResumeProfileResponse>;
    return NextResponse.json({ profile: normalizeProfile(parsed) });
  } catch {
    return NextResponse.json({ error: "Resume profile detection could not be parsed." }, { status: 502 });
  }
}
