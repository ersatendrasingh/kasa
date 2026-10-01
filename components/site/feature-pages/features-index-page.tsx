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

      <main className="overflow-hidden bg-white text-slate-950 dark:bg-[#061126] dark:text-white">
        <Hero />
        <JourneyRail />

        <section id="capability-map" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-[108rem]">
            <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary dark:text-emerald-300">Complete capability map</p>
                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-5xl">Ten capabilities. Four connected jobs.</h2>
              </div>
              <p className="max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Start with the job your team needs to improve. Each feature page then explains the workflow, implementation details, limits, and connected modules in depth.
              </p>
            </div>

            <div className="mt-12 grid gap-8 xl:grid-cols-2">
              {featureGroups.map((group) => <FeatureGroup key={group.id} group={group} />)}
            </div>
          </div>
        </section>

        <ConnectedSystem />
        <RoleViews />
        <DecisionSection />
        <FinalCta />
      </main>
    </>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(43,168,255,.17),transparent_30rem),radial-gradient(circle_at_88%_30%,rgba(34,181,115,.12),transparent_30rem),linear-gradient(180deg,#f6fbff_0%,#fff_88%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(69,145,255,.16),transparent_30rem),radial-gradient(circle_at_88%_30%,rgba(88,201,138,.1),transparent_30rem),linear-gradient(180deg,#08152c_0%,#061126_88%)]" />
      <div className="relative mx-auto max-w-[108rem]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
          <span className="text-primary dark:text-emerald-300">Features</span>
        </nav>

        <div className="mt-8 grid gap-12 xl:grid-cols-[0.88fr_1.12fr] xl:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/7 dark:text-emerald-200">
              <Sparkles className="size-4" aria-hidden="true" /> One platform, complete academy operation
            </div>
            <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.04] tracking-tight sm:text-6xl xl:text-[4.8rem]">
              Every feature should move the
              <span className="block stat-gradient-text">learner journey forward.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
              KASA connects discovery, payment, teaching, progress, and academy operations—so a learner never feels the gaps between your tools and your team never rebuilds the same context twice.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#capability-map" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[image:var(--button-solid)] px-7 text-base font-semibold text-white shadow-xl shadow-blue-900/20 transition hover:-translate-y-0.5">
                Explore all capabilities <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <ProductTourTrigger label="See KASA in action" variant="outline" size="lg" className="w-full justify-center bg-white/80 sm:w-auto dark:bg-white/5" />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
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
      <div className="absolute -inset-8 rounded-full bg-blue-300/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-950/10 bg-[#071a37] p-3 text-white shadow-[0_35px_100px_-40px_rgba(8,42,96,.65)] dark:border-white/12 sm:p-4">
        <div className="rounded-[1.4rem] border border-white/10 bg-[#0c2245]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-white/10 font-heading text-sm font-semibold">K</span><span className="text-sm font-semibold">Academy command centre</span></div>
            <div className="hidden items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 sm:flex"><span className="size-2 rounded-full bg-emerald-300" />All systems connected</div>
          </div>
          <div className="grid md:grid-cols-[10rem_1fr]">
            <aside className="hidden border-r border-white/10 p-4 md:block">
              {["Overview", "Courses", "Live classes", "Learners", "Orders", "Reports"].map((item, index) => <div key={item} className={index === 0 ? "rounded-xl bg-white/10 px-3 py-2.5 text-xs font-semibold text-white" : "px-3 py-2.5 text-xs font-medium text-slate-400"}>{item}</div>)}
            </aside>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-sky-200">Today across your academy</p><h2 className="mt-2 font-heading text-2xl font-semibold">The next action is already visible.</h2></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-xs font-semibold"><Search className="size-3.5" />Search records</span></div>
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[["₹84k", "New orders", TrendingUp], ["312", "Active learners", UsersRound], ["08", "Live today", Radio], ["27", "Certificates", FileBadge2]].map(([value, label, Icon]) => {
                  const StatIcon = Icon as typeof TrendingUp;
                  return <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[.055] p-4"><StatIcon className="size-4 text-emerald-200" /><p className="mt-5 font-heading text-2xl font-semibold">{String(value)}</p><p className="mt-1 text-[.7rem] text-slate-400">{String(label)}</p></div>;
                })}
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold">Learner journey</p><span className="text-[.65rem] text-emerald-200">Live view</span></div><div className="mt-6 flex items-center">{["Visit", "Enrol", "Learn", "Complete"].map((item, index) => <div key={item} className="flex flex-1 items-center"><div><span className="grid size-7 place-items-center rounded-full bg-emerald-300 text-[.65rem] font-bold text-[#071a37]">{index + 1}</span><p className="mt-2 text-[.62rem] text-slate-300">{item}</p></div>{index < 3 ? <span className="mb-5 h-px flex-1 bg-emerald-300/35" /> : null}</div>)}</div></div>
                <div className="rounded-2xl bg-[linear-gradient(135deg,#1a5b9e,#17836d)] p-4"><ShieldCheck className="size-5 text-emerald-100" /><p className="mt-5 text-sm font-semibold">Roles stay focused</p><p className="mt-2 text-xs leading-5 text-blue-100">Owner, admin, faculty, and learner each see the work that belongs to them.</p></div>
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
    <section className="border-y border-blue-950/8 bg-[#f6f9fd] px-4 py-8 sm:px-6 lg:px-8 dark:border-white/8 dark:bg-[#08152a]">
      <div className="mx-auto grid max-w-[108rem] gap-3 md:grid-cols-4">
        {featureGroups.map((group) => <Link key={group.id} href={`#${group.id}`} className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white hover:shadow-lg dark:hover:bg-white/5"><span className="font-heading text-2xl font-semibold text-primary/25 dark:text-white/15">{group.number}</span><span><span className="block text-xs font-semibold uppercase tracking-[.16em] text-primary dark:text-emerald-300">{group.eyebrow}</span><span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{group.features.length} connected capabilities</span></span><ArrowRight className="ml-auto size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" /></Link>)}
      </div>
    </section>
  );
}

function FeatureGroup({ group }: { group: (typeof featureGroups)[number] }) {
  const isWide = group.features.length > 2;
  return (
    <article id={group.id} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-blue-950/10 bg-white shadow-xl shadow-blue-950/5 dark:border-white/10 dark:bg-white/[.035]">
      <div className={group.accent === "navy" ? "bg-[#0c2245] p-7 text-white sm:p-9" : group.accent === "green" ? "bg-[linear-gradient(135deg,#e9faf2,#f8fcff)] p-7 dark:bg-[linear-gradient(135deg,rgba(31,139,100,.2),rgba(69,145,255,.08))] sm:p-9" : group.accent === "violet" ? "bg-[linear-gradient(135deg,#f3efff,#f8fbff)] p-7 dark:bg-[linear-gradient(135deg,rgba(111,79,190,.2),rgba(69,145,255,.08))] sm:p-9" : "bg-[linear-gradient(135deg,#edf7ff,#f9fcff)] p-7 dark:bg-[linear-gradient(135deg,rgba(69,145,255,.2),rgba(255,255,255,.03))] sm:p-9"}>
        <div className="flex items-start justify-between gap-5"><div><p className={group.accent === "navy" ? "text-xs font-semibold uppercase tracking-[.2em] text-emerald-200" : "text-xs font-semibold uppercase tracking-[.2em] text-primary dark:text-emerald-300"}>{group.eyebrow}</p><h3 className="mt-4 max-w-2xl font-heading text-2xl font-semibold leading-tight sm:text-3xl">{group.title}</h3><p className={group.accent === "navy" ? "mt-4 max-w-2xl text-sm leading-7 text-slate-300" : "mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300"}>{group.description}</p></div><span className={group.accent === "navy" ? "font-heading text-5xl font-semibold text-white/10" : "font-heading text-5xl font-semibold text-primary/10 dark:text-white/10"}>{group.number}</span></div>
      </div>
      <div className={isWide ? "grid md:grid-cols-2" : "grid"}>
        {group.features.map((feature, index) => {
          const Icon = feature.icon;
          return <Link key={feature.href} href={feature.href} className={["group relative flex min-h-56 flex-col p-6 transition hover:bg-blue-50/65 dark:hover:bg-white/[.045] sm:p-7", index > 0 ? "border-t border-blue-950/8 dark:border-white/8" : "", isWide && index % 2 ? "md:border-l" : "", isWide && index === 1 ? "md:border-t-0" : ""].join(" ")}><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-primary/8 text-primary dark:bg-white/8 dark:text-emerald-200"><Icon className="size-5" /></span><ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" /></div><h4 className="mt-6 font-heading text-xl font-semibold">{feature.title}</h4><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p><p className="mt-auto pt-5 text-xs font-semibold text-primary dark:text-emerald-300">{feature.meta}</p></Link>;
        })}
      </div>
    </article>
  );
}

function ConnectedSystem() {
  return (
    <section className="bg-[#071a37] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[108rem]">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-emerald-200">Why connection matters</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-5xl">One learner action should update the whole academy.</h2>
            <p className="mt-6 text-base leading-8 text-slate-300">A payment is not the end of checkout. It creates an order, opens the correct access, updates the learner record, and becomes visible to the admin team.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{["Less manual enrolment", "Fewer missing links", "Cleaner support context", "More reliable reports"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.05] px-4 py-3 text-sm font-semibold"><Check className="size-4 text-emerald-300" />{item}</div>)}</div>
          </div>
          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b2349]">
            <LazyVideo src="/feature-self-learning.mp4" poster="/academy-students-learning-card.webp" ariaLabel="KASA LMS product workflow preview" className="absolute inset-0 h-full w-full object-cover object-[76%_center] opacity-70" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,55,.2),rgba(7,26,55,.05)),linear-gradient(0deg,rgba(7,26,55,.9),transparent_55%)]" />
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8"><div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold backdrop-blur"><Play className="size-4 fill-current" />Product workflow preview</div><h3 className="mt-4 max-w-2xl font-heading text-2xl font-semibold">See how a connected dashboard keeps the signal, record, and next action together.</h3></div>
          </div>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-5">{[["01", "Visitor finds an offer"], ["02", "Payment creates an order"], ["03", "Access opens correctly"], ["04", "Learning activity begins"], ["05", "Progress reaches reports"]].map(([number, text], index) => <div key={number} className="relative rounded-2xl border border-white/10 bg-white/[.045] p-5"><p className="text-xs font-semibold text-emerald-200">{number}</p><p className="mt-4 text-sm font-semibold">{text}</p>{index < 4 ? <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-emerald-300 md:block" /> : null}</div>)}</div>
      </div>
    </section>
  );
}

function RoleViews() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[108rem]">
        <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">One system, focused workspaces</p><h2 className="mt-4 font-heading text-3xl font-semibold sm:text-5xl">Complete does not have to mean complicated.</h2><p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">KASA can hold the complete academy record while each person sees a workspace shaped around their responsibility.</p></div>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-blue-950/10 dark:border-white/10">
          {roles.map((item, index) => { const Icon = item.icon; return <div key={item.role} className={["grid gap-5 bg-white p-6 transition hover:bg-blue-50/60 dark:bg-white/[.025] dark:hover:bg-white/[.05] sm:grid-cols-[4rem_.32fr_.68fr] sm:items-center sm:p-7", index ? "border-t border-blue-950/10 dark:border-white/10" : ""].join(" ")}><span className="grid size-12 place-items-center rounded-2xl bg-primary/8 text-primary dark:bg-white/8 dark:text-emerald-200"><Icon className="size-5" /></span><h3 className="font-heading text-xl font-semibold">{item.role}</h3><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item.sees}</p></div>; })}
        </div>
      </div>
    </section>
  );
}

function DecisionSection() {
  return (
    <section className="border-y border-blue-950/8 bg-[#f6f9fd] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 dark:border-white/8 dark:bg-[#08152a]">
      <div className="mx-auto grid max-w-[108rem] gap-10 lg:grid-cols-[.42fr_.58fr] lg:items-start">
        <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Choose by operational pain</p><h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-5xl">Not sure where to begin?</h2><p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">Open the path closest to the work your team is doing manually today.</p></div>
        <div className="grid gap-3">
          {[
            ["We need to sell under our own brand", "/features/course-selling-platform", "Start with commerce"],
            ["Our class links, batches, and replays are scattered", "/features/live-class-management", "Start with delivery"],
            ["Learners keep asking what to do next", "/features/learner-dashboard-progress", "Start with learner experience"],
            ["The admin team cannot see the complete operation", "/features/admin-dashboard-reporting", "Start with control"],
          ].map(([problem, href, label]) => <Link key={problem} href={href} className="group grid gap-3 rounded-2xl border border-blue-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg dark:border-white/10 dark:bg-white/[.035] sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-heading text-lg font-semibold">{problem}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[.16em] text-primary dark:text-emerald-300">{label}</p></div><span className="grid size-10 place-items-center rounded-full bg-primary text-white"><ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span></Link>)}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-[108rem] overflow-hidden rounded-[2.5rem] bg-[linear-gradient(120deg,#123b73_0%,#1b62a4_50%,#148269_100%)] px-6 py-12 text-white shadow-[0_35px_90px_-40px_rgba(18,59,115,.65)] sm:px-10 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute -right-24 -top-40 size-[28rem] rounded-full border-[4rem] border-white/[.07]" />
        <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-100"><MonitorPlay className="size-4" />Use your real academy workflow</div><h2 className="mt-5 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">Do not sit through a generic feature tour.</h2><p className="mt-5 max-w-3xl text-base leading-8 text-blue-100">Bring one course, one batch, and your current enrolment process. We can map the exact KASA features your team would use before, during, and after delivery.</p></div>
          <ProductTourTrigger label="Map my academy workflow" variant="solid" size="lg" className="features-final-cta w-full justify-center lg:w-auto" />
        </div>
      </div>
    </section>
  );
}
