import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BookOpenCheck,
  CalendarDays,
  Check,
  CircleDot,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageCircleMore,
  MonitorPlay,
  PlayCircle,
  Radio,
  RefreshCw,
  Sparkles,
  UserRoundCheck,
  UsersRound,
  Video,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const faqs: Array<[string, string]> = [
  [
    "What is the best way to organize live online classes?",
    "Organize every class under a named program and batch with assigned faculty, enrolled learners, a published schedule, one joining route, reminders, attendance ownership, resources, replay rules, and a clear next task. This prevents the class from becoming an isolated meeting link.",
  ],
  [
    "Can an academy use Zoom, Google Meet, or another classroom provider with an LMS?",
    "Yes. The meeting provider can run the call while the LMS remains the operating record for the batch, schedule, learner access, resources, replay, assignment, progress, and communication. Confirm the exact integration and recording workflow during implementation.",
  ],
  [
    "How should recordings be shared after a live class?",
    "Attach the approved replay to the relevant batch, lesson, or class record instead of sending an open drive link. Add the class date, topic, supporting files, visibility rule, and expiry policy so learners can find the correct revision material later.",
  ],
  [
    "How do I manage learners who miss a class?",
    "Define an absence-recovery path before launch: publish the replay, identify the essential resource, set a catch-up task or quiz, provide a doubt route, and specify whether completion or attendance status changes after recovery.",
  ],
  [
    "Can live and recorded learning run in the same course?",
    "Yes. A hybrid program can combine scheduled teaching, recorded preparation or revision, assignments, tests, resources, doubt sessions, and certificates. The important part is that learners see one coherent sequence instead of separate tools and links.",
  ],
  [
    "What should an institute test before starting the first live batch?",
    "Test the workflow with coordinator, faculty, and learner accounts. Verify enrolment, timezone, reminders, permissions, joining, mobile access, attendance, recording ownership, replay publishing, assignment follow-up, support escalation, and class cancellation or rescheduling.",
  ],
];

const classCycle = [
  [CalendarDays, "Plan", "Batch, faculty, topic, time, capacity"],
  [BellRing, "Prepare", "Joining route, reminder, resources"],
  [Radio, "Teach", "Live room, attendance, questions"],
  [MonitorPlay, "Publish", "Replay, notes, files, visibility"],
  [ClipboardCheck, "Continue", "Assignment, doubt, progress, next class"],
] as const;

const timeline = [
  ["T−24h", "Coordinator", "Confirm faculty, room, topic, enrolled learners, and reminder audience."],
  ["T−10m", "Faculty", "Open the class record, test audio, review resources, and enter the live room."],
  ["00:00", "Learner", "Join from the batch dashboard without searching chat history for a link."],
  ["+45m", "Faculty", "End with the next action: practice, assignment, reading, or scheduled doubt session."],
  ["+2h", "Coordinator", "Publish the approved replay, attendance context, files, and catch-up instructions."],
] as const;

export function RunLiveOnlineClassesPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: page.title, href: `/resources/${page.slug}` },
        ]}
      />
      <WebPageStructuredData
        name={page.title}
        description={page.description}
        href={`/resources/${page.slug}`}
        pageType="Article"
      />
      <FaqStructuredData faqs={faqs} />

      <main className="overflow-hidden bg-[#f6f2e9] text-[#07162d] dark:bg-[#061126] dark:text-white">
        <section className="relative px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(255,191,79,.22),transparent_27rem),radial-gradient(circle_at_88%_22%,rgba(39,182,157,.17),transparent_30rem)]" />
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
              <Link href="/resources" className="hover:text-primary">Resources</Link><span>/</span>
              <span className="text-slate-900 dark:text-white">Live online classes</span>
            </nav>

            <div className="mt-8 grid gap-9 lg:grid-cols-[.83fr_1.17fr] lg:items-center xl:gap-14">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#07162d]/10 bg-white/55 px-3 py-1.5 text-[.68rem] font-semibold uppercase tracking-[.2em] text-primary dark:border-white/10 dark:bg-white/5 dark:text-emerald-300">
                  <Radio className="size-3.5" /> Live-class operations guide
                </div>
                <h1 className="mt-5 max-w-2xl font-heading text-[2.45rem] font-semibold leading-[1.03] tracking-[-.045em] sm:text-5xl lg:text-[3.45rem]">
                  Run the whole class—<span className="text-primary dark:text-emerald-300">not just the video call.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
                  Give every batch one dependable flow for schedules, faculty ownership, joining, attendance, replays, resources, assignments, and learner follow-up.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <ProductTourTrigger label="Map my live-class flow" variant="solid" size="sm" className="justify-center" />
                  <Link href="/features/live-class-management" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#07162d]/15 bg-white/60 px-5 text-sm font-semibold text-[#07162d] dark:border-white/15 dark:bg-white/5 dark:text-white">
                    Explore live-class management <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="relative lg:pl-6">
                <div className="relative overflow-hidden rounded-[1.7rem] bg-[#071b38] p-3 text-white shadow-[0_35px_100px_-52px_rgba(7,27,56,.85)]">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <div className="flex items-center gap-2 text-[.65rem] font-semibold uppercase tracking-[.17em] text-blue-100"><LayoutDashboard className="size-3.5" /> Batch control room</div>
                    <div className="flex items-center gap-2 rounded-full bg-emerald-300/10 px-2.5 py-1 text-[.62rem] font-semibold text-emerald-200"><CircleDot className="size-3" /> Live now</div>
                  </div>
                  <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#0c2851] md:grid-cols-[1.05fr_.95fr]">
                    <div className="relative min-h-[18rem] overflow-hidden md:min-h-[23rem]">
                      <Image src="/academy-live-class.jpg" alt="Faculty member teaching a live online class" fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06152d] via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex items-end justify-between gap-4">
                          <div><p className="text-[.62rem] font-semibold uppercase tracking-[.16em] text-emerald-200">Physics · JEE Batch A</p><p className="mt-1 font-heading text-lg font-semibold">Current Electricity</p></div>
                          <div className="rounded-lg bg-black/35 px-2.5 py-1.5 text-[.65rem] backdrop-blur">00:38:12</div>
                        </div>
                      </div>
                    </div>
                    <aside className="p-3 sm:p-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-[.65rem] text-blue-200">Class health</span><span className="text-[.65rem] font-semibold text-emerald-200">On track</span></div>
                      <div className="grid grid-cols-2 gap-2 py-3">
                        {[[UsersRound, "51 / 64", "Joined"], [MessageCircleMore, "08", "Questions"], [Clock3, "07:00 PM", "Started"], [UserRoundCheck, "Dr. Mehta", "Faculty"]].map(([Icon, value, label]) => {
                          const MetricIcon = Icon as typeof UsersRound;
                          return <div key={String(label)} className="rounded-xl border border-white/10 bg-white/[.045] p-3"><MetricIcon className="size-3.5 text-emerald-300" /><p className="mt-3 text-sm font-semibold">{String(value)}</p><p className="mt-0.5 text-[.6rem] text-blue-200">{String(label)}</p></div>;
                        })}
                      </div>
                      <div className="rounded-xl bg-white p-3 text-[#07162d]"><div className="flex items-center gap-2"><RefreshCw className="size-4 text-primary" /><span className="text-[.65rem] font-semibold uppercase tracking-[.14em] text-primary">After class</span></div><p className="mt-2 text-sm font-semibold">Replay publishing queue</p><p className="mt-1 text-[.65rem] leading-5 text-slate-500">Add notes, resources, attendance context, and the next task.</p></div>
                    </aside>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-1 hidden rounded-xl border border-[#07162d]/10 bg-[#fffaf0] px-4 py-3 shadow-lg lg:block dark:border-white/10 dark:bg-[#10213b]"><p className="text-[.62rem] font-semibold uppercase tracking-[.16em] text-amber-700 dark:text-amber-300">Next class</p><p className="mt-1 text-xs font-semibold">Chemistry · 08:30 PM</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#07162d]/10 bg-white/65 px-4 py-12 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-[#08172e]">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[.3fr_.7fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">One continuous record</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">A live class has five connected moments.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">If planning, delivery, and follow-up live in separate chats and spreadsheets, the academy loses context at every handoff.</p></div>
            <div className="mt-8 grid overflow-hidden rounded-2xl border border-[#07162d]/10 bg-[#07162d]/10 sm:grid-cols-2 lg:grid-cols-5 dark:border-white/10 dark:bg-white/10">
              {classCycle.map(([Icon, title, text], index) => <article key={title} className="relative border-b border-r border-[#07162d]/10 bg-[#fffdf8] p-4 last:border-r-0 sm:min-h-44 dark:border-white/10 dark:bg-[#0b1931]"><span className="font-mono text-[.6rem] text-primary/45">0{index + 1}</span><Icon className="mt-6 size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-base font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.38fr_.62fr]">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Class-day runbook</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Make the next owner obvious at every moment.</h2><p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">A schedule is useful only when coordinator, faculty, and learner each know what they need to do next.</p><div className="mt-7 rounded-2xl border border-amber-700/15 bg-amber-50 p-5 dark:border-amber-300/15 dark:bg-amber-300/5"><BellRing className="size-5 text-amber-700 dark:text-amber-300" /><p className="mt-3 font-heading text-lg font-semibold">Do not make chat the source of truth.</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Chat can alert people. The batch record should hold the final time, joining route, resources, replay, and next task.</p></div></div>
            <div className="relative border-l border-[#07162d]/15 pl-6 dark:border-white/15 sm:pl-9">
              {timeline.map(([time, owner, action], index) => <article key={time} className="relative grid gap-2 border-b border-[#07162d]/10 py-5 first:pt-0 sm:grid-cols-[5rem_7rem_1fr] sm:items-start dark:border-white/10"><span className="absolute -left-[1.88rem] top-6 size-3 rounded-full border-2 border-[#f6f2e9] bg-primary dark:border-[#061126] sm:-left-[2.57rem]" /><span className="font-mono text-xs font-semibold text-primary dark:text-emerald-300">{time}</span><span className="text-[.65rem] font-semibold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">{owner}</span><p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{action}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#071b38] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-7 lg:grid-cols-[.36fr_.64fr]"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-300">Three views, one class</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Everyone shares the record—not the same dashboard.</h2><p className="mt-5 text-sm leading-7 text-blue-100">Each role needs the right controls and context. Exposing every admin option to everyone creates noise, not transparency.</p></div><div className="grid gap-3 sm:grid-cols-3">{[
              [LayoutDashboard, "Coordinator", "Owns batch setup, faculty assignment, learner access, schedule changes, and operating exceptions.", ["Capacity and enrolment", "Schedule and reminders", "Replay visibility"]],
              [GraduationCap, "Faculty", "Sees the teaching plan, live room, learner context, questions, resources, and follow-up work.", ["Class plan", "Teaching resources", "Assignment handoff"]],
              [UsersRound, "Learner", "Sees when to join, what to prepare, where to revise, what is due, and how to get help.", ["One joining route", "Replay and notes", "Next task"]],
            ].map(([Icon, title, body, points]) => { const RoleIcon = Icon as typeof UsersRound; return <article key={String(title)} className="rounded-2xl border border-white/10 bg-white/[.055] p-5"><RoleIcon className="size-5 text-emerald-300" /><h3 className="mt-5 font-heading text-xl font-semibold">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-blue-100">{String(body)}</p><div className="mt-5 space-y-2">{(points as string[]).map((point) => <div key={point} className="flex items-center gap-2 text-xs text-blue-50"><Check className="size-3.5 text-emerald-300" />{point}</div>)}</div></article>; })}</div></div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-7 lg:grid-cols-[.4fr_.6fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">The class continues</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">A useful replay should recover the learning—not merely archive the call.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">The post-class package should answer four questions: what happened, what matters, what should I do, and where can I ask for help?</p></div>
            <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{[
              [Video, "Replay with context", "Attach the recording to the exact class, topic, batch, and visibility rule."],
              [FileText, "Notes and resources", "Keep slides, worksheets, links, and references next to the replay."],
              [BookOpenCheck, "Catch-up action", "Tell absent learners what to watch, practise, submit, or attend next."],
              [ClipboardCheck, "Progress evidence", "Connect attendance, replay, assignment, quiz, or review to a meaningful status."],
            ].map(([Icon, title, text], index) => { const CardIcon = Icon as typeof Video; return <article key={String(title)} className="rounded-2xl border border-[#07162d]/10 bg-white/65 p-5 dark:border-white/10 dark:bg-white/[.04]"><div className="flex items-center justify-between"><CardIcon className="size-5 text-primary dark:text-emerald-300" /><span className="font-mono text-[.6rem] text-primary/40">0{index + 1}</span></div><h3 className="mt-6 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>; })}</div>
          </div>
        </section>

        <section className="border-y border-[#07162d]/10 bg-[#e8f0ed] px-4 py-12 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-[#08172e]">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.36fr_.64fr]">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Pilot before rollout</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">Run one real batch through every exception.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Do not test only the happy path. Reschedule a class, miss one learner, replace one faculty member, and publish one replay.</p></div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[#07162d]/10 bg-[#07162d]/10 sm:grid-cols-2 dark:border-white/10 dark:bg-white/10">{[
              "Program, batch, timezone, capacity, and faculty are confirmed",
              "Enrolled and removed learners receive the correct access",
              "Joining works on desktop and mobile learner accounts",
              "Reminder copy and schedule-change ownership are agreed",
              "Attendance method and correction process are documented",
              "Recording owner, storage, consent, and replay rule are clear",
              "Cancelled and rescheduled classes have a communication path",
              "Assignment, doubt support, and next-class action are visible",
            ].map((item, index) => <div key={item} className="flex gap-3 bg-[#f7faf7] p-4 text-sm leading-6 dark:bg-[#0b1931]"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[.62rem] font-bold text-white dark:bg-emerald-300 dark:text-[#071b38]">{index + 1}</span>{item}</div>)}</div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 border-b border-[#07162d]/10 pb-12 dark:border-white/10 lg:grid-cols-[.32fr_.68fr] lg:items-center">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Planning desk</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">Useful tools around the class.</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Use them for preparation and decisions; keep the final class record inside the batch workflow.</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[
              ["Attendance calculator", "/tools/attendance-calculator", "Check attendance position and required classes."],
              ["Study timetable generator", "/tools/study-timetable-generator", "Turn class commitments into a practical study plan."],
              ["Lesson plan generator", "/tools/lesson-plan-generator", "Prepare the class objective, sequence, and checks."],
              ["Assignment generator", "/tools/assignment-generator", "Draft structured follow-up work after a session."],
              ["Quiz generator", "/tools/quiz-generator", "Create a quick post-class understanding check."],
              ["Worksheet generator", "/tools/worksheet-generator", "Give learners guided practice with the replay."],
            ].map(([title, href, text]) => <Link key={title} href={href} className="group rounded-2xl border border-[#07162d]/10 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[.04] dark:hover:bg-white/[.07]"><p className="font-heading text-base font-semibold">{title}</p><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-emerald-300">Open tool <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span></Link>)}</div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.32fr_.68fr]">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Live-class questions</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">Set the operating rules before the first invite.</h2><div className="mt-6 rounded-2xl bg-[#071b38] p-5 text-white"><MessageCircleMore className="size-5 text-emerald-300" /><p className="mt-4 font-heading text-lg font-semibold">Bring one upcoming batch.</p><p className="mt-2 text-sm leading-6 text-blue-100">We can map its schedule, owners, joining, replay, and learner follow-up.</p><ProductTourTrigger label="Review the batch workflow" variant="solid" size="sm" className="mt-5 w-full justify-center" /></div></div>
            <div className="border-t border-[#07162d]/10 dark:border-white/10">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-[#07162d]/10 py-5 dark:border-white/10"><summary className="flex cursor-pointer list-none items-start justify-between gap-5"><span className="flex gap-3"><span className="mt-1 font-mono text-[.62rem] text-primary/45">0{index + 1}</span><span className="font-heading text-base font-semibold leading-7 sm:text-lg">{question}</span></span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#07162d]/15 text-primary transition group-open:rotate-45 dark:border-white/15 dark:text-emerald-300">+</span></summary><p className="mt-3 max-w-3xl pl-10 pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[1.5rem] bg-[linear-gradient(110deg,#0a2852,#12698a_56%,#16856f)] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between"><div><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-emerald-200"><Sparkles className="size-4" />Ready to run the first connected batch?</div><h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-tight">Map the class before, during, and after the live room.</h2></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row"><ProductTourTrigger label="Plan the KASA workflow" variant="solid" size="sm" className="justify-center" /><Link href="/tools/attendance-calculator" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white">Open attendance calculator <ArrowRight className="size-4" /></Link></div></div>
        </section>
      </main>
    </>
  );
}
