"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Blocks,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  Download,
  FileText,
  FolderTree,
  Lightbulb,
  LoaderCircle,
  RefreshCcw,
  Share2,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { ToolToast, type ToolToastState } from "@/components/tools/tool-toast";

const storageKey = "kasa-ai-project-kit:last";

const courses = ["BTech CSE", "BCA", "MCA", "BSc CS", "Diploma CSE", "Class 12 CS", "Other"] as const;
const projectTypes = ["Final Year Project", "Major Project", "Mini Project", "Internship Project", "Portfolio Project"] as const;
const stacks = [
  "MERN Stack",
  "React + Firebase",
  "Next.js + Supabase",
  "Python Django",
  "Python Flask",
  "Java Spring Boot",
  "PHP Laravel",
  "Flutter",
  "Android Kotlin",
  "AI/ML Python",
  "Data Science",
  "IoT + Web Dashboard",
  "Cybersecurity",
] as const;
const domains = ["Education", "Healthcare", "E-commerce", "Finance", "Agriculture", "LMS", "HR", "Travel", "Food Delivery", "Social Impact", "Smart City"] as const;
const difficulties = ["Easy", "Balanced", "Impressive", "Advanced"] as const;
const timeOptions = ["2 days", "1 week", "15 days", "1 month", "2 months"] as const;
const goals = ["Easy to explain", "Impressive for viva", "Placement portfolio", "Startup style", "Documentation focused"] as const;
const resultTabs = ["Overview", "Build Plan", "Code & Data", "Viva & Resume"] as const;

type ProjectKit = {
  title: string;
  tagline: string;
  difficultyFit: string;
  abstract: string;
  problemStatement: string;
  objectives: string[];
  keyFeatures: string[];
  architecture: string[];
  folderStructure: string[];
  databaseSchema: string[];
  apiEndpoints: string[];
  screens: string[];
  setupSteps: string[];
  vivaQuestions: { question: string; answer: string }[];
  resumeBullets: string[];
  documentationFiles: string[];
  futureScope: string[];
};

type SavedProjectKit = {
  course: string;
  projectType: string;
  techStack: string;
  domain: string;
  difficulty: string;
  timeLeft: string;
  teamSize: number;
  goal: string;
  requirement: string;
  kit: ProjectKit;
};

export function FinalYearProjectKitGenerator() {
  const [course, setCourse] = useState<(typeof courses)[number]>("BTech CSE");
  const [projectType, setProjectType] = useState<(typeof projectTypes)[number]>("Final Year Project");
  const [techStack, setTechStack] = useState<(typeof stacks)[number]>("MERN Stack");
  const [domain, setDomain] = useState<(typeof domains)[number]>("Education");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("Balanced");
  const [timeLeft, setTimeLeft] = useState<(typeof timeOptions)[number]>("1 month");
  const [teamSize, setTeamSize] = useState(2);
  const [goal, setGoal] = useState<(typeof goals)[number]>("Impressive for viva");
  const [requirement, setRequirement] = useState("");
  const [kit, setKit] = useState<ProjectKit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedAvailable, setSavedAvailable] = useState(false);
  const [actionMessage, setActionMessage] = useState("Choose your stack and generate a final year project kit.");
  const [toast, setToast] = useState<ToolToastState>(null);
  const [activeTab, setActiveTab] = useState<(typeof resultTabs)[number]>("Overview");

  const notify = (type: NonNullable<ToolToastState>["type"], title: string, message: string) => {
    setToast({ id: Date.now(), type, title, message });
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<SavedProjectKit>;
        if (!saved.kit) return;
        setCourse((saved.course as (typeof courses)[number]) || "BTech CSE");
        setProjectType((saved.projectType as (typeof projectTypes)[number]) || "Final Year Project");
        setTechStack((saved.techStack as (typeof stacks)[number]) || "MERN Stack");
        setDomain((saved.domain as (typeof domains)[number]) || "Education");
        setDifficulty((saved.difficulty as (typeof difficulties)[number]) || "Balanced");
        setTimeLeft((saved.timeLeft as (typeof timeOptions)[number]) || "1 month");
        setTeamSize(clamp(Number(saved.teamSize), 1, 6));
        setGoal((saved.goal as (typeof goals)[number]) || "Impressive for viva");
        setRequirement(saved.requirement || "");
        setKit(saved.kit);
        setActiveTab("Overview");
        setSavedAvailable(true);
        setActionMessage("Last project kit restored from this browser.");
      } catch {
        setSavedAvailable(Boolean(window.localStorage.getItem(storageKey)));
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isGenerating) return;
    const intervalId = window.setInterval(() => {
      setProgress((value) => {
        if (value < 35) return Math.min(value + 8, 35);
        if (value < 80) return Math.min(value + 5, 80);
        return Math.min(value + 2, 94);
      });
    }, 420);
    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  const projectText = useMemo(() => {
    if (!kit) return "";
    return [
      kit.title,
      kit.tagline,
      "",
      "Abstract",
      kit.abstract,
      "",
      "Problem Statement",
      kit.problemStatement,
      "",
      "Features",
      ...kit.keyFeatures.map((item) => `- ${item}`),
      "",
      "Architecture",
      ...kit.architecture.map((item) => `- ${item}`),
      "",
      "Folder Structure",
      ...kit.folderStructure.map((item) => `- ${item}`),
      "",
      "APIs",
      ...kit.apiEndpoints.map((item) => `- ${item}`),
      "",
      "Viva Questions",
      ...kit.vivaQuestions.flatMap((item) => [`Q. ${item.question}`, `A. ${item.answer}`]),
      "",
      "Resume Bullets",
      ...kit.resumeBullets.map((item) => `- ${item}`),
    ].join("\n");
  }, [kit]);

  const clearGenerated = () => {
    if (kit) setActionMessage("Inputs changed. Generate a fresh project kit for updated requirements.");
    setKit(null);
  };

  const restoreLast = () => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<SavedProjectKit>;
      if (!saved.kit) return;
      setCourse((saved.course as (typeof courses)[number]) || "BTech CSE");
      setProjectType((saved.projectType as (typeof projectTypes)[number]) || "Final Year Project");
      setTechStack((saved.techStack as (typeof stacks)[number]) || "MERN Stack");
      setDomain((saved.domain as (typeof domains)[number]) || "Education");
      setDifficulty((saved.difficulty as (typeof difficulties)[number]) || "Balanced");
      setTimeLeft((saved.timeLeft as (typeof timeOptions)[number]) || "1 month");
      setTeamSize(clamp(Number(saved.teamSize), 1, 6));
      setGoal((saved.goal as (typeof goals)[number]) || "Impressive for viva");
      setRequirement(saved.requirement || "");
      setKit(saved.kit);
      setActiveTab("Overview");
      setSavedAvailable(true);
      setActionMessage("Last project kit restored.");
      notify("success", "Last kit restored", "Your previous project kit is back on the screen.");
    } catch {
      setActionMessage("Could not restore the last project kit.");
      notify("error", "Restore failed", "Could not load the last saved project kit from this browser.");
    }
  };

  const reset = () => {
    setCourse("BTech CSE");
    setProjectType("Final Year Project");
    setTechStack("MERN Stack");
    setDomain("Education");
    setDifficulty("Balanced");
    setTimeLeft("1 month");
    setTeamSize(2);
    setGoal("Impressive for viva");
    setRequirement("");
    setKit(null);
    setActionMessage("Choose your stack and generate a final year project kit.");
  };

  const generateKit = async () => {
    setIsGenerating(true);
    setProgress(8);
    setActionMessage("AI is designing project idea, architecture, docs, viva questions, and starter ZIP files...");
    try {
      const response = await fetch("/api/tools/project-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, projectType, techStack, domain, difficulty, timeLeft, teamSize, goal, requirement }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "AI project kit generation failed.");
      if (!data.kit) throw new Error("AI did not return a usable project kit.");
      setProgress(96);
      setKit(data.kit);
      setActiveTab("Overview");
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ course, projectType, techStack, domain, difficulty, timeLeft, teamSize, goal, requirement, kit: data.kit } satisfies SavedProjectKit),
      );
      setSavedAvailable(true);
      const successMessage = typeof data.remaining === "number" ? `Project kit generated. ${data.remaining} free AI generations left today.` : "Project kit generated.";
      setActionMessage(successMessage);
      notify("success", "Project kit generated", successMessage);
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI project kit generation failed. Please try again.";
      setActionMessage(message);
      notify("error", "Project kit failed", message);
    } finally {
      setProgress(100);
      window.setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 450);
    }
  };

  const copyKit = async () => {
    if (!projectText) return;
    try {
      await navigator.clipboard.writeText(projectText);
      setActionMessage("Project kit copied.");
      notify("success", "Copied", "Project kit text copied to clipboard.");
    } catch {
      setActionMessage("Copy was blocked. Use Download ZIP instead.");
      notify("error", "Copy blocked", "Your browser blocked clipboard access. Use Download ZIP instead.");
    }
  };

  const shareKit = async () => {
    if (!kit) return;
    const url = `${window.location.origin}/tools/final-year-project-kit-generator`;
    const text = `I generated a final year project kit: ${kit.title}. You can generate yours free on KASA: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: kit.title, text, url });
        setActionMessage("Project kit link shared.");
        notify("success", "Shared", "Project kit link shared successfully.");
        return;
      }
      await navigator.clipboard.writeText(text);
      setActionMessage("Share text copied.");
      notify("success", "Share text copied", "Direct sharing is not supported, so the share text was copied.");
    } catch {
      setActionMessage("Share was cancelled or blocked.");
      notify("error", "Share blocked", "Sharing was cancelled or blocked by the browser.");
    }
  };

  const downloadZip = () => {
    if (!kit) return;
    const files = buildProjectKitFiles(kit, { course, projectType, techStack, domain, difficulty, timeLeft, teamSize, goal });
    const blob = createZip(files);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(kit.title)}-project-kit.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionMessage("Project starter ZIP downloaded.");
    notify("success", "ZIP downloaded", "Your project starter ZIP is ready.");
  };

  return (
    <section className="relative bg-[#f4f8f4] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-[96rem] gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="rounded-[1.4rem] border border-[#173d36]/10 bg-white/94 p-5 shadow-[0_20px_55px_rgba(23,61,54,0.09)] dark:border-white/10 dark:bg-surface/90 sm:p-6 lg:sticky lg:top-28">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#177e70] dark:text-emerald-200">Project brief · about 2 minutes</p>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-[#16352f] dark:text-white">Set the project constraints</h2>
              <p className="mt-2 text-sm leading-6 text-[#657a74] dark:text-slate-300">A finishable project starts with an honest deadline, team size and stack.</p>
            </div>
            <button type="button" onClick={reset} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[#173d36]/10 bg-[#f7fbf8] text-[#47645d] shadow-sm transition hover:border-[#177e70]/40 hover:text-[#177e70] dark:border-white/10 dark:bg-white/7 dark:text-white" aria-label="Reset project kit">
              <RefreshCcw className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            <ChoiceGrid label="1. Course" value={course} options={courses} onChange={(value) => { setCourse(value); clearGenerated(); }} />
            <ChoiceGrid label="2. Project type" value={projectType} options={projectTypes} onChange={(value) => { setProjectType(value); clearGenerated(); }} />
            <ChoiceGrid label="3. Tech stack" value={techStack} options={stacks} onChange={(value) => { setTechStack(value); clearGenerated(); }} />
            <ChoiceGrid label="4. Domain" value={domain} options={domains} onChange={(value) => { setDomain(value); clearGenerated(); }} />
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceGrid label="Difficulty" value={difficulty} options={difficulties} onChange={(value) => { setDifficulty(value); clearGenerated(); }} compact />
              <ChoiceGrid label="Time left" value={timeLeft} options={timeOptions} onChange={(value) => { setTimeLeft(value); clearGenerated(); }} compact />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Team size" value={teamSize} onChange={(value) => { setTeamSize(value); clearGenerated(); }} min={1} max={6} suffix={teamSize === 1 ? " member" : " members"} />
              <ChoiceGrid label="Goal" value={goal} options={goals} onChange={(value) => { setGoal(value); clearGenerated(); }} compact />
            </div>
            <label className="rounded-[1rem] border border-[#173d36]/10 bg-[#f9fcfa] p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="text-sm font-semibold text-[#35534c] dark:text-slate-100">Anything the project must include?</span>
              <textarea
                value={requirement}
                onChange={(event) => { setRequirement(event.target.value); clearGenerated(); }}
                rows={4}
                placeholder="Example: I need a face recognition attendance project with admin panel and student dashboard..."
                className="mt-3 w-full resize-y rounded-xl border border-[#173d36]/10 bg-white px-4 py-3 text-sm font-medium leading-6 text-[#17342e] outline-none transition placeholder:text-[#95a59f] focus:border-[#177e70]/50 focus:ring-2 focus:ring-[#177e70]/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={generateKit} disabled={isGenerating} className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 text-sm font-bold !text-white shadow-[0_14px_30px_rgba(20,112,96,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-65 sm:flex-none">
                {isGenerating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                {isGenerating ? "Building project kit..." : "Generate project kit"}
              </button>
              {savedAvailable ? (
                <button type="button" onClick={restoreLast} className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#173d36]/12 bg-white px-5 text-sm font-semibold text-[#426159] shadow-sm transition hover:border-[#177e70]/40 hover:text-[#177e70] sm:flex-none dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white">
                  <Sparkles className="size-4" aria-hidden="true" />
                  {kit ? "Reload saved kit" : "See last kit"}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[#173d36]/10 bg-white/96 p-5 shadow-[0_20px_55px_rgba(23,61,54,0.09)] dark:border-white/10 dark:bg-surface/92 sm:p-6">
          {kit ? (
            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[1.25rem] border border-blue-950/10 bg-[image:var(--architecture-panel-background)] shadow-xl shadow-blue-950/10 dark:border-white/10">
                <div className="border-b border-blue-950/10 p-6 dark:border-white/10">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.08] dark:text-emerald-200">
                        <Archive className="size-4" aria-hidden="true" />
                        Final Year Project Kit
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        {difficulty}
                      </div>
                    </div>
                    <h3 className="mt-4 max-w-4xl font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-4xl">{kit.title}</h3>
                    <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{kit.tagline}</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <HeroStat label="Stack" value={techStack} />
                      <HeroStat label="Type" value={projectType} />
                      <HeroStat label="Domain" value={domain} />
                      <HeroStat label="Time" value={timeLeft} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-px bg-blue-950/10 sm:grid-cols-4 dark:bg-white/10">
                  <ResultMetric label="Features" value={`${kit.keyFeatures.length}`} />
                  <ResultMetric label="Screens" value={`${kit.screens.length}`} />
                  <ResultMetric label="Docs" value="10" />
                  <ResultMetric label="ZIP" value="Starter" />
                </div>
              </div>

              <div className="sticky top-24 z-10 rounded-[1rem] border border-blue-950/10 bg-white/92 p-2 shadow-lg shadow-blue-950/8 backdrop-blur dark:border-white/10 dark:bg-slate-950/82">
                <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                  {resultTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`h-10 cursor-pointer rounded-full px-3 text-xs font-semibold transition ${
                        activeTab === tab
                          ? "bg-[image:var(--button-solid)] !text-white shadow-md shadow-primary/15"
                          : "bg-slate-100 text-slate-650 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-white/[0.06] dark:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "Overview" ? (
                <div className="grid gap-4">
                  <InfoPanel title="Problem statement" icon={Lightbulb} items={[kit.problemStatement]} wide />
                  <InfoPanel title="Objectives" icon={BookOpenCheck} items={kit.objectives} wide />
                  <InfoPanel title="Key features" icon={Blocks} items={kit.keyFeatures} wide />
                </div>
              ) : null}

              {activeTab === "Build Plan" ? (
                <div className="grid gap-4">
                  <InfoPanel title="Screens to build" icon={Blocks} items={kit.screens} wide />
                  <InfoPanel title="Architecture" icon={Code2} items={kit.architecture} wide />
                  <InfoPanel title="Setup steps" icon={TerminalSquare} items={kit.setupSteps} wide />
                  <InfoPanel title="Future scope" icon={Lightbulb} items={kit.futureScope} wide />
                </div>
              ) : null}

              {activeTab === "Code & Data" ? (
                <div className="grid gap-4">
                  <InfoPanel title="Database schema" icon={Database} items={kit.databaseSchema} wide compact />
                  <InfoPanel title="API endpoints" icon={TerminalSquare} items={kit.apiEndpoints} wide compact />
                  <InfoPanel title="Folder structure" icon={FolderTree} items={kit.folderStructure} wide compact />
                </div>
              ) : null}

              {activeTab === "Viva & Resume" ? (
                <div className="grid gap-4">
                  <VivaPanel questions={kit.vivaQuestions} />
                  <InfoPanel title="Resume bullets" icon={FileText} items={kit.resumeBullets} wide />
                </div>
              ) : null}

              <div className="rounded-[1.1rem] border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{actionMessage}</p>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton label="Copy" icon={Copy} onClick={copyKit} />
                    <ActionButton label="Share" icon={Share2} onClick={shareKit} />
                    <ActionButton label="Download ZIP" icon={Download} onClick={downloadZip} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[42rem] overflow-hidden rounded-[1.2rem] border border-[#173d36]/10 bg-[linear-gradient(145deg,#f8fcf9,#edf7f2)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
              <div className="flex items-center justify-between border-b border-[#173d36]/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#177e70] dark:text-emerald-200">Submission bundle preview</p><h3 className="mt-1 font-heading text-2xl font-semibold text-[#17342e] dark:text-white">Your project kit will appear here</h3></div>
                <span className="rounded-full bg-[#e4f5ed] px-3 py-1.5 text-xs font-bold text-[#177e70] dark:bg-emerald-300/10 dark:text-emerald-200">10+ files</span>
              </div>
              <div className="grid gap-5 p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[['Course', course], ['Stack', techStack], ['Team', `${teamSize} member${teamSize === 1 ? '' : 's'}`], ['Deadline', timeLeft]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#173d36]/10 bg-white/75 p-3 dark:border-white/10 dark:bg-white/[0.035]"><p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#849790]">{label}</p><p className="mt-1 line-clamp-2 text-sm font-bold text-[#24463e] dark:text-white">{value}</p></div>)}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Lightbulb, title: 'Idea & synopsis', text: 'Title, abstract, objectives, scope and future direction.' },
                    { icon: Code2, title: 'Build architecture', text: 'Modules, screens, APIs, database and folder structure.' },
                    { icon: FolderTree, title: 'Starter source ZIP', text: 'Stack-specific files, setup guide and environment sample.' },
                    { icon: BookOpenCheck, title: 'Viva & portfolio', text: 'Questions, demo flow, resume bullets and presentation outline.' },
                  ].map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-xl border border-[#173d36]/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.035]"><Icon className="size-5 text-[#177e70] dark:text-emerald-200" /><h4 className="mt-3 text-sm font-bold text-[#24463e] dark:text-white">{item.title}</h4><p className="mt-1 text-xs leading-5 text-[#6a8079] dark:text-slate-300">{item.text}</p></div>; })}
                </div>
                <div className="rounded-xl border border-[#e4a77d]/35 bg-[#fff0e6] p-4 dark:border-[#e4a77d]/20 dark:bg-[#e4a77d]/10">
                  <p className="text-sm font-bold text-[#70452f] dark:text-[#ffc19b]">The generator creates a starter, not a submission shortcut.</p>
                  <p className="mt-1 text-xs leading-5 text-[#865f4b] dark:text-slate-300">Build the modules yourself, test the flow, add screenshots and explain every decision in your own words.</p>
                </div>
                {savedAvailable ? <button type="button" onClick={restoreLast} className="mx-auto inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 text-sm font-semibold !text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5"><Sparkles className="size-4" />See last kit</button> : null}
              </div>
            </div>
          )}
        </div>
      </div>
      {isGenerating ? <GenerationOverlay progress={progress} /> : null}
      <ToolToast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}

function ChoiceGrid<T extends string>({ label, value, options, onChange, compact }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void; compact?: boolean }) {
  return (
    <div className="rounded-[1rem] border border-[#173d36]/10 bg-[#f9fcfa] p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-[#35534c] dark:text-slate-100">{label}</div>
      <div className={`mt-3 flex flex-wrap gap-2 ${compact ? "" : "max-h-44 overflow-y-auto pr-1"}`}>
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === option ? "border-[#177e70] bg-[#177e70] text-white shadow-sm" : "border-[#173d36]/10 bg-white text-[#587069] hover:border-[#177e70]/45 hover:text-[#177e70] dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; suffix: string }) {
  const percent = ((value - min) / Math.max(1, max - min)) * 100;
  return (
    <div className="rounded-[1rem] border border-[#173d36]/10 bg-[#f9fcfa] p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[#35534c] dark:text-slate-100">{label}</div>
        <div className="rounded-full bg-[#e3f5ed] px-3 py-1 text-sm font-semibold text-[#177e70] dark:bg-emerald-400/10 dark:text-emerald-200">{value}{suffix}</div>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 h-2 w-full cursor-pointer accent-[#177e70]" style={{ background: `linear-gradient(90deg,#177e70 ${percent}%,#d8e4df ${percent}%)` }} />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-950/10 bg-white/72 p-3 shadow-sm shadow-blue-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.07]">
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/58 px-4 py-3 backdrop-blur dark:bg-white/[0.04]">
      <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 font-heading text-lg font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function InfoPanel({ title, icon: Icon, items, wide, compact }: { title: string; icon: typeof Lightbulb; items: string[]; wide?: boolean; compact?: boolean }) {
  return (
    <div className={`rounded-[1.1rem] border border-blue-950/10 bg-white p-5 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.05] ${wide ? "md:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 font-heading text-xl font-semibold text-slate-950 dark:text-white">
        <Icon className="size-5 text-primary dark:text-emerald-300" aria-hidden="true" />
        {title}
      </div>
      <ul className={`mt-4 grid text-sm leading-6 text-slate-650 dark:text-slate-300 ${compact ? "grid-cols-1 gap-2 xl:grid-cols-2" : items.length > 1 ? "grid-cols-1 gap-3 xl:grid-cols-2" : "gap-3"}`}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className={`flex gap-3 rounded-xl bg-slate-50 px-3 dark:bg-white/[0.06] ${compact ? "py-2 font-mono text-xs" : "py-3"}`}>
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VivaPanel({ questions }: { questions: ProjectKit["vivaQuestions"] }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="font-heading text-xl font-semibold text-slate-950 dark:text-white">Viva questions with answers</div>
      <div className="mt-3 grid gap-3">
        {questions.slice(0, 6).map((item) => (
          <div key={item.question} className="rounded-xl bg-blue-50/75 p-4 dark:bg-white/[0.06]">
            <div className="text-sm font-semibold text-slate-950 dark:text-white">Q. {item.question}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">A. {item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick, disabled }: { label: string; icon: typeof Copy; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-blue-950/5 transition hover:border-primary/35 hover:text-primary disabled:pointer-events-none disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

function GenerationOverlay({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/58 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.4rem] border border-white/18 bg-white p-6 shadow-2xl shadow-slate-950/30 dark:bg-slate-950 dark:text-white">
        <div className="flex items-center gap-4">
          <div className="relative grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200">
            <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
          </div>
          <div>
            <div className="font-heading text-2xl font-semibold text-slate-950 dark:text-white">Building project kit</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Creating idea, architecture, docs, code starter, and viva prep...</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"><span>AI generation</span><span>{Math.round(progress)}%</span></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/12"><div className="h-full rounded-full bg-[image:var(--button-solid)] transition-[width] duration-500" style={{ width: `${clamp(progress, 0, 100)}%` }} /></div>
      </div>
    </div>
  );
}

function buildProjectKitFiles(kit: ProjectKit, inputs: Omit<SavedProjectKit, "kit" | "requirement">) {
  const baseFiles: Record<string, string> = {
    "README.md": projectReadme(kit, inputs),
    "docs/01-project-synopsis.md": markdownSection("Project Synopsis", [
      kit.abstract,
      "## Problem Statement",
      kit.problemStatement,
      "## Objectives",
      ...kit.objectives.map((item) => `- ${item}`),
      "## Screens",
      ...kit.screens.map((item) => `- ${item}`),
    ]),
    "docs/02-features.md": markdownSection("Features", kit.keyFeatures.map((item) => `- ${item}`)),
    "docs/03-architecture.md": markdownSection("Architecture", kit.architecture.map((item) => `- ${item}`)),
    "docs/04-database-schema.md": markdownSection("Database Schema", kit.databaseSchema.map((item) => `- ${item}`)),
    "docs/05-api-plan.md": markdownSection("API Plan", kit.apiEndpoints.map((item) => `- ${item}`)),
    "docs/06-setup-guide.md": markdownSection("Setup Guide", kit.setupSteps.map((item, index) => `${index + 1}. ${item}`)),
    "docs/07-viva-questions.md": markdownSection("Viva Questions", kit.vivaQuestions.flatMap((item) => [`## ${item.question}`, item.answer])),
    "docs/08-resume-bullets.md": markdownSection("Resume Bullets", kit.resumeBullets.map((item) => `- ${item}`)),
    "docs/09-future-scope.md": markdownSection("Future Scope", kit.futureScope.map((item) => `- ${item}`)),
    "docs/10-presentation-outline.md": presentationOutline(kit),
  };

  return {
    ...baseFiles,
    ...starterFilesForStack(kit, inputs),
  };
}

function projectReadme(kit: ProjectKit, inputs: Omit<SavedProjectKit, "kit" | "requirement">) {
  return `# ${kit.title}

${kit.tagline}

## Project Details
- Course: ${inputs.course}
- Type: ${inputs.projectType}
- Tech Stack: ${inputs.techStack}
- Domain: ${inputs.domain}
- Difficulty: ${inputs.difficulty}
- Team Size: ${inputs.teamSize}
- Time Left: ${inputs.timeLeft}

## Abstract
${kit.abstract}

## Key Features
${kit.keyFeatures.map((item) => `- ${item}`).join("\n")}

## What is inside this ZIP
- /docs: synopsis, architecture, API plan, database schema, viva questions, presentation outline, and resume bullets.
- /source-starter: a starter implementation based on the selected stack.
- .env.example: environment variables you can copy into your local setup.

## Setup
${kit.setupSteps.map((item, index) => `${index + 1}. ${item}`).join("\n")}
`;
}

function presentationOutline(kit: ProjectKit) {
  return markdownSection("Presentation Outline", [
    "1. Title and team details",
    "2. Problem statement",
    "3. Existing system limitations",
    "4. Proposed solution",
    "5. Technology stack",
    "6. System architecture",
    "7. Database design",
    "8. Screens and modules",
    "9. Demo flow",
    "10. Future scope",
    "",
    "## Demo Script",
    `Start by explaining: ${kit.problemStatement}`,
    "Then show login, dashboard, main module flow, reports, and admin controls.",
  ]);
}

function starterFilesForStack(kit: ProjectKit, inputs: Omit<SavedProjectKit, "kit" | "requirement">) {
  const stack = inputs.techStack.toLowerCase();
  if (stack.includes("mern")) return mernStarter(kit);
  if (stack.includes("next") || stack.includes("supabase") || stack.includes("firebase") || stack.includes("react")) return nextStarter(kit, inputs);
  if (stack.includes("django")) return djangoStarter(kit);
  if (stack.includes("flask") || stack.includes("ai/ml") || stack.includes("data science")) return flaskStarter(kit);
  if (stack.includes("spring")) return springStarter(kit);
  if (stack.includes("laravel") || stack.includes("php")) return laravelStarter(kit);
  return universalStarter(kit, inputs);
}

function nextStarter(kit: ProjectKit, inputs: Omit<SavedProjectKit, "kit" | "requirement">) {
  return {
    "source-starter/README.md": starterReadme(kit, "Next.js starter"),
    "source-starter/.env.example": "NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\nDATABASE_URL=\n",
    "source-starter/package.json": JSON.stringify({
      scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" },
      dependencies: { "@supabase/supabase-js": "latest", next: "latest", react: "latest", "react-dom": "latest", "lucide-react": "latest" },
      devDependencies: { typescript: "latest", "@types/node": "latest", "@types/react": "latest", tailwindcss: "latest" },
    }, null, 2),
    "source-starter/src/app/layout.tsx": `import "./globals.css";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>;\n}\n`,
    "source-starter/src/app/page.tsx": nextPage(kit, inputs),
    "source-starter/src/app/globals.css": "body{margin:0;font-family:Inter,Arial,sans-serif;background:#eef5fb;color:#0f172a}.page{min-height:100vh;padding:32px}.hero{background:linear-gradient(135deg,#173b89,#2ba8ff,#22b573);color:white;border-radius:24px;padding:28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:20px}.card{background:white;border:1px solid #dbe7f3;border-radius:18px;padding:18px;box-shadow:0 12px 32px rgba(15,23,42,.08)}button{border:0;border-radius:999px;background:#173b89;color:white;padding:12px 18px;font-weight:700}",
    "source-starter/src/lib/project-data.ts": `export const projectData = ${JSON.stringify({
      title: kit.title,
      tagline: kit.tagline,
      features: kit.keyFeatures,
      screens: kit.screens,
      endpoints: kit.apiEndpoints,
    }, null, 2)};\n`,
    "source-starter/src/lib/supabase.ts": "import { createClient } from '@supabase/supabase-js';\n\nexport const supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL || '',\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''\n);\n",
    "source-starter/supabase/migrations/001_initial_schema.sql": sqlSchema(kit),
    "source-starter/supabase/seed.sql": seedSql(kit),
  };
}

function mernStarter(kit: ProjectKit) {
  return {
    "source-starter/README.md": starterReadme(kit, "MERN starter"),
    "source-starter/.env.example": "MONGODB_URI=mongodb://127.0.0.1:27017/final_year_project\nJWT_SECRET=change-me\nPORT=5000\n",
    "source-starter/package.json": JSON.stringify({ scripts: { dev: "npm --prefix backend run dev", "dev:frontend": "npm --prefix frontend run dev", "dev:backend": "npm --prefix backend run dev" } }, null, 2),
    "source-starter/backend/package.json": JSON.stringify({ scripts: { dev: "node server.js" }, dependencies: { cors: "latest", dotenv: "latest", express: "latest", mongoose: "latest" } }, null, 2),
    "source-starter/backend/server.js": mernServer(kit),
    "source-starter/backend/models/Record.js": "const mongoose = require('mongoose');\n\nconst recordSchema = new mongoose.Schema({\n  title: String,\n  description: String,\n  status: { type: String, default: 'pending' },\n  owner: String\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('Record', recordSchema);\n",
    "source-starter/frontend/package.json": JSON.stringify({ scripts: { dev: "vite --host 0.0.0.0" }, dependencies: { "@vitejs/plugin-react": "latest", vite: "latest", react: "latest", "react-dom": "latest" }, devDependencies: {} }, null, 2),
    "source-starter/frontend/index.html": "<div id=\"root\"></div><script type=\"module\" src=\"/src/App.jsx\"></script>",
    "source-starter/frontend/src/App.jsx": reactApp(kit),
    "source-starter/frontend/src/styles.css": "body{margin:0;font-family:Inter,Arial,sans-serif;background:#eef5fb;color:#0f172a}.page{padding:32px}.hero{background:linear-gradient(135deg,#173b89,#2ba8ff,#22b573);color:white;border-radius:24px;padding:28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:20px}.card{background:white;border:1px solid #dbe7f3;border-radius:18px;padding:18px}",
  };
}

function djangoStarter(kit: ProjectKit) {
  return {
    "source-starter/README.md": starterReadme(kit, "Django starter"),
    "source-starter/requirements.txt": "django\ndjangorestframework\npython-dotenv\n",
    "source-starter/.env.example": "SECRET_KEY=change-me\nDEBUG=True\n",
    "source-starter/manage.py": "# Install Django and run: django-admin startproject config .\n# Then create an app for the modules listed in docs.\n",
    "source-starter/app/models.py": pythonModels(kit),
    "source-starter/app/views.py": "from rest_framework.views import APIView\nfrom rest_framework.response import Response\n\nclass DashboardView(APIView):\n    def get(self, request):\n        return Response({'message': 'Project dashboard API is ready'})\n",
  };
}

function flaskStarter(kit: ProjectKit) {
  return {
    "source-starter/README.md": starterReadme(kit, "Python Flask starter"),
    "source-starter/requirements.txt": "flask\nflask-cors\npython-dotenv\n",
    "source-starter/.env.example": "FLASK_ENV=development\nSECRET_KEY=change-me\n",
    "source-starter/app.py": `from flask import Flask, jsonify, request\nfrom flask_cors import CORS\n\napp = Flask(__name__)\nCORS(app)\n\nrecords = []\n\n@app.get('/')\ndef home():\n    return jsonify({'project': '${escapeForSingleQuote(kit.title)}', 'status': 'running'})\n\n@app.get('/api/features')\ndef features():\n    return jsonify(${JSON.stringify(kit.keyFeatures, null, 4)})\n\n@app.post('/api/records')\ndef create_record():\n    data = request.get_json() or {}\n    records.append(data)\n    return jsonify({'message': 'record created', 'record': data}), 201\n\nif __name__ == '__main__':\n    app.run(debug=True)\n`,
  };
}

function springStarter(kit: ProjectKit) {
  return {
    "source-starter/README.md": starterReadme(kit, "Spring Boot starter"),
    "source-starter/pom.xml": "<project><modelVersion>4.0.0</modelVersion><groupId>com.kasa</groupId><artifactId>final-year-project</artifactId><version>1.0.0</version><properties><java.version>17</java.version></properties></project>",
    "source-starter/src/main/java/com/kasa/project/ProjectController.java": `package com.kasa.project;\n\nimport org.springframework.web.bind.annotation.*;\nimport java.util.*;\n\n@RestController\n@RequestMapping(\"/api\")\npublic class ProjectController {\n  @GetMapping(\"/features\")\n  public List<String> features() {\n    return Arrays.asList(${kit.keyFeatures.slice(0, 6).map((item) => `"${escapeForDoubleQuote(item)}"`).join(", ")});\n  }\n}\n`,
  };
}

function laravelStarter(kit: ProjectKit) {
  return {
    "source-starter/README.md": starterReadme(kit, "Laravel starter"),
    "source-starter/routes/api.php": `<?php\n\nuse Illuminate\\Support\\Facades\\Route;\n\nRoute::get('/features', function () {\n    return ${JSON.stringify(kit.keyFeatures.slice(0, 8), null, 4)};\n});\n`,
    "source-starter/database/migrations/README.md": markdownSection("Laravel Database Plan", kit.databaseSchema.map((item) => `- ${item}`)),
  };
}

function universalStarter(kit: ProjectKit, inputs: Omit<SavedProjectKit, "kit" | "requirement">) {
  return {
    "source-starter/README.md": starterReadme(kit, `${inputs.techStack} implementation starter`),
    "source-starter/project-modules.json": JSON.stringify({ screens: kit.screens, features: kit.keyFeatures, apis: kit.apiEndpoints, schema: kit.databaseSchema }, null, 2),
    "source-starter/src/IMPLEMENTATION_GUIDE.md": markdownSection("Implementation Guide", [
      "Use this file as your coding checklist.",
      "## Modules",
      ...kit.keyFeatures.map((item) => `- ${item}`),
      "## Suggested Folder Structure",
      ...kit.folderStructure.map((item) => `- ${item}`),
    ]),
  };
}

function starterReadme(kit: ProjectKit, label: string) {
  return `# ${label}

This starter is generated for: **${kit.title}**.

It is not a finished paid project. It is a practical base structure with starter files, docs, and implementation direction.

## Build Order
1. Set environment variables from .env.example.
2. Create database tables/collections from docs/04-database-schema.md.
3. Build authentication first.
4. Build dashboard and CRUD modules.
5. Add reports, validation, and final UI polish.

## Main Features
${kit.keyFeatures.map((item) => `- ${item}`).join("\n")}
`;
}

function nextPage(kit: ProjectKit, inputs: Omit<SavedProjectKit, "kit" | "requirement">) {
  return `import { projectData } from "@/lib/project-data";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p>${inputs.techStack} final year project</p>
        <h1>{projectData.title}</h1>
        <p>{projectData.tagline}</p>
      </section>
      <section className="grid">
        {projectData.features.map((feature) => (
          <article className="card" key={feature}>
            <h2>{feature}</h2>
            <p>Connect this module with your database and API layer.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
`;
}

function reactApp(kit: ProjectKit) {
  return `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './styles.css';\n\nconst project = ${JSON.stringify({ title: kit.title, tagline: kit.tagline, features: kit.keyFeatures.slice(0, 8) }, null, 2)};\n\nfunction App() {\n  return <main className=\"page\"><section className=\"hero\"><h1>{project.title}</h1><p>{project.tagline}</p></section><section className=\"grid\">{project.features.map((feature) => <article className=\"card\" key={feature}><h2>{feature}</h2><p>Build API and database connection for this module.</p></article>)}</section></main>;\n}\n\ncreateRoot(document.getElementById('root')).render(<App />);\n`;
}

function mernServer(kit: ProjectKit) {
  return `require('dotenv').config();\nconst express = require('express');\nconst cors = require('cors');\nconst mongoose = require('mongoose');\nconst Record = require('./models/Record');\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\n\nmongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/final_year_project');\n\napp.get('/', (req, res) => res.json({ project: '${escapeForSingleQuote(kit.title)}', status: 'running' }));\napp.get('/api/features', (req, res) => res.json(${JSON.stringify(kit.keyFeatures.slice(0, 8), null, 2)}));\napp.get('/api/records', async (req, res) => res.json(await Record.find().sort({ createdAt: -1 })));\napp.post('/api/records', async (req, res) => res.status(201).json(await Record.create(req.body)));\n\napp.listen(process.env.PORT || 5000, () => console.log('API running'));\n`;
}

function pythonModels(kit: ProjectKit) {
  return `from django.db import models\n\nclass ProjectRecord(models.Model):\n    title = models.CharField(max_length=180)\n    description = models.TextField(blank=True)\n    status = models.CharField(max_length=40, default='pending')\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return self.title\n\n# Suggested modules:\n${kit.keyFeatures.slice(0, 8).map((item) => `# - ${item}`).join("\n")}\n`;
}

function sqlSchema(kit: ProjectKit) {
  return `create table if not exists app_users (\n  id uuid primary key default gen_random_uuid(),\n  name text not null,\n  email text unique not null,\n  role text not null default 'student',\n  created_at timestamptz default now()\n);\n\ncreate table if not exists project_records (\n  id uuid primary key default gen_random_uuid(),\n  title text not null,\n  description text,\n  status text default 'pending',\n  owner_id uuid references app_users(id),\n  created_at timestamptz default now()\n);\n\n-- Extend these tables using the AI database plan:\n${kit.databaseSchema.map((item) => `-- ${item}`).join("\n")}\n`;
}

function seedSql(kit: ProjectKit) {
  return `insert into project_records (title, description, status) values\n${kit.keyFeatures.slice(0, 4).map((item) => `('${escapeForSingleQuote(item)}', 'Starter module generated for final year project.', 'planned')`).join(",\n")};\n`;
}

function escapeForSingleQuote(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function escapeForDoubleQuote(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function markdownSection(title: string, lines: string[]) {
  return [`# ${title}`, "", ...lines].join("\n");
}

function createZip(files: Record<string, string>) {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    localParts.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, Object.keys(files).length, true);
  endView.setUint16(10, Object.keys(files).length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  const zipParts = [...localParts, ...centralParts, end].map((part) => {
    const copy = new Uint8Array(part.byteLength);
    copy.set(part);
    return copy.buffer;
  });
  return new Blob(zipParts, { type: "application/zip" });
}

function crc32(data: Uint8Array) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function slugify(value: string) {
  return (value || "project-kit").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "project-kit";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);
}
