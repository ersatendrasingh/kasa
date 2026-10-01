"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Code2,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { FaApple, FaAws, FaDocker, FaGoogle } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import {
  SiBigbluebutton,
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiRazorpay,
  SiResend,
  SiWebauthn,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { siteContainerClasses } from "@/components/site/site-container";

type InfraIcon = LucideIcon | IconType;

type InfraTab = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  headline: string;
  body: string;
  metrics: Array<{ value: string; label: string }>;
  services: Array<{
    title: string;
    body: string;
    icon: InfraIcon;
    icons?: InfraIcon[];
    tone: string;
  }>;
  stack: string[];
};

const infraTabs: InfraTab[] = [
  {
    id: "platform",
    title: "1-Click Installation",
    subtitle: "Domain configure karo, LMS live",
    icon: Code2,
    headline: "Just configure your domain and start running your academy.",
    body: "KASA LMS is packaged as a production-ready software stack: Next.js 16 client, NestJS backend, Docker-managed services, environment setup, domain mapping, SSL, and branded academy configuration. Institute ko custom build ka wait nahi karna padta.",
    metrics: [
      { value: "1-click", label: "Install flow" },
      { value: "Domain", label: "Brand setup" },
      { value: "Docker", label: "Managed stack" },
    ],
    services: [
      {
        title: "Next.js 16 client",
        body: "Learner dashboard, admin workspace, course storefront, and public pages run on a modern App Router frontend.",
        icon: SiNextdotjs,
        tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200",
      },
      {
        title: "NestJS backend",
        body: "Courses, users, orders, batches, certificates, CRM, notifications, and admin APIs stay in one structured backend.",
        icon: SiNestjs,
        tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
      },
      {
        title: "Docker-managed deployment",
        body: "Services are containerized for repeatable setup, cleaner updates, and predictable server maintenance.",
        icon: FaDocker,
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      },
      {
        title: "Branded domain launch",
        body: "Connect your academy domain, configure logo/theme/payment/email keys, and start onboarding learners.",
        icon: Globe2,
        tone: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200",
      },
    ],
    stack: ["Next.js 16", "NestJS", "Docker", "SSL", "Custom domain", "Production env"],
  },
  {
    id: "cloud",
    title: "Cloud & Data Layer",
    subtitle: "EC2, RDS, S3, PostgreSQL",
    icon: Cloud,
    headline: "AWS-backed infrastructure for media-heavy LMS operations.",
    body: "The software is hosted on AWS EC2, database runs on Amazon RDS with PostgreSQL, media is stored in S3, and the whole stack is designed for course videos, downloadable resources, certificates, learner records, and institute-scale traffic.",
    metrics: [
      { value: "EC2", label: "App hosting" },
      { value: "RDS", label: "Managed DB" },
      { value: "S3", label: "Course media" },
    ],
    services: [
      {
        title: "AWS EC2 hosting",
        body: "Frontend, backend, worker services, and Docker workloads run on a controlled cloud server environment.",
        icon: FaAws,
        tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200",
      },
      {
        title: "Amazon S3 media storage",
        body: "Course videos, thumbnails, PDFs, assignments, resources, and certificate assets are stored outside the app server.",
        icon: FaAws,
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      },
      {
        title: "RDS PostgreSQL",
        body: "Learners, courses, batches, orders, payments, progress, roles, and reports live in a managed PostgreSQL database.",
        icon: SiPostgresql,
        tone: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200",
      },
      {
        title: "Backup-ready operations",
        body: "Database backups, Docker rollouts, asset separation, and server-level monitoring keep academy operations stable.",
        icon: FaDocker,
        tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
      },
    ],
    stack: ["AWS EC2", "Amazon RDS", "PostgreSQL", "Amazon S3", "Docker", "Backups"],
  },
  {
    id: "data",
    title: "Learning Engine",
    subtitle: "BBB, VAPID, Resend, media",
    icon: Video,
    headline: "Live classes, notifications, and email workflows work as one system.",
    body: "KASA LMS brings self-paced courses, BigBlueButton live classes, replay workflows, push notifications, transactional emails, and learner progress together so institutes can teach live, recorded, and hybrid programs without juggling tools.",
    metrics: [
      { value: "BBB", label: "Live classes" },
      { value: "VAPID", label: "Push alerts" },
      { value: "Resend", label: "Email engine" },
    ],
    services: [
      {
        title: "BigBlueButton classes",
        body: "Run live classes, faculty sessions, doubt classes, recordings, attendance, and replay access from the LMS flow.",
        icon: SiBigbluebutton,
        tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200",
      },
      {
        title: "VAPID push notifications",
        body: "Send browser push alerts for live sessions, assignments, reminders, certificates, and important academy updates.",
        icon: SiWebauthn,
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      },
      {
        title: "Resend email delivery",
        body: "Transactional emails, login messages, purchase confirmations, reminders, and learner communication are sent through Resend.",
        icon: SiResend,
        tone: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200",
      },
      {
        title: "Course progress engine",
        body: "Lessons, modules, resources, assignments, exams, certificates, and completion rules stay attached to each learner.",
        icon: Workflow,
        tone: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
      },
    ],
    stack: ["BigBlueButton", "VAPID push", "Resend", "S3 media", "Progress tracking", "Certificates"],
  },
  {
    id: "security",
    title: "Auth & Payments",
    subtitle: "Google, Meta, Apple, Razorpay",
    icon: ShieldCheck,
    headline: "Login, roles, payments, and access control are built into the core.",
    body: "Learners can sign in with social accounts, academies can collect payments through Razorpay, and admin teams can control who gets access to courses, batches, certificates, invoices, and dashboards.",
    metrics: [
      { value: "OAuth", label: "Social login" },
      { value: "Razorpay", label: "Payments" },
      { value: "RBAC", label: "Role control" },
    ],
    services: [
      {
        title: "Google, Meta and Apple login",
        body: "Reduce signup friction with social login options while keeping learner identity tied to one academy account.",
        icon: FaGoogle,
        icons: [FaGoogle, FaMeta, FaApple],
        tone: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200",
      },
      {
        title: "Razorpay gateway",
        body: "Sell courses, live batches, bundles, subscriptions, and institute programs with online payment collection.",
        icon: SiRazorpay,
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      },
      {
        title: "Role and access control",
        body: "Admins, faculty, learners, counsellors, and teams get the right permissions for their workspace.",
        icon: LockKeyhole,
        tone: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
      },
      {
        title: "Secure course unlock",
        body: "Payment, coupon, enrolment, batch, and plan rules decide which course content a learner can access.",
        icon: ShieldCheck,
        tone: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200",
      },
    ],
    stack: ["Google login", "Meta login", "Apple login", "Razorpay", "RBAC", "Access rules"],
  },
];

export function InfrastructureSection() {
  const [activeId, setActiveId] = useState(infraTabs[0].id);
  const activeTab = infraTabs.find((tab) => tab.id === activeId) ?? infraTabs[0];
  const ActiveIcon = activeTab.icon;

  return (
    <section className="relative overflow-visible bg-[linear-gradient(135deg,#f2f8ff_0%,#ffffff_46%,#effbf5_100%)] py-16 text-foreground sm:py-20 lg:overflow-hidden lg:py-24 dark:bg-[linear-gradient(135deg,#071126_0%,#0b1833_52%,#0a2927_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_16%,rgba(43,168,255,0.16),transparent_28rem),radial-gradient(circle_at_90%_10%,rgba(34,181,115,0.14),transparent_30rem)] dark:bg-[radial-gradient(circle_at_14%_20%,rgba(69,145,255,0.16),transparent_32rem),radial-gradient(circle_at_86%_14%,rgba(88,201,138,0.12),transparent_34rem)]" />
      <div className={siteContainerClasses({ className: "relative z-10" })}>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-lg shadow-blue-950/8 dark:bg-white/8 dark:text-emerald-200">
            <Cloud className="size-4" aria-hidden="true" />
            Infrastructure
          </span>
          <h2 className="mt-5 max-w-4xl font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
            Launch a full LMS on a{" "}
            <span className="stat-gradient-text animate-[gradient-shift_4s_ease-in-out_infinite]">
              production-ready stack
            </span>{" "}
            without custom development delays.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
            KASA LMS comes with the app, backend, database, cloud hosting, media,
            live classes, email, notifications, social login, and payments already
            wired. Configure your domain, connect keys, and start working.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-6">
          <div className="sticky top-[4.25rem] z-40 -mx-4 flex gap-2 overflow-x-auto border-y border-blue-950/10 bg-white/92 px-4 py-3 shadow-lg shadow-blue-950/6 backdrop-blur-xl dark:border-white/10 dark:bg-surface/92 sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:grid lg:gap-3 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
            {infraTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={[
                    "infrastructure-tab group flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-left shadow-sm transition duration-200 lg:w-full lg:gap-4 lg:rounded-[1.25rem] lg:p-4",
                    isActive
                      ? "border-primary/60 bg-white shadow-xl shadow-blue-950/8 dark:border-primary/50 dark:bg-white/10"
                      : "border-blue-950/10 bg-white/65 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/8",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "infrastructure-tab-icon grid size-9 shrink-0 place-items-center rounded-full transition lg:size-12 lg:rounded-2xl",
                      isActive
                        ? "bg-[image:var(--button-solid)] !text-white"
                        : "bg-primary/8 text-primary group-hover:bg-primary group-hover:![color:#fff] dark:bg-white/8 dark:text-emerald-200",
                    ].join(" ")}
                  >
                    <Icon className="size-4 lg:size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 lg:flex-1">
                    <span className="block whitespace-nowrap font-heading text-xs font-semibold text-slate-950 dark:text-white lg:text-base lg:whitespace-normal">
                      {tab.title}
                    </span>
                    <span className="mt-1 hidden text-xs leading-5 text-slate-500 dark:text-slate-300 lg:block">
                      {tab.subtitle}
                    </span>
                  </span>
                  <ArrowRight
                    className={[
                      "hidden size-4 shrink-0 transition lg:block",
                      isActive ? "text-primary" : "text-slate-300 group-hover:text-primary",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-blue-950/10 bg-white/95 p-3 shadow-2xl shadow-blue-950/10 dark:border-white/10 dark:bg-surface/95 sm:p-5 lg:rounded-[2rem]">
            <div className="rounded-[1.25rem] border border-blue-950/10 bg-[linear-gradient(135deg,#f8fcff,#f4fbf7)] p-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(69,145,255,0.12),rgba(88,201,138,0.09))] sm:p-5 lg:rounded-[1.55rem]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[image:var(--button-solid)] !text-white shadow-lg shadow-blue-950/12 sm:size-12">
                      <ActiveIcon className="size-5 sm:size-6" aria-hidden="true" />
                    </span>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200 sm:text-xs sm:tracking-[0.18em]">
                      {activeTab.title}
                    </p>
                  </div>
                  <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight text-slate-950 sm:mt-5 sm:text-3xl dark:text-white">
                    {activeTab.headline}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {activeTab.body}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 lg:min-w-[15rem] lg:grid-cols-1">
                  {activeTab.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="min-w-0 rounded-2xl border border-blue-950/10 bg-white/82 p-2 text-center shadow-sm dark:border-white/10 dark:bg-white/8 sm:p-3"
                    >
                      <div className="stat-gradient-text break-words font-heading text-lg font-semibold leading-tight sm:text-xl">
                        {metric.value}
                      </div>
                      <div className="mt-1 text-[0.58rem] font-semibold uppercase leading-4 tracking-[0.08em] text-slate-500 dark:text-slate-300 sm:text-[0.68rem] sm:tracking-[0.12em]">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {activeTab.services.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.title}
                    className={`rounded-[1.4rem] border p-5 shadow-sm transition hover:-translate-y-1 ${service.tone}`}
                  >
                    <span className="flex size-12 items-center justify-center gap-1 rounded-2xl bg-white/88 shadow-sm dark:bg-white/10">
                      {service.icons ? (
                        service.icons.map((BrandIcon, index) => (
                          <BrandIcon
                            key={index}
                            className="size-4"
                            aria-hidden="true"
                          />
                        ))
                      ) : (
                        <Icon className="size-6" aria-hidden="true" />
                      )}
                    </span>
                    <h4 className="mt-4 font-heading text-lg font-semibold text-slate-950 dark:text-white">
                      {service.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {service.body}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-blue-950/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                Stack included
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeTab.stack.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/8 dark:text-white"
                  >
                    <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
