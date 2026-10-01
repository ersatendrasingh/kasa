import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileBadge2,
  FileCheck2,
  FileText,
  ListChecks,
  LockKeyhole,
  Medal,
  PenLine,
  Percent,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  UsersRound,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const examFlow = [
  ["Design", "Define syllabus coverage, marks, question types, duration, attempts, and the standard needed to pass."],
  ["Publish", "Attach the assessment to the right course or batch and make the deadline visible in the learner dashboard."],
  ["Attempt", "Learners answer within the configured window while the assessment remains connected to their course record."],
  ["Evaluate", "Review objective results and faculty-checked work with marks, comments, status, and retry decisions."],
  ["Prove", "Use completion and performance evidence to decide whether a branded certificate should be issued."],
] as const;

const assignmentFlow = [
  { label: "Brief", text: "Outcome, instructions, files, marks, rubric, and due date", icon: FileText },
  { label: "Submit", text: "Learner upload with timestamp and submission status", icon: Upload },
  { label: "Review", text: "Faculty feedback, score, correction, and resubmission decision", icon: PenLine },
  { label: "Record", text: "Final status remains attached to learner progress", icon: FileCheck2 },
] as const;

const faqs: Array<[string, string]> = [
  ["Can KASA run online exams and quizzes inside the LMS?", "KASA supports assessment workflows connected with courses, batches, learners, results, and progress. The exact question types, exam controls, attempt rules, evaluation method, and reporting requirements should be confirmed during the product walkthrough."],
  ["How do assignments differ from online exams?", "An exam usually measures performance inside a defined attempt and time window. An assignment is better for files, projects, written work, practice tasks, faculty feedback, and revision over a longer deadline."],
  ["Can faculty review submissions and give feedback?", "The intended assignment workflow gives faculty a place to review submitted work, record marks or status, leave useful feedback, and decide whether correction or resubmission is needed."],
  ["Can certificates depend on exam performance?", "Certificate eligibility can be designed around course completion, assessment performance, or a combined rule. The appropriate rule depends on the seriousness of the program and the certificate claim."],
  ["Can learners download branded certificates?", "A certificate can carry the academy identity and learner completion details. The final design, identifiers, signatories, verification needs, and plan-level availability should be agreed before rollout."],
  ["Does an LMS prevent cheating in every online exam?", "No. Software can support attempt rules, timing, access controls, question configuration, and audit signals, but no ordinary browser-based assessment guarantees academic integrity by itself. High-stakes exams may need proctoring, identity verification, supervised centres, or additional controls."],
  ["What should an academy prepare before setup?", "Prepare the syllabus map, learning outcomes, question bank, marks scheme, passing rule, assignment rubrics, faculty reviewers, completion logic, certificate wording, and the person responsible for disputes or corrections."],
];

export function ExamsAssignmentsCertificatesPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "Features", href: "/features" }, { name: "Exams, assignments, and certificates", href: "/features/exams-assignments-certificates" }]} />
      <WebPageStructuredData name={page.title} description={page.description} href="/features/exams-assignments-certificates" />
      <FaqStructuredData faqs={faqs} />

      <main className="overflow-hidden bg-[#fbfaf7] text-slate-950 dark:bg-[#071021] dark:text-white">
        <Hero />
        <EvidenceRail />
        <ExamStudio />
        <AssignmentDesk />
        <CertificateSection />
        <EligibilityRules />
        <HonestLimits />
        <FaqSection />
        <FinalCta />
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(22,71,163,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(22,71,163,.035)_1px,transparent_1px),radial-gradient(circle_at_82%_20%,rgba(34,181,115,.13),transparent_28rem),radial-gradient(circle_at_12%_18%,rgba(43,168,255,.13),transparent_30rem)] bg-[size:32px_32px,32px_32px,auto,auto] dark:bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px),radial-gradient(circle_at_82%_20%,rgba(88,201,138,.1),transparent_28rem),radial-gradient(circle_at_12%_18%,rgba(69,145,255,.12),transparent_30rem)]" />
      <div className="relative mx-auto max-w-[108rem]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300"><Link href="/" className="hover:text-primary">Home</Link><ChevronRight className="size-4 text-slate-300" /><Link href="/features" className="hover:text-primary">Features</Link><ChevronRight className="size-4 text-slate-300" /><span className="text-primary dark:text-emerald-300">Assessment and certificates</span></nav>

        <div className="mt-8 grid gap-10 xl:grid-cols-[.82fr_1.18fr] xl:items-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7 dark:text-emerald-200"><ScanLine className="size-4" />Assessment and certificate software</p>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl xl:text-[3.75rem]">Do not award completion.<span className="block stat-gradient-text">Build evidence for it.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">Create online exams, collect assignments, review learner work, record results, apply completion rules, and issue branded course certificates inside the same learning journey.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><ProductTourTrigger label="See the assessment workflow" variant="solid" size="lg" className="justify-center" /><Link href="#exam-studio" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-blue-950/12 bg-white px-7 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 dark:border-white/15 dark:bg-white/7 dark:text-white">Open the exam studio <ArrowRight className="size-4" /></Link></div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{["Course-linked assessments", "Faculty review", "Rule-based certificates"].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" />{item}</span>)}</div>
          </div>
          <AssessmentDesk />
        </div>
      </div>
    </section>
  );
}

function AssessmentDesk() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-full bg-blue-300/15 blur-3xl" />
      <div className="relative rotate-[.7deg] rounded-[1.8rem] border border-blue-950/10 bg-[#ebe8df] p-3 shadow-[0_35px_90px_-35px_rgba(35,46,72,.4)] dark:border-white/10 dark:bg-[#111b30] sm:p-4">
        <div className="overflow-hidden rounded-[1.35rem] bg-white dark:bg-[#0b1730]">
          <div className="flex items-center justify-between border-b border-dashed border-slate-300 px-5 py-4 dark:border-white/15"><div><p className="text-[.62rem] font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Faculty assessment desk</p><h2 className="mt-1 font-heading text-lg font-semibold">Data Analysis · Module 04</h2></div><span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-300/10 dark:text-amber-200">Draft review</span></div>
          <div className="grid md:grid-cols-[1fr_15rem]">
            <div className="relative p-5 sm:p-7"><div className="absolute bottom-0 left-11 top-0 w-px bg-rose-200 dark:bg-rose-300/15" /><div className="relative pl-9"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Question 06 of 10</span><span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold dark:border-white/10">10 marks</span></div><h3 className="mt-6 font-heading text-xl font-semibold leading-snug">Which conclusion is supported by the learner-retention chart?</h3><div className="mt-6 grid gap-3">{["Campaign A generated the highest revenue", "Week-two engagement predicts completion", "Every learner followed the same path", "Certificates increased first-week activity"].map((answer, index) => <div key={answer} className={"flex items-center gap-3 rounded-xl border px-4 py-3 text-sm " + (index === 1 ? "border-emerald-300 bg-emerald-50 font-semibold text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100" : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300")}><span className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-[.65rem]">{String.fromCharCode(65 + index)}</span>{answer}</div>)}</div><div className="mt-6 flex items-center justify-between border-t border-dashed border-slate-200 pt-5 text-xs dark:border-white/10"><span className="text-slate-500 dark:text-slate-400">Outcome: Interpret evidence</span><span className="font-semibold text-emerald-700 dark:text-emerald-300">Answer key attached</span></div></div></div>
            <aside className="border-t border-slate-200 bg-[#f8fafc] p-5 dark:border-white/10 dark:bg-white/[.035] md:border-l md:border-t-0"><p className="text-[.62rem] font-semibold uppercase tracking-[.18em] text-slate-400">Exam settings</p><div className="mt-5 space-y-4">{[[Clock3, "Duration", "40 minutes"], [RotateCcw, "Attempts", "2 allowed"], [Percent, "Pass mark", "70%"], [ListChecks, "Questions", "10 total"]].map(([Icon, label, value]) => { const RowIcon = Icon as typeof Clock3; return <div key={String(label)} className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm dark:bg-white/8 dark:text-emerald-200"><RowIcon className="size-4" /></span><div><p className="text-[.65rem] text-slate-500 dark:text-slate-400">{String(label)}</p><p className="mt-0.5 text-xs font-semibold">{String(value)}</p></div></div>; })}</div><div className="mt-6 rounded-2xl bg-[#0d2d59] p-4 text-white"><LockKeyhole className="size-4 text-emerald-200" /><p className="mt-3 text-xs font-semibold">Publish to one cohort</p><p className="mt-1 text-[.68rem] leading-5 text-blue-100">Final review keeps the wrong paper away from learners.</p></div></aside>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 left-[8%] hidden -rotate-2 items-center gap-3 rounded-2xl border border-blue-950/10 bg-white/95 px-4 py-3 shadow-xl md:flex dark:border-white/10 dark:bg-[#0b1833]/95"><BadgeCheck className="size-5 text-emerald-600" /><div><p className="text-xs font-semibold">Syllabus coverage checked</p><p className="text-[.65rem] text-slate-500 dark:text-slate-400">4 learning outcomes represented</p></div></div>
    </div>
  );
}

function EvidenceRail() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f2f0ea] px-4 py-5 sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#0b172d]"><div className="mx-auto grid max-w-[108rem] gap-2 md:grid-cols-5">{examFlow.map(([label], index) => <a key={label} href={`#${label.toLowerCase()}`} className="group flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white dark:hover:bg-white/5"><span className="grid size-8 place-items-center rounded-full border border-blue-950/10 bg-white font-heading text-xs font-semibold text-primary dark:border-white/10 dark:bg-white/8 dark:text-emerald-200">{index + 1}</span><span className="text-xs font-semibold uppercase tracking-[.14em]">{label}</span>{index < 4 ? <ArrowRight className="ml-auto size-3.5 text-slate-300" /> : null}</a>)}</div></section>
  );
}

function ExamStudio() {
  return (
    <section id="exam-studio" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto max-w-[108rem]"><div className="grid gap-6 border-b border-blue-950/10 pb-8 lg:grid-cols-[.4fr_.6fr] lg:items-center dark:border-white/10"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Online exam workflow</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">An exam begins before the first question.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">Useful assessment starts with the outcome being measured. Question count and marks matter, but so do syllabus coverage, difficulty, attempt rules, evaluation ownership, feedback, and what the result changes next.</p></div>
      <div className="divide-y divide-blue-950/10 dark:divide-white/10">{examFlow.map(([label, text], index) => <article id={label.toLowerCase()} key={label} className="grid gap-4 py-5 sm:grid-cols-[5rem_10rem_1fr] sm:items-center"><span className="font-heading text-3xl font-semibold text-primary/20 dark:text-white/15">0{index + 1}</span><h3 className="font-heading text-lg font-semibold">{label}</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p></article>)}</div></div></section>
  );
}

function AssignmentDesk() {
  return (
    <section className="relative overflow-hidden bg-[#10284f] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8"><div className="pointer-events-none absolute right-0 top-0 size-96 bg-[radial-gradient(circle,rgba(88,201,138,.17),transparent_68%)]" /><div className="relative mx-auto max-w-[108rem]"><div className="grid gap-8 lg:grid-cols-[.38fr_.62fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-200">Assignment review desk</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Some outcomes cannot fit inside a multiple-choice question.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Projects, written answers, worksheets, portfolios, practical evidence, and reflective tasks need a longer loop: clear brief, submitted work, faculty feedback, correction, and a final academic record.</p></div>
      <div className="mt-9 grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 lg:grid-cols-4">{assignmentFlow.map((item, index) => { const Icon = item.icon; return <article key={item.label} className="bg-[#0c2143] p-6"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-white/8 text-emerald-200"><Icon className="size-5" /></span><span className="font-heading text-3xl font-semibold text-white/10">0{index + 1}</span></div><h3 className="mt-6 font-heading text-xl font-semibold">{item.label}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p></article>; })}</div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center"><ReviewState label="Submitted" value="18 learners" tone="blue" /><ArrowRight className="mx-auto hidden size-5 text-white/25 lg:block" /><ReviewState label="Needs review" value="6 submissions" tone="amber" /><ArrowRight className="mx-auto hidden size-5 text-white/25 lg:block" /><ReviewState label="Feedback shared" value="12 learners" tone="green" /></div></div></section>
  );
}

function ReviewState({ label, value, tone }: { label: string; value: string; tone: "blue" | "amber" | "green" }) {
  const style = tone === "green" ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100" : tone === "amber" ? "border-amber-300/25 bg-amber-300/10 text-amber-100" : "border-sky-300/25 bg-sky-300/10 text-sky-100";
  return <div className={`rounded-2xl border px-5 py-4 ${style}`}><p className="text-xs font-semibold uppercase tracking-[.16em]">{label}</p><p className="mt-2 font-heading text-lg font-semibold text-white">{value}</p></div>;
}

function CertificateSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto grid max-w-[108rem] gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center xl:gap-14"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Certificate management software</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">A certificate is credible only when the rule behind it is credible.</h2><p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">A branded certificate should state what the learner completed or achieved. The platform can record eligibility and produce the output; the academy must define the standard, approve the wording, and protect the meaning of its credential.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{["Completion threshold", "Assessment pass mark", "Required assignments", "Attendance or participation", "Issue and expiry policy", "Correction and reissue owner"].map((item) => <div key={item} className="flex items-center gap-3 border-b border-blue-950/10 py-3 text-sm font-semibold dark:border-white/10"><Check className="size-4 text-emerald-600" />{item}</div>)}</div></div><CertificatePreview /></div></section>
  );
}

function CertificatePreview() {
  return (
    <div className="relative mx-auto w-full max-w-3xl rotate-[-1deg] rounded-[1.3rem] bg-[#e7e0d0] p-3 shadow-[0_30px_80px_-35px_rgba(43,49,65,.55)] dark:bg-[#17233a]"><div className="relative overflow-hidden border border-[#c6a76b] bg-[#fffdf7] px-6 py-9 text-center text-slate-900 sm:px-10 sm:py-11"><div className="absolute inset-3 border border-[#d8c290]" /><div className="absolute left-1/2 top-0 h-16 w-px bg-[#d8c290]" /><Award className="relative mx-auto size-9 text-[#9c742c]" /><p className="relative mt-5 text-[.65rem] font-semibold uppercase tracking-[.28em] text-[#8a6c35]">Certificate of achievement</p><h3 className="relative mt-6 font-serif text-3xl font-semibold sm:text-4xl">Aarav Sharma</h3><p className="relative mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-600">has successfully completed the assessed learning requirements for</p><p className="relative mt-3 font-heading text-xl font-semibold text-[#173f77] sm:text-2xl">Applied Data Analytics</p><div className="relative mx-auto mt-7 flex max-w-lg items-end justify-between border-t border-[#d8c290] pt-5 text-left"><div><p className="text-[.6rem] uppercase tracking-[.16em] text-slate-500">Credential ID</p><p className="mt-1 text-xs font-semibold">KASA-ADA-2048</p></div><div className="grid size-16 place-items-center rounded-full border-4 border-double border-[#b69049] bg-[#f7efd9] text-[#8a682d]"><Medal className="size-7" /></div><div className="text-right"><p className="text-[.6rem] uppercase tracking-[.16em] text-slate-500">Eligibility</p><p className="mt-1 text-xs font-semibold">84% · Passed</p></div></div></div></div>
  );
}

function EligibilityRules() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f2f0ea] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#0b172d]"><div className="mx-auto max-w-[108rem]"><div className="grid gap-7 lg:grid-cols-[.36fr_.64fr]"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Eligibility logic</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Different programs need different proof.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Choose rules that match the promise of the program instead of issuing the same certificate for every kind of participation.</p></div><div className="overflow-hidden rounded-[1.5rem] border border-blue-950/10 bg-white dark:border-white/10 dark:bg-white/[.035]"><div className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr] border-b border-blue-950/10 bg-[#f8fafc] px-5 py-3 text-[.65rem] font-semibold uppercase tracking-[.14em] text-slate-500 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-400"><span>Program type</span><span>Completion</span><span>Assessment</span><span>Certificate</span></div>{[["Short workshop", "Attend", "Optional", "Participation"], ["Self-paced course", "Modules", "Final quiz", "Completion"], ["Cohort program", "Classes + work", "Pass rule", "Achievement"], ["Skill certification", "Full evidence", "Verified", "Competency"]].map((row) => <div key={row[0]} className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr] border-b border-blue-950/8 px-5 py-4 text-xs last:border-0 dark:border-white/8"><strong>{row[0]}</strong><span className="text-slate-500 dark:text-slate-300">{row[1]}</span><span className="text-slate-500 dark:text-slate-300">{row[2]}</span><span className="font-semibold text-primary dark:text-emerald-300">{row[3]}</span></div>)}</div></div></div></section>
  );
}

function HonestLimits() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto grid max-w-[108rem] gap-8 lg:grid-cols-[.42fr_.58fr]"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Academic integrity</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">The platform records decisions. Your academic team owns their quality.</h2></div><div className="grid gap-3 sm:grid-cols-2">{[[ShieldCheck, "Integrity", "Browser controls alone cannot guarantee that a high-stakes attempt is genuine."], [UsersRound, "Review ownership", "Faculty still needs clear rubrics, moderation, and a process for disputed marks."], [BookOpenCheck, "Question quality", "A large question bank is not useful if it does not represent the learning outcomes."], [FileBadge2, "Credential meaning", "The academy remains responsible for the claim printed on every certificate."]].map(([Icon, title, text]) => { const LimitIcon = Icon as typeof ShieldCheck; return <article key={String(title)} className="rounded-[1.35rem] border border-blue-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/[.035]"><LimitIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>; })}</div></div></section>
  );
}

function FaqSection() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f2f0ea] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#0b172d]"><div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[.34fr_.66fr]"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Assessment questions</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Define the academic rules before configuration.</h2><div className="mt-6 flex flex-wrap gap-2"><Link href="/tools/question-paper-generator" className="rounded-full border border-blue-950/10 bg-white px-4 py-2 text-xs font-semibold text-primary dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">Question paper generator</Link><Link href="/tools/certificate-generator" className="rounded-full border border-blue-950/10 bg-white px-4 py-2 text-xs font-semibold text-primary dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">Certificate generator</Link></div></div><div className="border-t border-blue-950/10 dark:border-white/10">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-blue-950/10 py-4 dark:border-white/10"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-heading text-base font-semibold"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-blue-950/15 text-primary transition group-open:rotate-45 dark:border-white/15 dark:text-emerald-300">+</span></summary><p className="mt-3 max-w-3xl pr-10 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div></div></section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="relative mx-auto max-w-[108rem] overflow-hidden rounded-[2rem] bg-[#10284f] px-6 py-10 text-white sm:px-9 sm:py-12 lg:px-12"><div className="absolute -right-20 -top-28 size-80 rounded-full border-[3rem] border-emerald-300/10" /><div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200"><Sparkles className="size-4" />Bring one real assessment</p><h2 className="mt-4 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Map the rule from question to certificate.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Use one exam, assignment, marks scheme, and certificate requirement in the demo. That reveals the workflow more clearly than a generic feature checklist.</p></div><ProductTourTrigger label="Map my assessment flow" variant="solid" size="lg" className="assessment-final-cta w-full justify-center lg:w-auto" /></div></div></section>
  );
}
