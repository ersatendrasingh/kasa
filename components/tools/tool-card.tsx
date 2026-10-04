import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { type ToolCategory, type ToolItem } from "@/lib/tools";

const visualStyles: Record<ToolCategory, { panel: string; chip: string; accent: string; soft: string }> = {
  Students: { panel: "border-sky-200 bg-[#f5fbff] dark:border-sky-300/20 dark:bg-[#10233e]", chip: "border-sky-200 bg-white text-primary dark:border-sky-300/25 dark:bg-sky-300/10 dark:text-sky-100", accent: "bg-[#3f8ee8]", soft: "bg-[#dceeff] dark:bg-sky-300/12" },
  Teachers: { panel: "border-emerald-200 bg-[#f4fcf8] dark:border-emerald-300/20 dark:bg-[#102b25]", chip: "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-300/25 dark:bg-emerald-300/10 dark:text-emerald-100", accent: "bg-[#1caa7e]", soft: "bg-[#dff6ed] dark:bg-emerald-300/12" },
  Academies: { panel: "border-violet-200 bg-[#f8f6ff] dark:border-violet-300/20 dark:bg-[#211c42]", chip: "border-violet-200 bg-white text-violet-700 dark:border-violet-300/25 dark:bg-violet-300/10 dark:text-violet-100", accent: "bg-[#7b61d9]", soft: "bg-[#e9e2ff] dark:bg-violet-300/12" },
};

function visualType(slug: string) {
  if (/(calculator|percentage|gpa|cgpa|grade|score|profit|pricing|capacity|attendance|eligibility)/.test(slug)) return "metric";
  if (/(timetable|planner|roadmap|deadline|project-kit)/.test(slug)) return "plan";
  if (/(resume|worksheet|report-card|assignment|lesson-plan|question-paper|receipt|admission-form|certificate)/.test(slug)) return "document";
  return "ai";
}

export function ToolCardVisual({ tool }: { tool: ToolItem }) {
  const Icon = tool.icon;
  const style = visualStyles[tool.category];
  const type = visualType(tool.slug);
  return <div className={`relative h-44 overflow-hidden rounded-[1.1rem] border p-4 ${style.panel}`}>
    <div className={`absolute -right-8 -top-8 size-36 rounded-full opacity-70 ${style.soft}`} />
    <div className="relative z-10 flex items-center justify-between"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[.12em] ${style.chip}`}>{tool.isAi ? <Sparkles className="size-3" /> : null}{tool.isAi ? "AI tool" : tool.category}</span><span className={`grid size-9 place-items-center rounded-xl text-white shadow-lg ${style.accent}`}><Icon className="size-4.5" /></span></div>
    {type === "metric" ? <MetricPreview accent={style.accent} soft={style.soft} /> : null}
    {type === "plan" ? <PlanPreview accent={style.accent} soft={style.soft} /> : null}
    {type === "document" ? <DocumentPreview accent={style.accent} soft={style.soft} /> : null}
    {type === "ai" ? <AiPreview accent={style.accent} soft={style.soft} /> : null}
  </div>;
}

function MetricPreview({ accent, soft }: { accent: string; soft: string }) {
  return <div className="absolute inset-x-4 bottom-4 top-16 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/[.07]"><div className="flex items-end justify-between"><div><span className="text-[.6rem] font-bold uppercase tracking-[.12em] text-slate-400">Quick result</span><p className="mt-1 font-heading text-2xl font-semibold text-slate-800 dark:text-white">82<span className="text-sm">%</span></p></div><div className="flex h-10 items-end gap-1">{[40, 65, 53, 82, 72].map((height, index) => <span key={index} className={`w-2.5 rounded-t ${index === 4 ? accent : soft}`} style={{ height: `${height}%` }} />)}</div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><span className={`block h-full w-[82%] rounded-full ${accent}`} /></div></div>;
}

function PlanPreview({ accent, soft }: { accent: string; soft: string }) {
  return <div className="absolute inset-x-4 bottom-4 top-16 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/[.07]"><div className="flex items-center justify-between text-[.6rem] font-bold uppercase tracking-[.12em] text-slate-400"><span>Next steps</span><span>3 tasks</span></div><div className="mt-3 space-y-2">{["Research", "Build", "Review"].map((item, index) => <div key={item} className="flex items-center gap-2"><span className={`grid size-4 place-items-center rounded-full text-[.55rem] font-bold text-white ${index === 0 ? accent : "bg-slate-300 dark:bg-white/20"}`}>{index + 1}</span><span className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-white/10" /><span className={`h-2 rounded-full ${soft} ${index === 1 ? "w-7" : "w-10"}`} /></div>)}</div></div>;
}

function DocumentPreview({ accent, soft }: { accent: string; soft: string }) {
  return <div className="absolute bottom-3 left-8 right-8 top-16"><div className={`absolute inset-x-5 top-2 h-28 rotate-[4deg] rounded-xl ${soft}`} /><div className="relative h-full rounded-xl border border-white bg-white/90 p-3 shadow-md dark:border-white/10 dark:bg-[#16233c]"><div className="flex items-center gap-2"><span className={`size-6 rounded-lg ${accent}`} /><span className="h-2 w-20 rounded-full bg-slate-200 dark:bg-white/15" /></div><div className="mt-4 space-y-2">{["w-full", "w-4/5", "w-3/5"].map((width) => <span key={width} className={`block h-1.5 rounded-full bg-slate-100 dark:bg-white/10 ${width}`} />)}</div><div className="mt-4 flex gap-1.5">{[0, 1, 2].map((item) => <span key={item} className={`size-5 rounded-md ${item === 0 ? accent : soft}`} />)}</div></div></div>;
}

function AiPreview({ accent, soft }: { accent: string; soft: string }) {
  return <div className="absolute inset-x-4 bottom-4 top-16 overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/[.07]"><div className={`absolute -right-7 -bottom-9 size-28 rounded-full ${soft}`} /><div className="relative flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-xl text-white ${accent}`}><Sparkles className="size-4" /></span><div className="space-y-1.5"><span className="block h-2 w-24 rounded-full bg-slate-200 dark:bg-white/15" /><span className="block h-2 w-16 rounded-full bg-slate-100 dark:bg-white/10" /></div></div><div className="relative mt-4 flex items-center gap-2"><span className={`size-2 rounded-full ${accent}`} /><span className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-white/10" /><span className="h-2 w-8 rounded-full bg-slate-100 dark:bg-white/10" /></div><div className="relative mt-2 flex items-center gap-2"><span className={`size-2 rounded-full ${accent} opacity-55`} /><span className="h-2 w-3/5 rounded-full bg-slate-100 dark:bg-white/10" /></div></div>;
}

export function ToolCard({ tool, href, disabled = false }: { tool: ToolItem; href?: string; disabled?: boolean }) {
  const targetHref = href ?? `/tools/${tool.slug}`;
  return <Link href={disabled ? "/tools" : targetHref} className={["group flex flex-col rounded-[1.25rem] border bg-white/88 p-5 shadow-sm shadow-blue-950/5 backdrop-blur transition dark:bg-white/[0.05] sm:min-h-[21rem]", disabled ? "pointer-events-none border-blue-950/10 opacity-70 dark:border-white/10" : "border-blue-950/10 hover:-translate-y-1 hover:border-primary/35 hover:shadow-2xl hover:shadow-blue-950/12 dark:border-white/10 dark:hover:border-emerald-200/35"].join(" ")}><ToolCardVisual tool={tool} /><h3 className="mt-5 font-heading text-xl font-semibold leading-tight text-slate-950 dark:text-white">{tool.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.description}</p><div className="mt-auto pt-6"><span className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-emerald-200">Open tool<ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></div></Link>;
}
