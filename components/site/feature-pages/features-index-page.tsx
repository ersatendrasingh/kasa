import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  CreditCard,
  FileBadge2,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MonitorPlay,
  Palette,
  Play,
  Radio,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { LazyVideo } from "@/components/site/lazy-video";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import { featurePages } from "@/lib/site-content";

const featureGroups = [
  {
    id: "sell",
    number: "01",
    eyebrow: "Attract and sell",
    title: "Turn interest into a paid learner—without breaking the journey.",
    description:
      "Your website, enquiry context, checkout, order, and enrolment should behave like one acquisition system.",
    accent: "blue",
    features: [
      {
        title: "Course selling platform",
        href: "/features/course-selling-platform",
        text: "Publish recorded, live, and hybrid offers with curriculum, pricing, checkout, and automatic access.",
        meta: "Storefront → checkout → access",
        icon: ShoppingBag,
      },
      {
        title: "Academy website builder",
        href: "/features/academy-website-builder",
        text: "Build search-ready course pages, pricing paths, enquiry forms, and learner login under your brand.",
        meta: "Pages → enquiries → conversion",
        icon: Globe2,
      },
      {
        title: "Education CRM and leads",
        href: "/features/education-crm-leads",
        text: "Keep source, page, intent, notes, and follow-up context attached to every serious enquiry.",
        meta: "Lead source → follow-up → admission",
        icon: Megaphone,
      },
      {
        title: "Payments, coupons, and orders",
        href: "/features/payments-coupons-orders",
        text: "Connect pricing, offers, payment records, invoices, refunds, and course access.",
        meta: "Payment → order → invoice",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "teach",
    number: "02",
    eyebrow: "Teach and assess",
    title: "Keep the class, content, assessment, and proof of learning together.",
    description:
      "Faculty and learners see the same academic journey from different, role-specific workspaces.",
    accent: "navy",
    features: [
      {
        title: "Live class management",
        href: "/features/live-class-management",
        text: "Plan batches, assign faculty, publish sessions, attach replays, and continue after class.",
        meta: "Schedule → live room → replay",
        icon: Radio,
      },
      {
        title: "Exams, assignments, certificates",
        href: "/features/exams-assignments-certificates",
        text: "Measure outcomes, review submissions, track results, and issue branded completion proof.",
        meta: "Attempt → result → certificate",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    id: "support",
    number: "03",
    eyebrow: "Support every role",
    title: "Give learners and faculty clarity without giving up admin control.",
    description:
      "The same academy record powers focused workspaces for students, teachers, and the operations team.",
    accent: "green",
    features: [
      {
        title: "Student and faculty management",
        href: "/features/student-faculty-management",
        text: "Organize users, roles, batches, assigned teaching work, and learner records without spreadsheet handoffs.",
        meta: "People → roles → batches",
        icon: UsersRound,
      },
      {
        title: "Learner dashboard and progress",
        href: "/features/learner-dashboard-progress",
        text: "Give each learner one place for courses, classes, pending work, progress, orders, and certificates.",
        meta: "Next step → progress → completion",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "control",
    number: "04",
    eyebrow: "Control and scale",
    title: "Own the brand outside. See the operation clearly inside.",
    description:
      "KASA combines a branded learner experience with the visibility and permissions a growing team needs.",
    accent: "violet",
    features: [
      {
        title: "Admin dashboard and reporting",
        href: "/features/admin-dashboard-reporting",
        text: "Monitor users, courses, orders, leads, certificates, settings, and performance from one control room.",
        meta: "Operations → signals → decisions",
        icon: LayoutDashboard,
      },
      {
        title: "White-label LMS",
        href: "/features/white-label-lms",
        text: "Use your domain, identity, course positioning, learner portal, and certificates instead of a marketplace brand.",
        meta: "Your domain → your academy → your data",
        icon: Palette,
      },
    ],
  },
] as const;

const roles = [
  { role: "Academy owner", sees: "Revenue, demand, learner growth, and operating health", icon: Building2 },
  { role: "Operations team", sees: "Orders, users, access, batches, support, and exceptions", icon: LayoutDashboard },
  { role: "Faculty", sees: "Assigned classes, learners, resources, reviews, and follow-up", icon: BookOpenCheck },
  { role: "Learner", sees: "Purchased courses, next class, pending work, progress, and proof", icon: CircleUserRound },
] as const;

export function FeaturesIndexPage() {
  const itemList = featurePages.map((page) => ({ ...page, href: `/features/${page.slug}` }));

  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "Features", href: "/features" }]} />
      <ItemListStructuredData name="KASA LMS features" items={itemList} />
      <WebPageStructuredData
        name="KASA LMS Features for Online Academies and Coaching Institutes"
        description="Explore how KASA connects course selling, live classes, payments, assessments, learner dashboards, CRM, branding, and reporting."
        href="/features"
      />

      <main className="overflow-hidden bg-[#fbfdff] text-slate-950 dark:bg-[#061126] dark:text-white">
        <Hero />
        <JourneyRail />

        <section id="capability-map" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-[0.44fr_0.56fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary dark:text-emerald-300">Complete capability map</p>
                <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Ten capabilities. Four connected jobs.</h2>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                Start with the job your team needs to improve. Each feature page then explains the workflow, implementation details, limits, and connected modules in depth.
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              {featureGroups.map((group) => <FeatureGroup key={group.id} group={group} />)}
            </div>
          </div>
        </section>

        <ConnectedSystem />
        <RoleViews />
        <WorkflowShortcuts />
        <DecisionSection />
        <FinalCta />
      </main>
    </>
  );
}

function WorkflowShortcuts() {
  const shortcuts = [
    ["Plan course economics", "/tools/course-pricing-calculator", "Price, cost, margin, and enrolment assumptions.", CreditCard],
    ["Prepare admissions", "/tools/admission-form-generator", "Draft the information your counselling team needs.", ClipboardCheck],
    ["Build an assessment", "/tools/question-paper-generator", "Turn a topic and difficulty mix into a paper draft.", BookOpenCheck],
    ["Prototype completion proof", "/tools/certificate-generator", "Check certificate wording, identity, and issue fields.", FileBadge2],
  ] as const;

  return (
    <section className="border-y border-blue-950/8 bg-[#eef6fb] px-4 py-12 sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#0a1930]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300">Try the workflow before setup</p><h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">Four practical starting points.</h2></div><Link href="/resources/start-online-academy-india" className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-emerald-300">Read the academy launch guide <ArrowRight className="size-4" /></Link></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{shortcuts.map(([title, href, text, Icon]) => <Link key={href} href={href} className="group rounded-2xl border border-blue-950/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/35 dark:border-white/10 dark:bg-white/[.04]"><Icon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-base font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-emerald-300">Open free tool <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span></Link>)}</div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(43,168,255,.19),transparent_25rem),radial-gradient(circle_at_88%_32%,rgba(34,181,115,.15),transparent_24rem),linear-gradient(180deg,#f3f9ff_0%,#fbfdff_90%)] dark:bg-[radial-gradient(circle_at_12%_10%,rgba(69,145,255,.17),transparent_25rem),radial-gradient(circle_at_88%_32%,rgba(88,201,138,.11),transparent_24rem),linear-gradient(180deg,#08152c_0%,#061126_90%)]" />
      <div className="relative mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
          <span className="text-primary dark:text-emerald-300">Features</span>
        </nav>

        <div className="mt-6 grid gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white/80 px-3.5 py-1.5 text-[.68rem] font-semibold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7 dark:text-emerald-200">
              <Sparkles className="size-4" aria-hidden="true" /> One platform, complete academy operation
            </div>
            <h1 className="mt-5 font-heading text-[2.35rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.8rem] lg:text-[3.05rem]">
              Every academy workflow.
              <span className="block stat-gradient-text">One connected workspace.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
              Sell courses, run live batches, collect payments, assess learning, and support every role without rebuilding context across disconnected tools.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="#capability-map" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-5 text-sm font-semibold text-white shadow-xl shadow-blue-900/20 transition hover:-translate-y-0.5">
                Explore all capabilities <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <ProductTourTrigger label="See KASA in action" variant="outline" size="md" className="w-full justify-center bg-white/80 sm:w-auto dark:bg-white/5" />
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {["Recorded, live, and hybrid", "Role-based workspaces", "Branded learner journey"].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" />{item}</span>)}
            </div>
          </div>

          <ControlRoom />
        </div>
      </div>
    </section>
  );
}

function ControlRoom() {
  return (
    <div className="relative">
      <div className="absolute -inset-5 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.6rem] border border-blue-950/10 bg-[#071a37] p-2.5 text-white shadow-[0_28px_80px_-38px_rgba(8,42,96,.75)] dark:border-white/12 sm:p-3">
        <div className="rounded-[1.15rem] border border-white/10 bg-[#0c2245]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-white/10 font-heading text-xs font-semibold">K</span><span className="text-xs font-semibold">Academy command centre</span></div>
            <div className="hidden items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 sm:flex"><span className="size-2 rounded-full bg-emerald-300" />All systems connected</div>
          </div>
          <div className="grid md:grid-cols-[8rem_1fr]">
            <aside className="hidden border-r border-white/10 p-3 md:block">
              {["Overview", "Courses", "Live classes", "Learners", "Orders"].map((item, index) => <div key={item} className={index === 0 ? "rounded-lg bg-white/10 px-2.5 py-2 text-[.68rem] font-semibold text-white" : "px-2.5 py-2 text-[.68rem] font-medium text-slate-400"}>{item}</div>)}
            </aside>
            <div className="p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[.58rem] font-semibold uppercase tracking-[.18em] text-sky-200">Today across your academy</p><h2 className="mt-1.5 font-heading text-xl font-semibold">Every team sees the next action.</h2></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/8 px-2.5 py-1.5 text-[.65rem] font-semibold"><Search className="size-3" />Search records</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[["₹84k", "New orders", TrendingUp], ["312", "Learners", UsersRound], ["08", "Live today", Radio], ["27", "Certificates", FileBadge2]].map(([value, label, Icon]) => {
                  const StatIcon = Icon as typeof TrendingUp;
                  return <div key={String(label)} className="rounded-xl border border-white/10 bg-white/[.055] p-3"><StatIcon className="size-3.5 text-emerald-200" /><p className="mt-3 font-heading text-lg font-semibold">{String(value)}</p><p className="mt-0.5 text-[.62rem] text-slate-400">{String(label)}</p></div>;
                })}
              </div>
              <div className="mt-2 grid gap-2 lg:grid-cols-[1.25fr_.75fr]">
                <div className="rounded-xl border border-white/10 bg-white/[.04] p-3"><div className="flex items-center justify-between"><p className="text-[.68rem] font-semibold">Learner journey</p><span className="text-[.58rem] text-emerald-200">Live view</span></div><div className="mt-4 flex items-center">{["Visit", "Enrol", "Learn", "Complete"].map((item, index) => <div key={item} className="flex flex-1 items-center"><div><span className="grid size-6 place-items-center rounded-full bg-emerald-300 text-[.58rem] font-bold text-[#071a37]">{index + 1}</span><p className="mt-1.5 text-[.55rem] text-slate-300">{item}</p></div>{index < 3 ? <span className="mb-4 h-px flex-1 bg-emerald-300/35" /> : null}</div>)}</div></div>
                <div className="rounded-xl bg-[linear-gradient(135deg,#1a5b9e,#17836d)] p-3"><ShieldCheck className="size-4 text-emerald-100" /><p className="mt-3 text-xs font-semibold">Roles stay focused</p><p className="mt-1.5 text-[.65rem] leading-4 text-blue-100">Owner, admin, faculty, and learner see only relevant work.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyRail() {
  return (
    <section className="border-y border-blue-950/8 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#08152a]/90">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 lg:grid-cols-4">
        {featureGroups.map((group) => <Link key={group.id} href={`#${group.id}`} className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-blue-100 hover:bg-blue-50/70 dark:hover:border-white/10 dark:hover:bg-white/5"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/8 font-heading text-xs font-semibold text-primary dark:bg-white/8 dark:text-emerald-200">{group.number}</span><span className="min-w-0"><span className="block truncate text-[.67rem] font-semibold uppercase tracking-[.12em] text-slate-800 dark:text-slate-100">{group.eyebrow}</span><span className="mt-0.5 hidden text-[.62rem] text-slate-500 sm:block dark:text-slate-400">{group.features.length} capabilities</span></span><ArrowRight className="ml-auto hidden size-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary sm:block" /></Link>)}
      </div>
    </section>
  );
}

function FeatureGroup({ group }: { group: (typeof featureGroups)[number] }) {
  const themes = {
    blue: { shell: "border-blue-200/80 bg-[linear-gradient(135deg,#edf7ff,#ffffff_52%)] dark:border-blue-400/15 dark:bg-[linear-gradient(135deg,rgba(30,91,153,.22),rgba(255,255,255,.025))]", badge: "bg-blue-600 text-white", icon: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200" },
    navy: { shell: "border-slate-700 bg-[#0b203f] text-white", badge: "bg-emerald-300 text-[#071a37]", icon: "bg-white/8 text-emerald-200" },
    green: { shell: "border-emerald-200/80 bg-[linear-gradient(135deg,#edfbf5,#ffffff_52%)] dark:border-emerald-400/15 dark:bg-[linear-gradient(135deg,rgba(24,125,91,.2),rgba(255,255,255,.025))]", badge: "bg-emerald-600 text-white", icon: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200" },
    violet: { shell: "border-violet-200/80 bg-[linear-gradient(135deg,#f4f0ff,#ffffff_52%)] dark:border-violet-400/15 dark:bg-[linear-gradient(135deg,rgba(103,71,176,.2),rgba(255,255,255,.025))]", badge: "bg-violet-600 text-white", icon: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-200" },
  } as const;
  const theme = themes[group.accent];
  const dark = group.accent === "navy";
  return (
    <article id={group.id} className={`scroll-mt-28 overflow-hidden rounded-[1.5rem] border shadow-[0_18px_55px_-38px_rgba(15,45,90,.35)] ${theme.shell}`}>
      <div className="grid gap-5 p-5 lg:grid-cols-[.34fr_.66fr] lg:items-start lg:p-6">
        <div className="lg:pr-3">
          <div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-xl text-xs font-bold ${theme.badge}`}>{group.number}</span><p className={`text-[.67rem] font-semibold uppercase tracking-[.18em] ${dark ? "text-emerald-200" : "text-primary dark:text-emerald-300"}`}>{group.eyebrow}</p></div>
          <h3 className="mt-4 max-w-md font-heading text-xl font-semibold leading-snug sm:text-2xl">{group.title}</h3>
          <p className={`mt-3 max-w-md text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>{group.description}</p>
        </div>
        <div className={`grid gap-3 ${group.features.length > 2 ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        {group.features.map((feature) => {
          const Icon = feature.icon;
          return <Link key={feature.href} href={feature.href} className={`group relative rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl ${dark ? "border-white/10 bg-white/[.055] hover:bg-white/[.085]" : "border-white/80 bg-white/80 hover:border-primary/20 dark:border-white/10 dark:bg-white/[.04]"}`}><div className="flex items-center justify-between"><span className={`grid size-9 place-items-center rounded-xl ${theme.icon}`}><Icon className="size-4" /></span><ArrowRight className={`size-4 transition group-hover:translate-x-1 ${dark ? "text-slate-500 group-hover:text-emerald-200" : "text-slate-300 group-hover:text-primary"}`} /></div><h4 className="mt-4 font-heading text-base font-semibold">{feature.title}</h4><p className={`mt-2 text-xs leading-5 ${dark ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>{feature.text}</p><p className={`mt-4 text-[.65rem] font-semibold ${dark ? "text-emerald-200" : "text-primary dark:text-emerald-300"}`}>{feature.meta}</p></Link>;
        })}
        </div>
      </div>
    </article>
  );
}

function ConnectedSystem() {
  return (
    <section className="bg-[#071a37] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-200">Why connection matters</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">One learner action should update the whole academy.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">A payment creates an order, opens the correct access, updates the learner record, and becomes visible to the admin team.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">{["Less manual enrolment", "Fewer missing links", "Cleaner support context", "More reliable reports"].map((item) => <div key={item} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[.05] px-3.5 py-2.5 text-xs font-semibold"><Check className="size-3.5 text-emerald-300" />{item}</div>)}</div>
          </div>
          <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b2349]">
            <LazyVideo src="/feature-self-learning.mp4" poster="/academy-students-learning-card.webp" ariaLabel="KASA LMS product workflow preview" className="absolute inset-0 h-full w-full object-cover object-[76%_center] opacity-70" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,55,.2),rgba(7,26,55,.05)),linear-gradient(0deg,rgba(7,26,55,.9),transparent_55%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6"><div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[.68rem] font-semibold backdrop-blur"><Play className="size-3.5 fill-current" />Product workflow preview</div><h3 className="mt-3 max-w-2xl font-heading text-xl font-semibold">Signal, learner record, and next action—kept together.</h3></div>
          </div>
        </div>
        <div className="mt-6 grid gap-2 md:grid-cols-5">{[["01", "Visitor finds an offer"], ["02", "Payment creates an order"], ["03", "Access opens correctly"], ["04", "Learning begins"], ["05", "Progress reaches reports"]].map(([number, text], index) => <div key={number} className="relative rounded-xl border border-white/10 bg-white/[.045] p-3.5"><p className="text-[.65rem] font-semibold text-emerald-200">{number}</p><p className="mt-2 text-xs font-semibold">{text}</p>{index < 4 ? <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden size-3.5 -translate-y-1/2 text-emerald-300 md:block" /> : null}</div>)}</div>
      </div>
    </section>
  );
}

function RoleViews() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[.42fr_.58fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">One system, focused workspaces</p><h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Complete without feeling complicated.</h2></div><p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">KASA holds the complete academy record while every person gets a workspace shaped around their responsibility.</p></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((item, index) => { const Icon = item.icon; const tones = ["from-blue-50 to-white text-blue-700", "from-violet-50 to-white text-violet-700", "from-emerald-50 to-white text-emerald-700", "from-amber-50 to-white text-amber-700"]; return <div key={item.role} className={`group rounded-2xl border border-blue-950/8 bg-gradient-to-br p-5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:from-white/[.06] dark:to-white/[.025] ${tones[index]}`}><span className="grid size-10 place-items-center rounded-xl bg-white shadow-sm dark:bg-white/10"><Icon className="size-4.5" /></span><h3 className="mt-5 font-heading text-base font-semibold text-slate-950 dark:text-white">{item.role}</h3><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.sees}</p></div>; })}
        </div>
      </div>
    </section>
  );
}

function DecisionSection() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f3f8fd] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08152a]">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[.36fr_.64fr] lg:items-start">
        <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Choose by operational pain</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Where should you begin?</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Pick the manual workflow causing the most friction today.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["We need to sell under our own brand", "/features/course-selling-platform", "Start with commerce"],
            ["Our class links, batches, and replays are scattered", "/features/live-class-management", "Start with delivery"],
            ["Learners keep asking what to do next", "/features/learner-dashboard-progress", "Start with learner experience"],
            ["The admin team cannot see the complete operation", "/features/admin-dashboard-reporting", "Start with control"],
          ].map(([problem, href, label]) => <Link key={problem} href={href} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-blue-950/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg dark:border-white/10 dark:bg-white/[.035]"><div className="flex items-start justify-between gap-3"><p className="font-heading text-base font-semibold leading-snug">{problem}</p><span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-white"><ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></div><p className="mt-3 text-[.65rem] font-semibold uppercase tracking-[.14em] text-primary dark:text-emerald-300">{label}</p></Link>)}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[linear-gradient(120deg,#123b73_0%,#1b62a4_50%,#148269_100%)] px-6 py-9 text-white shadow-[0_28px_75px_-40px_rgba(18,59,115,.7)] sm:px-9 sm:py-11 lg:px-12">
        <div className="pointer-events-none absolute -right-24 -top-40 size-[28rem] rounded-full border-[4rem] border-white/[.07]" />
        <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><div className="inline-flex items-center gap-2 text-[.68rem] font-semibold uppercase tracking-[.18em] text-emerald-100"><MonitorPlay className="size-4" />Use your real academy workflow</div><h2 className="mt-4 max-w-3xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">See the features working with your course and batch.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base">Bring one course, one batch, and your current enrolment process. We will map the exact workflow before, during, and after delivery.</p></div>
          <ProductTourTrigger label="Map my academy workflow" variant="solid" size="md" className="features-final-cta w-full justify-center lg:w-auto" />
        </div>
      </div>
    </section>
  );
}
