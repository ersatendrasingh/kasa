import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  FileBadge2,
  Globe2,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  UsersRound,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const journey = [
  {
    number: "01",
    label: "Publish",
    title: "Turn the course into a clear offer.",
    text: "Bring outcomes, modules, delivery format, eligibility, pricing, and learner support together before asking for payment.",
    icon: Globe2,
    detail: ["Branded course page", "Curriculum and outcomes", "Pricing context"],
  },
  {
    number: "02",
    label: "Convert",
    title: "Move interest into a controlled checkout.",
    text: "Keep pricing, coupons, payment, order records, and invoices inside one purchase flow connected to the academy.",
    icon: CreditCard,
    detail: ["Course checkout", "Coupon rules", "Order and invoice"],
  },
  {
    number: "03",
    label: "Enrol",
    title: "Connect the buyer with the right access.",
    text: "A successful order should lead to the learner account, purchased course, dashboard, and the correct access rules.",
    icon: CircleUserRound,
    detail: ["Learner account", "Automatic enrolment", "Access control"],
  },
  {
    number: "04",
    label: "Deliver",
    title: "Continue the journey after the sale.",
    text: "Recorded lessons, live sessions, assignments, progress, and certificates remain part of the same learner record.",
    icon: FileBadge2,
    detail: ["Learning dashboard", "Progress tracking", "Completion proof"],
  },
] as const;

const courseModels = [
  {
    label: "Self-paced",
    title: "Recorded programs",
    text: "Structured modules, downloadable resources, progress, and completion rules.",
    icon: BookOpenCheck,
  },
  {
    label: "Faculty-led",
    title: "Live cohorts",
    text: "Scheduled batches, live sessions, replays, assignments, and learner access.",
    icon: UsersRound,
  },
  {
    label: "Blended",
    title: "Hybrid offers",
    text: "Recorded foundations combined with live support, tests, and certificates.",
    icon: Layers3,
  },
] as const;

const faqs: Array<[string, string]> = [
  ["Can KASA sell recorded and live courses?", "Yes. An academy can position recorded programs, faculty-led live cohorts, and hybrid offers with lessons, sessions, resources, assignments, tests, and certificates."],
  ["What happens after a learner completes payment?", "The intended workflow connects the order with the learner account, invoice, course access, dashboard, and progress tracking so the team does not manually send links after each sale."],
  ["Can we use our own academy brand and domain?", "Yes. KASA is designed around a branded academy website, course pages, learner journey, and certificates instead of sending buyers to a marketplace profile."],
  ["Can the team manage coupons, orders, and invoices?", "Course pricing can stay connected with coupon rules, order records, invoices, learner access, and admin visibility inside the academy workflow."],
  ["Is this only a storefront and payment tool?", "No. The value comes from connecting discovery and checkout with learner delivery, progress, certificates, lead context, and reporting inside the LMS."],
];

export function CourseSellingPlatformPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData items={[
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
        { name: page.eyebrow, href: "/features/" + page.slug },
      ]} />
      <WebPageStructuredData
        name={page.title}
        description={page.description}
        href={"/features/" + page.slug}
      />
      <FaqStructuredData faqs={faqs} />

      <main className="lms-compact-page overflow-hidden bg-white text-slate-950 dark:bg-[#061126] dark:text-white">
        <section className="relative px-4 pb-0 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_50%_12%,rgba(43,168,255,0.14),transparent_32rem),radial-gradient(circle_at_82%_24%,rgba(34,181,115,0.1),transparent_28rem),linear-gradient(180deg,#f7fbff_0%,#ffffff_92%)] dark:bg-[radial-gradient(circle_at_50%_12%,rgba(69,145,255,0.16),transparent_32rem),radial-gradient(circle_at_82%_24%,rgba(88,201,138,0.1),transparent_28rem),linear-gradient(180deg,#08152c_0%,#061126_92%)]" />

          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
              <Link href="/" className="transition hover:text-primary">Home</Link>
              <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
              <Link href="/features" className="transition hover:text-primary">Features</Link>
              <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
              <span className="text-primary">Course selling</span>
            </nav>

            <div className="mx-auto mt-8 max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white/86 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-emerald-200">
                <ShoppingBag className="size-4" aria-hidden="true" />
                Course commerce for your own academy
              </div>
              <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                From course page to payment
                <span className="block stat-gradient-text">to learner access.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                Sell recorded, live, and hybrid programs without separating the
                storefront, checkout, learner account, course access, and
                completion journey.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ProductTourTrigger label="See the selling workflow" variant="solid" size="lg" className="w-full justify-center sm:w-auto" />
                <Link href="#commerce-system" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-blue-950/12 bg-white px-6 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 dark:border-white/15 dark:bg-white/8 dark:text-white sm:w-auto">
                  Explore the system
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <ProductCanvas />
          </div>
        </section>

        <section id="commerce-system" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">One connected system</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
                Course selling is an operating workflow, not a payment link.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
                Each part of the buying journey should create useful context for the next part of the academy operation.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-12">
              <article className="relative overflow-hidden rounded-[2rem] border border-blue-950/10 bg-[linear-gradient(145deg,#eef7ff,#ffffff)] p-7 lg:col-span-7 lg:min-h-[24rem] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(69,145,255,.13),rgba(255,255,255,.035))]">
                <div className="max-w-md">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20"><Globe2 className="size-5" aria-hidden="true" /></span>
                  <h3 className="mt-6 font-heading text-2xl font-semibold sm:text-3xl">A storefront under your academy brand.</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Give every course a clear home for positioning, curriculum, delivery, pricing, FAQs, and enrolment.</p>
                </div>
                <div className="absolute -bottom-12 right-6 hidden w-[45%] rotate-[-3deg] rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-2xl shadow-blue-950/10 sm:block dark:border-white/10 dark:bg-[#0d1b34]">
                  <div className="h-3 w-20 rounded-full bg-blue-100" />
                  <div className="mt-5 h-7 w-4/5 rounded-lg bg-slate-900 dark:bg-white" />
                  <div className="mt-3 h-3 w-full rounded-full bg-slate-100 dark:bg-white/10" />
                  <div className="mt-2 h-3 w-3/4 rounded-full bg-slate-100 dark:bg-white/10" />
                  <div className="mt-8 h-10 rounded-xl bg-[image:var(--button-solid)]" />
                </div>
              </article>

              <article className="rounded-[2rem] bg-[#0c2245] p-7 text-white lg:col-span-5">
                <div className="flex items-start justify-between gap-5">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-emerald-200"><CreditCard className="size-5" aria-hidden="true" /></span>
                  <span className="rounded-full bg-emerald-300/12 px-3 py-1.5 text-xs font-semibold text-emerald-200">Purchase layer</span>
                </div>
                <h3 className="mt-12 font-heading text-2xl font-semibold sm:text-3xl">Checkout that knows what the learner is buying.</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">Pricing, coupon rules, payment, invoice, order, and course access belong to one transaction record.</p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {["Coupon rules", "Order record", "Invoice", "Access mapping"].map((item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-xs font-semibold">{item}</div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-blue-950/10 bg-white p-7 shadow-xl shadow-blue-950/5 lg:col-span-5 dark:border-white/10 dark:bg-white/[0.035]">
                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><CircleUserRound className="size-5" aria-hidden="true" /></span>
                <h3 className="mt-8 font-heading text-2xl font-semibold">Buyer becomes a learner.</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">The learner account, purchased course, access rules, and dashboard are the next part of the sale—not a manual follow-up.</p>
                <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                  <CheckCircle2 className="size-4" aria-hidden="true" /> Payment confirmed <ArrowRight className="size-4 text-slate-300" aria-hidden="true" /> Access ready
                </div>
              </article>

              <article className="relative overflow-hidden rounded-[2rem] border border-blue-950/10 bg-[linear-gradient(145deg,#f8fbff,#effbf6)] p-7 lg:col-span-7 dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(69,145,255,.09),rgba(88,201,138,.07))]">
                <div className="relative z-10 max-w-lg">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary shadow-lg shadow-blue-950/8 dark:bg-white/10 dark:text-emerald-200"><BarChart3 className="size-5" aria-hidden="true" /></span>
                  <h3 className="mt-8 font-heading text-2xl font-semibold sm:text-3xl">Orders, learners, and delivery stay visible together.</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Admin teams can follow the transaction into course access, learner activity, progress, and completion without rebuilding context.</p>
                </div>
                <div className="absolute -bottom-10 -right-8 size-52 rounded-full border-[2rem] border-blue-200/35 dark:border-blue-400/10" />
              </article>
            </div>
          </div>
        </section>

        <JourneySection />
        <ModelsSection />
        <FaqSection />

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,#173f77_0%,#1d63a3_58%,#168465_100%)] px-6 py-12 text-white shadow-[0_30px_80px_-35px_rgba(18,59,115,.55)] sm:px-10 sm:py-14 lg:px-14">
            <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border-[3rem] border-white/8" />
            <div className="relative grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100"><Sparkles className="size-4" aria-hidden="true" /> Use one real course in the demo</div>
                <h2 className="mt-5 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">Map your current offer from the first page to learner access.</h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-blue-100">Bring the course, pricing, delivery model, and current enrolment process. The walkthrough can follow that exact workflow.</p>
              </div>
              <ProductTourTrigger
                label="Map my course flow"
                variant="solid"
                size="lg"
                className="course-selling-final-cta w-full justify-center"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ProductCanvas() {
  return (
    <div className="relative mx-auto mt-14 max-w-6xl">
      <div className="absolute -inset-x-12 top-20 h-80 rounded-full bg-blue-300/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-950/10 bg-white p-2.5 shadow-[0_35px_100px_-35px_rgba(15,45,95,0.35)] dark:border-white/10 dark:bg-[#0b1830] sm:p-4">
        <div className="overflow-hidden rounded-[1.45rem] border border-slate-200 bg-[#f8fafc] dark:border-white/10 dark:bg-[#09152a]">
          <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" /></div>
            <div className="rounded-full bg-slate-100 px-5 py-1.5 text-[0.65rem] font-semibold text-slate-500 dark:bg-white/8 dark:text-slate-300">academy.yourbrand.in</div>
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
          </div>

          <div className="grid min-h-[30rem] lg:grid-cols-[12rem_1fr_19rem]">
            <aside className="hidden border-r border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.025] lg:block">
              <div className="flex items-center gap-2 font-heading text-sm font-semibold"><span className="grid size-8 place-items-center rounded-xl bg-primary text-white">K</span>Your Academy</div>
              <div className="mt-8 grid gap-2">
                {["Overview", "Courses", "Orders", "Learners"].map((label, index) => (
                  <div key={label} className={["rounded-xl px-3 py-2.5 text-xs font-semibold", index === 1 ? "bg-blue-50 text-primary dark:bg-white/8 dark:text-emerald-200" : "text-slate-500 dark:text-slate-400"].join(" ")}>{label}</div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl bg-[linear-gradient(145deg,#eef7ff,#effbf6)] p-4 dark:bg-white/[0.04]">
                <LockKeyhole className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-3 text-xs font-semibold">Brand and access controls</p>
              </div>
            </aside>

            <div className="p-4 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">Course storefront</p><h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">Build the offer before checkout.</h2></div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200"><CheckCircle2 className="size-4" aria-hidden="true" />Ready to publish</span>
              </div>
              <div className="mt-7 overflow-hidden rounded-[1.35rem] bg-[linear-gradient(135deg,#123b73,#1e65a5)] p-5 text-white sm:p-7">
                <div className="flex items-center justify-between"><span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-100">Flagship program</span><BookOpenCheck className="size-5 text-sky-200" aria-hidden="true" /></div>
                <h3 className="mt-10 max-w-xl font-heading text-2xl font-semibold leading-tight sm:text-4xl">Explain the outcome, not only the syllabus.</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">Position curriculum, support, delivery, and completion proof as one learner offer.</p>
                <div className="mt-8 flex flex-wrap gap-2">{["12 modules", "Live support", "Resources", "Certificate"].map((item) => <span key={item} className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-semibold">{item}</span>)}</div>
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.025] lg:border-l lg:border-t-0 sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">Checkout</p><h3 className="mt-2 font-heading text-xl font-semibold">Enrolment summary</h3></div><ShoppingBag className="size-5 text-primary" aria-hidden="true" /></div>
              <div className="mt-7 grid gap-4 text-sm">{[["Course", "Selected offer"], ["Coupon", "Optional"], ["Invoice", "Included"], ["Access", "After payment"]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-slate-100 pb-4 dark:border-white/8"><span className="text-slate-500">{label}</span><span className="font-semibold">{value}</span></div>)}</div>
              <div className="mt-7 rounded-2xl bg-[image:var(--button-solid)] px-4 py-3.5 text-center text-sm font-semibold text-white">Continue to payment</div>
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/15 dark:bg-emerald-300/8"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200"><BadgeCheck className="size-4" aria-hidden="true" />Connected handoff</div><p className="mt-2 text-xs leading-5 text-emerald-700 dark:text-emerald-100">Order → account → course access</p></div>
            </aside>
          </div>
        </div>
      </div>
      <div className="absolute -left-8 top-24 hidden items-center gap-3 rounded-2xl border border-blue-950/10 bg-white px-4 py-3 text-sm font-semibold shadow-xl xl:flex"><TicketPercent className="size-5 text-primary" aria-hidden="true" />Coupons stay with the order</div>
      <div className="absolute -right-8 bottom-20 hidden items-center gap-3 rounded-2xl border border-blue-950/10 bg-white px-4 py-3 text-sm font-semibold shadow-xl xl:flex"><CircleUserRound className="size-5 text-emerald-600" aria-hidden="true" />Learner access opens next</div>
    </div>
  );
}

function JourneySection() {
  return (
    <section className="bg-[#f5f8fc] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:bg-[#08152a]">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.36fr_0.64fr]">
        <div className="lg:sticky lg:top-32 lg:self-start"><div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm dark:bg-white/8 dark:text-emerald-200"><Sparkles className="size-4" aria-hidden="true" />The commerce journey</div><h2 className="mt-5 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Four handoffs. One learner record.</h2><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">The page, transaction, enrolment, and learning experience should feel like one product.</p></div>
        <div className="border-l border-blue-950/10 pl-5 sm:pl-8 dark:border-white/10">
          {journey.map((item, index) => {
            const Icon = item.icon;
            return <article key={item.number} className={["relative py-9 sm:py-11", index ? "border-t border-blue-950/10 dark:border-white/10" : ""].join(" ")}>
              <span className="absolute -left-[2.3rem] top-12 grid size-10 place-items-center rounded-full border-4 border-[#f5f8fc] bg-[image:var(--button-solid)] text-white sm:-left-[3.25rem] dark:border-[#08152a]"><Icon className="size-4" aria-hidden="true" /></span>
              <div className="grid gap-5 md:grid-cols-[0.18fr_0.5fr_0.32fr]">
                <div><p className="font-heading text-3xl font-semibold text-primary/25">{item.number}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{item.label}</p></div>
                <div><h3 className="font-heading text-2xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p></div>
                <div className="grid gap-2">{item.detail.map((detail) => <div key={detail} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><Check className="size-4 text-emerald-600" aria-hidden="true" />{detail}</div>)}</div>
              </div>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

function ModelsSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Delivery models</p><h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Sell the format that matches the promise.</h2></div><p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">Different offers can share the same storefront, buyer record, and learner account.</p></div>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-blue-950/10 bg-[#0c2245] text-white">
          <div className="grid lg:grid-cols-3">{courseModels.map((model, index) => { const Icon = model.icon; return <article key={model.title} className={["p-7 sm:p-9", index ? "border-t border-white/10 lg:border-l lg:border-t-0" : ""].join(" ")}><div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-emerald-200"><Icon className="size-5" aria-hidden="true" /></span><span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">{model.label}</span></div><h3 className="mt-10 font-heading text-2xl font-semibold">{model.title}</h3><p className="mt-4 text-sm leading-7 text-slate-300">{model.text}</p></article>; })}</div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Link href="/tools/course-pricing-calculator" className="group flex items-center justify-between rounded-[1.5rem] border border-blue-950/10 bg-[linear-gradient(135deg,#eef7ff,#ffffff)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(42,102,178,.24),rgba(255,255,255,.055))]"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-sky-300">Free planning tool</p><h3 className="mt-2 font-heading text-xl font-semibold">Course pricing calculator</h3></div><span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white shadow-lg shadow-blue-900/20"><ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span></Link>
          <Link href="/tools/profit-calculator" className="group flex items-center justify-between rounded-[1.5rem] border border-blue-950/10 bg-[linear-gradient(135deg,#effbf6,#ffffff)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(27,125,98,.24),rgba(255,255,255,.055))]"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Free planning tool</p><h3 className="mt-2 font-heading text-xl font-semibold">Academy profit calculator</h3></div><span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-950/20"><ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span></Link>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f8fafc] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_0.65fr]">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Questions before rollout</p><h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Evaluate the complete journey.</h2><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Look beyond the payment gateway and ask what happens before and after every transaction.</p></div>
        <div>{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-t border-blue-950/10 py-5 last:border-b dark:border-white/10"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-heading text-lg font-semibold"><span>{question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-blue-950/10 text-primary transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div>
      </div>
    </section>
  );
}
