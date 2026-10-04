"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  ChevronDown,
  GraduationCap,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { siteContainerClasses } from "@/components/site/site-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavChild = {
  label: string;
  href: string;
  description: string;
};

type NavItem =
  | {
      label: string;
      href: string;
      items: NavChild[];
    }
  | {
      label: string;
      href: string;
      items?: never;
    };

const primaryNav: NavItem[] = [
  {
    label: "Students",
    href: "/students",
    items: [
      {
        label: "Student hub",
        href: "/students",
        description: "Resume tools, ATS checker, project kit, interview Q&A, and study calculators.",
      },
      {
        label: "Resume builder",
        href: "/tools/resume-builder-studio",
        description: "Build an ATS-friendly student resume with templates and live editing.",
      },
      {
        label: "ATS checker",
        href: "/tools/resume-ats-checker",
        description: "Check resume score, keyword gaps, rejection risks, and next steps.",
      },
      {
        label: "Project kit",
        href: "/tools/final-year-project-kit-generator",
        description: "Generate final year project ideas, docs, viva questions, and starter kits.",
      },
      {
        label: "Career roadmap",
        href: "/tools/ai-career-roadmap",
        description: "Get a role-wise plan with skills, projects, weekly tasks, and interview prep.",
      },
      {
        label: "Interview questions",
        href: "/students/interview-questions",
        description: "Practice HR, technical, project, and CS fundamentals questions.",
      },
    ],
  },
  {
    label: "LMS",
    href: "/features",
    items: [
      {
        label: "Features",
        href: "/features",
        description: "Explore course selling, live classes, exams, certificates, CRM, and reports.",
      },
      {
        label: "Coaching institutes",
        href: "/solutions/coaching-institutes",
        description: "Run courses, batches, fees, students, and institute operations.",
      },
      {
        label: "Online academies",
        href: "/solutions/online-academies",
        description: "Launch a branded academy with recorded courses and live programs.",
      },
      {
        label: "Course selling",
        href: "/features/course-selling-platform",
        description: "Course pages, checkout, coupons, invoices, and access.",
      },
      {
        label: "Live classes",
        href: "/features/live-class-management",
        description: "Batches, calendars, replays, attendance, and reminders.",
      },
      {
        label: "Exams and certificates",
        href: "/features/exams-assignments-certificates",
        description: "Quizzes, assignments, results, and certificate rules.",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  {
    label: "Resources",
    href: "/resources",
    items: [
      {
        label: "Start online academy",
        href: "/resources/start-online-academy-india",
        description: "How to start an online academy in India with courses, payments, and certificates.",
      },
      {
        label: "Sell recorded courses",
        href: "/resources/sell-recorded-courses-online",
        description: "How to sell recorded courses online from your own branded platform.",
      },
      {
        label: "Run live online classes",
        href: "/resources/run-live-online-classes",
        description: "How to run live online classes with batches, replays, and student tracking.",
      },
      {
        label: "Academy growth guide",
        href: "/resources/lms-seo-for-academies",
        description: "How academies can bring more students through their own website.",
      },
      {
        label: "Course certificates",
        href: "/resources/course-certificates-best-practices",
        description: "Course certificate best practices for coaching institutes and trainers.",
      },
      {
        label: "Course pricing",
        href: "/resources/online-course-pricing-guide",
        description: "Online course pricing guide for trainers and coaching institutes.",
      },
    ],
  },
  {
    label: "Tools",
    href: "/tools",
    items: [
      {
        label: "ATS checker",
        href: "/tools/resume-ats-checker",
        description: "Upload a resume and get ATS score, missing skills, next steps, and PDF report.",
      },
      {
        label: "Free Resume Builder",
        href: "/tools/resume-builder-studio",
        description: "Create a free ATS-friendly resume online with templates, live editing, and PDF-ready export.",
      },
      {
        label: "Project kit",
        href: "/tools/final-year-project-kit-generator",
        description: "Generate project ideas, system plan, docs, viva questions, and starter ZIP.",
      },
      {
        label: "Career roadmap",
        href: "/tools/ai-career-roadmap",
        description: "Create a role-wise plan with skills, projects, weekly tasks, and interview prep.",
      },
      {
        label: "PDF tools",
        href: "/pdf-tools",
        description: "Merge, split, compress, convert, protect, and edit PDFs privately in your browser.",
      },
      {
        label: "All tools",
        href: "/tools",
        description: "Browse calculators, resume tools, project tools, and teacher generators.",
      },
    ],
  },
  {
    label: "Company",
    href: "/why-kasa",
    items: [
      {
        label: "Why KASA?",
        href: "/why-kasa",
        description: "See why academies choose KASA over scattered tools.",
      },
      {
        label: "About KASA",
        href: "/about",
        description: "Learn the product vision behind the academy platform.",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Talk to the KASA team about your academy rollout.",
      },
      {
        label: "Use cases",
        href: "/testimonials",
        description: "Explore practical KASA workflows for academy teams.",
      },
      {
        label: "FAQ",
        href: "/faq",
        description: "Get answers about setup, pricing, rollout, and support.",
      },
    ],
  },
];

const menuIcons = [BookOpenCheck, GraduationCap, Sparkles];

const menuCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  Students: {
    eyebrow: "Student launchpad",
    title: "Move from college work to career proof.",
    description: "Resume, projects, interview preparation and practical study tools in one place.",
  },
  LMS: {
    eyebrow: "KASA LMS",
    title: "One operating system for your academy.",
    description: "Sell courses, run live batches, manage learners and keep every team connected.",
  },
  Resources: {
    eyebrow: "Practical playbooks",
    title: "Build and grow an academy with fewer guesses.",
    description: "Detailed guides for setup, delivery, pricing, certificates and organic growth.",
  },
  Tools: {
    eyebrow: "Free utility desk",
    title: "Finish the task in front of you.",
    description: "AI generators, student planners, career tools and private browser-based PDF utilities.",
  },
  Company: {
    eyebrow: "Inside KASA",
    title: "Understand the product and the people behind it.",
    description: "Read our product thinking, use cases, answers and ways to reach the team.",
  },
};

type SiteHeaderUser = {
  name: string;
  email: string;
  image?: string;
} | null;

function hasChildren(item: NavItem): item is Extract<NavItem, { items: NavChild[] }> {
  return Array.isArray(item.items);
}

function initials(name: string, email: string) {
  const source = name || email || "KASA";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function HeaderUserMenu({ user, callbackUrl }: { user: SiteHeaderUser; callbackUrl: string }) {
  if (!user) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-blue-950/10 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm shadow-blue-950/8 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/8 dark:text-white dark:hover:text-emerald-200"
      >
        <LogIn className="size-4" aria-hidden="true" />
        Login
      </Link>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="grid size-11 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white p-1 text-slate-900 shadow-sm shadow-blue-950/8 transition hover:border-primary/30 dark:border-white/10 dark:bg-white/8 dark:text-white"
        aria-label="Open account menu"
      >
        <Avatar className="size-8">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback className="bg-blue-50 text-xs font-bold text-primary dark:bg-emerald-300 dark:text-slate-950">
            {initials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>
      </button>
      <div className="invisible absolute right-0 top-full z-20 w-64 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
        <div className="rounded-2xl border border-blue-950/10 bg-white p-3 shadow-2xl shadow-blue-950/14 dark:border-white/10 dark:bg-surface">
          <div className="flex items-center gap-3 border-b border-blue-950/10 pb-3 dark:border-white/10">
            <Avatar className="size-10">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback className="bg-blue-50 font-bold text-primary dark:bg-emerald-300 dark:text-slate-950">
                {initials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-300">{user.email}</p>
            </div>
          </div>
          <Link
            href="/students/interview-questions#ask"
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-primary dark:text-slate-200 dark:hover:bg-white/7"
          >
            <UserRound className="size-4" aria-hidden="true" />
            Ask a question
          </Link>
          <Link
            href={`/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            prefetch={false}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-white/7"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>("Students");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SiteHeaderUser>(null);
  const pathname = usePathname();
  const currentPath = pathname || "/";
  const isActive = (href: string) =>
    href === "/" ? currentPath === "/" : currentPath === href || currentPath.startsWith(href + "/");

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const session = response.ok ? await response.json() : null;

      if (!session?.user?.id) {
        setUser(null);
        return;
      }

      setUser({
        name: session.user.name || "KASA member",
        email: session.user.email || "",
        image: session.user.image || "",
      });
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshSession();
    });
  }, [pathname, refreshSession]);

  useEffect(() => {
    window.addEventListener("focus", refreshSession);
    window.addEventListener("pageshow", refreshSession);

    return () => {
      window.removeEventListener("focus", refreshSession);
      window.removeEventListener("pageshow", refreshSession);
    };
  }, [refreshSession]);

  if (
    pathname?.startsWith("/cwk") ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup")
  ) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-emerald-950/10 bg-white/88 shadow-[0_12px_38px_-28px_rgba(20,90,80,0.42)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1918]/92">
      <div
        className={[
          "site-topbar overflow-hidden border-b border-white/10 text-[0.62rem] font-semibold transition-all duration-300 sm:text-xs",
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-9 py-1 opacity-100 sm:max-h-12 sm:py-1.5",
        ].join(" ")}
      >
        <div className={siteContainerClasses({ className: "flex items-center justify-center gap-2 sm:justify-between sm:gap-4" })}>
          <ProductTourTrigger
            label="See KASA in action"
            variant="ghost"
            size="sm"
            className="site-topbar-pill h-auto max-w-full rounded-full px-2.5 py-1 text-[0.62rem] sm:px-3 sm:py-1.5 sm:text-xs"
          />

          <div className="hidden items-center gap-4 sm:flex">
            <span className="site-topbar-soft-pill hidden rounded-full px-3 py-1.5 lg:inline-flex">
              Built for institutes, trainers, and EdTech teams
            </span>
            <a
              href="mailto:getkasalms@gmail.com"
              className="hidden cursor-pointer items-center gap-2 text-[var(--topbar-foreground)] transition hover:opacity-75 lg:inline-flex"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              getkasalms@gmail.com
            </a>
          </div>
        </div>
      </div>

      <header
        className={siteContainerClasses({
          className:
            "flex h-16 items-center justify-between sm:h-[4.75rem]",
        })}
      >
        <Link
          href="/"
          className="relative block h-8 w-[7.8rem] overflow-hidden sm:h-11 sm:w-[9.8rem]"
          aria-label="KASA home"
        >
          <Image
            src="/kasa-logo-light.png"
            alt="KASA"
            width={760}
            height={260}
            priority
            sizes="(min-width: 640px) 9.8rem, 7.8rem"
            className="h-full w-full object-contain object-left dark:hidden"
          />
          <Image
            src="/kasa-logo-dark.png"
            alt="KASA"
            width={760}
            height={260}
            sizes="(min-width: 640px) 9.8rem, 7.8rem"
            className="hidden h-full w-full object-contain object-left dark:block"
          />
        </Link>

        <nav className="hidden h-full items-center gap-1 xl:flex">
          {primaryNav.map((item) =>
            hasChildren(item) ? (
              <div key={item.label} className="group relative flex h-full items-center">
                <Link
                  href={item.href}
                  className={[
                    "relative inline-flex h-10 cursor-pointer items-center gap-1 px-3 text-sm font-semibold transition hover:text-[#188f83] dark:font-medium dark:text-white/78 dark:hover:text-emerald-200",
                    isActive(item.href)
                      ? "text-[#188f83] after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-[#39a98a] dark:text-emerald-200"
                      : "text-slate-900",
                  ].join(" ")}
                >
                  {item.label === "Tools" ? <Sparkles className="size-3.5 animate-pulse text-primary dark:text-emerald-200" aria-hidden="true" /> : null}
                  {item.label}
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </Link>
                <div
                  className={[
                    "invisible absolute top-full w-[min(48rem,calc(100vw-2rem))] translate-y-2 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                    item.label === "Students" || item.label === "LMS"
                      ? "left-0"
                      : item.label === "Company"
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2",
                  ].join(" ")}
                >
                  <div className="overflow-hidden rounded-b-[1.5rem] border border-t-0 border-[#173d36]/10 bg-[#fbfdfb] shadow-[0_28px_80px_rgba(17,58,50,0.2)] dark:border-white/10 dark:border-t-0 dark:bg-[#10211e] dark:shadow-black/35">
                    <div className="grid md:grid-cols-[0.78fr_1.22fr]">
                      <Link href={item.href} className="group/featured relative overflow-hidden bg-[#153f37] p-6 text-white dark:bg-[#17332d]">
                        <div className="pointer-events-none absolute -bottom-14 -right-12 size-44 rounded-full border border-[#7ce0bf]/16" />
                        <div className="pointer-events-none absolute -bottom-8 -right-6 size-28 rounded-full border border-[#7ce0bf]/18" />
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#7ce0bf]">{menuCopy[item.label].eyebrow}</p>
                        <h2 className="mt-3 max-w-xs font-heading text-2xl font-semibold leading-[1.08]">{menuCopy[item.label].title}</h2>
                        <p className="mt-3 max-w-xs text-sm leading-6 text-white/62">{menuCopy[item.label].description}</p>
                        <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#8be7c7]">Explore {item.label}<ArrowRight className="size-4 transition group-hover/featured:translate-x-1" /></span>
                      </Link>
                      <div className="grid grid-cols-2 content-start p-2">
                      {item.items.map((child, index) => {
                        const Icon = menuIcons[index % menuIcons.length];
                        return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex min-h-[6.4rem] cursor-pointer gap-3 rounded-xl p-3.5 transition hover:bg-[#edf8f3] dark:hover:bg-white/7"
                        >
                          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[#e3f5ed] text-[#188f83] transition group-hover/item:-rotate-3 group-hover/item:bg-[#188f83] group-hover/item:text-white dark:bg-emerald-300/10 dark:text-emerald-200">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#17342e] dark:text-white">
                              {child.label}
                            </div>
                            <div className="mt-1 line-clamp-2 text-xs leading-5 text-[#687d76] dark:text-muted">
                              {child.description}
                            </div>
                          </div>
                        </Link>
                        );
                      })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#173d36]/10 bg-white/70 px-5 py-3 text-xs dark:border-white/10 dark:bg-white/[0.025]">
                      <span className="font-medium text-[#728780] dark:text-slate-400">Choose a destination or start from the {item.label.toLowerCase()} overview.</span>
                      <Link href={item.href} className="inline-flex items-center gap-1.5 font-bold text-[#177e70] dark:text-emerald-200">View all <ArrowRight className="size-3.5" /></Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "relative inline-flex h-10 cursor-pointer items-center gap-1.5 px-4 text-sm font-semibold transition hover:text-[#188f83] dark:font-medium dark:text-white/78 dark:hover:text-emerald-200",
                  isActive(item.href)
                    ? "text-[#188f83] after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-[#39a98a] dark:text-emerald-200"
                    : "text-slate-900",
                ].join(" ")}
              >
                {item.label === "Tools" ? <Sparkles className="size-3.5 animate-pulse text-primary dark:text-emerald-200" aria-hidden="true" /> : null}
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ProductTourTrigger className="h-11 rounded-full !border-emerald-900/15 !bg-white !text-[#176b68] px-5 shadow-sm hover:!bg-[#eefbf6] dark:!border-white/15 dark:!bg-white/6 dark:!text-white" />
          <HeaderUserMenu user={user} callbackUrl={currentPath} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-900 shadow-sm shadow-blue-950/8 dark:border-white/10 dark:bg-white/8 dark:text-white dark:shadow-none xl:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] bg-[#071713]/55 backdrop-blur-sm xl:hidden" onClick={() => setOpen(false)}>
          <aside
            className="ml-auto flex h-dvh w-[min(25rem,94vw)] flex-col border-l border-[#173d36]/10 bg-[#f8fcf9] shadow-2xl shadow-black/25 dark:border-white/10 dark:bg-[#10211e]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative shrink-0 overflow-hidden bg-[#153f37] px-5 pb-5 pt-4 text-white dark:bg-[#17332d]">
              <div className="pointer-events-none absolute -right-12 -top-14 size-40 rounded-full border border-[#7ce0bf]/15" />
              <div className="flex items-center justify-between">
                <Image src="/kasa-logo-dark.png" alt="KASA" width={180} height={62} className="h-9 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/8 text-white"
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </button>
              </div>
              <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#7ce0bf]">Explore KASA</p>
              <h2 className="mt-1 font-heading text-xl font-semibold">Where do you want to go next?</h2>
              <p className="mt-1 text-xs leading-5 text-white/55">Product, student tools, practical guides and company pages.</p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
              <nav className="divide-y divide-[#173d36]/9 overflow-hidden rounded-2xl border border-[#173d36]/10 bg-white dark:divide-white/8 dark:border-white/10 dark:bg-white/[0.025]">
                {primaryNav.map((item) => hasChildren(item) ? (
                  <div key={item.label}>
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <Link href={item.href} onClick={() => setOpen(false)} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-bold text-[#1d3d36] dark:text-white">
                        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${mobileSection === item.label ? "bg-[#177e70] text-white" : "bg-[#e6f6ef] text-[#177e70] dark:bg-emerald-300/10 dark:text-emerald-200"}`}>
                          {item.label === "Tools" ? <Sparkles className="size-4" /> : item.label.slice(0, 1)}
                        </span>
                        {item.label}
                      </Link>
                      <button type="button" onClick={() => setMobileSection((current) => current === item.label ? null : item.label)} className="grid size-10 shrink-0 place-items-center rounded-xl text-[#60776f] hover:bg-[#edf7f2] dark:text-slate-300 dark:hover:bg-white/7" aria-label={`Toggle ${item.label} menu`} aria-expanded={mobileSection === item.label}>
                        <ChevronDown className={`size-4 transition ${mobileSection === item.label ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {mobileSection === item.label ? (
                      <div className="mx-3 mb-3 overflow-hidden rounded-xl bg-[#f1f8f4] dark:bg-white/[0.045]">
                        {item.items.map((child, index) => (
                          <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="group/mobile flex gap-3 border-b border-[#173d36]/8 px-3 py-3 last:border-b-0 dark:border-white/8">
                            <span className="mt-0.5 text-[0.65rem] font-bold text-[#1a9a7f]">0{index + 1}</span>
                            <span className="min-w-0"><span className="block text-xs font-bold text-[#27473f] dark:text-white">{child.label}</span><span className="mt-0.5 line-clamp-2 block text-[0.7rem] leading-5 text-[#748780] dark:text-slate-400">{child.description}</span></span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-3.5 text-sm font-bold text-[#1d3d36] dark:text-white"><span>{item.label}</span><ArrowRight className="size-4 text-[#789089]" /></Link>
                ))}
              </nav>
            </div>

            <div className="shrink-0 border-t border-[#173d36]/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <ProductTourTrigger className="w-full justify-center" />
                <HeaderUserMenu user={user} callbackUrl={currentPath} />
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
