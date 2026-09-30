"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SiteHeaderUser>(null);
  const pathname = usePathname();
  const currentPath = pathname || "/";

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
    <div className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--header-border)] bg-[var(--header-background)] shadow-[0_16px_54px_rgba(22,71,163,0.09)] backdrop-blur-xl dark:shadow-none">
      <div
        className={[
          "site-topbar overflow-hidden border-b border-white/15 text-[0.62rem] font-semibold transition-all duration-300 dark:border-white/10 sm:text-xs",
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-9 py-1 opacity-100 sm:max-h-14 sm:py-1.5",
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
            <span className="site-topbar-soft-pill hidden rounded-full px-3 py-1.5 opacity-95 lg:inline-flex">
              Built for institutes, trainers, and EdTech teams
            </span>
            <a
              href="mailto:getkasalms@gmail.com"
              className="hidden cursor-pointer items-center gap-2 text-[var(--topbar-foreground)] transition hover:opacity-80 lg:inline-flex"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              getkasalms@gmail.com
            </a>
          </div>
        </div>
      </div>

      <header className={siteContainerClasses({ className: "flex h-16 items-center justify-between sm:h-[4.9rem]" })}>
        <Link
          href="/"
          className="relative block h-8 w-[8rem] overflow-hidden sm:h-12 sm:w-[10.6rem]"
          aria-label="KASA home"
        >
          <Image
            src="/kasa-logo-light.png"
            alt="KASA"
            width={760}
            height={260}
            priority
            sizes="(min-width: 640px) 10.6rem, 8rem"
            className="h-full w-full object-contain object-left dark:hidden"
          />
          <Image
            src="/kasa-logo-dark.png"
            alt="KASA"
            width={760}
            height={260}
            sizes="(min-width: 640px) 10.6rem, 8rem"
            className="hidden h-full w-full object-contain object-left dark:block"
          />
        </Link>

        <nav className="hidden h-full items-center gap-1 xl:flex">
          {primaryNav.map((item) =>
            hasChildren(item) ? (
              <div key={item.label} className="group relative flex h-full items-center">
                <Link
                  href={item.href}
                  className="inline-flex h-10 cursor-pointer items-center gap-1 px-3 text-sm font-semibold text-slate-900 transition hover:text-primary dark:font-medium dark:text-white/78 dark:hover:text-white"
                >
                  {item.label === "Tools" ? <Sparkles className="size-3.5 animate-pulse text-primary dark:text-emerald-200" aria-hidden="true" /> : null}
                  {item.label}
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </Link>
                <div
                  className={[
                    "invisible absolute top-full w-[min(42rem,calc(100vw-2rem))] opacity-0 transition group-hover:visible group-hover:opacity-100",
                    item.label === "Students" || item.label === "LMS"
                      ? "left-0"
                      : item.label === "Company"
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2",
                  ].join(" ")}
                >
                  <div className="overflow-hidden rounded-b-[1.6rem] border border-blue-950/10 bg-white shadow-2xl shadow-blue-950/12 dark:border-white/10 dark:bg-surface dark:shadow-black/30">
                    <div className="site-topbar border-b border-white/15 px-6 py-3 text-center">
                      <p className="font-heading text-sm font-semibold text-[var(--topbar-foreground)]">
                        {item.label === "Students"
                            ? "College resources and career tools"
                          : item.label === "LMS"
                            ? "KASA LMS for academies and trainers"
                            : item.label === "Resources"
                              ? "Guides for academy growth"
                              : item.label === "Tools"
                                ? "Popular tools for students and teachers"
                              : "Company pages"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-0 divide-x divide-dashed divide-sky-200 dark:divide-white/10">
                      {item.items.map((child, index) => {
                        const Icon = menuIcons[index % menuIcons.length];
                        return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex min-h-28 cursor-pointer gap-4 px-8 py-6 transition hover:bg-blue-50/80 dark:hover:bg-white/7"
                        >
                          <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-primary transition group-hover/item:bg-primary group-hover/item:text-white dark:bg-primary/12 dark:text-primary">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="text-base font-semibold text-slate-950 dark:text-white">
                              {child.label}
                            </div>
                            <div className="mt-1 max-w-[17rem] text-sm leading-6 text-slate-500 dark:text-muted">
                              {child.description}
                            </div>
                          </div>
                        </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-10 cursor-pointer items-center gap-1.5 px-4 text-sm font-semibold text-slate-900 transition hover:text-primary dark:font-medium dark:text-white/78 dark:hover:text-white"
              >
                {item.label === "Tools" ? <Sparkles className="size-3.5 animate-pulse text-primary dark:text-emerald-200" aria-hidden="true" /> : null}
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ProductTourTrigger className="h-11 px-5" />
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
        <div className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-sm xl:hidden" onClick={() => setOpen(false)}>
          <aside
            className="ml-auto flex h-dvh w-[min(22rem,88vw)] flex-col border-l border-blue-950/10 bg-white p-4 shadow-2xl shadow-blue-950/20 dark:border-white/10 dark:bg-surface"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-blue-950/10 pb-4 dark:border-white/10">
              <div>
                <div className="font-heading text-lg font-semibold text-slate-950 dark:text-white">
                  KASA Menu
                </div>
                <div className="text-xs text-slate-500 dark:text-muted">
                  Explore product, pricing, resources, and company pages.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-blue-50 text-slate-950 dark:border-white/10 dark:bg-white/8 dark:text-white"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <nav className="space-y-2">
                {primaryNav.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-blue-950/10 bg-blue-50/60 p-1.5 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white dark:text-white dark:hover:bg-white/7"
                    >
                      <span className="inline-flex items-center gap-2">
                        {item.label === "Tools" ? <Sparkles className="size-4 animate-pulse text-primary dark:text-emerald-200" aria-hidden="true" /> : null}
                        {item.label}
                      </span>
                      {hasChildren(item) ? <ChevronDown className="size-3.5" /> : null}
                    </Link>
                    {hasChildren(item) ? (
                      <div className="mt-1 space-y-1 border-t border-blue-950/8 px-2 pt-2 dark:border-white/10">
                        {(item.label === "Tools" ? item.items : item.items.slice(0, 4)).map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-muted dark:hover:bg-white/7 dark:hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>
            </div>

            <div className="mt-4 shrink-0 space-y-3 border-t border-blue-950/10 pt-4 dark:border-white/10">
              <HeaderUserMenu user={user} callbackUrl={currentPath} />
              <ProductTourTrigger className="w-full justify-center" />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
