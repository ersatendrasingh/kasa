import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  Layers3,
  Minus,
  Radio,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { LazyVideo } from "@/components/site/lazy-video";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";

export const metadata: Metadata = {
  title: "Why KASA? One Operating System for Your Academy",
  description:
    "Why coaching institutes and online academies choose KASA to connect course sales, live classes, learner access, payments, progress, and certificates under their own brand.",
  alternates: { canonical: "/why-kasa" },
};

const brokenHandoffs = [
  ["A lead pays", "Someone manually confirms the payment."],
  ["A batch starts", "The joining link lives in a chat thread."],
  ["A class ends", "The replay and worksheet travel separately."],
  ["A learner finishes", "Progress is checked before a certificate is made."],
] as const;

const principles = [
  ["01", "The academy owns the relationship", "Your website, pricing, learner records, communication, and brand should strengthen your institution—not a marketplace profile."],
  ["02", "A workflow matters more than a feature count", "Payment is valuable when it creates the right access. A live class is useful when its replay, resources, and next task remain connected."],
  ["03", "Each role gets a focused workspace", "Admins need control, faculty need teaching context, and learners need a clear next step. They should not all fight the same dashboard."],
  ["04", "Software must show its limits honestly", "KASA can organize delivery and evidence. It cannot replace curriculum quality, good teaching, learner support, or genuine demand."],
] as const;

const connectedFlow = [
  ["Discover", "A branded program page explains the outcome, format, price, and support."],
  ["Enrol", "The order, payment status, learner identity, and access rule stay together."],
  ["Learn", "Lessons, live sessions, resources, assignments, and progress share one journey."],
  ["Prove", "Results and completion rules create credible evidence and certificates."],
] as const;

export default function WhyKasaPage() {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "Company", href: "/why-kasa" }, { name: "Why KASA", href: "/why-kasa" }]} />
      <WebPageStructuredData name="Why KASA" description="The product thinking behind KASA and the connected academy workflow it is built to support." href="/why-kasa" />

      <main className="overflow-hidden bg-[#f8f7f2] text-slate-950 dark:bg-[#061126] dark:text-white">
        <section className="relative px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
          <div className="pointer-events-none absolute inset-0"><div className="absolute -left-56 top-20 size-[34rem] rounded-full bg-blue-200/55 blur-[120px] dark:bg-blue-500/10" /><div className="absolute -right-48 top-8 size-[32rem] rounded-full bg-emerald-200/55 blur-[120px] dark:bg-emerald-400/10" /></div>
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"><Link href="/" className="transition hover:text-primary">Home</Link><span aria-hidden="true">/</span><span className="text-slate-800 dark:text-white">Why KASA</span></nav>
            <div className="mt-10 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white/70 px-4 py-2 text-[.68rem] font-semibold uppercase tracking-[.2em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-emerald-200"><Sparkles className="size-4" />Why we built KASA</div>
                <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-[-.035em] sm:text-5xl lg:text-[3.65rem]">Your academy should feel like<span className="block bg-[image:var(--stat-gradient)] bg-clip-text text-transparent">one institution.</span>Not ten tools.</h1>
              </div>
              <div className="border-l border-blue-950/15 pl-6 dark:border-white/15 sm:pl-8">
                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">KASA exists for education teams that have outgrown the patchwork of a website, payment gateway, spreadsheets, meeting links, video folders, and manual certificates.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row"><ProductTourTrigger label="See the connected workflow" variant="solid" size="md" className="justify-center" /><Link href="#reason" className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-slate-700 transition hover:text-primary dark:text-slate-200">Read our product thinking <ArrowRight className="size-4" /></Link></div>
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-blue-950/10 bg-[#071a37] p-3 shadow-[0_35px_90px_-45px_rgba(15,54,105,.65)] dark:border-white/10 sm:p-4">
              <div className="grid overflow-hidden rounded-[1.25rem] lg:grid-cols-[.42fr_.58fr]">
                <div className="relative min-h-[22rem] bg-[#0b2245] sm:min-h-[27rem]">
                  <LazyVideo src="/learner-access-video.mp4" poster="/academy-live-class.jpg" ariaLabel="KASA learner experience" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,18,41,.08),rgba(5,18,41,.82))]" />
                  <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-slate-950/65 p-4 text-white backdrop-blur-xl"><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-emerald-200">The learner sees</p><p className="mt-2 font-heading text-xl font-semibold">One clear next step.</p><p className="mt-2 text-sm leading-6 text-slate-300">Not the complexity required to operate the academy.</p></div>
                </div>
                <div className="bg-white p-5 dark:bg-[#0a1730] sm:p-7">
                  <div className="flex items-center justify-between border-b border-blue-950/10 pb-5 dark:border-white/10"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-primary dark:text-emerald-200">Behind that simplicity</p><h2 className="mt-2 font-heading text-2xl font-semibold">The institution stays connected.</h2></div><BadgeCheck className="size-6 text-emerald-600" /></div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[[CircleDollarSign, "Order", "Payment creates the right learner access."], [UsersRound, "Batch", "Faculty, schedule, and learners share context."], [Radio, "Class", "Room, attendance, replay, and task stay together."], [BookOpenCheck, "Progress", "Completion is based on visible evidence."]].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof CircleDollarSign; return <article key={String(title)} className="rounded-2xl border border-blue-950/8 bg-[#f7f9fc] p-4 dark:border-white/8 dark:bg-white/[.035]"><ItemIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-base font-semibold">{String(title)}</h3><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{String(text)}</p></article>; })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="reason" className="border-y border-blue-950/8 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08152a]">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.38fr_.62fr]">
            <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">The actual problem</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Most LMS problems happen between the screens.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">A feature may work perfectly on its own while the team still spends hours moving information to the next tool.</p></div>
            <div className="divide-y divide-blue-950/10 border-y border-blue-950/10 dark:divide-white/10 dark:border-white/10">{brokenHandoffs.map(([event, consequence], index) => <div key={event} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_.8fr_1.2fr] sm:items-center sm:gap-5"><span className="font-heading text-sm font-semibold text-primary/45 dark:text-emerald-200/50">0{index + 1}</span><strong className="font-heading text-base">{event}</strong><span className="text-sm leading-6 text-slate-600 dark:text-slate-300">{consequence}</span></div>)}</div>
          </div>
        </section>

        <section className="bg-[#071a37] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-7 lg:grid-cols-[.38fr_.62fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-200">Our product principles</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Four decisions behind KASA.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">These principles decide what we build, how workflows connect, and what we refuse to pretend software can solve.</p></div>
            <div className="mt-9 grid border-l border-t border-white/12 md:grid-cols-2">{principles.map(([number, title, text]) => <article key={number} className="border-b border-r border-white/12 p-5 sm:p-6"><div className="flex items-start gap-5"><span className="font-heading text-sm font-semibold text-emerald-200">{number}</span><div><h3 className="font-heading text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{text}</p></div></div></article>)}</div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.42fr_.58fr] lg:items-start">
            <div className="lg:sticky lg:top-28"><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">One continuous record</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">The value is in the handoff.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">KASA is designed around the movement from interest to enrolment, from enrolment to learning, and from learning to credible proof.</p><Link href="/features" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-emerald-300">Explore the complete feature system <ArrowRight className="size-4" /></Link></div>
            <div className="relative pl-8 sm:pl-11"><div className="absolute bottom-6 left-3 top-6 w-px bg-gradient-to-b from-primary via-sky-400 to-emerald-500 sm:left-4" />{connectedFlow.map(([title, text], index) => <article key={title} className="relative mb-4 rounded-2xl border border-blue-950/10 bg-white p-5 shadow-sm last:mb-0 dark:border-white/10 dark:bg-white/[.035]"><span className="absolute -left-[2.1rem] top-5 grid size-7 place-items-center rounded-full border-4 border-[#f8f7f2] bg-primary text-[.6rem] font-bold text-white dark:border-[#061126] sm:-left-[2.8rem]">{index + 1}</span><h3 className="font-heading text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></article>)}</div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-[#eeece4] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#0a1730]">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">A useful fit check</p><h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">KASA is not the right answer for everyone.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Clear fit creates a better rollout than an impressive demo followed by the wrong expectations.</p></div>
            <div className="mt-9 grid overflow-hidden rounded-[1.6rem] border border-blue-950/10 bg-white lg:grid-cols-2 dark:border-white/10 dark:bg-white/[.035]">
              <div className="p-6 sm:p-7"><div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300"><Check className="size-5" /><h3 className="font-heading text-xl font-semibold text-slate-950 dark:text-white">KASA fits when…</h3></div><div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{["You sell under your own academy or institute brand.", "Recorded, live, or hybrid delivery needs one learner record.", "Admin, faculty, sales, and support need connected context.", "You want a configured platform instead of a long custom build."].map((item) => <p key={item} className="flex gap-3"><BadgeCheck className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</p>)}</div></div>
              <div className="border-t border-blue-950/10 bg-[#f8f9fb] p-6 dark:border-white/10 dark:bg-black/10 sm:p-7 lg:border-l lg:border-t-0"><div className="flex items-center gap-3 text-rose-700 dark:text-rose-300"><Minus className="size-5" /><h3 className="font-heading text-xl font-semibold text-slate-950 dark:text-white">Look elsewhere when…</h3></div><div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{["You only need a public video folder with no operations.", "You expect software to create curriculum or student demand.", "Every screen must be custom-built before one real batch is tested.", "You want a marketplace to own discovery, pricing, and learner relationships."].map((item) => <p key={item} className="flex gap-3"><X className="mt-1 size-4 shrink-0 text-rose-500" />{item}</p>)}</div></div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">{[[Clock3, "Start with one batch", "Prove the daily workflow before migrating the whole academy."], [GraduationCap, "Use real academic rules", "Bring your schedule, access, assessment, and completion logic."], [ShieldCheck, "Confirm limits early", "Users, storage, live usage, integrations, and support belong in the rollout plan."]].map(([Icon, title, text]) => { const CardIcon = Icon as typeof Clock3; return <article key={String(title)} className="border-t-2 border-primary pt-5"><CardIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>; })}</div></section>

        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"><div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[linear-gradient(120deg,#123b73,#1c65a8_52%,#148269)] px-6 py-9 text-white sm:px-9 sm:py-11 lg:px-11"><Layers3 className="absolute -right-8 -top-8 size-48 text-white/[.06]" /><div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-100">Do not demo an imaginary academy</p><h2 className="mt-3 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Bring one real program. We will map the complete operation.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100">Use your actual offer, batch, price, faculty structure, learner journey, and completion rule. That is the fastest way to discover genuine fit.</p></div><ProductTourTrigger label="Map my academy workflow" variant="solid" size="lg" className="w-full justify-center lg:w-auto" /></div></div></section>
      </main>
    </>
  );
}
