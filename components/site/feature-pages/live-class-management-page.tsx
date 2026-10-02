import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileVideo2,
  GraduationCap,
  MessageSquareText,
  PlayCircle,
  Radio,
  Sparkles,
  UsersRound,
  Video,
  WandSparkles,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { LazyVideo } from "@/components/site/lazy-video";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const faqs: Array<[string, string]> = [
  ["How does faculty find today's class?", "The batch workspace keeps the schedule, joining link, learner list, resources, and replay context together. Faculty can open the session without reconstructing it from messages and spreadsheets."],
  ["Can an institute run several batches at once?", "Yes. Every batch can have its own faculty, schedule, learner access, sessions, and recordings. The operating limits should be confirmed during rollout planning."],
  ["What happens after a live class ends?", "The recording, attendance context, resources, and next assignment stay connected with the batch, so learners know exactly what happens next."],
  ["Does KASA replace a teacher or coordinator?", "No. KASA organizes delivery work. Faculty still plan lessons, answer questions, review assignments, and own academic quality."],
  ["Which teams is this workflow designed for?", "It is designed for coaching institutes, online academies, cohort-based programs, test-prep teams, and training businesses that run repeated live batches with faculty and learner follow-up."],
  ["What affects live-class pricing?", "Pricing depends on the number of users and active batches, classroom usage, recording and storage needs, and the rollout support required. These limits should be confirmed against one real batch before purchase."],
];

const handoffs = [
  { number: "01", label: "Coordinator", title: "Plans the session", text: "Assign Dr. Mehta to Batch A, schedule 7:00 PM, and confirm who can join." },
  { number: "02", label: "Faculty", title: "Runs the class", text: "Open the correct room with the learner list, resources, and questions already in context." },
  { number: "03", label: "Learner", title: "Continues learning", text: "Return to the same batch for the replay, worksheet, progress, and next class." },
] as const;

const classDay = [
  { time: "6:45 PM", label: "Reminder delivered", text: "Batch A gets the joining link and preparation note.", icon: BellRing },
  { time: "7:00 PM", label: "Class begins", text: "Faculty opens the scheduled room with 64 learners.", icon: Video },
  { time: "8:08 PM", label: "Replay attached", text: "The recording returns to the same session record.", icon: FileVideo2 },
  { time: "8:15 PM", label: "Next task visible", text: "The worksheet and due date appear in the learner view.", icon: CheckCircle2 },
] as const;

const scopeItems = [
  { icon: Clock3, title: "Timetable", text: "Faculty availability, holidays, capacity, and rescheduling rules remain your decisions." },
  { icon: GraduationCap, title: "Teaching", text: "Preparation, feedback, doubt resolution, and academic judgment still belong to faculty." },
  { icon: UsersRound, title: "Support", text: "Your team defines who handles missed classes, access issues, and learner follow-up." },
] as const;

const rolloutItems = [
  "Batch and learner access",
  "Faculty and session ownership",
  "Class links and reminders",
  "Replay and resource policy",
  "Assignment and support handoff",
] as const;

export function LiveClassManagementPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData items={[
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
        { name: "Live class management", href: "/features/live-class-management" },
      ]} />
      <WebPageStructuredData name={page.title} description={page.description} href="/features/live-class-management" />
      <FaqStructuredData faqs={faqs} />

      <div className="lms-compact-page overflow-hidden bg-background text-foreground">
        <section className="relative px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-40 top-20 size-[34rem] rounded-full bg-blue-300/25 blur-[100px] dark:bg-blue-500/10" />
            <div className="absolute -right-48 top-0 size-[38rem] rounded-full bg-emerald-200/35 blur-[110px] dark:bg-emerald-400/10" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="transition hover:text-primary">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/features" className="transition hover:text-primary">Features</Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">Live class management</span>
            </nav>

            <div className="grid items-center gap-12 xl:grid-cols-12 xl:gap-10">
              <div className="xl:col-span-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-primary">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Live delivery workspace
                </div>
                <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.08] tracking-[-.025em] sm:text-5xl xl:text-[3.4rem]">
                  One live class.
                  <span className="mt-1 block bg-[image:var(--stat-gradient)] bg-clip-text text-transparent">No broken handoffs.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                  Built for coaching institutes and online academies that need the schedule, faculty, classroom, replay, and learner follow-up to stay connected.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ProductTourTrigger label="See a live batch demo" variant="solid" size="lg" className="justify-center" />
                  <a href="#class-flow" className="inline-flex h-12 items-center justify-center gap-2 px-5 text-sm font-semibold text-foreground transition hover:text-primary">
                    Follow the class flow <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {["Batch schedules", "Faculty ownership", "Replay continuity"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-300" />{item}</span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[32rem] xl:col-span-7 xl:min-h-[36rem]">
                <div className="absolute left-[4%] top-[5%] size-52 rounded-full border border-primary/15 sm:size-80" />
                <div className="absolute bottom-[2%] right-[2%] size-72 rounded-full border border-emerald-400/20 sm:size-[25rem]" />
                <div className="absolute left-0 top-16 z-20 hidden -rotate-3 rounded-2xl border border-blue-950/10 bg-white/85 px-4 py-3 shadow-xl shadow-blue-950/10 backdrop-blur-xl sm:flex dark:border-white/10 dark:bg-surface/80">
                  <span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><Radio className="size-4" /></span>
                  <div className="ml-3"><p className="text-xs font-semibold">Room is live</p><p className="mt-0.5 text-[.68rem] text-slate-500 dark:text-slate-400">51 learners joined</p></div>
                </div>
                <div className="absolute bottom-14 right-0 z-20 hidden rotate-2 rounded-2xl border border-blue-950/10 bg-white/85 px-4 py-3 shadow-xl shadow-blue-950/10 backdrop-blur-xl sm:flex dark:border-white/10 dark:bg-surface/80">
                  <span className="grid size-9 place-items-center rounded-xl bg-blue-100 text-primary dark:bg-primary/15"><FileVideo2 className="size-4" /></span>
                  <div className="ml-3"><p className="text-xs font-semibold">Replay published</p><p className="mt-0.5 text-[.68rem] text-slate-500 dark:text-slate-400">Resources attached</p></div>
                </div>
                <div className="absolute inset-x-[3%] top-1/2 -translate-y-1/2 sm:inset-x-[8%]">
                  <ScheduleBoard />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="class-flow" className="scroll-mt-24 border-y border-blue-950/8 bg-surface-muted/65 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-surface-strong">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">A single connected class flow</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Three people. Three jobs. One shared session.</h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">Each person gets a focused view, while the session history stays connected behind the scenes.</p>
            </div>

            <div className="relative mx-auto mt-14 max-w-6xl">
              <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-primary/10 via-primary/60 to-emerald-400/40 md:block" />
              <div className="grid gap-9 md:grid-cols-3 md:gap-6">
                {handoffs.map((item, index) => (
                  <article key={item.number} className="relative text-center">
                    <div className="relative z-10 mx-auto grid size-14 place-items-center rounded-full border-[5px] border-surface-muted bg-foreground font-heading text-sm font-bold text-background shadow-lg shadow-blue-950/10 dark:border-surface-strong">{item.number}</div>
                    <p className="mt-5 text-[.68rem] font-semibold uppercase tracking-[.18em] text-primary">{item.label}</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold">{item.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                    {index < handoffs.length - 1 ? <ArrowRight className="absolute -right-4 top-5 hidden size-5 text-primary/40 md:block" /> : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-9 lg:grid-cols-[1.08fr_.92fr] xl:gap-12">
            <LearnerCanvas />
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">The learner lens</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">One clear next step—not six disconnected links.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">The learner view prioritizes today&apos;s room, the previous replay, and the task that follows. Every item stays attached to the right batch and subject.</p>
              <div className="mt-8 divide-y divide-blue-950/10 border-y border-blue-950/10 dark:divide-white/10 dark:border-white/10">
                {[
                  ["Before class", "Reminder, joining link, and preparation resource"],
                  ["During class", "Room access and session context"],
                  ["After class", "Replay, worksheet, and next scheduled session"],
                ].map(([label, text]) => (
                  <div key={label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-5">
                    <span className="font-heading text-sm font-semibold text-foreground">{label}</span>
                    <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-surface-muted/55 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-surface-strong">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.32fr_.68fr] lg:items-end">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">A real class day</p>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">From reminder to follow-up in ninety minutes.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end dark:text-slate-300">Example: a Physics class for Batch A. Each event adds context to the same session instead of creating another disconnected message or folder.</p>
            </div>

            <div className="relative mt-12 overflow-hidden rounded-[2.25rem] bg-foreground px-6 py-9 text-background sm:px-10 sm:py-11">
              <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-emerald-400/20 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-32 left-1/4 size-72 rounded-full bg-blue-400/20 blur-[90px]" />
              <div className="absolute left-10 right-10 top-[4.25rem] hidden h-px bg-gradient-to-r from-blue-400/40 via-emerald-300 to-blue-400/40 md:block" />
              <div className="relative grid gap-8 md:grid-cols-4 md:gap-5">
                {classDay.map(({ time, label, text, icon: Icon }, index) => (
                  <article key={time} className="relative pl-12 md:pl-0">
                    <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full bg-background text-foreground ring-4 ring-foreground md:relative md:z-10 md:mx-auto"><Icon className="size-4" /></span>
                    <div className="absolute bottom-0 left-[1.1rem] top-9 w-px bg-background/20 md:hidden" />
                    <p className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-promo-accent md:mt-6 md:text-center">{time}</p>
                    <h3 className="mt-2 font-heading text-lg font-semibold md:text-center">{label}</h3>
                    <p className="mt-2 text-sm leading-6 text-background/70 md:mx-auto md:max-w-[15rem] md:text-center">{text}</p>
                    <span className="absolute -right-2 top-2 hidden font-heading text-xs text-background/30 md:block">0{index + 1}</span>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-foreground">Works best for:</span>
              {['Coaching institutes', 'Test-prep batches', 'Cohort programs', 'Online academies'].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 dark:bg-black">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="pointer-events-none absolute -right-32 -top-48 size-[34rem] rounded-full bg-emerald-400/15 blur-[120px]" />
          <div className="relative mx-auto w-full max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.42fr_.58fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-300">What software cannot decide</p>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">KASA runs the handoff. Your academy owns the standard.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">A useful rollout starts by separating platform automation from the academic decisions only your team can make.</p>
            </div>
            <div className="mt-12 grid border-y border-white/12 md:grid-cols-3">
              {scopeItems.map(({ icon: Icon, title, text }, index) => (
                <article key={title} className={["py-7 md:px-8 md:py-9", index > 0 ? "border-t border-white/12 md:border-l md:border-t-0" : ""].join(" ")}>
                  <div className="flex items-center gap-3"><Icon className="size-5 text-emerald-300" /><span className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-slate-400">Your decision</span></div>
                  <h3 className="mt-8 font-heading text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-9 lg:grid-cols-[.43fr_.57fr] xl:gap-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">Plan with a real batch</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Your demo should look like your operation.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">Bring one batch, its faculty roles, weekly frequency, replay policy, and support owner. The walkthrough will use those details to expose missing handoffs before setup begins.</p>
              <div className="mt-7 inline-flex items-start gap-3 rounded-2xl bg-primary/8 px-4 py-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <Sparkles className="mt-1 size-4 shrink-0 text-primary" />
                Pricing follows the actual scope: live batches, classroom usage, storage, users, and rollout support.
              </div>
            </div>
            <RolloutMap />
          </div>
        </section>

        <section className="border-t border-blue-950/8 bg-surface-muted/55 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-surface-strong">
          <div className="mx-auto grid w-full max-w-7xl gap-9 lg:grid-cols-[.34fr_.66fr]">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">Before you move a batch</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Questions worth answering first.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">Operational clarity matters more than a long feature checklist.</p>
            </div>
            <div className="border-t border-blue-950/10 dark:border-white/10">
              {faqs.map(([question, answer], index) => (
                <details key={question} open={index === 0} className="group border-b border-blue-950/10 py-5 dark:border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-heading text-base font-semibold sm:text-lg">
                    <span>{question}</span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-blue-950/15 text-primary transition group-open:rotate-45 dark:border-white/15">+</span>
                  </summary>
                  <p className="mt-3 max-w-3xl pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-foreground px-4 py-14 text-background sm:px-6 sm:py-16 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(43,168,255,.3),transparent_35rem),radial-gradient(circle_at_85%_90%,rgba(34,181,115,.3),transparent_35rem)]" />
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-promo-accent">Ready to simplify live delivery?</p>
              <h2 className="mt-3 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Show us one batch. We will map every handoff.</h2>
            </div>
            <ProductTourTrigger label="Book the class demo" variant="solid" size="lg" className="shrink-0 justify-center" />
          </div>
        </section>
      </div>
    </>
  );
}

function ScheduleBoard() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-blue-950/10 bg-white/90 p-2.5 shadow-[0_40px_100px_-35px_rgba(15,45,95,.4)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1830]/92 dark:shadow-black/50 sm:p-4">
      <div className="rounded-[1.5rem] border border-blue-950/8 bg-[#f8fbff] p-4 dark:border-white/8 dark:bg-[#081326] sm:p-6">
        <div className="flex items-center justify-between border-b border-blue-950/8 pb-5 dark:border-white/8">
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><CalendarDays className="size-5" /></span><div><p className="text-[.68rem] font-semibold uppercase tracking-[.16em] text-primary">Faculty desk</p><h2 className="mt-1 font-heading text-xl font-semibold">Today&apos;s teaching plan</h2></div></div>
          <BellRing className="size-5 text-slate-400" />
        </div>
        <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/7 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[.68rem] font-semibold text-primary">07:00 PM · LIVE NOW</p><h3 className="mt-2 font-heading text-lg font-semibold sm:text-xl">Physics: Current Electricity</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Batch A · 64 learners · Dr. Mehta</p></div><span className="rounded-full bg-emerald-500 px-3 py-1.5 text-[.62rem] font-bold uppercase tracking-wide text-white">Join room</span></div>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><UsersRound className="size-3.5" />51 joined<span className="text-slate-300 dark:text-slate-600">·</span><MessageSquareText className="size-3.5" />8 questions</div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <MiniSession icon={Clock3} title="Doubt session" detail="08:30 PM · Batch B" tone="amber" />
          <MiniSession icon={FileVideo2} title="Replay ready" detail="Mathematics · Published" tone="emerald" />
        </div>
      </div>
    </div>
  );
}

function MiniSession({ icon: Icon, title, detail, tone }: { icon: typeof Clock3; title: string; detail: string; tone: "amber" | "emerald" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-blue-950/8 bg-white p-3.5 dark:border-white/8 dark:bg-white/[.035]">
      <span className={["grid size-9 shrink-0 place-items-center rounded-xl", tone === "amber" ? "bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"].join(" ")}><Icon className="size-4" /></span>
      <div className="min-w-0"><p className="truncate text-sm font-semibold">{title}</p><p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{detail}</p></div>
    </div>
  );
}

function LearnerCanvas() {
  return (
    <div className="relative mx-auto w-full max-w-3xl pb-10 pr-0 sm:pr-10">
      <div className="absolute -left-8 -top-10 size-48 rounded-full bg-blue-300/25 blur-3xl dark:bg-blue-500/10" />
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-950/10 bg-surface p-3 shadow-[0_35px_90px_-45px_rgba(15,45,95,.45)] dark:border-white/10">
        <div className="flex items-center justify-between border-b border-blue-950/8 px-3 pb-3 dark:border-white/8"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" /></div><span className="rounded-full bg-surface-muted px-4 py-1.5 text-[.62rem] font-semibold text-slate-500 dark:text-slate-300">getkasa.in</span><WandSparkles className="size-4 text-primary" /></div>
        <div className="p-3 sm:p-4">
          <div className="relative min-h-[23rem] overflow-hidden rounded-[1.45rem] bg-slate-950 sm:min-h-[27rem]">
            <LazyVideo
              src="/learner-access-video.mp4"
              poster="/academy-students-learning-card.webp"
              ariaLabel="Learners accessing an online class through KASA"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,13,31,.3),rgba(4,13,31,.05)_42%,rgba(4,13,31,.86))]" />

            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
              <div className="rounded-2xl border border-white/20 bg-slate-950/55 px-4 py-3 text-white shadow-xl backdrop-blur-md">
                <p className="text-[.62rem] font-semibold uppercase tracking-[.16em] text-emerald-200">Physics · Batch A</p>
                <p className="mt-1 font-heading text-base font-semibold">Class in progress</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md"><span className="size-2 rounded-full bg-emerald-400" />51 joined</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/20 bg-slate-950/72 p-4 text-white shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-5">
              <div><p className="text-[.62rem] font-semibold uppercase tracking-[.16em] text-emerald-200">Current Electricity</p><h3 className="mt-1 font-heading text-lg font-semibold">Learning continues after the room closes.</h3></div>
              <div className="mt-3 flex shrink-0 gap-2 sm:mt-0"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold"><PlayCircle className="size-3.5" />Replay</span><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold"><MessageSquareText className="size-3.5" />Worksheet</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 right-0 hidden w-64 rounded-2xl border border-blue-950/10 bg-white/90 p-4 shadow-xl shadow-blue-950/10 backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:block"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><Check className="size-4" /></span><div><p className="text-xs font-semibold">Replay linked to Batch A</p><p className="mt-0.5 text-[.68rem] text-slate-500 dark:text-slate-400">No separate Drive link needed</p></div></div></div>
    </div>
  );
}

function RolloutMap() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-950/10 bg-surface p-6 shadow-[0_30px_80px_-45px_rgba(15,45,95,.4)] dark:border-white/10 sm:p-8">
      <div className="absolute -right-16 -top-16 size-52 rounded-full bg-primary/8" />
      <div className="relative flex items-center justify-between border-b border-blue-950/8 pb-5 dark:border-white/8"><div><p className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-primary">Live batch blueprint</p><h3 className="mt-2 font-heading text-2xl font-semibold">Five decisions before setup</h3></div><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><CalendarDays className="size-5" /></span></div>
      <div className="relative mt-6">
        <div className="absolute bottom-4 left-[.7rem] top-4 w-px bg-gradient-to-b from-primary via-primary/40 to-emerald-400" />
        <div className="space-y-1">
          {rolloutItems.map((item, index) => (
            <div key={item} className="relative flex items-center gap-4 py-3 pl-0">
              <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full border-4 border-surface bg-primary text-[.55rem] font-bold text-primary-foreground dark:border-surface">{index + 1}</span>
              <span className="text-sm font-semibold">{item}</span>
              {index === 0 ? <span className="ml-auto hidden rounded-full bg-emerald-50 px-3 py-1 text-[.65rem] font-semibold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200 sm:inline">Start here</span> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
