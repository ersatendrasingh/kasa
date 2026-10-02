"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Award, CheckCircle2, Copy, Download, FileCheck2, Printer, RotateCcw, Sparkles, TrendingUp } from "lucide-react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

const classes = ["Class 1-2", "Class 3-5", "Class 6-8", "Class 9-10", "Class 11-12"] as const;
const conductLevels = ["Excellent", "Good", "Needs attention"] as const;
const learningLevels = ["Ahead", "On track", "Needs support"] as const;
const tones = ["Balanced and encouraging", "Formal", "Warm and supportive", "Improvement focused"] as const;
const strengthOptions = ["Concept understanding", "Class participation", "Homework completion", "Creativity", "Discipline", "Problem solving"] as const;
const improvementOptions = ["Consistent revision", "Written presentation", "Time management", "Reading practice", "Accuracy", "Confidence"] as const;
const storageKey = "kasa-ai-report-card-generator:last";

type GeneratedReportCard = {
  headline: string;
  overallRemark: string;
  parentNote: string;
  strengths: string[];
  improvementPlan: string[];
  nextSteps: string[];
  teacherClosing: string;
};

type SavedReport = {
  selectedClass: (typeof classes)[number];
  studentName: string;
  examName: string;
  overallPercentage: number;
  attendancePercentage: number;
  conductLevel: (typeof conductLevels)[number];
  learningLevel: (typeof learningLevels)[number];
  tone: (typeof tones)[number];
  strengths: string[];
  improvementAreas: string[];
  teacherNotes: string;
  reportCard: GeneratedReportCard;
  signature: string;
};

export function AiReportCardGenerator() {
  const resultPanelRef = useRef<HTMLDivElement>(null);
  const [selectedClass, setSelectedClass] = useState<(typeof classes)[number]>("Class 6-8");
  const [studentName, setStudentName] = useState("Shivaan Gangwar");
  const [examName, setExamName] = useState("Term Assessment");
  const [overallPercentage, setOverallPercentage] = useState(78);
  const [attendancePercentage, setAttendancePercentage] = useState(88);
  const [conductLevel, setConductLevel] = useState<(typeof conductLevels)[number]>("Good");
  const [learningLevel, setLearningLevel] = useState<(typeof learningLevels)[number]>("On track");
  const [tone, setTone] = useState<(typeof tones)[number]>("Balanced and encouraging");
  const [strengths, setStrengths] = useState<string[]>(["Concept understanding", "Class participation"]);
  const [improvementAreas, setImprovementAreas] = useState<string[]>(["Consistent revision", "Written presentation"]);
  const [teacherNotes, setTeacherNotes] = useState("Student responds well to guided practice and regular feedback.");
  const [reportCard, setReportCard] = useState<GeneratedReportCard | null>(null);
  const [reportSignature, setReportSignature] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [actionMessage, setActionMessage] = useState("Choose report details, then generate AI remarks.");
  const [savedReportAvailable, setSavedReportAvailable] = useState(false);

  const currentSignature = useMemo(
    () =>
      JSON.stringify({
        selectedClass,
        studentName,
        examName,
        overallPercentage,
        attendancePercentage,
        conductLevel,
        learningLevel,
        tone,
        strengths,
        improvementAreas,
        teacherNotes,
      }),
    [
      attendancePercentage,
      conductLevel,
      examName,
      improvementAreas,
      learningLevel,
      overallPercentage,
      selectedClass,
      strengths,
      studentName,
      teacherNotes,
      tone,
    ],
  );

  const isAiGenerated = Boolean(reportCard && reportSignature === currentSignature);
  const gradeBand = overallPercentage >= 90 ? "A+" : overallPercentage >= 80 ? "A" : overallPercentage >= 70 ? "B" : overallPercentage >= 60 ? "C" : "Needs support";
  const performanceLabel = overallPercentage >= 85 ? "Strong performance" : overallPercentage >= 70 ? "Steady progress" : overallPercentage >= 55 ? "Needs regular support" : "Focused recovery needed";

  const reportText = [
    `${studentName || "Student"} - AI Report Card Remarks`,
    `${selectedClass} | ${examName}`,
    `Performance: ${overallPercentage}% | Attendance: ${attendancePercentage}% | Grade band: ${gradeBand}`,
    "",
    reportCard?.headline,
    "",
    "Overall Remark:",
    reportCard?.overallRemark,
    "",
    "Strengths:",
    ...(reportCard?.strengths.map((item) => `- ${item}`) || []),
    "",
    "Improvement Plan:",
    ...(reportCard?.improvementPlan.map((item) => `- ${item}`) || []),
    "",
    "Parent Note:",
    reportCard?.parentNote,
    "",
    "Next Steps:",
    ...(reportCard?.nextSteps.map((item) => `- ${item}`) || []),
    "",
    reportCard?.teacherClosing,
    "",
    "Generated with KASA AI Report Card Generator",
  ].filter(Boolean).join("\n");

  const restoreSavedReport = () => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return false;
      const saved = JSON.parse(raw) as Partial<SavedReport>;
      if (!saved.reportCard) return false;
      setSelectedClass(saved.selectedClass || "Class 6-8");
      setStudentName(saved.studentName || "Shivaan Gangwar");
      setExamName(saved.examName || "Term Assessment");
      setOverallPercentage(clamp(Number(saved.overallPercentage), 0, 100));
      setAttendancePercentage(clamp(Number(saved.attendancePercentage), 0, 100));
      setConductLevel(saved.conductLevel || "Good");
      setLearningLevel(saved.learningLevel || "On track");
      setTone(saved.tone || "Balanced and encouraging");
      setStrengths(Array.isArray(saved.strengths) && saved.strengths.length ? saved.strengths : ["Concept understanding"]);
      setImprovementAreas(Array.isArray(saved.improvementAreas) && saved.improvementAreas.length ? saved.improvementAreas : ["Consistent revision"]);
      setTeacherNotes(saved.teacherNotes || "");
      setReportCard(saved.reportCard);
      setReportSignature(saved.signature || "");
      setSavedReportAvailable(true);
      setActionMessage("Last AI report card restored.");
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const restored = restoreSavedReport();
      if (!restored) setSavedReportAvailable(Boolean(window.localStorage.getItem(storageKey)));
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isGenerating) return;
    const intervalId = window.setInterval(() => {
      setGenerationProgress((progress) => {
        if (progress < 35) return Math.min(progress + 8, 35);
        if (progress < 72) return Math.min(progress + 5, 72);
        return Math.min(progress + 2, 93);
      });
    }, 380);
    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  const clearGenerated = () => {
    setReportCard(null);
    setReportSignature("");
  };

  const toggleListItem = (item: string, value: string[], setter: (next: string[]) => void) => {
    if (value.includes(item)) {
      if (value.length > 1) setter(value.filter((current) => current !== item));
      clearGenerated();
      return;
    }
    setter([...value, item]);
    clearGenerated();
  };

  const reset = () => {
    setSelectedClass("Class 6-8");
    setStudentName("Shivaan Gangwar");
    setExamName("Term Assessment");
    setOverallPercentage(78);
    setAttendancePercentage(88);
    setConductLevel("Good");
    setLearningLevel("On track");
    setTone("Balanced and encouraging");
    setStrengths(["Concept understanding", "Class participation"]);
    setImprovementAreas(["Consistent revision", "Written presentation"]);
    setTeacherNotes("Student responds well to guided practice and regular feedback.");
    clearGenerated();
    setGenerationProgress(0);
    setActionMessage("Choose report details, then generate AI remarks.");
  };

  const generateReport = async () => {
    setGenerationProgress(8);
    setIsGenerating(true);
    setActionMessage("Generating parent-friendly AI report card remarks...");
    try {
      const response = await fetch("/api/tools/report-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedClass,
          studentName,
          examName,
          overallPercentage,
          attendancePercentage,
          conductLevel,
          learningLevel,
          tone,
          strengths,
          improvementAreas,
          teacherNotes,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "AI report card generation failed.");
      if (!data.reportCard) throw new Error("AI did not return a usable report card.");
      setGenerationProgress(96);
      setReportCard(data.reportCard);
      setReportSignature(currentSignature);
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          selectedClass,
          studentName,
          examName,
          overallPercentage,
          attendancePercentage,
          conductLevel,
          learningLevel,
          tone,
          strengths,
          improvementAreas,
          teacherNotes,
          reportCard: data.reportCard,
          signature: currentSignature,
        } satisfies SavedReport),
      );
      setSavedReportAvailable(true);
      setActionMessage(
        typeof data.remaining === "number"
          ? `Report card generated successfully. ${data.remaining} free generations left today.`
          : "Report card generated successfully.",
      );
      window.setTimeout(() => resultPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 450);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "AI report card generation failed. Please try again.");
    } finally {
      setGenerationProgress(100);
      window.setTimeout(() => setIsGenerating(false), 350);
    }
  };

  const copyReport = async () => {
    if (!isAiGenerated) {
      setActionMessage("Generate the AI report card first, then copy it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(reportText);
      setActionMessage("Report card remarks copied.");
    } catch {
      setActionMessage("Copy was blocked. Use download or print instead.");
    }
  };

  const downloadReport = () => {
    if (!isAiGenerated) {
      setActionMessage("Generate the AI report card first, then download it.");
      return;
    }
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kasa-ai-report-card.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionMessage("Report card downloaded.");
  };

  const printReport = () => {
    if (!isAiGenerated || !reportCard) {
      setActionMessage("Generate the AI report card first, then print it.");
      return;
    }
    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${studentName} Report Card Remarks</title>
          <style>
            body { margin: 0; padding: 32px; color: #071b3a; font-family: Arial, Helvetica, sans-serif; }
            main { max-width: 820px; margin: 0 auto; }
            h1 { margin: 0 0 8px; text-align: center; font-size: 28px; }
            .meta { text-align: center; color: #475569; margin-bottom: 22px; line-height: 1.6; }
            .card { border: 1px solid #d7e7f6; border-radius: 16px; padding: 18px; margin: 14px 0; break-inside: avoid; }
            h2 { margin: 0 0 8px; font-size: 18px; }
            p, li { line-height: 1.6; color: #334155; }
            ul { margin: 8px 0 0; padding-left: 20px; }
            .footer { margin-top: 28px; border-top: 1px solid #d7e7f6; padding-top: 12px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <main>
            <h1>${studentName || "Student"} Report Card Remarks</h1>
            <div class="meta">${selectedClass} | ${examName}<br />Performance: ${overallPercentage}% | Attendance: ${attendancePercentage}% | Grade band: ${gradeBand}</div>
            <div class="card"><h2>${reportCard.headline}</h2><p>${reportCard.overallRemark}</p></div>
            <div class="card"><h2>Strengths</h2><ul>${reportCard.strengths.map((item) => `<li>${item}</li>`).join("")}</ul></div>
            <div class="card"><h2>Improvement Plan</h2><ul>${reportCard.improvementPlan.map((item) => `<li>${item}</li>`).join("")}</ul></div>
            <div class="card"><h2>Parent Note</h2><p>${reportCard.parentNote}</p></div>
            <div class="card"><h2>Next Steps</h2><ul>${reportCard.nextSteps.map((item) => `<li>${item}</li>`).join("")}</ul><p>${reportCard.teacherClosing}</p></div>
            <div class="footer">Generated with KASA AI Report Card Generator</div>
          </main>
        </body>
      </html>
    `;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const frameWindow = iframe.contentWindow;
    const frameDocument = iframe.contentDocument ?? frameWindow?.document;
    if (!frameWindow || !frameDocument) {
      iframe.remove();
      setActionMessage("Print could not open. Use download instead.");
      return;
    }
    frameDocument.open();
    frameDocument.write(printHtml);
    frameDocument.close();
    frameWindow.focus();
    frameWindow.print();
    window.setTimeout(() => iframe.remove(), 1000);
    setActionMessage("Print dialog opened with only the report card remarks.");
  };

  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-8">
      {isGenerating ? <GenerationOverlay progress={generationProgress} /> : null}
      <div className="mx-auto grid w-full max-w-[108rem] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/92 p-5 shadow-xl shadow-blue-950/8 backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                <Sparkles className="size-4 animate-pulse" aria-hidden="true" />
                AI report card setup
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
                Create teacher remarks
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Generate polished report card comments, parent notes, strengths, and improvement plans.
              </p>
            </div>
            <button type="button" onClick={reset} className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-700 shadow-sm transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-white" aria-label="Reset generator" title="Reset generator">
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <ChoiceGrid label="Class group" value={selectedClass} options={classes} onChange={(value) => { setSelectedClass(value); clearGenerated(); }} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Student name" value={studentName} onChange={setStudentName} onDirty={clearGenerated} />
              <TextField label="Exam or term" value={examName} onChange={setExamName} onDirty={clearGenerated} />
            </div>
            <div className="grid gap-3 rounded-[1.1rem] border border-blue-950/10 bg-[linear-gradient(135deg,#f8fbff,#f1fbf6)] p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-none dark:bg-white/[0.04] sm:grid-cols-3">
              <QuickStat label="Performance" value={`${overallPercentage}%`} />
              <QuickStat label="Attendance" value={`${attendancePercentage}%`} />
              <QuickStat label="Grade band" value={gradeBand} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <RangeField label="Overall performance" value={overallPercentage} setValue={(value) => { setOverallPercentage(value); clearGenerated(); }} min={0} max={100} step={1} suffix="%" presets={[50, 60, 70, 80, 90, 100]} />
              <RangeField label="Attendance" value={attendancePercentage} setValue={(value) => { setAttendancePercentage(value); clearGenerated(); }} min={0} max={100} step={1} suffix="%" presets={[60, 75, 85, 90, 95, 100]} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceGrid label="Conduct" value={conductLevel} options={conductLevels} onChange={(value) => { setConductLevel(value); clearGenerated(); }} />
              <ChoiceGrid label="Learning level" value={learningLevel} options={learningLevels} onChange={(value) => { setLearningLevel(value); clearGenerated(); }} />
            </div>
            <ChoiceGrid label="Remark tone" value={tone} options={tones} onChange={(value) => { setTone(value); clearGenerated(); }} />
            <MultiChoice label="Strengths" selected={strengths} options={strengthOptions} onToggle={(item) => toggleListItem(item, strengths, setStrengths)} />
            <MultiChoice label="Improvement areas" selected={improvementAreas} options={improvementOptions} onToggle={(item) => toggleListItem(item, improvementAreas, setImprovementAreas)} />
            <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Teacher note</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">Add one useful context line. AI will turn it into parent-friendly wording.</span>
              <textarea value={teacherNotes} onChange={(event) => { setTeacherNotes(event.target.value); clearGenerated(); }} rows={3} className="mt-3 w-full resize-none rounded-xl border border-blue-950/10 bg-white px-3 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-primary/45 dark:border-white/10 dark:bg-slate-950/55 dark:text-white" />
            </label>
            <button type="button" onClick={generateReport} disabled={isGenerating} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-blue-950/12 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
              <Sparkles className="size-4" aria-hidden="true" />
              {isGenerating ? "Generating AI remarks..." : "Generate report card with AI"}
            </button>
          </div>
        </div>

        <div ref={resultPanelRef} className="scroll-mt-28 rounded-[1.25rem] border border-blue-950/10 bg-white/94 p-5 shadow-2xl shadow-blue-950/12 backdrop-blur dark:border-white/10 dark:bg-surface/92 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5 rounded-[1.1rem] border border-blue-950/10 bg-[linear-gradient(135deg,#f7fbff_0%,#eef8f3_100%)] p-5 dark:border-white/10 dark:bg-none dark:bg-white/[0.05]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary dark:text-emerald-200">AI report card</p>
              <div className="mt-3 font-heading text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">{studentName || "Student"}</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedClass} · {examName} · {performanceLabel}</p>
            </div>
            <div className="grid min-w-[7.5rem] place-items-center rounded-2xl border border-emerald-200 bg-white/82 p-4 text-center shadow-sm shadow-blue-950/5 dark:border-emerald-300/25 dark:bg-slate-950/40">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Grade band</div>
              <div className="mt-1 font-heading text-4xl font-semibold text-emerald-700 dark:text-emerald-200">{gradeBand}</div>
              <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{isAiGenerated ? "AI generated" : "Ready"}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ScoreMeter label="Overall performance" value={overallPercentage} icon={TrendingUp} />
            <ScoreMeter label="Attendance" value={attendancePercentage} icon={CheckCircle2} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Class" value={selectedClass} />
            <Metric label="Performance" value={`${overallPercentage}%`} />
            <Metric label="Attendance" value={`${attendancePercentage}%`} />
            <Metric label="Tone" value={tone} />
          </div>

          <div className="mt-6 rounded-[1.1rem] border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">Report card preview</div>
            {isAiGenerated && reportCard ? (
              <div className="overflow-hidden rounded-2xl border border-blue-950/10 bg-[#fbfdff] shadow-sm shadow-blue-950/6 dark:border-white/10 dark:bg-slate-950/35">
                <div className="border-b border-blue-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-start">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">Student progress report</div>
                      <h3 className="mt-2 font-heading text-2xl font-semibold text-slate-950 dark:text-white">{reportCard.headline}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-200">{reportCard.overallRemark}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm shadow-emerald-900/5 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-100">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em]">Grade</span>
                        <Award className="size-5" aria-hidden="true" />
                      </div>
                      <div className="mt-3 font-heading text-5xl font-semibold leading-none">{gradeBand}</div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/12">
                        <div className="h-full rounded-full bg-emerald-600 dark:bg-emerald-300" style={{ width: `${clamp(overallPercentage, 0, 100)}%` }} />
                      </div>
                      <div className="mt-2 text-xs font-semibold text-emerald-700/80 dark:text-emerald-100/80">{overallPercentage}% overall</div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <PreviewBlock title="Strengths" items={reportCard.strengths} tone="green" />
                  <PreviewBlock title="Improvement plan" items={reportCard.improvementPlan} tone="amber" />
                  <div className="rounded-xl border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04] md:col-span-2">
                    <div className="font-semibold text-slate-950 dark:text-white">Parent note</div>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{reportCard.parentNote}</p>
                  </div>
                  <PreviewBlock title="Next steps" items={reportCard.nextSteps} tone="blue" />
                  <div className="rounded-xl border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="font-semibold text-slate-950 dark:text-white">Teacher closing</div>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{reportCard.teacherClosing}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[22rem] place-items-center rounded-xl border border-dashed border-blue-950/15 bg-slate-50 p-6 text-center dark:border-white/15 dark:bg-slate-950/35">
                <div className="max-w-md">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"><Sparkles className="size-5" aria-hidden="true" /></div>
                  <h3 className="mt-4 font-heading text-2xl font-semibold text-slate-950 dark:text-white">Your AI report card remarks will appear here.</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Click generate to create polished remarks, parent notes, strengths, and improvement actions.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-[1.1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-950 dark:text-white">Save or share this report card</div>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{actionMessage}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!isAiGenerated && savedReportAvailable ? <ActionButton label="Restore last" icon={Sparkles} onClick={restoreSavedReport} /> : null}
                <ActionButton label="Copy" icon={Copy} onClick={copyReport} disabled={!isAiGenerated} />
                <ActionButton label="Print" icon={Printer} onClick={printReport} disabled={!isAiGenerated} />
                <ActionButton label="Download" icon={Download} onClick={downloadReport} disabled={!isAiGenerated} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextField({ label, value, onChange, onDirty }: { label: string; value: string; onChange: (value: string) => void; onDirty: () => void }) {
  return (
    <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      <input value={value} onChange={(event) => { onChange(event.target.value); onDirty(); }} className="mt-3 h-12 w-full rounded-xl border border-blue-950/10 bg-white px-3 text-base font-semibold text-slate-950 outline-none transition focus:border-primary/45 dark:border-white/10 dark:bg-slate-950/55 dark:text-white" />
    </label>
  );
}

function ChoiceGrid<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === option ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>{option}</button>)}
      </div>
    </div>
  );
}

function MultiChoice({ label, selected, options, onToggle }: { label: string; selected: string[]; options: readonly string[]; onToggle: (value: string) => void }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button key={option} type="button" onClick={() => onToggle(option)} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${active ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
              {active ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : null}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/74 p-3 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function RangeField({ label, value, setValue, min, max, step, suffix, presets }: { label: string; value: number; setValue: (value: number) => void; min: number; max: number; step: number; suffix: string; presets: readonly number[] }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">{value}{suffix}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => setValue(clamp(Number(event.target.value), min, max))} className="mt-4 h-2 w-full cursor-pointer accent-[#22b573] dark:accent-[#58c98a]" />
      <div className="mt-3 flex flex-wrap gap-2">{presets.map((preset) => <button key={preset} type="button" onClick={() => setValue(clamp(preset, min, max))} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === preset ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>{preset}{suffix}</button>)}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-[1.1rem] border border-blue-950/10 bg-white p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.05]"><div className="flex items-center justify-between gap-3"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div><FileCheck2 className="size-4 shrink-0 text-primary dark:text-emerald-300" aria-hidden="true" /></div><div className="mt-3 min-w-0 break-words text-[1.05rem] font-semibold leading-snug text-slate-950 sm:text-[1.12rem] dark:text-white" title={value}>{value}</div></div>;
}

function ScoreMeter({ label, value, icon: Icon }: { label: string; value: number; icon: typeof CheckCircle2 }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{value}%</div>
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/12">
        <div className="h-full rounded-full bg-[image:var(--button-solid)]" style={{ width: `${clamp(value, 0, 100)}%` }} />
      </div>
    </div>
  );
}

function PreviewBlock({ title, items, tone = "blue" }: { title: string; items: string[]; tone?: "green" | "amber" | "blue" }) {
  const styles = {
    green: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-300/25 dark:bg-emerald-400/10",
    amber: "border-amber-200 bg-amber-50/70 dark:border-amber-300/25 dark:bg-amber-400/10",
    blue: "border-blue-950/10 bg-blue-50/70 dark:border-white/10 dark:bg-white/[0.04]",
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <div className="font-semibold text-slate-950 dark:text-white">{title}</div>
      <div className="mt-3 grid gap-2">
        {items.map((item) => <div key={item} className="rounded-lg bg-white px-3 py-2 text-sm leading-6 text-slate-700 dark:bg-white/[0.05] dark:text-slate-200">{item}</div>)}
      </div>
    </div>
  );
}

function GenerationOverlay({ progress }: { progress: number }) {
  const stage = progress < 35 ? "Reading student details" : progress < 72 ? "Writing teacher remarks" : progress < 94 ? "Balancing parent feedback" : "Preparing report preview";
  return <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/58 px-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-[1.4rem] border border-white/18 bg-white p-6 shadow-2xl shadow-slate-950/30 dark:bg-slate-950 dark:!text-white"><div className="flex items-center gap-4"><div className="relative grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200"><Sparkles className="size-6 animate-pulse" aria-hidden="true" /><span className="absolute inset-0 rounded-full border-2 border-emerald-300/70 border-t-transparent animate-spin" /></div><div><div className="font-heading text-2xl font-semibold text-slate-950 dark:!text-white">Generating AI report card</div><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stage}...</p></div></div><div className="mt-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"><span>AI generation</span><span>{Math.round(progress)}%</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/12"><div className="h-full rounded-full bg-[image:var(--button-solid)] transition-[width] duration-500" style={{ width: `${clamp(progress, 0, 100)}%` }} /></div><p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Creating polished remarks, parent note, strengths, and improvement plan.</p></div></div>;
}

function ActionButton({ label, icon: Icon, onClick, disabled = false }: { label: string; icon: typeof Copy; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-blue-950/5 transition hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white"><Icon className="size-3.5" aria-hidden="true" />{label}</button>;
}
