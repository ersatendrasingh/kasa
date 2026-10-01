import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  CreditCard,
  FileBadge2,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  MessageCircleMore,
  MonitorPlay,
  Radio,
  School,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { LazyVideo } from "@/components/site/lazy-video";
import { CurrentDayBadge } from "@/components/site/current-day-badge";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const operatingDay = [
  { time: "08:00", label: "Admissions desk", title: "New enquiries arrive with context", text: "The counsellor can see the source, program interest, contact details, and follow-up status instead of starting from a blank spreadsheet.", icon: MessageCircleMore },
  { time: "10:30", label: "Academic office", title: "A batch is ready for the day", text: "Students, assigned faculty, class timing, joining details, resources, and attendance expectations sit under the same batch record.", icon: CalendarDays },
  { time: "16:00", label: "Faculty workspace", title: "Teaching continues beyond the live room", text: "The teacher can publish a replay, attach notes, review assignments, and make the next class visible to the right learners.", icon: Radio },
  { time: "20:30", label: "Learner dashboard", title: "Every student knows the next step", text: "Recorded lessons, live schedules, tests, pending work, progress, fee records, and certificates remain available without searching chat threads.", icon: GraduationCap },
] as const;

const instituteSystems = [
  { label: "Admissions", title: "Lead and enquiry management", text: "Capture website enquiries, demo requests, course interest, source, notes, and follow-up status for the counselling team.", href: "/features/education-crm-leads", icon: UserRoundCheck },
  { label: "Academics", title: "Courses, batches, and faculty", text: "Organize recorded, live, and hybrid programs with batch calendars, assigned teachers, resources, replays, and learner access.", href: "/features/live-class-management", icon: BookOpenCheck },
  { label: "Assessment", title: "Tests, assignments, and certificates", text: "Run academic checks inside the same coaching institute LMS and keep results attached to the learner record.", href: "/features/exams-assignments-certificates", icon: ClipboardCheck },
  { label: "Commerce", title: "Fees, payments, and orders", text: "Connect online payments, course pricing, coupons, invoices, purchase history, and access without manual link-sharing.", href: "/features/payments-coupons-orders", icon: CreditCard },
  { label: "Student app", title: "Learner dashboard and progress", text: "Give students one branded place for courses, classes, recordings, tests, notices, progress, orders, and completion proof.", href: "/features/learner-dashboard-progress", icon: CircleUserRound },
  { label: "Management", title: "Admin dashboard and reports", text: "See admissions, active learners, course activity, revenue signals, team roles, and operational exceptions from one control room.", href: "/features/admin-dashboard-reporting", icon: LayoutDashboard },
] as const;

const models = [
  ["Local coaching centre", "Extend classroom teaching with a student portal, recorded revision, tests, notices, and online fee records."],
  ["Online coaching institute", "Sell and deliver subject programs through a branded website, learner dashboard, live batches, and assessments."],
  ["Multi-faculty academy", "Assign teachers by course or batch while the admin team retains control over users, pricing, reports, and settings."],
  ["Hybrid institute", "Combine centre-based teaching with online replays, resources, doubt sessions, homework, and progress tracking."],
] as const;

const faqs: Array<[string, string]> = [
  ["What is LMS software for coaching institutes?", "LMS software for coaching institutes is a connected system for course delivery, live batches, recorded lessons, student and faculty management, online tests, assignments, payments, certificates, and learner progress. A serious coaching LMS should support both academic delivery and the daily operations around it."],
  ["Can KASA manage classroom, online, and hybrid coaching batches?", "Yes. A coaching institute can organize classroom-supported programs, fully online batches, and hybrid courses that combine live classes, recorded revision, resources, tests, assignments, and certificates."],
  ["Does KASA include a student app for coaching institutes?", "KASA provides a responsive learner dashboard where students can access enrolled courses, upcoming classes, replays, resources, tests, assignments, orders, progress, and certificates under the institute brand."],
  ["Can faculty members manage only their assigned batches?", "Role-based workflows can keep faculty focused on assigned courses, batches, sessions, learners, and academic tasks while institute admins retain access to sensitive settings, payments, reports, and user controls."],
  ["How are fees and course access connected?", "The intended workflow keeps pricing, payment, order, invoice, learner identity, and course access connected. The exact payment gateway, fee structure, refund process, and any offline-fee requirements should be mapped during rollout."],
  ["Can a coaching institute use its own domain and branding?", "Yes. KASA is designed for institutes that want their own website, domain, course pages, learner experience, and certificates instead of sending students to a marketplace identity."],
  ["What should we prepare before migrating from spreadsheets or WhatsApp?", "Prepare a clean list of active courses, batches, students, faculty, schedules, access rules, fee status, existing videos and documents, and the staff members who will own admissions, academics, support, and platform administration."],
  ["Does software guarantee admissions or student results?", "No. KASA can organize discovery, counselling context, delivery, assessment, and reporting. The institute still owns teaching quality, course positioning, marketing, counselling, student support, and academic outcomes."],
];

export function CoachingInstitutesPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "Solutions", href: "/solutions" }, { name: "Coaching institutes", href: "/solutions/coaching-institutes" }]} />
      <WebPageStructuredData name={page.title} description={page.description} href="/solutions/coaching-institutes" />
      <FaqStructuredData faqs={faqs} />

      <main className="overflow-hidden bg-white text-slate-950 dark:bg-[#061126] dark:text-white">
        <Hero />
        <TrustStrip />
        <OperatingDay />
        <InstituteStack />
        <HybridExperience />
        <InstituteModels />
        <RolloutSection />
        <FaqSection />
        <FinalCta />
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_15%,rgba(43,168,255,.17),transparent_31rem),radial-gradient(circle_at_92%_26%,rgba(34,181,115,.13),transparent_30rem),linear-gradient(180deg,#f5faff_0%,#fff_90%)] dark:bg-[radial-gradient(circle_at_8%_15%,rgba(69,145,255,.17),transparent_31rem),radial-gradient(circle_at_92%_26%,rgba(88,201,138,.1),transparent_30rem),linear-gradient(180deg,#08152c_0%,#061126_90%)]" />
      <div className="relative mx-auto max-w-[108rem]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300"><Link href="/" className="transition hover:text-primary">Home</Link><ChevronRight className="size-4 text-slate-300" /><Link href="/solutions" className="transition hover:text-primary">Solutions</Link><ChevronRight className="size-4 text-slate-300" /><span className="text-primary dark:text-emerald-300">Coaching institutes</span></nav>

        <div className="mt-7 grid gap-8 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7 dark:text-emerald-200"><School className="size-4" />LMS software for coaching institutes</div>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl xl:text-[3.8rem]">Run the institute as one system—<span className="block stat-gradient-text">not ten disconnected tools.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">KASA is coaching institute management software for admissions, course selling, live and recorded classes, student and faculty operations, fees, tests, certificates, and reporting under your own brand.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ProductTourTrigger label="Map my institute workflow" variant="solid" size="lg" className="justify-center" /><Link href="#daily-operations" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-blue-950/12 bg-white/82 px-7 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 dark:border-white/15 dark:bg-white/7 dark:text-white">See daily operations <ArrowRight className="size-4" /></Link></div>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">{["Own domain and branding", "Recorded + live + hybrid", "Admin, faculty, and learner roles", "Payments and academic records"].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 shrink-0 text-emerald-600" />{item}</span>)}</div>
          </div>
          <InstituteConsole />
        </div>
      </div>
    </section>
  );
}

function InstituteConsole() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.1rem] border border-blue-950/10 bg-white p-3 shadow-[0_40px_110px_-42px_rgba(12,53,112,.55)] dark:border-white/10 dark:bg-[#0a1730] sm:p-4">
        <div className="overflow-hidden rounded-[1.55rem] border border-blue-950/10 bg-[#f6f9fd] dark:border-white/10 dark:bg-[#09152b]">
          <div className="flex items-center justify-between border-b border-blue-950/8 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[.04]"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-primary text-xs font-bold text-white">KI</span><span className="text-sm font-semibold">Institute operations</span></div><span className="hidden sm:block"><CurrentDayBadge /></span></div>
          <div className="grid lg:grid-cols-[11rem_1fr]">
            <aside className="hidden border-r border-blue-950/8 bg-white p-4 dark:border-white/10 dark:bg-white/[.025] lg:block">{["Overview", "Admissions", "Batches", "Students", "Faculty", "Fees", "Reports"].map((item, index) => <div key={item} className={index === 0 ? "rounded-xl bg-primary/8 px-3 py-2.5 text-xs font-semibold text-primary dark:bg-white/8 dark:text-emerald-200" : "px-3 py-2.5 text-xs font-medium text-slate-500 dark:text-slate-400"}>{item}</div>)}</aside>
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-primary dark:text-emerald-300">Today at your institute</p><h2 className="mt-2 font-heading text-2xl font-semibold">Every team sees the next action.</h2></div><BellRing className="size-5 text-primary" /></div>
              <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">{[["24", "New enquiries", TrendingUp], ["08", "Classes today", Radio], ["436", "Active students", UsersRound], ["₹72k", "Fees recorded", IndianRupee]].map(([value, label, Icon]) => { const StatIcon = Icon as typeof TrendingUp; return <div key={String(label)} className="rounded-2xl border border-blue-950/8 bg-white p-4 dark:border-white/10 dark:bg-white/[.04]"><StatIcon className="size-4 text-primary dark:text-emerald-300" /><p className="mt-5 font-heading text-xl font-semibold">{String(value)}</p><p className="mt-1 text-[.68rem] text-slate-500 dark:text-slate-400">{String(label)}</p></div>; })}</div>
              <div className="mt-3 grid gap-3 xl:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-2xl border border-blue-950/8 bg-white p-4 dark:border-white/10 dark:bg-white/[.04]"><div className="flex items-center justify-between"><p className="text-xs font-semibold">Next live batch</p><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[.65rem] font-semibold text-primary dark:bg-white/8 dark:text-emerald-200">Starts in 25 min</span></div><h3 className="mt-5 font-heading text-lg font-semibold">Physics · Current Electricity</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">JEE Batch A · 64 learners · Dr. Mehta</p><div className="mt-5 flex gap-2"><span className="rounded-lg bg-primary px-3 py-2 text-[.68rem] font-semibold text-white">Open classroom</span><span className="rounded-lg border border-blue-950/10 px-3 py-2 text-[.68rem] font-semibold dark:border-white/10">View batch</span></div></div>
                <div className="rounded-2xl bg-[#0d2d59] p-4 text-white"><ShieldCheck className="size-5 text-emerald-200" /><p className="mt-5 text-sm font-semibold">3 workspaces, one record</p><p className="mt-2 text-xs leading-5 text-blue-100">Admin controls the system. Faculty manages teaching. Learners see their own journey.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 left-[7%] hidden items-center gap-3 rounded-2xl border border-blue-950/10 bg-white/90 px-4 py-3 shadow-xl backdrop-blur md:flex dark:border-white/10 dark:bg-[#0b1833]/90"><BadgeCheck className="size-5 text-emerald-600" /><div><p className="text-xs font-semibold">Fee received</p><p className="text-[.65rem] text-slate-500 dark:text-slate-400">Order and learner record updated</p></div></div>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f6f9fd] px-4 py-5 sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#08152a]"><div className="mx-auto grid max-w-[108rem] gap-2 md:grid-cols-4">{[["Admissions", "Enquiries retain source and follow-up context"], ["Academics", "Batches retain faculty, schedule, and resources"], ["Learners", "Access retains courses, progress, and proof"], ["Management", "Reports retain the complete operating picture"]].map(([title, text], index) => <div key={title} className="flex gap-3 rounded-xl px-3 py-2"><span className="font-heading text-xl font-semibold text-primary/25 dark:text-white/15">0{index + 1}</span><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></div></div>)}</div></section>
  );
}

function OperatingDay() {
  return (
    <section id="daily-operations" className="scroll-mt-24 bg-[linear-gradient(180deg,#fff_0%,#f8fbff_100%)] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 dark:bg-[linear-gradient(180deg,#061126_0%,#08152a_100%)]"><div className="mx-auto max-w-[108rem]"><div className="grid gap-5 border-b border-blue-950/10 pb-8 lg:grid-cols-[.42fr_.58fr] lg:items-center dark:border-white/10"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">A day inside the institute</p><h2 className="mt-3 max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-[2.15rem]">Software should follow the coaching workflow—not force a new one.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">A coaching institute moves through counselling, scheduling, teaching, assessment, fee follow-up, and student support every day. The value of an LMS appears when those handoffs remain connected.</p></div>
      <div className="relative"><div className="absolute bottom-0 left-[3.75rem] top-0 w-px bg-blue-950/10 dark:bg-white/10" />{operatingDay.map((item, index) => { const Icon = item.icon; return <article key={item.time} className={"relative grid gap-4 py-5 sm:grid-cols-[7.5rem_12rem_1fr_1fr] sm:items-center " + (index ? "border-t border-blue-950/8 dark:border-white/8" : "")}><div className="relative z-10 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full border-4 border-[#fbfdff] bg-primary text-white dark:border-[#071429]"><Icon className="size-4" /></span><span className="font-heading text-sm font-semibold text-primary dark:text-emerald-300">{item.time}</span></div><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500 dark:text-slate-400">{item.label}</p><h3 className="font-heading text-lg font-semibold">{item.title}</h3><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p></article>; })}</div>
    </div></section>
  );
}

function InstituteStack() {
  return (
    <section className="bg-[#071a37] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto max-w-[108rem]"><div className="grid gap-6 lg:grid-cols-[.42fr_.58fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-200">Coaching institute management system</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Six systems that should behave like one.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Each capability can solve a separate problem. Together, they remove the repeated data entry and broken context that slow down admissions, academics, and student support.</p></div>
      <div className="mt-9 grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">{instituteSystems.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} className="group flex min-h-[16rem] flex-col bg-[#0b2245] p-6 transition hover:bg-[#10305e]"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-white/8 text-emerald-200"><Icon className="size-5" /></span><ArrowRight className="size-5 text-white/25 transition group-hover:translate-x-1 group-hover:text-emerald-200" /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-sky-200">{item.label}</p><h3 className="mt-2 font-heading text-lg font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p><span className="mt-auto pt-4 text-xs font-semibold text-emerald-200">Explore capability</span></Link>; })}</div>
    </div></section>
  );
}

function HybridExperience() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[1.08fr_.92fr] lg:items-center xl:gap-12"><div className="relative min-h-[29rem] overflow-hidden rounded-[1.75rem] bg-[#0b2245] shadow-2xl shadow-blue-950/15"><LazyVideo src="/learner-access-video.mp4" poster="/academy-live-class.jpg" ariaLabel="Student accessing a coaching institute learning portal" className="absolute inset-0 h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,18,41,.04),rgba(5,18,41,.05)_45%,rgba(5,18,41,.92))]" /><div className="absolute left-5 top-5 rounded-full border border-white/15 bg-slate-950/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur"><span className="mr-2 inline-block size-2 rounded-full bg-emerald-300" />Learner workspace</div><div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/15 bg-slate-950/72 p-4 text-white backdrop-blur-xl"><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-emerald-200">JEE Batch A · This week</p><div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><h3 className="font-heading text-lg font-semibold">Class, replay, test, and progress—in one view.</h3><p className="mt-2 text-xs leading-5 text-slate-300">The student does not need a separate message for every next step.</p></div><div className="flex gap-2"><span className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold">4/6 lessons</span><span className="rounded-xl bg-emerald-300 px-3 py-2 text-xs font-semibold text-slate-950">Test due</span></div></div></div></div>
      <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Student experience for coaching institutes</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">WhatsApp can send a link. It cannot become the learning record.</h2><p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">A coaching institute app or learner portal should answer the questions students repeat most: What class is next? Where is the replay? What is pending? How much have I completed? Where is my certificate?</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{[["Upcoming classes", CalendarDays], ["Replay and resources", MonitorPlay], ["Tests and assignments", ClipboardCheck], ["Progress and certificates", FileBadge2]].map(([label, Icon]) => { const ItemIcon = Icon as typeof CalendarDays; return <div key={String(label)} className="flex items-center gap-3 rounded-xl border border-blue-950/10 bg-[#f8fbff] p-3.5 text-sm font-semibold dark:border-white/10 dark:bg-white/[.035]"><span className="grid size-9 place-items-center rounded-xl bg-primary/8 text-primary dark:bg-white/8 dark:text-emerald-200"><ItemIcon className="size-4" /></span>{String(label)}</div>; })}</div></div>
    </div></section>
  );
}

function InstituteModels() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f6f9fd] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08152a]"><div className="mx-auto max-w-[108rem]"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Built around the institute model</p><h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Not every coaching centre operates the same way.</h2><p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">The right setup depends on where teaching happens, how faculty is organized, and how students buy and consume programs.</p></div><div className="mt-9 grid gap-4 md:grid-cols-2">{models.map(([title, text], index) => <article key={title} className="group grid gap-4 rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[.035] sm:grid-cols-[3.5rem_1fr] sm:p-6"><span className="grid size-11 place-items-center rounded-xl bg-primary/8 font-heading text-sm font-semibold text-primary dark:bg-white/8 dark:text-emerald-200">0{index + 1}</span><div><h3 className="font-heading text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></div></article>)}</div></div></section>
  );
}

function RolloutSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[.4fr_.6fr] xl:gap-12"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Implementation without disruption</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Start with one active batch—not the whole database.</h2><p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">A useful rollout proves the daily workflow first. Once admissions, teaching, learner access, and reporting work for one real batch, the institute can migrate with more confidence.</p><ProductTourTrigger label="Plan a pilot batch" variant="solid" size="lg" className="mt-6 justify-center" /></div><div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#123b73,#1c65a8_55%,#148168)] p-6 text-white shadow-[0_32px_90px_-45px_rgba(22,71,163,.65)] sm:p-7"><div className="absolute -right-24 -top-24 size-72 rounded-full border-[2.5rem] border-white/[.07]" /><div className="relative"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-100">Pilot batch checklist</p><div className="mt-5 grid gap-2.5 sm:grid-cols-2">{["Choose one course and batch", "Import active students and faculty", "Confirm schedule and access rules", "Map online and offline fee handling", "Upload essential videos and resources", "Assign admissions and support owners", "Test learner and faculty logins", "Review reports after the first week"].map((item, index) => <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.07] p-3 text-sm leading-6"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-300 text-[.65rem] font-bold text-slate-950">{index + 1}</span>{item}</div>)}</div><div className="mt-5 flex items-start gap-3 border-t border-white/15 pt-5 text-sm leading-6 text-blue-100"><ShieldCheck className="mt-1 size-5 shrink-0 text-emerald-200" /><p><strong className="text-white">Important:</strong> migration scope, payment integrations, video/storage volume, custom reports, and staff training should be confirmed before the final rollout plan.</p></div></div></div></div></section>
  );
}

function FaqSection() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f6f9fd] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08152a]"><div className="mx-auto grid max-w-[108rem] gap-9 lg:grid-cols-[.34fr_.66fr]"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Coaching LMS questions</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Evaluate the complete institute workflow.</h2><p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">These are the practical questions to answer before choosing LMS software for a coaching institute.</p></div><div className="border-t border-blue-950/10 dark:border-white/10">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-blue-950/10 py-4 dark:border-white/10"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-heading text-base font-semibold"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-blue-950/15 text-primary transition group-open:rotate-45 dark:border-white/15 dark:text-emerald-300">+</span></summary><p className="mt-3 max-w-3xl pr-10 text-sm leading-6 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div></div></section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"><div className="relative mx-auto max-w-[108rem] overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#123b73_0%,#1d64a8_52%,#148269_100%)] px-6 py-10 text-white shadow-[0_35px_90px_-40px_rgba(18,59,115,.65)] sm:px-9 sm:py-12 lg:px-12"><div className="pointer-events-none absolute -right-28 -top-40 size-[30rem] rounded-full border-[4rem] border-white/[.07]" /><div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-100"><Sparkles className="size-4" />Bring one real batch</div><h2 className="mt-4 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">See whether KASA fits the way your institute actually teaches.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">Use your current program, schedule, faculty structure, fee flow, and learner journey in the walkthrough. The useful demo is the one that exposes real fit and real limitations.</p></div><ProductTourTrigger label="Map my coaching institute" variant="solid" size="lg" className="coaching-final-cta w-full justify-center lg:w-auto" /></div></div></section>
  );
}
