import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Check, ChevronRight, CircleHelp, CloudCog, Compass, CreditCard, Database, GraduationCap, Layers3, MessageCircleMore, Route, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { BreadcrumbStructuredData, FaqStructuredData, WebPageStructuredData } from "@/components/site/structured-data";

export const metadata: Metadata = {
  title: "KASA LMS FAQ | Setup, Pricing, Live Classes, Payments and Support",
  description:
    "Find answers about KASA LMS setup, domain configuration, pricing, Razorpay payments, live classes, learner dashboards, certificates, media, support, and rollout for academies.",
  alternates: {
    canonical: "/faq",
  },
};

const faqGroups = [
  {
    id: "fit",
    number: "01",
    label: "Fit and product model",
    icon: Compass,
    intro: "Start here if you are still deciding whether KASA matches the way your academy earns and teaches.",
    questions: [
      ["What kind of education business is KASA built for?", "KASA is designed for coaching institutes, online academies, independent trainers, skill centres, and EdTech teams that want to operate under their own brand. It fits recorded, live, and hybrid programs where admissions, delivery, learner access, payments, progress, and proof need to stay connected."],
      ["Is KASA a course marketplace?", "No. KASA is an owned academy platform. Your organisation controls its domain, catalogue, pricing, positioning, learner relationship, and operating workflow. A marketplace may still be used for discovery, but KASA is intended to be the branded destination where learners enrol and study."],
      ["Can a solo trainer use KASA, or is it only for institutes?", "A trainer can begin with a focused catalogue and learner experience, then add live batches, faculty-style roles, CRM, assessments, and reports as the operation grows. The rollout should match the real workflow rather than enable every module on day one."],
      ["When might KASA not be the right fit?", "KASA may not be the right first choice if you only need a public video folder, must stay entirely inside a third-party marketplace, or require a highly specialised custom product before validating the teaching model. Unusual integrations and workflows should be discussed before commitment."],
    ],
  },
  {
    id: "setup",
    number: "02",
    label: "Setup and migration",
    icon: Route,
    intro: "Understand what your team must prepare and how to avoid turning rollout into another software project.",
    questions: [
      ["What should we prepare before setup?", "Prepare the academy name and branding, domain preference, active programs, pricing and tax context, delivery model, learner and faculty roles, payment and email requirements, media volume, live-class needs, and the staff members who will own admissions, academics, support, and administration."],
      ["Do we need to migrate everything at once?", "No. A safer rollout starts with one active program or batch. Import the people and content needed for that workflow, test admin, faculty, and learner views, confirm payment and communication behaviour, then expand after the first operating cycle is stable."],
      ["Can existing learners, courses, and videos be moved?", "Migration can be planned, but the scope depends on the quality and format of existing data, course structure, media location, access rules, fee records, and historical activity. A clean inventory and sample export are needed before confirming what can be automated and what needs manual review."],
      ["Can KASA run on our own domain and brand?", "The platform is intended for branded academy use. Domain, logo, colours, public pages, program positioning, and learner-facing identity are part of rollout planning. DNS access, brand assets, and the exact domain structure should be confirmed before launch."],
    ],
  },
  {
    id: "learning",
    number: "03",
    label: "Learning and team operations",
    icon: GraduationCap,
    intro: "Clarify what learners, faculty, counsellors, and administrators can expect from the connected workflow.",
    questions: [
      ["What does a learner see after enrolment?", "The learner experience can bring together purchased or assigned programs, recorded lessons, live sessions, resources, assessments, orders, notices, progress, and certificates. The exact view depends on the program model and access rules configured by the academy."],
      ["How are live classes and replays organised?", "Live sessions should belong to a course or batch with a schedule, faculty owner, eligible learners, joining context, resources, and post-class replay. This keeps a class from disappearing into a chat thread once the session ends."],
      ["Do faculty and counsellors use the same dashboard as admins?", "No. Roles should receive the working view and permissions they need. Faculty focus on assigned teaching and review work; counsellors focus on enquiries and follow-up; learners focus on access and progress; admins retain broader configuration and reporting control."],
      ["Can KASA issue certificates automatically?", "Certificates can be connected to completion rules, but the academy must define what completion means. Lesson progress, assessment scores, assignment review, attendance, or manual approval may be relevant. Automation should follow credible academic rules rather than issue proof without evidence."],
      ["Does KASA guarantee learner completion or academic results?", "No. Software can improve access, continuity, reminders, visibility, and evidence. Course quality, faculty preparation, feedback, learner motivation, support, and academic standards remain the responsibility of the education team."],
    ],
  },
  {
    id: "commercial",
    number: "04",
    label: "Payments, pricing, data, and support",
    icon: ShieldCheck,
    intro: "Review the commercial and technical boundaries that should be explicit before a final rollout plan.",
    questions: [
      ["How does pricing work?", "Pricing should be discussed against the required modules, learner and team scale, storage and video usage, migration scope, integrations, environments, and support expectations. Use the pricing page as a starting point, then confirm the actual rollout scope before purchase."],
      ["Can learners pay online and receive access?", "KASA supports connected payment, order, and learner-access workflows. Gateway setup, account verification, taxes, invoices, refunds, settlement responsibility, and the exact rule that unlocks or removes access must be agreed during configuration."],
      ["Where are media and academy data stored?", "The platform uses a relational data foundation and configurable infrastructure and media services. Hosting region, database, media provider, backup expectations, retention, exports, and recovery responsibilities should be documented for the chosen deployment."],
      ["What happens if we need a custom integration?", "First define the business event, data owner, direction of sync, authentication method, failure behaviour, and reporting need. An integration should only be committed after feasibility, security, maintenance, and commercial scope are reviewed."],
      ["What does support cover after launch?", "Support should distinguish product defects, configuration questions, staff training, data correction, integration incidents, infrastructure issues, and new feature requests. Response expectations and ownership depend on the selected rollout and support arrangement."],
    ],
  },
] as const;

const structuredFaqs = faqGroups.flatMap((group) => group.questions.map(([question, answer]) => [question, answer] as [string, string]));

export default function FaqPage() {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "FAQ", href: "/faq" }]} />
      <WebPageStructuredData name="KASA LMS FAQ" description="Detailed answers about KASA fit, setup, migration, learning operations, payments, pricing, infrastructure, and support." href="/faq" pageType="WebPage" />
      <FaqStructuredData faqs={structuredFaqs} />

      <main className="overflow-hidden bg-[#f8f7f2] text-slate-950 dark:bg-[#061126] dark:text-white">
        <section className="relative px-4 pb-14 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(72,140,255,.16),transparent_28rem),radial-gradient(circle_at_88%_20%,rgba(55,204,153,.13),transparent_30rem)]" />
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-slate-900 dark:text-white">FAQ</span></nav>
            <div className="mt-8 grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center xl:gap-16">
              <div><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300"><CircleHelp className="size-4" />Questions before commitment</div><h1 className="mt-5 max-w-xl font-heading text-[2.4rem] font-semibold leading-[1.05] tracking-[-.04em] sm:text-5xl lg:text-[3.35rem]">Ask the operational questions before choosing the software.</h1><p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">A useful LMS decision covers more than features. It should clarify ownership, migration, integrations, learner experience, infrastructure, pricing boundaries, and what the software cannot promise.</p></div>

              <div className="relative overflow-hidden rounded-[1.6rem] border border-blue-950/10 bg-[#0b2b59] p-5 text-white shadow-[0_30px_90px_-50px_rgba(10,43,89,.75)] sm:p-6 dark:border-white/10"><div className="absolute -right-24 -top-24 size-64 rounded-full border-[2.5rem] border-emerald-300/[.06]" /><div className="relative"><div className="flex items-center justify-between gap-4"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-emerald-300">Bring these to the demo</p><h2 className="mt-2 font-heading text-2xl font-semibold">Five decisions make the conversation useful.</h2></div><MessageCircleMore className="hidden size-6 text-blue-200 sm:block" /></div><div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">{[[UsersRound, "People", "Who sells, teaches, supports, and administers?"], [BookOpenCheck, "Programs", "Recorded, live, hybrid, cohort, or self-paced?"], [CreditCard, "Commerce", "Pricing, payments, tax, refunds, and access rules?"], [Database, "Migration", "Which learners, courses, media, and records must move?"], [CloudCog, "Infrastructure", "Domain, email, media, live classes, and integrations?"]].map(([Icon, title, text], index) => { const ItemIcon = Icon as typeof Layers3; return <div key={String(title)} className={`bg-[#0d3267] p-4 ${index === 4 ? "sm:col-span-2" : ""}`}><ItemIcon className="size-4 text-emerald-300" /><h3 className="mt-3 text-sm font-semibold">{String(title)}</h3><p className="mt-1 text-xs leading-5 text-blue-100">{String(text)}</p></div>; })}</div></div></div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-white px-4 py-5 sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#08152a]"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2"><span className="mr-2 text-[.65rem] font-semibold uppercase tracking-[.18em] text-slate-400">Jump to</span>{faqGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-[#f8fafc] px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><span className="font-mono text-[.6rem] text-primary/55">{group.number}</span>{group.label}</a>)}</div></section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.29fr_.71fr] lg:items-start">
            <aside className="lg:sticky lg:top-28"><div className="border-l-2 border-primary/30 pl-5"><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">18 practical answers</p><h2 className="mt-3 font-heading text-2xl font-semibold leading-tight">Read by decision, not randomly.</h2><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Start with product fit, then move through setup, daily operations, and commercial boundaries.</p></div><div className="mt-6 rounded-2xl border border-blue-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/[.04]"><Sparkles className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-lg font-semibold">Your question is specific?</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Share the current workflow and constraint. We will answer against that context rather than guess.</p><Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-emerald-300">Ask KASA directly <ArrowRight className="size-4" /></Link></div></aside>

            <div className="space-y-12">{faqGroups.map((group) => { const GroupIcon = group.icon; return <section key={group.id} id={group.id} className="scroll-mt-32"><div className="grid gap-4 border-b border-blue-950/10 pb-5 sm:grid-cols-[auto_1fr] dark:border-white/10"><span className="grid size-11 place-items-center rounded-xl bg-primary/8 text-primary dark:bg-white/8 dark:text-emerald-300"><GroupIcon className="size-5" /></span><div><div className="flex items-center gap-3"><span className="font-mono text-[.65rem] text-primary/55">{group.number}</span><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary dark:text-emerald-300">{group.label}</p></div><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{group.intro}</p></div></div><div>{group.questions.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-blue-950/10 py-5 dark:border-white/10"><summary className="flex cursor-pointer list-none items-start justify-between gap-5"><span className="flex gap-3"><span className="mt-1 font-mono text-[.62rem] text-slate-400">{group.number}.{index + 1}</span><span className="font-heading text-base font-semibold leading-7 sm:text-lg">{question}</span></span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-blue-950/15 text-primary transition group-open:rotate-45 dark:border-white/15 dark:text-emerald-300">+</span></summary><p className="mt-3 max-w-3xl pl-10 pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div></section>; })}</div>
          </div>
        </section>

        <section className="border-t border-blue-950/10 bg-[#eef4fb] px-4 py-12 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-[#08172e]"><div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-primary dark:text-emerald-300"><ShieldCheck className="size-4" />Next step</div><h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-tight">Turn the answers into one rollout checklist.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">Bring one active program, the people involved, your current tools, migration needs, and the first workflow you want to improve.</p></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row"><ProductTourTrigger label="Plan a relevant demo" variant="solid" size="sm" className="justify-center" /><Link href="/pricing" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/20 bg-white px-5 text-sm font-semibold text-primary dark:border-white/15 dark:bg-white/5 dark:text-white">Review pricing context <ChevronRight className="size-4" /></Link></div></div></section>
      </main>
    </>
  );
}
