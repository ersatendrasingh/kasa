"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  CheckCircle2,
  Clipboard,
  Clock3,
  Copy,
  Download,
  GraduationCap,
  LoaderCircle,
  Printer,
  Route,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { ToolToast, type ToolToastState } from "@/components/tools/tool-toast";

type Roadmap = {
  title: string;
  summary: string;
  roleFit: string;
  focusAreas: string[];
  skillsToLearn: { skill: string; why: string; priority: string }[];
  weeklyPlan: { week: string; focus: string; tasks: string[]; outcome: string }[];
  projects: { title: string; description: string; skills: string[]; resumeBullets: string[] }[];
  portfolioTasks: string[];
  interviewPrep: { topic: string; questions: string[] }[];
  jobSearchActions: string[];
  freeResources: string[];
  mistakesToAvoid: string[];
  checkpoints: { label: string; proof: string }[];
};

const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "Java Developer",
  "Python Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Digital Marketing Executive",
  "Business Analyst",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
];

const courseOptions = ["BTech CSE", "BTech IT", "BCA", "MCA", "BSc CS", "MBA", "BCom", "Diploma", "Other"];
const yearOptions = ["1st year", "2nd year", "3rd year", "Final year", "Passed out"];
const languageOptions = ["English", "Hinglish"];
const learningStyles = ["Balanced theory and projects", "Project-first", "Interview-first", "Beginner friendly", "Fast revision"];
const experienceLevels = ["Student / Fresher", "Internship experience", "0-1 year", "1-3 years", "Career switcher"];

const sampleSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "Python",
  "Java",
  "Spring Boot",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "DSA basics",
  "Git",
  "GitHub",
  "REST API",
  "Tailwind CSS",
  "Excel",
  "Power BI",
  "Machine Learning",
  "Figma",
  "Communication",
  "Aptitude",
  "Problem Solving",
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

function listText(items: string[]) {
  return items.filter(Boolean).map((item) => `- ${item}`).join("\n");
}

function roadmapToText(roadmap: Roadmap) {
  return [
    roadmap.title,
    "",
    roadmap.summary,
    "",
    "Role fit",
    roadmap.roleFit,
    "",
    "Focus areas",
    listText(roadmap.focusAreas),
    "",
    "Skills to learn",
    roadmap.skillsToLearn.map((item) => `- ${item.skill} (${item.priority}): ${item.why}`).join("\n"),
    "",
    "Weekly plan",
    roadmap.weeklyPlan.map((week) => `${week.week}: ${week.focus}\n${listText(week.tasks)}\nOutcome: ${week.outcome}`).join("\n\n"),
    "",
    "Projects",
    roadmap.projects.map((project) => `${project.title}\n${project.description}\nSkills: ${project.skills.join(", ")}\nResume bullets:\n${listText(project.resumeBullets)}`).join("\n\n"),
    "",
    "Interview prep",
    roadmap.interviewPrep.map((topic) => `${topic.topic}\n${listText(topic.questions)}`).join("\n\n"),
    "",
    "Job search actions",
    listText(roadmap.jobSearchActions),
    "",
    "Mistakes to avoid",
    listText(roadmap.mistakesToAvoid),
  ].join("\n");
}

export function AiCareerRoadmap() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [course, setCourse] = useState("BTech CSE");
  const [year, setYear] = useState("Final year");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["HTML", "CSS", "JavaScript", "React", "Git"]);
  const [goal, setGoal] = useState("Get an internship or fresher job");
  const [dailyHours, setDailyHours] = useState(2);
  const [timelineMonths, setTimelineMonths] = useState(3);
  const [experienceLevel, setExperienceLevel] = useState("Student / Fresher");
  const [learningStyle, setLearningStyle] = useState("Balanced theory and projects");
  const [language, setLanguage] = useState("English");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<ToolToastState>(null);

  const currentSkills = useMemo(() => selectedSkills.join(", "), [selectedSkills]);

  useEffect(() => {
    if (!isGenerating) return;
    const intervalId = window.setInterval(() => {
      setProgress((value) => {
        if (value < 35) return Math.min(value + 8, 35);
        if (value < 78) return Math.min(value + 5, 78);
        return Math.min(value + 2, 94);
      });
    }, 420);
    return () => window.clearInterval(intervalId);
  }, [isGenerating]);

  const notify = (type: NonNullable<ToolToastState>["type"], title: string, message: string) => {
    setToast({ id: Date.now(), type, title, message });
  };

  const addSkill = (skill: string) => {
    const skills = new Set(selectedSkills.map((item) => item.toLowerCase()));
    if (skills.has(skill.toLowerCase())) return;
    setSelectedSkills((value) => [...value, skill].slice(0, 18));
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((value) => value.filter((item) => item !== skill));
  };

  const generateRoadmap = async () => {
    if (selectedSkills.length < 2) {
      notify("error", "Add current skills", "Add a few skills or subjects you already know.");
      return;
    }

    setIsGenerating(true);
    setProgress(8);
    try {
      const response = await fetch("/api/tools/career-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          course,
          year,
          currentSkills,
          goal,
          dailyHours,
          timelineMonths,
          experienceLevel,
          learningStyle,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Roadmap generation failed.");
      setProgress(96);
      setRoadmap(data.roadmap);
      notify("success", "Roadmap ready", "Your career roadmap is ready.");
    } catch (error) {
      notify("error", "Could not generate roadmap", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setProgress(100);
      window.setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 450);
    }
  };

  const copyRoadmap = async () => {
    if (!roadmap) return;
    await navigator.clipboard.writeText(roadmapToText(roadmap));
    notify("success", "Copied", "Roadmap copied to clipboard.");
  };

  const downloadRoadmap = () => {
    if (!roadmap) return;
    const blob = new Blob([roadmapToText(roadmap)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${targetRole.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-career-roadmap.txt`;
    link.click();
    URL.revokeObjectURL(url);
    notify("success", "Downloaded", "Roadmap text file downloaded.");
  };

  const printRoadmap = () => {
    if (!roadmap || !resultRef.current) return;
    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      notify("error", "Print blocked", "Please allow pop-ups to print the roadmap.");
      return;
    }
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${roadmap.title}</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; color: #0f172a; padding: 28px; line-height: 1.6; }
            h1, h2, h3 { color: #020617; line-height: 1.2; }
            .no-print { display: none !important; }
            .print-root { max-width: 860px; margin: 0 auto; }
            section, .rounded-2xl { break-inside: avoid; page-break-inside: avoid; }
            .rounded-2xl, .rounded-xl { border: 1px solid #dbe7f5; border-radius: 14px; padding: 14px; margin: 10px 0; background: #f8fbff; }
            ul { padding-left: 18px; }
          </style>
        </head>
        <body><main class="print-root">${resultRef.current.innerHTML}</main></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <section className="relative bg-[#f7fbf7] px-4 py-14 text-[#122c28] dark:bg-surface-strong dark:text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-[96rem] gap-6 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
        <div className="rounded-[1.4rem] border border-[#173d36]/10 bg-white/90 p-5 shadow-[0_20px_55px_rgba(24,68,59,0.08)] dark:border-white/10 dark:bg-white/[0.045] xl:sticky xl:top-28">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#e2f6ed] text-[#177e70] dark:bg-primary/12 dark:text-emerald-200">
              <Route className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#177e70] dark:text-emerald-200">Your inputs · about 2 minutes</p>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-[#15342e] dark:text-white">
                Design your career route
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#617871] dark:text-slate-300">
                Be specific about where you are now. The plan adapts to your time, experience and learning style.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="flex items-center justify-between text-sm font-semibold text-[#35534c] dark:text-slate-200"><span>1. Target role</span><span className="text-xs font-medium text-[#80938e]">Where do you want to go?</span></span>
              <select value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm font-medium outline-none transition focus:border-[#1a9a7f] focus:ring-2 focus:ring-[#1a9a7f]/10 dark:border-white/10 dark:bg-slate-950/50">
                {roleOptions.map((role) => <option key={role}>{role}</option>)}
              </select>
            </label>

            <div className="flex flex-wrap gap-2">
              {["Frontend Developer", "Data Analyst", "Java Developer", "UI/UX Designer"].map((role) => (
                <button key={role} type="button" onClick={() => setTargetRole(role)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${targetRole === role ? "border-[#177e70] bg-[#177e70] text-white" : "border-[#173d36]/12 bg-white text-[#587069] hover:border-[#177e70]/45 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"}`}>{role}</button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#35534c] dark:text-slate-200">2. Course / branch</span>
                <select value={course} onChange={(event) => setCourse(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm outline-none transition focus:border-[#1a9a7f] dark:border-white/10 dark:bg-slate-950/50">
                  {courseOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#35534c] dark:text-slate-200">College year</span>
                <select value={year} onChange={(event) => setYear(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm outline-none transition focus:border-[#1a9a7f] dark:border-white/10 dark:bg-slate-950/50">
                  {yearOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <SkillPicker selectedSkills={selectedSkills} onAdd={addSkill} onRemove={removeSkill} />

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#35534c] dark:text-slate-200">4. Your immediate goal</span>
              <input value={goal} onChange={(event) => setGoal(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm outline-none transition focus:border-[#1a9a7f] focus:ring-2 focus:ring-[#1a9a7f]/10 dark:border-white/10 dark:bg-slate-950/50" />
            </label>

            <div className="grid gap-3 rounded-xl bg-[#f0f8f4] p-4 dark:bg-white/[0.04] sm:grid-cols-2">
              <label className="grid gap-3">
                <span className="flex items-center justify-between text-sm font-semibold text-[#35534c] dark:text-slate-200"><span>Daily time</span><strong className="rounded-full bg-white px-2.5 py-1 text-xs text-[#177e70] shadow-sm dark:bg-white/10 dark:text-emerald-200">{dailyHours}h</strong></span>
                <input className="accent-[#177e70]" type="range" min={1} max={10} value={dailyHours} onChange={(event) => setDailyHours(Number(event.target.value))} />
              </label>
              <label className="grid gap-3">
                <span className="flex items-center justify-between text-sm font-semibold text-[#35534c] dark:text-slate-200"><span>Timeline</span><strong className="rounded-full bg-white px-2.5 py-1 text-xs text-[#177e70] shadow-sm dark:bg-white/10 dark:text-emerald-200">{timelineMonths} months</strong></span>
                <input className="accent-[#177e70]" type="range" min={1} max={12} value={timelineMonths} onChange={(event) => setTimelineMonths(Number(event.target.value))} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#35534c] dark:text-slate-200">Experience level</span>
                <select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm outline-none transition focus:border-[#1a9a7f] dark:border-white/10 dark:bg-slate-950/50">
                  {experienceLevels.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#35534c] dark:text-slate-200">Learning style</span>
                <select value={learningStyle} onChange={(event) => setLearningStyle(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm outline-none transition focus:border-[#1a9a7f] dark:border-white/10 dark:bg-slate-950/50">
                  {learningStyles.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#35534c] dark:text-slate-200">Language</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-12 rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] px-3 text-sm outline-none transition focus:border-[#1a9a7f] dark:border-white/10 dark:bg-slate-950/50">
                  {languageOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>

            <button type="button" onClick={generateRoadmap} disabled={isGenerating} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 text-sm font-bold !text-white shadow-[0_14px_30px_rgba(20,112,96,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70">
              {isGenerating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
              {isGenerating ? "Creating roadmap..." : "Generate AI roadmap"}
            </button>
          </div>
        </div>

        <div className="min-h-[42rem] rounded-[1.4rem] border border-[#173d36]/10 bg-white p-5 shadow-[0_20px_55px_rgba(24,68,59,0.08)] dark:border-white/10 dark:bg-white/[0.04]">
          {roadmap ? (
            <div ref={resultRef}>
              <div className="flex flex-col gap-4 border-b border-blue-950/10 pb-5 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-emerald-200">Your roadmap</p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white">{roadmap.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{roadmap.summary}</p>
                </div>
                <div className="no-print grid grid-cols-3 gap-2 sm:flex">
                  <ActionButton label="Copy" icon={Copy} onClick={copyRoadmap} />
                  <ActionButton label="Download" icon={Download} onClick={downloadRoadmap} />
                  <ActionButton label="Print" icon={Printer} onClick={printRoadmap} />
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {[
                  { label: "Target role", value: targetRole, icon: Target },
                  { label: "Daily time", value: `${dailyHours} hours`, icon: Clock3 },
                  { label: "Timeline", value: `${timelineMonths} months`, icon: BriefcaseBusiness },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-blue-950/10 bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-slate-950/36">
                      <Icon className="size-5 text-primary dark:text-emerald-200" aria-hidden="true" />
                      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">{item.label}</div>
                      <div className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{item.value}</div>
                    </div>
                  );
                })}
              </div>

              <ResultSection title="Role fit" icon={GraduationCap}>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{roadmap.roleFit}</p>
              </ResultSection>

              <ResultSection title="Skills to learn" icon={CheckCircle2}>
                <div className="grid gap-3 md:grid-cols-2">
                  {roadmap.skillsToLearn.map((skill) => (
                    <div key={skill.skill} className="rounded-2xl border border-blue-950/10 bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-slate-950/36">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-slate-950 dark:text-white">{skill.skill}</h3>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary/12 dark:text-emerald-200">{skill.priority}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{skill.why}</p>
                    </div>
                  ))}
                </div>
              </ResultSection>

              <ResultSection title="Weekly plan" icon={Clipboard}>
                <div className="space-y-3">
                  {roadmap.weeklyPlan.map((week) => (
                    <div key={week.week} className="rounded-2xl border border-blue-950/10 bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-slate-950/36">
                      <h3 className="font-semibold text-slate-950 dark:text-white">{week.week}: {week.focus}</h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {week.tasks.map((task) => <li key={task}>- {task}</li>)}
                      </ul>
                      <p className="mt-3 rounded-xl bg-white p-3 text-sm font-medium text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">Outcome: {week.outcome}</p>
                    </div>
                  ))}
                </div>
              </ResultSection>

              <ResultSection title="Projects to build" icon={Sparkles}>
                <div className="grid gap-3 lg:grid-cols-2">
                  {roadmap.projects.map((project) => (
                    <div key={project.title} className="rounded-2xl border border-blue-950/10 bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-slate-950/36">
                      <h3 className="font-semibold text-slate-950 dark:text-white">{project.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.skills.map((skill) => <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-200">{skill}</span>)}
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {project.resumeBullets.map((bullet) => <li key={bullet}>- {bullet}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </ResultSection>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <Checklist title="Portfolio tasks" items={roadmap.portfolioTasks} />
                <Checklist title="Job search actions" items={roadmap.jobSearchActions} />
                <Checklist title="Free resources to use" items={roadmap.freeResources} />
                <Checklist title="Mistakes to avoid" items={roadmap.mistakesToAvoid} />
              </div>
            </div>
          ) : (
            <div className="min-h-[38rem] overflow-hidden rounded-[1.1rem] border border-[#173d36]/10 bg-[linear-gradient(145deg,#f8fcf9,#eef8f3)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
              <div className="border-b border-[#173d36]/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#177e70] dark:text-emerald-200">Roadmap preview</p><h2 className="mt-1 font-heading text-2xl font-semibold text-[#17342e] dark:text-white">Your plan will take shape here</h2></div>
                  <span className="rounded-full bg-[#e4f5ed] px-3 py-1.5 text-xs font-bold text-[#177e70] dark:bg-emerald-300/10 dark:text-emerald-200">Personalised</span>
                </div>
              </div>
              <div className="grid gap-5 p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-3">
                  {[['Role', targetRole], ['Time', `${dailyHours}h / day`], ['Timeline', `${timelineMonths} months`]].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-[#173d36]/10 bg-white/75 p-3 dark:border-white/10 dark:bg-white/[0.035]"><p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#81958f]">{label}</p><p className="mt-1 line-clamp-2 text-sm font-bold text-[#23443c] dark:text-white">{value}</p></div>
                  ))}
                </div>
                <div className="relative ml-3 border-l border-dashed border-[#7ac6b4] pl-7">
                  {[['Skills gap', 'Priority skills ordered by what your target role needs first.'], ['Weekly sprints', 'Focused tasks sized to your available study time.'], ['Portfolio proof', 'Projects, GitHub tasks and honest resume bullet ideas.'], ['Interview & applications', 'Questions, checkpoints and practical job-search actions.']].map(([title, body], index) => (
                    <div key={title} className="relative pb-5 last:pb-0"><span className="absolute -left-[2.2rem] top-0 grid size-4 place-items-center rounded-full bg-[#177e70] text-[0.5rem] font-bold text-white ring-4 ring-[#eef8f3] dark:ring-[#173029]">{index + 1}</span><h3 className="text-sm font-bold text-[#24463e] dark:text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-[#697f78] dark:text-slate-300">{body}</p></div>
                  ))}
                </div>
                <div className="rounded-xl border border-[#e7ad86]/35 bg-[#fff2e8] p-4 dark:border-[#e7ad86]/20 dark:bg-[#e7ad86]/10">
                  <p className="text-sm font-bold text-[#71442d] dark:text-[#ffc4a1]">Ready when your inputs feel honest.</p>
                  <p className="mt-1 text-xs leading-5 text-[#86604c] dark:text-slate-300">Generate once, review the result, then return whenever your skills or timeline changes.</p>
                </div>
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

function SkillPicker({
  selectedSkills,
  onAdd,
  onRemove,
}: {
  selectedSkills: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredSkills = sampleSkills.filter((skill) => skill.toLowerCase().includes(query.toLowerCase()) && !selectedSkills.includes(skill)).slice(0, 12);

  return (
    <div className="grid gap-2">
      <span className="flex items-center justify-between text-sm font-semibold text-[#35534c] dark:text-slate-200"><span>3. Current skills</span><span className="text-xs font-medium text-[#80938e]">Add at least two</span></span>
      <div className="rounded-xl border border-[#173d36]/12 bg-[#fbfdfb] p-3 dark:border-white/10 dark:bg-slate-950/50">
        <div className="flex min-h-12 flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-[#e3f5ed] px-3 py-1.5 text-xs font-semibold text-[#177e70] dark:bg-primary/12 dark:text-emerald-200">
              {skill}
              <button type="button" onClick={() => onRemove(skill)} className="grid size-4 place-items-center rounded-full bg-white/80 text-slate-500 hover:text-red-600 dark:bg-white/10 dark:text-slate-200" aria-label={`Remove ${skill}`}>
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
        <div className="relative mt-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#173d36]/10 bg-white px-3 dark:border-white/10 dark:bg-white/[0.04]">
            <Search className="size-4 text-[#177e70] dark:text-emerald-200" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search and add skills"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10" aria-label="Toggle skills">
              <ChevronDown className="size-4" aria-hidden="true" />
            </button>
          </div>
          {open ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#173d36]/10 bg-white p-2 shadow-2xl shadow-[#173d36]/12 dark:border-white/10 dark:bg-slate-950">
              {(filteredSkills.length ? filteredSkills : sampleSkills.filter((skill) => !selectedSkills.includes(skill)).slice(0, 12)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    onAdd(skill);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-primary dark:text-slate-200 dark:hover:bg-white/8"
                >
                  {skill}
                  <span className="text-xs text-slate-400">Add</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick }: { label: string; icon: typeof Copy; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm shadow-blue-950/5 transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white sm:px-4 sm:text-sm">
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function GenerationOverlay({ progress }: { progress: number }) {
  const stage = progress < 35 ? "Reading your profile" : progress < 78 ? "Planning skills and projects" : progress < 94 ? "Writing weekly actions" : "Preparing roadmap";
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/58 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.4rem] border border-white/18 bg-white p-6 shadow-2xl shadow-slate-950/30 dark:bg-slate-950 dark:text-white">
        <div className="flex items-center gap-4">
          <div className="relative grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200">
            <Sparkles className="size-6 animate-pulse" aria-hidden="true" />
            <span className="absolute inset-0 rounded-full border-2 border-emerald-300/70 border-t-transparent animate-spin" />
          </div>
          <div>
            <div className="font-heading text-2xl font-semibold text-slate-950 dark:text-white">Creating career roadmap</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stage}...</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          <span>AI generation</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/12">
          <div className="h-full rounded-full bg-[image:var(--button-solid)] transition-[width] duration-500" style={{ width: `${clamp(progress, 0, 100)}%` }} />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Matching your skills with the target role and preparing weekly tasks, projects, and interview prep.
        </p>
      </div>
    </div>
  );
}

function ResultSection({ title, icon: Icon, children }: { title: string; icon: typeof Route; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-primary dark:bg-primary/12 dark:text-emerald-200">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-blue-950/10 bg-[#f8fbff] p-4 dark:border-white/10 dark:bg-slate-950/36">
      <h3 className="font-semibold text-slate-950 dark:text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}
