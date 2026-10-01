import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  CreditCard,
  FileBadge2,
  FileText,
  Globe2,
  GraduationCap,
  Headphones,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  MessageCircleMore,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const launchStages = [
  {
    week: "01",
    label: "Position",
    title: "Choose one learner and one urgent outcome",
    text: "Interview the audience, name the starting problem, and write a promise that can be taught and evaluated.",
    output: "Audience note + course promise",
    icon: Target,
  },
  {
    week: "02",
    label: "Structure",
    title: "Turn expertise into a teachable journey",
    text: "Sequence modules, live sessions, practice, feedback, assessment, and completion instead of building a video library.",
    output: "Curriculum + delivery calendar",
    icon: BookOpenCheck,
  },
  {
    week: "03",
    label: "Produce",
    title: "Create the smallest complete learning experience",
    text: "Record the essential lessons, prepare resources, test audio quality, and write the first assignment before polishing extras.",
    output: "Pilot-ready course content",
    icon: PlayCircle,
  },
  {
    week: "04",
    label: "Configure",
    title: "Connect the page, payment, access, and support flow",
    text: "Set the academy domain, program page, checkout, learner dashboard, messages, policies, and internal ownership.",
    output: "Testable enrolment journey",
    icon: LayoutDashboard,
  },
  {
    week: "05",
    label: "Pilot",
    title: "Run the journey with a small learner group",
    text: "Watch where learners hesitate, which instructions fail, how long support takes, and whether the promised outcome is measurable.",
    output: "Fix list + learner evidence",
    icon: UsersRound,
  },
  {
    week: "06",
    label: "Launch",
    title: "Open enrolment with a repeatable operating rhythm",
    text: "Publish useful content, answer buyer questions, follow up with leads, onboard the cohort, and review the numbers weekly.",
    output: "Live offer + weekly review",
    icon: Rocket,
  },
] as const;

const operatingLoop = [
  [Megaphone, "Attract", "Content, referrals, partnerships, webinars, and paid campaigns create qualified attention."],
  [MessageCircleMore, "Convert", "The program page, enquiry response, counselling, price, and proof help the right learner decide."],
  [CreditCard, "Enrol", "A successful payment should create an order, learner identity, invoice trail, and the correct access."],
  [GraduationCap, "Teach", "Lessons, classes, resources, assignments, and communication follow a visible learning plan."],
  [Headphones, "Support", "A named owner handles access issues, doubts, missed classes, reminders, and learner follow-up."],
  [FileBadge2, "Prove", "Progress, assessment, completion, and certificate rules show what the learner actually achieved."],
] as const;

const faqs: Array<[string, string]> = [
  [
    "What should I decide before choosing an LMS for my online academy?",
    "Decide the target learner, promised outcome, course format, curriculum, faculty involvement, price, acquisition channel, support model, and completion rule first. The LMS should support that operating model rather than define it for you.",
  ],
  [
    "Can I start an online academy in India with only one course?",
    "Yes. One focused course is often easier to validate than a large catalogue. Build one complete learner journey, test demand and delivery, then expand using evidence from real learners.",
  ],
  [
    "Should I launch recorded classes or a live cohort first?",
    "Choose based on the outcome and your capacity. Recorded delivery offers flexibility; a live cohort adds accountability and feedback; a hybrid program combines reusable lessons with scheduled teaching. Do not choose only because one format appears easier to sell.",
  ],
  [
    "How should an Indian online academy accept payments?",
    "Use a configured payment provider that supports the methods your buyers expect, and test success, failure, refund, invoice, and access scenarios before launch. Confirm tax treatment and invoicing requirements with a qualified accountant for your business.",
  ],
  [
    "Do I need my own website and domain?",
    "An owned domain gives the academy a consistent brand, clear course pages, and a direct relationship with learners. The public website, checkout, learner access, emails, and certificates should feel like one academy rather than disconnected tools.",
  ],
  [
    "How much content should be ready before launch?",
    "Enough to deliver the promise responsibly. For a cohort, that may mean the complete curriculum, first teaching block, assignments, and production schedule. For a self-paced course, learners should not purchase an incomplete path unless that is stated clearly.",
  ],
  [
    "Will KASA bring students to my academy?",
    "No platform can create demand automatically. KASA can support the website, lead, payment, learning, live-class, assessment, and certificate workflows; the academy still owns positioning, marketing, counselling, teaching quality, and learner outcomes.",
  ],
  [
    "What should I measure after launch?",
    "Track qualified enquiries, page-to-enrolment conversion, payment failures, activation, attendance, lesson progress, assignment completion, support volume, refunds, completion, learner outcomes, and repeat or referral demand.",
  ],
];

export function StartOnlineAcademyIndiaPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: "Start an online academy in India", href: "/resources/start-online-academy-india" },
        ]}
      />
      <WebPageStructuredData
        name={page.title}
        description={page.description}
        href="/resources/start-online-academy-india"
        image="/academy-online-student.jpg"
        pageType="Article"
      />
      <FaqStructuredData faqs={faqs} />

      <div className="overflow-hidden bg-[#f7f4ec] text-slate-950 dark:bg-[#07172d] dark:text-white">
        <LaunchHero />
        <DecisionStrip />
        <OfferBrief />
        <LaunchPlan />
        <EconomicsSection />
        <AcademyToolRail />
        <OperatingSystem />
        <AcademyConnections />
        <IndiaReadiness />
        <OwnershipSection />
        <FaqSection />
        <FinalCta />
      </div>
    </>
  );
}

function LaunchHero() {
  return (
    <section className="relative px-4 pb-14 pt-[9.25rem] sm:px-6 sm:pb-16 sm:pt-[10rem] lg:px-8 lg:pb-20 lg:pt-[10.5rem]">
      <div className="pointer-events-none absolute inset-0 opacity-55 dark:opacity-20 [background-image:linear-gradient(rgba(23,63,119,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(23,63,119,.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="pointer-events-none absolute -right-32 top-28 size-[32rem] rounded-full bg-[radial-gradient(circle,rgba(239,138,45,.24),transparent_68%)] blur-2xl" />
      <div className="relative mx-auto max-w-[108rem]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/resources" className="transition hover:text-primary">Resources</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-slate-900 dark:text-white">Start an online academy in India</span>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-center xl:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 border-y border-orange-300/70 py-2 text-xs font-semibold uppercase tracking-[.22em] text-[#9a4d13] dark:border-orange-300/25 dark:text-orange-200">
              <BadgeIndianRupee className="size-4" /> India academy launch field guide
            </p>
            <h1 className="mt-6 max-w-4xl font-heading text-[2.35rem] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[2.9rem] lg:text-[3.65rem]">
              An online academy is not a website with videos.
              <span className="mt-2 block text-primary dark:text-emerald-300">It is a learning business with a system.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              This practical guide shows how to shape the offer, price the program, prepare delivery, connect payments, launch under your own domain, and operate the learner journey after the first sale.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#six-week-plan" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#163f76] px-7 text-sm font-semibold text-white shadow-[0_16px_35px_-18px_rgba(22,63,118,.8)] transition hover:-translate-y-0.5 hover:bg-[#0e315f]">
                Build the launch plan <ArrowRight className="size-4" />
              </a>
              <a href="#offer-brief" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-slate-900/12 bg-white/70 px-7 text-sm font-semibold text-slate-900 backdrop-blur transition hover:border-primary/35 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                Start with the offer
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {["Owned academy domain", "India-ready payment journey", "Courses, cohorts, and certificates"].map((item) => (
                <span key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-300" />{item}</span>
              ))}
            </div>
          </div>

          <LaunchDossier />
        </div>
      </div>
    </section>
  );
}

function LaunchDossier() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -left-5 top-12 hidden h-[82%] w-12 -rotate-3 rounded-l-2xl bg-[#f0b25e] lg:block" />
      <div className="relative rotate-[.45deg] rounded-[1.8rem] border border-slate-900/10 bg-[#fffdf8] p-3 shadow-[0_35px_90px_-38px_rgba(40,54,78,.55)] dark:border-white/10 dark:bg-[#0c203d] sm:p-4">
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-900/8 dark:border-white/10">
          <div className="flex items-center justify-between border-b border-slate-900/10 bg-[#f4ead8] px-5 py-4 dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="text-[.62rem] font-bold uppercase tracking-[.22em] text-[#9a4d13] dark:text-orange-200">Launch dossier · 01</p>
              <h2 className="mt-1 font-heading text-lg font-semibold">Data Career Academy</h2>
            </div>
            <span className="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">Pilot planning</span>
          </div>
          <div className="grid sm:grid-cols-[1fr_13rem]">
            <div className="p-5 sm:p-6">
              <p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-slate-400">First offer</p>
              <h3 className="mt-2 font-heading text-xl font-semibold leading-snug">Job-ready data analysis for working graduates</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Format", "6-week hybrid cohort"],
                  ["Promise", "Build 3 portfolio projects"],
                  ["Support", "Weekly review clinic"],
                  ["Proof", "Assessment + certificate"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-900/8 bg-[#faf8f2] p-3 dark:border-white/10 dark:bg-white/[.04]">
                    <p className="text-[.62rem] uppercase tracking-[.14em] text-slate-400">{label}</p>
                    <p className="mt-1 text-xs font-semibold leading-5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#133c70] p-4 text-white">
                <div className="flex items-center justify-between text-xs"><span className="font-semibold">Launch readiness</span><span>3 of 5 decided</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-3/5 rounded-full bg-emerald-300" /></div>
                <div className="mt-3 flex flex-wrap gap-2 text-[.65rem] text-blue-100"><span>✓ Audience</span><span>✓ Outcome</span><span>✓ Format</span><span>○ Price</span><span>○ Pilot</span></div>
              </div>
            </div>
            <div className="relative min-h-64 overflow-hidden border-t border-slate-900/8 sm:border-l sm:border-t-0 dark:border-white/10">
              <Image src="/academy-online-student.jpg" alt="Learner attending an online academy program" fill sizes="(min-width: 640px) 208px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07172d]/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[.62rem] font-semibold uppercase tracking-[.18em] text-emerald-200">Design test</p><p className="mt-1 text-sm font-semibold">Would the right learner understand the outcome in ten seconds?</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 right-7 hidden -rotate-2 items-center gap-3 rounded-xl bg-[#f6c768] px-4 py-3 text-slate-900 shadow-xl sm:flex">
        <ClipboardCheck className="size-5" /><span className="text-xs font-semibold">Offer before software</span>
      </div>
    </div>
  );
}

function DecisionStrip() {
  const decisions = [
    ["Who", "A narrow learner segment"],
    ["Why", "One measurable transformation"],
    ["How", "Recorded, live, or hybrid"],
    ["Proof", "A completion standard"],
  ];
  return (
    <section className="border-y border-slate-900/10 bg-[#132f57] px-4 py-5 text-white sm:px-6 lg:px-8 dark:border-white/10">
      <div className="mx-auto grid max-w-[108rem] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {decisions.map(([label, value], index) => (
          <div key={label} className="flex items-center gap-4 border-white/10 px-3 py-2 lg:border-r lg:last:border-r-0">
            <span className="font-heading text-2xl font-semibold text-emerald-300/70">0{index + 1}</span>
            <div><p className="text-[.62rem] font-semibold uppercase tracking-[.18em] text-blue-200">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OfferBrief() {
  return (
    <section id="offer-brief" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[.78fr_1.22fr] lg:items-start xl:gap-16">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#a45418] dark:text-orange-200">The one-page offer brief</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Do not record module one until these answers are clear.</h2>
          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">A vague offer makes every later decision harder: curriculum, landing-page copy, pricing, ads, onboarding, support, and certificates.</p>
          <p className="mt-5 border-l-2 border-orange-400 pl-4 text-sm font-semibold leading-7 text-slate-800 dark:text-slate-100">Write the brief in plain language. If a learner cannot understand it, more features will not rescue it.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-900/10 bg-[#fffdf8] p-5 shadow-[0_20px_65px_-45px_rgba(28,44,70,.6)] dark:border-white/10 dark:bg-white/[.035] sm:p-7">
          {[
            ["01", "Target learner", "Who has the problem now?", "Example: commerce graduates with basic Excel skills seeking analyst roles."],
            ["02", "Transformation", "What becomes possible after the program?", "Name an observable capability, not “master everything” or “become successful”."],
            ["03", "Learning design", "What must learners do, not only watch?", "Practice, projects, feedback, live discussion, assessments, and revision create the journey."],
            ["04", "Delivery promise", "What support is included and when?", "State live-class frequency, response window, mentor access, cohort dates, and course-access period."],
            ["05", "Evidence", "What proves completion or achievement?", "Define required lessons, submissions, scores, attendance, review, and certificate eligibility."],
          ].map(([number, title, question, guidance]) => (
            <article key={number} className="grid gap-3 border-b border-dashed border-slate-900/12 py-5 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[3.25rem_1fr] dark:border-white/12">
              <span className="grid size-10 place-items-center rounded-full bg-[#f2e5d2] font-heading text-sm font-semibold text-[#9a4d13] dark:bg-orange-300/10 dark:text-orange-200">{number}</span>
              <div><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-slate-400">{title}</p><h3 className="mt-1 font-heading text-lg font-semibold">{question}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{guidance}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LaunchPlan() {
  return (
    <section id="six-week-plan" className="scroll-mt-28 bg-[#0d2749] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[108rem]">
        <div className="grid gap-6 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-orange-200">Six-week pilot path</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Launch one complete journey before building a catalogue.</h2></div>
          <p className="max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">This is a working sequence, not a guarantee of launch speed. Adjust it for faculty availability, content depth, approvals, integrations, and the risk of the learning outcome.</p>
        </div>
        <div className="mt-9 border-t border-white/15">
          {launchStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <article key={stage.week} className="group grid gap-4 border-b border-white/15 py-5 md:grid-cols-[4.5rem_9rem_1fr_15rem] md:items-center">
                <span className="font-heading text-3xl font-semibold text-white/20 transition group-hover:text-emerald-300/70">{stage.week}</span>
                <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/8 text-emerald-200"><Icon className="size-4" /></span><span className="text-xs font-semibold uppercase tracking-[.16em] text-blue-100">{stage.label}</span></div>
                <div><h3 className="font-heading text-lg font-semibold">{stage.title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{stage.text}</p></div>
                <div className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-3"><p className="text-[.6rem] uppercase tracking-[.15em] text-slate-400">Output</p><p className="mt-1 text-xs font-semibold text-white">{stage.output}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EconomicsSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-[108rem] gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center xl:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#a45418] dark:text-orange-200">Course economics</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Revenue is the top line. Capacity decides whether the course is operable.</h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">Model payment charges, taxes, refunds, marketing, faculty time, support, content production, software, and your own operating effort before treating sales as profit.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              [IndianRupee, "Price logic", "Tie price to outcome, format, support depth, and buyer context—not competitor screenshots alone."],
              [UsersRound, "Cohort capacity", "Set a learner limit that faculty and support can serve without weakening feedback."],
              [TrendingUp, "Acquisition cost", "Measure what it costs to generate a qualified enrolment across every channel."],
              [Headphones, "Service load", "Estimate doubts, access issues, reminders, reviews, refunds, and rescheduling work."],
            ].map(([Icon, title, text]) => {
              const CardIcon = Icon as typeof IndianRupee;
              return <article key={String(title)} className="border-t border-slate-900/12 py-4 dark:border-white/12"><CardIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-3 font-heading text-base font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>;
            })}
          </div>
        </div>
        <div className="relative rounded-[1.75rem] border border-slate-900/10 bg-[#f0e6d4] p-5 dark:border-white/10 dark:bg-[#102442] sm:p-7">
          <div className="flex items-start justify-between gap-5"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-[#9a4d13] dark:text-orange-200">Illustrative cohort model</p><h3 className="mt-2 font-heading text-2xl font-semibold">Start with the maths on paper.</h3></div><BadgeIndianRupee className="size-8 text-primary dark:text-emerald-300" /></div>
          <div className="mt-7 rounded-2xl bg-[#fffdf8] p-5 text-slate-950 dark:bg-white/[.055] dark:text-white">
            <div className="grid grid-cols-[1fr_auto] gap-y-4 text-sm"><span className="text-slate-500 dark:text-slate-300">Program price</span><strong>₹4,999</strong><span className="text-slate-500 dark:text-slate-300">Paid learners</span><strong>40</strong><span className="text-slate-500 dark:text-slate-300">Gross collections</span><strong>₹1,99,960</strong></div>
            <div className="my-5 border-t border-dashed border-slate-300 dark:border-white/15" />
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">{["Payment charges and taxes", "Marketing and sales cost", "Faculty and review time", "Support and refund allowance", "Software and production cost"].map((item) => <div key={item} className="flex items-center gap-2"><CircleDot className="size-3.5 text-orange-500" />Subtract or allocate: {item}</div>)}</div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Illustration only—not a revenue forecast or tax calculation. Use your real costs and confirm tax treatment with a qualified professional.</p>
        </div>
      </div>
    </section>
  );
}

function AcademyToolRail() {
  const tools = [
    ["Price the first course", "Estimate fee, margin, and break-even learners.", "/tools/course-pricing-calculator", BadgeIndianRupee],
    ["Test academy profit", "Model revenue against monthly operating costs.", "/tools/profit-calculator", TrendingUp],
    ["Plan batch capacity", "Check seats, faculty load, and occupancy.", "/tools/batch-capacity-calculator", UsersRound],
    ["Prepare fee receipts", "Create a clear printable payment record.", "/tools/fee-receipt-generator", FileText],
  ] as const;

  return (
    <section aria-labelledby="academy-planning-tools" className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
      <div className="mx-auto max-w-[108rem] border-y border-slate-900/12 py-6 dark:border-white/12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Free academy planning tools</p><h2 id="academy-planning-tools" className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">Put real numbers behind the launch plan.</h2></div>
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline dark:text-emerald-300">See all free tools <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {tools.map(([title, text, href, Icon]) => (
            <Link key={href} href={href} className="group flex items-start gap-3 rounded-xl border border-slate-900/10 bg-white/65 p-4 transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/[.035] dark:hover:bg-white/[.06]">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e8f3ed] text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><Icon className="size-4" /></span>
              <span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperatingSystem() {
  return (
    <section className="border-y border-slate-900/10 bg-[#fffdf8] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/10 dark:bg-[#0a1c36]">
      <div className="mx-auto max-w-[108rem]">
        <div className="grid gap-6 lg:grid-cols-[.76fr_1.24fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">The academy operating loop</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">The first sale begins the work. It does not finish it.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">A reliable academy connects acquisition, enrolment, learning, support, proof, and improvement. When these live in separate spreadsheets and chat threads, the learner feels the gaps.</p></div>
        <div className="mt-9 grid gap-px overflow-hidden rounded-[1.5rem] border border-slate-900/10 bg-slate-900/10 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10 dark:bg-white/10">
          {operatingLoop.map(([Icon, title, text], index) => {
            const LoopIcon = Icon as typeof Megaphone;
            return <article key={String(title)} className="bg-[#fffdf8] p-5 dark:bg-[#0d2342]"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f3ed] text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><LoopIcon className="size-5" /></span><span className="font-heading text-2xl font-semibold text-slate-900/10 dark:text-white/10">0{index + 1}</span></div><h3 className="mt-5 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>;
          })}
        </div>
      </div>
    </section>
  );
}

function AcademyConnections() {
  const connections = [
    ["Own the public offer", "Explain the course, format, price, and support without sending buyers across disconnected pages.", "/features/academy-website-builder", "Academy website builder", Globe2],
    ["Sell without manual access", "Keep checkout, coupon, order, invoice, and learner access in the same purchase flow.", "/features/course-selling-platform", "Course selling platform", CreditCard],
    ["Control money movement", "Map payment status, commercial policies, refunds, and the access rules that follow an order.", "/features/payments-coupons-orders", "Payments, coupons, and orders", IndianRupee],
    ["Deliver scheduled learning", "Use batches, calendars, class links, replays, and faculty ownership for cohort delivery.", "/features/live-class-management", "Live class management", CalendarDays],
    ["Give learners one home", "Make the next lesson, class, task, result, and proof visible in a focused learner record.", "/features/learner-dashboard-progress", "Learner dashboard and progress", LayoutDashboard],
    ["Make completion meaningful", "Connect assignments, evaluation, results, completion rules, and course certificates.", "/features/exams-assignments-certificates", "Exams, assignments, and certificates", FileBadge2],
  ] as const;

  return (
    <section aria-labelledby="academy-workflow-links" className="bg-[#eef4f2] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 dark:bg-[#0c213d]">
      <div className="mx-auto max-w-[108rem]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Build the connected academy</p><h2 id="academy-workflow-links" className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">Each launch decision has its own working system.</h2></div><Link href="/solutions/online-academies" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline dark:text-emerald-300">Explore online academy software <ArrowRight className="size-4" /></Link></div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {connections.map(([title, text, href, anchor, Icon]) => (
            <Link key={href} href={href} className="group rounded-xl border border-slate-900/10 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/[.035] dark:hover:bg-white/[.07]">
              <div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-lg bg-primary/8 text-primary dark:bg-emerald-300/10 dark:text-emerald-200"><Icon className="size-4" /></span><ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary dark:text-slate-500 dark:group-hover:text-emerald-200" /></div>
              <h3 className="mt-4 font-heading text-base font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{text}</p><span className="mt-3 block text-xs font-semibold text-primary dark:text-emerald-300">{anchor}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndiaReadiness() {
  const checks = [
    [Globe2, "Brand and domain", "Use your academy identity consistently across discovery, checkout, learner access, emails, and certificates."],
    [CreditCard, "Payment scenarios", "Test expected payment methods plus success, failure, duplicate, refund, and delayed-access cases."],
    [FileText, "Commercial records", "Define receipt or invoice ownership and have a qualified accountant review applicable tax treatment."],
    [ShieldCheck, "Policies and consent", "Publish clear terms, privacy, refund, cancellation, access, and communication policies before collecting payment."],
    [CalendarDays, "Operating calendar", "Account for launch dates, class schedules, public holidays, faculty availability, and support coverage."],
    [MessageCircleMore, "Learner communication", "Set response windows, channels, language expectations, escalation owners, and important automated messages."],
  ] as const;
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[.38fr_.62fr] xl:gap-16">
        <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-[#a45418] dark:text-orange-200">India launch readiness</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Test the business edges—not only the course player.</h2><p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">Operational details shape trust. Confirm them for your entity, audience, payment provider, program, and delivery model instead of copying another academy&apos;s setup.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {checks.map(([Icon, title, text]) => {
            const CheckIcon = Icon as typeof Globe2;
            return <article key={title} className="rounded-[1.25rem] border border-slate-900/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[.035]"><CheckIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></article>;
          })}
        </div>
      </div>
    </section>
  );
}

function OwnershipSection() {
  return (
    <section className="bg-[#173e73] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-[108rem]">
        <div className="max-w-4xl"><p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-200">Platform versus academy</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Software can connect the workflow. It cannot supply the reason learners should trust you.</h2></div>
        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/15 bg-white/[.06] p-6 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">KASA can support</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{["Branded academy website", "Course and cohort pages", "Payment-to-access workflow", "Learner dashboard", "Live and recorded delivery", "Assignments and exams", "Certificates and progress", "Admin visibility and reports"].map((item) => <div key={item} className="flex items-start gap-2 text-sm text-blue-50"><Check className="mt-0.5 size-4 shrink-0 text-emerald-300" />{item}</div>)}</div></div>
          <div className="rounded-[1.5rem] bg-[#f2bd61] p-6 text-slate-950 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#6f3b13]">The academy must own</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{["A precise market position", "Accurate and useful teaching", "Qualified faculty and mentors", "Traffic and demand generation", "Counselling and learner fit", "Support standards", "Academic and policy decisions", "Real learner outcomes"].map((item) => <div key={item} className="flex items-start gap-2 text-sm font-medium"><CircleDot className="mt-0.5 size-4 shrink-0 text-[#8a4b17]" />{item}</div>)}</div></div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[.34fr_.66fr] xl:gap-14">
        <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-[#a45418] dark:text-orange-200">Before you launch</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Questions worth answering while changes are still cheap.</h2><div className="mt-6 flex flex-wrap gap-2"><Link href="/features/course-selling-platform" className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-primary dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">Course selling</Link><Link href="/features/live-class-management" className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-primary dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">Live classes</Link><Link href="/pricing" className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-primary dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">Pricing</Link></div></div>
        <div className="border-t border-slate-900/12 dark:border-white/12">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-slate-900/12 py-4 dark:border-white/12"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-heading text-base font-semibold"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-900/15 text-primary transition group-open:rotate-45 dark:border-white/15 dark:text-emerald-300">+</span></summary><p className="mt-3 max-w-3xl pr-10 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
      <div className="relative mx-auto max-w-[108rem] overflow-hidden rounded-[2rem] bg-[#ea8a2d] px-6 py-10 text-slate-950 sm:px-9 sm:py-12 lg:px-12">
        <div className="pointer-events-none absolute -right-16 -top-28 size-80 rounded-full border-[3rem] border-white/15" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-[#65340f]"><Sparkles className="size-4" />Bring the first real offer</p><h2 className="mt-4 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Map one learner journey from discovery to completion.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-[#5d3519] sm:text-base">Use your audience, curriculum, price, class format, support plan, and certificate rule in the walkthrough. That is more useful than a generic feature tour.</p></div><ProductTourTrigger label="Plan my academy launch" variant="solid" size="lg" className="academy-launch-final-cta w-full justify-center lg:w-auto" /></div>
      </div>
    </section>
  );
}
