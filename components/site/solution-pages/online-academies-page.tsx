import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleUserRound,
  CreditCard,
  FileBadge2,
  Globe2,
  Layers3,
  LockKeyhole,
  MessageCircleMore,
  PlayCircle,
  Rocket,
  ShoppingBag,
  Sparkles,
  UsersRound,
  Video,
} from "lucide-react";
import { LazyVideo } from "@/components/site/lazy-video";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const faqs: Array<[string, string]> = [
  ["Can an academy sell recorded, live, and hybrid programs?", "Yes. An academy can offer self-paced courses, scheduled cohorts, or a blended program that combines recorded lessons with live classes, assignments, and certificates."],
  ["What happens after a learner pays?", "The intended flow connects the successful order with the learner account, invoice, course access, and dashboard so the team does not manually send links after every purchase."],
  ["Can we use our own brand and domain?", "Yes. The public website, course catalogue, learner journey, and certificates are designed to sit under the academy brand rather than a marketplace identity."],
  ["Does KASA bring students automatically?", "No. KASA provides the website, checkout, CRM, and delivery infrastructure. The academy still owns positioning, content quality, traffic, campaigns, counselling, and learner outcomes."],
  ["What affects pricing?", "Pricing depends on users, active programs, storage and video usage, live-class requirements, integrations, and rollout support. These limits should be mapped before purchase."],
  ["Who is this best suited for?", "It is best suited for online academies, subject experts, cohort businesses, coaching brands, and training teams that need direct sales and a structured learner experience under their own brand."],
];

const journey = [
  { label: "Discover", title: "A program page earns attention", text: "Outcome, curriculum, format, support, price, and FAQs answer the buyer's first questions.", icon: Globe2 },
  { label: "Enrol", title: "Checkout creates a real order", text: "Payment, coupon, invoice, learner identity, and program access stay connected.", icon: CreditCard },
  { label: "Learn", title: "The dashboard guides progress", text: "Lessons, live sessions, resources, assignments, and support appear in one journey.", icon: BookOpenCheck },
  { label: "Complete", title: "Progress becomes proof", text: "Completion rules, assessment results, and certificates close the learning loop.", icon: FileBadge2 },
] as const;

const models = [
  { label: "Self-paced", title: "Recorded course academy", text: "For evergreen programs with modules, resources, progress rules, and completion certificates.", detail: "Best when learners need flexible access.", icon: PlayCircle },
  { label: "Cohort-led", title: "Live learning business", text: "For fixed batches with faculty, calendars, joining links, replays, and guided assignments.", detail: "Best when teaching happens on a schedule.", icon: Video },
  { label: "Blended", title: "Hybrid flagship program", text: "For recorded foundations combined with live support, projects, tests, and feedback.", detail: "Best when outcomes need structure and support.", icon: Layers3 },
] as const;

const boundaries = [
  ["Audience", "You define who the program is for and why the outcome matters."],
  ["Curriculum", "Faculty owns lessons, feedback, assessments, and academic quality."],
  ["Demand", "Your campaigns, content, referrals, and counselling create enrolments."],
  ["Support", "Your team decides response times, mentor roles, and learner follow-up."],
] as const;

export function OnlineAcademiesPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData items={[
        { name: "Home", href: "/" },
        { name: "Solutions", href: "/solutions" },
        { name: "Online academies", href: "/solutions/online-academies" },
      ]} />
      <WebPageStructuredData name={page.title} description={page.description} href="/solutions/online-academies" />
      <FaqStructuredData faqs={faqs} />

      <div className="lms-compact-page overflow-hidden bg-background text-foreground">
        <section className="relative px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-24 h-[34rem] w-[68rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(43,168,255,.19),rgba(34,181,115,.1)_42%,transparent_72%)] blur-2xl dark:opacity-55" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="relative mx-auto w-full max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="transition hover:text-primary">Home</Link><span>/</span>
              <Link href="/solutions" className="transition hover:text-primary">Solutions</Link><span>/</span>
              <span className="text-foreground">Online academies</span>
            </nav>

            <div className="mx-auto mt-12 max-w-5xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/7 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-primary">
                <Sparkles className="size-4" /> Build an academy learners remember
              </p>
              <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] tracking-[-.025em] sm:text-5xl lg:text-[3.4rem]">
                Your courses deserve more than
                <span className="block bg-[image:var(--stat-gradient)] bg-clip-text text-transparent">a checkout page and a folder of videos.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                KASA connects your branded website, program sales, learner access, live teaching, progress, support, and certificates into one online academy.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ProductTourTrigger label="Map my academy" variant="solid" size="lg" className="justify-center" />
                <Link href="/pricing" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-blue-950/12 bg-surface px-6 text-sm font-semibold shadow-sm transition hover:border-primary/35 hover:text-primary dark:border-white/12">
                  Understand pricing <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <AcademyCanvas />
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-surface-muted/55 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-surface-strong">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[.32fr_.68fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">One academy, four public promises</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">What buyers see should match what learners receive.</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-blue-950/10 bg-blue-950/10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/10 dark:bg-white/10">
              {[
                ["01", "Brand", "A credible home for the academy"],
                ["02", "Offer", "A clear program and price"],
                ["03", "Delivery", "A guided learning experience"],
                ["04", "Proof", "Progress and completion"],
              ].map(([number, title, text]) => (
                <div key={number} className="bg-surface px-5 py-6"><span className="font-heading text-xs font-semibold text-primary">{number}</span><h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.42fr_.58fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">The learner journey</p>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">From first visit to completion—without rebuilding context.</h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end dark:text-slate-300">A serious academy is not one screen. Every stage should pass useful information to the next stage.</p>
            </div>

            <div className="mt-12 border-y border-blue-950/10 dark:border-white/10">
              {journey.map(({ label, title, text, icon: Icon }, index) => (
                <article key={label} className="group grid gap-5 border-b border-blue-950/10 py-7 last:border-b-0 sm:grid-cols-[4rem_9rem_1fr_1fr] sm:items-center dark:border-white/10">
                  <span className="font-heading text-sm font-semibold text-primary">0{index + 1}</span>
                  <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500 dark:text-slate-400">{label}</span></div>
                  <h3 className="font-heading text-xl font-semibold transition group-hover:text-primary">{title}</h3>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 dark:bg-black">
          <div className="pointer-events-none absolute -left-48 -top-48 size-[38rem] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-48 right-0 size-[36rem] rounded-full bg-emerald-400/15 blur-[120px]" />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-9 lg:grid-cols-[.46fr_.54fr] xl:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-300">Inside the learning experience</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Recorded lessons become a program—not a playlist.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">Modules, resources, progress, assignments, live support, and completion rules give learners a reason to continue after the first login.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Module-level progress", "Resources beside lessons", "Assignments and feedback", "Completion certificates"].map((item) => <div key={item} className="flex items-center gap-3 border-b border-white/10 py-3 text-sm font-semibold"><Check className="size-4 text-emerald-300" />{item}</div>)}
              </div>
            </div>
            <AcademyVideo />
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">Choose the operating model</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Your delivery model should shape the academy.</h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">Recorded, live, and hybrid programs share the same commerce and learner records—but need different operating rhythms.</p>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {models.map(({ label, title, text, detail, icon: Icon }, index) => (
                <article key={label} className={["relative overflow-hidden rounded-[2rem] border p-7", index === 1 ? "border-primary/25 bg-foreground text-background shadow-2xl shadow-primary/15" : "border-blue-950/10 bg-surface dark:border-white/10"].join(" ")}>
                  {index === 1 ? <span className="absolute right-5 top-5 rounded-full bg-background/10 px-3 py-1.5 text-[.65rem] font-semibold uppercase tracking-[.14em]">Guided delivery</span> : null}
                  <span className={["grid size-12 place-items-center rounded-2xl", index === 1 ? "bg-background/10 text-background" : "bg-primary/10 text-primary"].join(" ")}><Icon className="size-5" /></span>
                  <p className={["mt-8 text-xs font-semibold uppercase tracking-[.18em]", index === 1 ? "text-promo-accent" : "text-primary"].join(" ")}>{label}</p>
                  <h3 className="mt-3 font-heading text-2xl font-semibold">{title}</h3>
                  <p className={["mt-4 text-sm leading-7", index === 1 ? "text-background/70" : "text-slate-600 dark:text-slate-300"].join(" ")}>{text}</p>
                  <p className={["mt-7 border-t pt-5 text-xs font-semibold", index === 1 ? "border-background/15 text-background" : "border-blue-950/10 text-slate-500 dark:border-white/10 dark:text-slate-400"].join(" ")}>{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-surface-muted/55 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-surface-strong">
          <div className="mx-auto grid w-full max-w-7xl gap-9 lg:grid-cols-[.44fr_.56fr] xl:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">What the platform will not do for you</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Technology can organize an academy. It cannot create its value.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">Approval, retention, and growth depend on original programs, honest positioning, real support, and measurable learner outcomes—not simply having an LMS.</p>
              <div className="mt-7 rounded-2xl border-l-4 border-primary bg-surface px-5 py-4 text-sm leading-7 text-slate-600 shadow-sm dark:text-slate-300"><strong className="text-foreground">Rollout reality:</strong> prepare your first program, pricing, policies, support owner, and access rules before configuration.</div>
            </div>
            <div className="divide-y divide-blue-950/10 border-y border-blue-950/10 dark:divide-white/10 dark:border-white/10">
              {boundaries.map(([title, text], index) => (
                <div key={title} className="grid gap-3 py-5 sm:grid-cols-[3rem_8rem_1fr] sm:items-start"><span className="font-heading text-xs font-semibold text-primary">0{index + 1}</span><h3 className="font-heading text-base font-semibold">{title}</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-9 lg:grid-cols-[.38fr_.62fr] xl:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">Price the real operation</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Bring one program to the demo.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">The useful conversation starts with the offer you plan to sell—not an abstract feature list.</p>
              <ProductTourTrigger label="Plan my academy rollout" variant="solid" size="lg" className="mt-8 justify-center" />
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#123b73,#1762a5_55%,#148267)] p-7 text-white shadow-[0_32px_90px_-45px_rgba(22,71,163,.65)] sm:p-9">
              <div className="absolute -right-20 -top-20 size-64 rounded-full border-[2rem] border-white/7" />
              <div className="relative grid gap-7 sm:grid-cols-2">
                <div><p className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-emerald-100">Bring these details</p><div className="mt-5 space-y-3">{["Program format and price", "Expected learners and users", "Video, live-class, and storage needs", "Domain, payment, email, and support setup"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />{item}</div>)}</div></div>
                <div className="border-t border-white/15 pt-7 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0"><p className="text-[.68rem] font-semibold uppercase tracking-[.18em] text-emerald-100">Pricing considers</p><div className="mt-5 grid grid-cols-2 gap-3">{["Users", "Programs", "Storage", "Live usage", "Integrations", "Rollout"].map((item) => <div key={item} className="rounded-xl bg-white/8 px-3 py-3 text-xs font-semibold">{item}</div>)}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl border-y border-blue-950/10 py-7 dark:border-white/10"><div className="grid gap-6 lg:grid-cols-[.32fr_.68fr] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">From offer to operation</p><h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">Pressure-test the academy before launch.</h2><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold"><Link href="/resources/start-online-academy-india" className="text-primary hover:underline">Launch guide</Link><Link href="/resources/sell-recorded-courses-online" className="text-primary hover:underline">Recorded-course guide</Link><Link href="/resources/online-course-pricing-guide" className="text-primary hover:underline">Pricing guide</Link></div></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{[["Course pricing calculator", "/tools/course-pricing-calculator"], ["Profit calculator", "/tools/profit-calculator"], ["Admission form generator", "/tools/admission-form-generator"], ["Batch capacity calculator", "/tools/batch-capacity-calculator"], ["Fee receipt generator", "/tools/fee-receipt-generator"], ["Certificate generator", "/tools/certificate-generator"]].map(([title, href]) => <Link key={href} href={href} className="group flex items-center justify-between rounded-xl border border-blue-950/10 bg-surface px-4 py-3 text-sm font-semibold dark:border-white/10"><span>{title}</span><ArrowRight className="size-3.5 text-primary transition group-hover:translate-x-1" /></Link>)}</div></div></div>
        </section>

        <section className="border-t border-blue-950/8 bg-surface-muted/55 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-surface-strong">
          <div className="mx-auto grid w-full max-w-7xl gap-9 lg:grid-cols-[.34fr_.66fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">Online academy questions</p>
              <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Decide with the full operating picture.</h2>
            </div>
            <div className="border-t border-blue-950/10 dark:border-white/10">
              {faqs.map(([question, answer], index) => (
                <details key={question} open={index === 0} className="group border-b border-blue-950/10 py-5 dark:border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-heading text-base font-semibold sm:text-lg"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-blue-950/15 text-primary transition group-open:rotate-45 dark:border-white/15">+</span></summary>
                  <p className="mt-3 max-w-3xl pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-foreground px-4 py-14 text-background sm:px-6 sm:py-16 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(43,168,255,.3),transparent_32rem),radial-gradient(circle_at_88%_88%,rgba(34,181,115,.3),transparent_34rem)]" />
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-promo-accent">Your brand. Your programs. Your learner relationship.</p><h2 className="mt-3 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Build the academy around one real offer.</h2></div>
            <ProductTourTrigger label="See KASA in action" variant="solid" size="lg" className="shrink-0 justify-center" />
          </div>
        </section>
      </div>
    </>
  );
}

function AcademyCanvas() {
  return (
    <div className="relative mx-auto mt-14 max-w-7xl">
      <div className="absolute -inset-x-10 top-16 h-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.2rem] border border-blue-950/10 bg-surface p-2.5 shadow-[0_40px_110px_-40px_rgba(15,45,95,.42)] dark:border-white/10 sm:p-4">
        <div className="overflow-hidden rounded-[1.65rem] border border-blue-950/8 bg-background dark:border-white/8">
          <div className="flex h-12 items-center justify-between border-b border-blue-950/8 bg-surface px-4 dark:border-white/8"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" /></div><span className="rounded-full bg-surface-muted px-5 py-1.5 text-[.65rem] font-semibold text-slate-500 dark:text-slate-300">getkasa.in</span><LockKeyhole className="size-4 text-emerald-600 dark:text-emerald-300" /></div>
          <div className="grid min-h-[31rem] lg:grid-cols-[13rem_1fr_20rem]">
            <aside className="hidden border-r border-blue-950/8 bg-surface p-5 dark:border-white/8 lg:block">
              <div className="flex items-center gap-2 font-heading text-sm font-semibold"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">A</span>Your Academy</div>
              <div className="mt-8 space-y-2">{["Overview", "Programs", "Learners", "Orders", "Messages"].map((item, index) => <div key={item} className={["rounded-xl px-3 py-2.5 text-xs font-semibold", index === 1 ? "bg-primary/10 text-primary" : "text-slate-500 dark:text-slate-400"].join(" ")}>{item}</div>)}</div>
              <div className="mt-10 rounded-2xl bg-surface-muted p-4"><BarChart3 className="size-5 text-primary" /><p className="mt-3 text-xs font-semibold">Sales and learning in one view</p></div>
            </aside>
            <div className="p-4 sm:p-7">
              <div className="flex items-center justify-between gap-4"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-primary">Flagship program</p><h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">Data Analytics Career Track</h2></div><span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:inline-flex dark:bg-emerald-300/10 dark:text-emerald-200"><BadgeCheck className="mr-2 size-4" />Published</span></div>
              <div className="relative mt-7 min-h-[20rem] overflow-hidden rounded-[1.6rem] bg-[#0f3264]">
                <Image src="/feature-digital-class.jpg" alt="Online academy program experience" fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover opacity-55" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,45,.94),rgba(7,20,45,.38),rgba(7,20,45,.15))]" />
                <div className="relative flex min-h-[20rem] max-w-xl flex-col justify-end p-6 text-white sm:p-8"><span className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[.65rem] font-semibold uppercase tracking-[.16em]">16-week guided program</span><h3 className="mt-5 font-heading text-3xl font-semibold leading-tight">Sell the outcome—not just access to lessons.</h3><p className="mt-3 text-sm leading-7 text-blue-100">Recorded foundations, live labs, mentor feedback, portfolio projects, and a completion certificate.</p></div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">{[["12", "modules"], ["4", "live labs"], ["1", "certificate"]].map(([value, label]) => <div key={label} className="rounded-xl border border-blue-950/8 bg-surface px-4 py-3 dark:border-white/8"><strong className="font-heading text-xl">{value}</strong><span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{label}</span></div>)}</div>
            </div>
            <aside className="border-t border-blue-950/8 bg-surface p-5 dark:border-white/8 lg:border-l lg:border-t-0 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.16em] text-slate-400">Today</p><h3 className="mt-2 font-heading text-xl font-semibold">Academy pulse</h3></div><Rocket className="size-5 text-primary" /></div>
              <div className="mt-7 space-y-5">{[["₹4,999", "Program price"], ["18", "New enquiries"], ["7", "Paid learners"], ["64%", "Average progress"]].map(([value, label]) => <div key={label} className="flex items-end justify-between border-b border-blue-950/8 pb-4 dark:border-white/8"><span className="text-xs text-slate-500 dark:text-slate-400">{label}</span><strong className="font-heading text-lg">{value}</strong></div>)}</div>
              <div className="mt-7 rounded-2xl bg-primary/8 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-primary"><MessageCircleMore className="size-4" />Follow-up queue</div><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">4 prospects requested a curriculum call.</p></div>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-blue-950/8 p-4 dark:border-white/8"><span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><CircleUserRound className="size-4" /></span><div><p className="text-xs font-semibold">Learner access</p><p className="mt-0.5 text-[.68rem] text-slate-500">7 accounts ready</p></div></div>
            </aside>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 left-[8%] hidden rotate-[-2deg] items-center gap-3 rounded-2xl border border-blue-950/10 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:flex dark:border-white/10 dark:bg-surface/90"><ShoppingBag className="size-5 text-primary" /><div><p className="text-xs font-semibold">New enrolment</p><p className="mt-0.5 text-[.68rem] text-slate-500 dark:text-slate-400">Order connected to learner access</p></div></div>
      <div className="absolute -right-2 top-[18%] hidden rotate-2 items-center gap-3 rounded-2xl border border-blue-950/10 bg-white/90 px-4 py-3 shadow-xl backdrop-blur md:flex dark:border-white/10 dark:bg-surface/90"><UsersRound className="size-5 text-emerald-600 dark:text-emerald-300" /><div><p className="text-xs font-semibold">Learners active</p><p className="mt-0.5 text-[.68rem] text-slate-500 dark:text-slate-400">Progress visible by program</p></div></div>
    </div>
  );
}

function AcademyVideo() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30">
      <div className="relative min-h-[28rem] overflow-hidden rounded-[1.5rem]">
        <LazyVideo src="/feature-self-learning.mp4" poster="/academy-students-learning-card.webp" ariaLabel="KASA self-learning academy experience" className="absolute inset-0 h-full w-full object-cover object-[82%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,24,.18),rgba(2,9,24,.05)_45%,rgba(2,9,24,.88))]" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/55 px-3 py-2 text-xs font-semibold backdrop-blur"><span className="grid size-6 place-items-center rounded-full bg-white text-primary">K</span>Self-learning mode</div>
        <div className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/15 bg-slate-950/72 p-4 backdrop-blur-xl sm:flex sm:items-center sm:justify-between"><div><p className="text-[.62rem] font-semibold uppercase tracking-[.18em] text-emerald-200">Module 04 · Lesson 02</p><h3 className="mt-1 font-heading text-lg font-semibold">Progress continues across devices.</h3></div><div className="mt-3 w-full sm:mt-0 sm:w-36"><div className="flex justify-between text-[.65rem] font-semibold"><span>Progress</span><span>68%</span></div><div className="mt-2 h-2 rounded-full bg-white/15"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-300 to-sky-400" /></div></div></div>
      </div>
    </div>
  );
}
