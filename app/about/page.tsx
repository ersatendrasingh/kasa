import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Boxes, Check, CircleDot, CloudCog, Compass, GraduationCap, HeartHandshake, Layers3, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { BreadcrumbStructuredData, WebPageStructuredData } from "@/components/site/structured-data";

export const metadata: Metadata = {
  title: "About KASA | The Operating System for Modern Academies",
  description: "Learn why KASA connects academy websites, admissions, courses, live classes, payments, learners, assessments, and certificates in one branded LMS.",
  alternates: { canonical: "/about" },
};

const academyJourney = [
  ["01", "Discover", "Website and program pages"], ["02", "Enquire", "Lead context and follow-up"],
  ["03", "Enrol", "Orders, fees, and access"], ["04", "Learn", "Recorded and live delivery"],
  ["05", "Prove", "Tests, work, and certificates"], ["06", "Improve", "Reports and operating insight"],
];

const principles = [
  { number: "01", title: "The academy owns the relationship.", text: "Its domain, brand, pricing, program positioning, learner journey, and communication should feel like one institution—not a collection of vendor pages." },
  { number: "02", title: "Context should survive every handoff.", text: "An enquiry becomes an admission, an admission becomes learner access, and learning becomes progress and proof. Teams should not rebuild that story in every tool." },
  { number: "03", title: "Software must respect real teaching work.", text: "A platform can organise delivery, reminders, access, review, and records. Faculty still own preparation, feedback, academic quality, and student outcomes." },
  { number: "04", title: "Useful scope beats endless features.", text: "We prefer a clear workflow that a team can operate every day over a long feature list with unclear ownership, dependencies, or limits." },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "Company", href: "/why-kasa" }, { name: "About KASA", href: "/about" }]} />
      <WebPageStructuredData name="About KASA" description="The product thinking and operating principles behind KASA." href="/about" />

      <main className="overflow-hidden bg-[#f8f7f2] text-slate-950 dark:bg-[#061126] dark:text-white">
        <section className="relative px-4 pb-14 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(72,140,255,.16),transparent_28rem),radial-gradient(circle_at_90%_42%,rgba(55,204,153,.14),transparent_30rem)]" />
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><Link href="/why-kasa" className="hover:text-primary">Company</Link><span>/</span><span className="text-slate-900 dark:text-white">About KASA</span></nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end xl:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300"><Compass className="size-4" />Our point of view</div>
                <h1 className="mt-5 max-w-xl font-heading text-[2.35rem] font-semibold leading-[1.05] tracking-[-.04em] sm:text-5xl lg:text-[3.35rem]">Education software should understand the academy around the course.</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">KASA is a branded LMS and academy operating platform for teams that need the complete journey—from discovery and admission to teaching, progress, and proof—to stay connected.</p>
              </div>

              <div className="relative border-y border-blue-950/10 py-5 dark:border-white/10">
                <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">The academy journey</p><h2 className="mt-2 font-heading text-2xl font-semibold">One record should keep moving.</h2></div><span className="hidden font-mono text-[.65rem] text-slate-400 sm:block">KASA / OPERATING VIEW</span></div>
                <div className="grid gap-px overflow-hidden rounded-2xl border border-blue-950/10 bg-blue-950/10 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10 dark:bg-white/10">
                  {academyJourney.map(([number, title, text]) => <div key={number} className="group bg-white/90 p-4 transition hover:bg-blue-50 dark:bg-[#0b1931] dark:hover:bg-[#102443]"><div className="flex items-center justify-between"><span className="font-mono text-[.62rem] text-primary/60 dark:text-emerald-300/70">{number}</span><CircleDot className="size-3 text-emerald-500 opacity-50 transition group-hover:opacity-100" /></div><h3 className="mt-5 font-heading text-base font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08152a]">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.42fr_.58fr] lg:gap-16">
            <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Why the product exists</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">The course was rarely the disconnected part.</h2></div>
            <div className="grid gap-5 text-[.95rem] leading-8 text-slate-600 dark:text-slate-300 sm:grid-cols-2"><p>Academies were already creating valuable teaching. The friction appeared around it: a marketing website in one place, payment links in another, classes in chat, videos in folders, follow-ups in spreadsheets, and certificates somewhere else.</p><p>KASA was shaped around that operational gap. The goal is not to turn education into software. It is to keep the commercial, academic, and learner-facing work connected enough that people can focus on running a credible institution.</p></div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Four product principles</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">The decisions behind KASA matter more than a feature count.</h2></div>
            <div className="mt-9 border-t border-blue-950/10 dark:border-white/10">{principles.map((principle) => <article key={principle.number} className="grid gap-3 border-b border-blue-950/10 py-6 sm:grid-cols-[4rem_.75fr_1fr] sm:items-start dark:border-white/10"><span className="font-mono text-xs text-primary/50 dark:text-emerald-300/60">{principle.number}</span><h3 className="max-w-md font-heading text-xl font-semibold leading-snug">{principle.title}</h3><p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{principle.text}</p></article>)}</div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] border border-blue-950/10 bg-[#0a2852] text-white shadow-[0_30px_90px_-48px_rgba(14,60,125,.7)] lg:grid-cols-2 dark:border-white/10">
            <div className="relative p-6 sm:p-8 lg:p-10"><div className="absolute -left-28 -top-28 size-72 rounded-full border-[2.5rem] border-white/[.04]" /><div className="relative"><UsersRound className="size-6 text-emerald-300" /><p className="mt-6 text-xs font-semibold uppercase tracking-[.2em] text-blue-200">Who KASA is built for</p><h2 className="mt-3 max-w-lg font-heading text-3xl font-semibold leading-tight">Teams building an academy they intend to own.</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{["Coaching institutes running batches", "Online academies selling directly", "Independent trainers building a brand", "Skill centres managing cohorts", "EdTech teams launching focused programs", "Institutions replacing scattered tools"].map((item) => <div key={item} className="flex gap-2 text-sm leading-6 text-blue-100"><Check className="mt-1 size-4 shrink-0 text-emerald-300" />{item}</div>)}</div></div></div>
            <div className="border-t border-white/10 bg-white/[.06] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"><ShieldCheck className="size-6 text-amber-300" /><p className="mt-6 text-xs font-semibold uppercase tracking-[.2em] text-blue-200">What software does not replace</p><h2 className="mt-3 font-heading text-2xl font-semibold">Clear ownership still belongs to the institution.</h2><p className="mt-4 text-sm leading-7 text-blue-100">KASA can connect workflows, permissions, records, delivery, and reporting. It cannot invent a valuable course, guarantee admissions, replace faculty judgment, resolve every support issue, or define credible completion rules for you.</p><p className="mt-5 border-l-2 border-emerald-300 pl-4 text-sm font-medium leading-7 text-white">Good software makes responsibility visible. It does not pretend responsibility disappears.</p></div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-[#eef4fb] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08172e]">
          <div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[.36fr_.64fr]"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Built as a connected product</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight">One foundation. Different working views.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Learners, faculty, counsellors, and administrators should not use the same dashboard—but their work should refer to the same academy record.</p></div><div className="grid gap-px overflow-hidden rounded-2xl border border-blue-950/10 bg-blue-950/10 sm:grid-cols-2 dark:border-white/10 dark:bg-white/10">{[[GraduationCap, "Learner experience", "Courses, live classes, resources, orders, progress, and proof."], [BookOpenCheck, "Faculty workspace", "Teaching context, batches, submissions, review, and follow-up."], [HeartHandshake, "Admissions workflow", "Enquiries, source, interest, notes, status, and learner conversion."], [Boxes, "Admin control", "Programs, people, payments, permissions, settings, and reports."]].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof Layers3; return <article key={String(title)} className="bg-white p-5 dark:bg-[#0b1931]"><ItemIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-5 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>; })}</div></div></div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.66fr_.34fr] lg:items-center">
            <div><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300"><CloudCog className="size-4" />Product and infrastructure</div><h2 className="mt-4 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Designed for branded rollout, not marketplace dependency.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">KASA combines a modern web application, role-aware workspaces, a relational data foundation, configurable media and infrastructure services, payment workflows, and live-learning integrations. The exact rollout depends on the academy’s scale, integrations, storage, and operating requirements.</p><div className="mt-6 flex flex-wrap gap-2">{["Branded domain", "Role-based access", "Course commerce", "Live and recorded learning", "Education CRM", "Assessments and certificates", "Operational reporting"].map((item) => <span key={item} className="rounded-full border border-blue-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">{item}</span>)}</div></div>
            <div className="border-l border-blue-950/10 pl-6 dark:border-white/10"><Sparkles className="size-5 text-primary dark:text-emerald-300" /><p className="mt-4 font-heading text-xl font-semibold">See whether the model fits.</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Bring one real course, batch, or broken handoff. We will map the relevant workflow and the boundaries honestly.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col"><ProductTourTrigger label="Take a Product Tour" variant="solid" size="sm" className="justify-center" /><Link href="/contact" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/20 px-5 text-sm font-semibold text-primary transition hover:bg-primary/5 dark:border-white/15 dark:text-white">Start a conversation <ArrowRight className="size-4" /></Link></div></div>
          </div>
        </section>
      </main>
    </>
  );
}
