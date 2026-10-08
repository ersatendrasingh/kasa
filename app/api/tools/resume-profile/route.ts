import { NextRequest, NextResponse } from "next/server";
import { detectLocalResumeProfile } from "@/lib/resume/local-analysis";

export async function POST(request: NextRequest) {
  let resumeText = "";
  try {
    const input = await request.json() as { resumeText?: unknown };
    resumeText = String(input.resumeText || "").trim().slice(0, 30_000);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (resumeText.length < 300) {
    return NextResponse.json({ error: "Could not extract enough text. Try a text-based PDF, DOCX, TXT, or paste the resume text." }, { status: 400 });
  }

  return NextResponse.json({ profile: detectLocalResumeProfile(resumeText), engine: "local" });
}
