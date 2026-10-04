import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Archive,
  Blocks,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Database,
  FileArchive,
  FileText,
  FolderTree,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Presentation,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UsersRound,
} from "lucide-react";
import { JsonLd } from "@/components/site/structured-data";
import { siteContainerClasses } from "@/components/site/site-container";
import { FinalYearProjectKitGenerator } from "@/components/tools/final-year-project-kit-generator";
import { ToolBreadcrumb } from "@/components/tools/tool-hero-extras";

export const metadata: Metadata = {
  title: "AI Final Year Project Kit Generator | Ideas, Source Code, Report & Viva",
  description:
    "Generate your final year project kit in 2 minutes. Get BTech, BCA, MCA project ideas, source code starter, synopsis, report, documentation, viva questions, resume bullets and ZIP.",
  keywords: [
    "final year project generator",
    "AI final year project kit generator",
    "final year project ideas",
    "final year project with source code",
    "final year project source code",
    "final year project report",
    "final year project documentation",
    "final year project synopsis",
    "final year project abstract",
    "final year project viva questions",
    "BTech final year project ideas",
    "BTech CSE final year project",
    "BTech CSE project with source code",
    "BCA final year project with documentation",
    "BCA project ideas with source code",
    "MCA final year project ideas",
    "MCA project with documentation",
    "computer science final year project",
    "CSE final year project ideas",
    "mini project source code",
    "mini project ideas for CSE",
    "major project ideas for CSE",
    "major project report generator",
    "project synopsis generator",
    "project report generator",
    "project documentation generator",
    "AI project generator for students",
    "project viva questions",
    "project zip download",
    "computer science project ideas",
    "AI ML final year project ideas",
    "data science final year project",
    "IoT final year project ideas",
    "cybersecurity final year project",
    "React project for final year",
    "Python project for students",
    "Java project for final year",
    "MERN stack project ideas",
  ],
  alternates: { canonical: "/tools/final-year-project-kit-generator" },
  openGraph: {
    title: "AI Final Year Project Kit Generator",
    description: "Generate final year project ideas, source-code starter, synopsis, report, documentation, viva questions, resume bullets, and ZIP.",
    url: "/tools/final-year-project-kit-generator",
    type: "website",
  },
};

const pageUrl = "https://www.getkasa.in/tools/final-year-project-kit-generator";

const projectFaqs = [
  {
    question: "What is an AI Final Year Project Kit Generator?",
    answer:
      "It is a student tool that generates final year project ideas, abstract, problem statement, features, architecture, folder structure, database schema, API plan, documentation, viva questions, resume bullets, and a starter ZIP.",
  },
  {
    question: "Can I generate a final year project in 2 minutes?",
    answer:
      "Yes. Choose your course, project type, tech stack, domain, difficulty, team size, and time left. The tool creates a structured project kit quickly.",
  },
  {
    question: "Can I get final year project ideas with source code?",
    answer:
      "The tool creates a source-code starter structure, setup guide, folder plan, API plan, and implementation roadmap. It is designed to help students start coding instead of searching random ZIP files.",
  },
  {
    question: "Does the ZIP include complete source code?",
    answer:
      "The current ZIP includes a reliable starter kit with documentation, source-code structure, setup guide, environment sample, and implementation plan. Full production code can be built from the generated plan.",
  },
  {
    question: "Can I generate BTech CSE final year project ideas?",
    answer:
      "Yes. It supports BTech CSE projects across MERN, React, Next.js, Python, Java, AI/ML, data science, IoT, cybersecurity, and other domains.",
  },
  {
    question: "Can BCA students use this project generator?",
    answer:
      "Yes. BCA students can generate final year projects, mini projects, major projects, documentation, viva questions, and resume-ready project bullets.",
  },
  {
    question: "Can MCA students generate project documentation?",
    answer:
      "Yes. MCA students can generate project synopsis, abstract, system architecture, modules, database schema, API design, future scope, and viva preparation.",
  },
  {
    question: "Can I create a project synopsis?",
    answer:
      "Yes. The generated kit includes abstract, problem statement, objectives, features, architecture, scope, and implementation plan that can be used to write a synopsis.",
  },
  {
    question: "Can I create a final year project report?",
    answer:
      "Yes. The kit gives the building blocks for a report: abstract, problem statement, objectives, modules, database schema, API plan, setup steps, future scope, and documentation files.",
  },
  {
    question: "Does it generate viva questions?",
    answer:
      "Yes. The project kit includes viva questions with answers so students can prepare for project explanation, architecture, database, APIs, and future scope.",
  },
  {
    question: "Which tech stacks are supported?",
    answer:
      "Supported stacks include MERN, React + Firebase, Next.js + Supabase, Python Django, Flask, Java Spring Boot, Laravel, Flutter, Android Kotlin, AI/ML Python, data science, IoT, and cybersecurity.",
  },
  {
    question: "Can I generate AI/ML final year project ideas?",
    answer:
      "Yes. Choose AI/ML Python or Data Science to generate projects with dataset ideas, model workflow, features, architecture, and viva points.",
  },
  {
    question: "Can I generate MERN stack final year projects?",
    answer:
      "Yes. Choose MERN Stack to generate MongoDB, Express, React, Node.js project ideas with APIs, folder structure, database schema, and implementation plan.",
  },
  {
    question: "Can I generate Java Spring Boot project ideas?",
    answer:
      "Yes. Choose Java Spring Boot for backend-heavy projects with modules, REST APIs, database schema, admin/user roles, and setup steps.",
  },
  {
    question: "Can I generate Python project ideas for students?",
    answer:
      "Yes. Python Django, Flask, AI/ML Python, and Data Science stacks are supported for student projects, dashboards, prediction systems, and automation tools.",
  },
  {
    question: "Can this help with resume and placement?",
    answer:
      "Yes. The tool generates resume bullets, project explanation points, and portfolio-friendly wording. You can also check your resume with the AI Resume ATS Checker.",
  },
  {
    question: "Can I use this for mini projects?",
    answer:
      "Yes. Select Mini Project and choose an easier difficulty or shorter time left. The tool will keep the idea simpler and more practical.",
  },
  {
    question: "Can I use this for major projects?",
    answer:
      "Yes. Select Major Project or Final Year Project and choose Balanced, Impressive, or Advanced difficulty for a deeper project plan.",
  },
  {
    question: "Is this project generator free?",
    answer:
      "Yes. KASA's AI Final Year Project Kit Generator is free to use for students who need ideas, documentation, viva prep, and starter project structure.",
  },
  {
    question: "How should I choose a final year project topic?",
    answer:
      "Choose a topic that matches your skill level, available time, team size, faculty expectations, and placement goals. A project you can explain clearly is better than a complex idea you cannot complete.",
  },
];

const useCases = [
  {
    title: "For BTech CSE Students",
    description: "Generate major project ideas, architecture, database schema, APIs, documentation, and viva prep for CSE final year.",
    icon: GraduationCap,
  },
  {
    title: "For BCA & MCA Students",
    description: "Create practical project kits for web apps, management systems, dashboards, AI tools, and portfolio-ready software.",
    icon: BookOpenCheck,
  },
  {
    title: "For Mini Projects",
    description: "Get simple project ideas with source-code structure, modules, setup steps, and easy explanation points.",
    icon: Blocks,
  },
  {
    title: "For Major Projects",
    description: "Plan impressive final year projects with abstract, problem statement, system design, future scope, and report content.",
    icon: Rocket,
  },
  {
    title: "For Viva & Placement",
    description: "Prepare viva answers, resume bullets, project explanation, and interview-friendly talking points.",
    icon: Presentation,
  },
];

const stackExamples = [
  {
    title: "MERN Stack Final Year Project",
    focus: "React, Node.js, Express, MongoDB",
    points: [
      "Generate user/admin modules, REST APIs, MongoDB schema, and folder structure.",
      "Best for LMS, e-commerce, task manager, HR, finance, and dashboard projects.",
      "Good for students who want a placement-friendly full-stack project.",
    ],
  },
  {
    title: "AI/ML Final Year Project",
    focus: "Python, model workflow, dataset, prediction",
    points: [
      "Generate problem statement, dataset idea, ML workflow, model features, and evaluation plan.",
      "Best for healthcare, agriculture, education, finance, and recommendation systems.",
      "Useful for viva because model choice and future scope can be explained clearly.",
    ],
  },
  {
    title: "Java Spring Boot Project",
    focus: "REST APIs, database, backend modules",
    points: [
      "Generate entity design, API endpoints, service modules, and setup steps.",
      "Best for library, hospital, banking, attendance, billing, and management systems.",
      "Strong option for students targeting backend developer roles.",
    ],
  },
  {
    title: "Python Django Project",
    focus: "Admin panel, database models, web app",
    points: [
      "Generate models, views, templates, user roles, and database schema.",
      "Best for student portals, inventory systems, LMS, appointment systems, and CRM projects.",
      "Practical for BCA, MCA, and diploma students with limited time.",
    ],
  },
  {
    title: "IoT + Web Dashboard Project",
    focus: "Sensor data, dashboard, alerts",
    points: [
      "Generate device flow, data collection plan, dashboard screens, and database schema.",
      "Best for smart agriculture, smart city, health monitoring, and energy projects.",
      "Good for teams that want hardware plus software presentation impact.",
    ],
  },
  {
    title: "Cybersecurity Project",
    focus: "Security tool, scanner, detection, report",
    points: [
      "Generate project scope, modules, test cases, risk explanation, and report structure.",
      "Best for phishing detection, vulnerability scanner, password audit, and network security tools.",
      "Useful when you need a project that sounds strong in viva and interviews.",
    ],
  },
];

const deliverables = [
  { title: "Project Idea", text: "Title, tagline, domain, difficulty fit, and project direction.", icon: Lightbulb },
  { title: "Synopsis", text: "Abstract, problem statement, objectives, modules, and future scope.", icon: FileText },
  { title: "Architecture", text: "System flow, components, screens, APIs, and database planning.", icon: FolderTree },
  { title: "Code Starter", text: "Folder structure, setup guide, environment sample, and ZIP download.", icon: Code2 },
  { title: "Database Schema", text: "Tables or collections, relationships, fields, and data planning.", icon: Database },
  { title: "Viva Prep", text: "Viva questions, answers, resume bullets, and presentation points.", icon: ListChecks },
];

export default function FinalYearProjectKitGeneratorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#softwareapplication`,
      name: "AI Final Year Project Kit Generator",
      alternateName: ["Final Year Project Generator", "Final Year Project Ideas Generator", "Project Synopsis Generator", "Project Report Generator"],
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description:
        "Free AI final year project kit generator for students to create BTech, BCA, MCA, CSE project ideas, source-code starter, synopsis, report, documentation, viva questions, resume bullets, and downloadable ZIP.",
      publisher: {
        "@type": "Organization",
        name: "KASA",
        url: "https://www.getkasa.in",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${pageUrl}#howto`,
      name: "How to generate a final year project kit",
      description: "Generate final year project ideas, source-code starter, documentation, viva questions, resume bullets, and ZIP in minutes.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          name: "Choose course and project type",
          text: "Select BTech CSE, BCA, MCA, diploma, mini project, major project, internship project, or portfolio project.",
        },
        {
          "@type": "HowToStep",
          name: "Select stack and domain",
          text: "Choose MERN, React, Next.js, Python, Java, AI/ML, data science, IoT, cybersecurity, or another stack and domain.",
        },
        {
          "@type": "HowToStep",
          name: "Set difficulty and time left",
          text: "Add difficulty, team size, time left, and goal so the project kit matches your actual deadline and skill level.",
        },
        {
          "@type": "HowToStep",
          name: "Generate and download",
          text: "Generate the project kit, review documentation, viva questions, architecture, and download the starter ZIP.",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: projectFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#fbfdf9] text-[#122c28] dark:bg-surface-strong dark:text-white">
      <JsonLd data={jsonLd} />
      <section className="relative border-b border-white/10 bg-[#153f37] pb-12 pt-[8.75rem] text-white dark:bg-[#0b1c19] sm:pt-[9.5rem] lg:pt-[10rem]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_25%,rgba(112,223,188,0.17),transparent_28rem),radial-gradient(circle_at_4%_90%,rgba(255,182,136,0.12),transparent_24rem)]" />
        <div className={siteContainerClasses({ className: "relative" })}>
          <div className="[&_nav]:!mt-0 [&_nav]:!text-white/42 [&_nav_a:hover]:!text-[#8ce8c8] [&_nav_span]:!text-white/70">
            <ToolBreadcrumb current="AI Final Year Project Kit Generator" />
          </div>
          <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#77dfbd]/25 bg-[#77dfbd]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#8ce8c8]">
              <Sparkles className="size-3.5 animate-pulse" aria-hidden="true" />
              AI project lab · free for students
            </div>
            <h1 className="mt-5 max-w-3xl font-heading text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4rem]">
              Go from project idea to a build you can defend.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
              Generate a practical final year project kit with problem statement, architecture, database schema, APIs, documentation, viva preparation, resume bullets and a downloadable source-code starter.
            </p>
            <Link href="#project-lab" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#7ce0bf] px-6 text-sm font-bold text-[#123c33] shadow-[0_16px_38px_rgba(75,200,158,0.18)] transition hover:-translate-y-0.5 hover:bg-[#91e8cc]">Open project lab <ArrowRight className="size-4" /></Link>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/65">
              {["BTech, BCA, MCA & diploma", "Mini and major projects", "Starter ZIP + documentation"].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#7ce0bf]" />{item}</span>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[48rem]">
            <div className="overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#0f2e28] shadow-[0_30px_85px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#ff9a77]" /><span className="size-2.5 rounded-full bg-[#ffd37c]" /><span className="size-2.5 rounded-full bg-[#70d8b4]" /></div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/45">project-kit / ready</p>
              </div>
              <div className="grid sm:grid-cols-[0.8fr_1.2fr]">
                <div className="border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#7ce0bf]">Project brief</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">Smart Campus Issue Tracker</h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">MERN · Education · 2-member team · 1 month</p>
                  <div className="mt-5 grid gap-2">
                    {[['01', 'Problem & objectives'], ['02', 'System architecture'], ['03', 'Database & APIs'], ['04', 'Build & test plan']].map(([number, label]) => (
                      <div key={number} className="flex items-center gap-3 rounded-lg bg-white/[0.045] px-3 py-2.5"><span className="text-xs font-bold text-[#7ce0bf]">{number}</span><span className="text-xs font-semibold text-white/72">{label}</span></div>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#ffba91]">Submission bundle</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { icon: FileText, title: 'Synopsis', meta: 'Abstract + scope' },
                      { icon: Database, title: 'Schema', meta: 'Tables + relations' },
                      { icon: Code2, title: 'Code starter', meta: 'Files + setup' },
                      { icon: Presentation, title: 'Viva prep', meta: 'Q&A + demo flow' },
                    ].map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.055] p-3"><Icon className="size-4 text-[#7ce0bf]" /><h3 className="mt-3 text-sm font-bold">{item.title}</h3><p className="mt-1 text-[0.7rem] text-white/45">{item.meta}</p></div>; })}
                  </div>
                  <div className="mt-3 rounded-xl border border-[#7ce0bf]/20 bg-[#7ce0bf]/10 p-3"><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#a2efd5]">Downloadable ZIP</span><Archive className="size-4 text-[#7ce0bf]" /></div><p className="mt-1 text-[0.7rem] text-white/48">README, docs, source structure and environment sample.</p></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden -rotate-2 rounded-2xl bg-[#ffcfac] px-4 py-3 text-[#4d2c20] shadow-xl sm:block"><p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#8b4e2d]">Built to explain</p><p className="mt-1 text-sm font-bold">Not a random ZIP to submit blindly.</p></div>
          </div>
          </div>
        </div>
      </section>

      <div id="project-lab"><FinalYearProjectKitGenerator /></div>

      <FinalYearProjectSeoContent />

      <section className="bg-[#153f37] py-14 text-white dark:bg-[#0b1c19] sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7ce0bf]">Final year project FAQ</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-[1.08] sm:text-[2.6rem]">Questions students ask before choosing, building and presenting a project.</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/65">These answers cover BTech CSE, BCA, MCA, mini projects, major projects, source-code starters, documentation, project reports and viva preparation.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["BTech CSE", "BCA & MCA", "MERN", "Python", "AI/ML", "Java"].map((keyword) => <span key={keyword} className="rounded-full border border-white/12 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold text-white/70">{keyword}</span>)}
              </div>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {projectFaqs.map((faq, index) => (
                <details key={faq.question} className="group py-4 open:pb-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                    <span className="flex gap-4"><span className="mt-0.5 text-xs font-bold text-[#7ce0bf]">{String(index + 1).padStart(2, "0")}</span><span className="text-base font-bold leading-6 text-white/90">{faq.question}</span></span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/15 text-[#7ce0bf] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="ml-10 mt-3 max-w-3xl text-sm leading-7 text-white/62">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf4] py-14 dark:bg-surface sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c66a42] dark:text-[#ffb791]">Continue the student workflow</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-[1.1] text-[#193832] dark:text-white">Turn the completed project into marks, proof and placement value.</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#687b74] dark:text-slate-300">After you generate the kit, plan the deadline, build the modules, test the project, prepare your presentation and add only your real contribution to the resume.</p>
            </div>
            <div className="grid overflow-hidden rounded-[1.25rem] border border-[#5a3f2c]/15 sm:grid-cols-2 dark:border-white/10">
              {[
                { href: "/tools/assignment-deadline-planner", label: "Plan the submission deadline", text: "Break documentation, coding, testing and presentation work into daily tasks." },
                { href: "/tools/study-timetable-generator", label: "Create a project timetable", text: "Fit project work around classes, exams and other college commitments." },
                { href: "/tools/ai-career-roadmap", label: "Connect it to a career roadmap", text: "Choose projects that prove the skills required by your target role." },
                { href: "/tools/resume-builder-studio", label: "Add the project to your resume", text: "Convert real features, stack and outcomes into honest resume bullets." },
                { href: "/tools/resume-ats-checker", label: "Check project keywords", text: "Compare your resume with the target job and find missing technical proof." },
                { href: "/students/interview-questions", label: "Practice project interviews", text: "Prepare to explain architecture, trade-offs, testing and your contribution." },
              ].map((item, index) => (
                <Link key={item.href} href={item.href} className="group border-[#5a3f2c]/15 bg-white/55 p-5 transition hover:bg-white sm:even:border-l sm:[&:nth-child(n+3)]:border-t dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold text-[#c66a42] dark:text-[#ffb791]">0{index + 1}</span><ArrowRight className="size-4 text-[#9a7560] transition group-hover:translate-x-1" /></div>
                  <h3 className="mt-3 text-base font-bold text-[#2d443d] dark:text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b7b75] dark:text-slate-300">{item.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FinalYearProjectSeoContent() {
  return (
    <section className="relative bg-white py-14 dark:bg-surface sm:py-16">
      <div className={siteContainerClasses()}>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#177e70] dark:text-emerald-200">
              How AI Final Year Project Kit Generator Works
            </p>
            <h2 className="mt-3 max-w-4xl font-heading text-3xl font-semibold leading-[1.1] text-[#193832] sm:text-[2.55rem] dark:text-white">
              A final year project needs more than an idea. It needs a finishable system and a clear explanation.
            </h2>
            <div className="mt-6 max-w-4xl space-y-4 border-l border-[#177e70]/25 pl-5 text-sm leading-7 text-[#5e746d] dark:text-slate-300 sm:text-base">
              <p>
                KASA&apos;s AI Final Year Project Kit Generator helps students move from confusion to a complete project direction in minutes. Choose your course, project type, tech stack, domain, difficulty, time left, team size, and goal. The generator then prepares a practical kit with a project title, abstract, problem statement, objectives, features, architecture, folder structure, database schema, API endpoints, screen plan, setup steps, documentation outline, viva questions, resume bullets, and future scope.
              </p>
              <p>
                The best output depends on your constraint. A student with one week left needs a smaller build with clear modules, screenshots, and a strong explanation. A team with six weeks can choose deeper architecture, authentication, dashboards, APIs, testing, and deployment. The page is designed around those real decisions: selecting an idea, planning implementation, preparing documentation, getting ready for viva, and turning the project into placement value.
              </p>
              <p>
                A good final year project should be practical, explainable, and finishable. Many students choose a topic that sounds advanced but becomes difficult to complete before submission. This project kit generator balances ambition with time left. If you have only a few days, generate an easy mini project with clear modules. If you have one or two months, choose a major project with better architecture, database design, authentication, dashboard screens, APIs, and future scope. For placement, choose a stack that matches your resume goal and then use the generated resume bullets in the{" "}
                <Link href="/tools/resume-ats-checker" className="font-semibold text-[#177e70] hover:underline dark:text-emerald-200">
                  AI Resume ATS Checker
                </Link>
                .
              </p>
              <p>
                Use the generated kit as a roadmap, not as blind copy-paste material. Read the abstract, understand the problem statement, build the modules step by step, and prepare the viva answers in your own words. If your faculty asks for documentation, expand the generated synopsis into chapters such as introduction, literature survey, proposed system, requirements, system design, implementation, testing, results, conclusion, and future scope. To manage your deadline, combine this page with the{" "}
                <Link href="/tools/study-timetable-generator" className="font-semibold text-[#177e70] hover:underline dark:text-emerald-200">
                  Study Timetable Generator
                </Link>
                {" "}and{" "}
                <Link href="/tools/assignment-deadline-planner" className="font-semibold text-[#177e70] hover:underline dark:text-emerald-200">
                  Assignment Deadline Planner
                </Link>
                .
              </p>
            </div>
          </div>

          <aside className="rounded-[1.25rem] bg-[#153f37] p-5 text-white shadow-[0_22px_55px_rgba(21,63,55,0.18)] dark:bg-[#102721]">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#7ce0bf]/12 text-[#7ce0bf]">
              <Lightbulb className="size-5 !text-white [stroke:white]" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold">
              Project kit includes
            </h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-white/72">
              {["Project idea", "Synopsis and report plan", "Architecture", "Source-code structure", "Viva questions", "Resume bullets"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#7ce0bf]" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-12 border-y border-[#173d36]/10 py-8 dark:border-white/10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#177e70] dark:text-emerald-200">
            Use Cases
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-[#193832] dark:text-white">
            Final year project generator for every student deadline
          </h2>
          <div className="mt-7 grid md:grid-cols-2 xl:grid-cols-5">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;

              return (
                <div key={useCase.title} className="border-b border-r border-[#173d36]/10 p-4 transition hover:bg-[#f4faf6] dark:border-white/10 dark:hover:bg-white/[0.04]">
                  <Icon className="size-5 text-[#177e70] dark:text-emerald-200" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-[#24463e] dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657a74] dark:text-slate-300">
                    {useCase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 rounded-[1.4rem] bg-[#edf8f3] p-5 dark:bg-white/[0.035] sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#177e70] dark:text-emerald-200">
            Project Deliverables
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-[#193832] dark:text-white">
            Everything students need for project submission and viva
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deliverables.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[1rem] border border-[#173d36]/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                  <Icon className="size-5 text-[#177e70] dark:text-emerald-200" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-[#24463e] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#657a74] dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-blue-950/10 bg-white/82 p-5 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-surface/88 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                Project Examples
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
                Popular final year project ideas by stack
              </h2>
            </div>
            <Link href="/tools/ai-resume-builder" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline dark:text-emerald-200">
              Add project to resume
              <FileText className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {stackExamples.map((example) => (
              <div key={example.title} className="rounded-[1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <h3 className="font-heading text-lg font-semibold text-slate-950 dark:text-white">
                  {example.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-primary dark:text-emerald-200">
                  {example.focus}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {example.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary dark:text-emerald-200" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-blue-950/10 bg-white/82 p-5 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-surface/88 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
            Choosing Guide
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
            Pick a project scope that matches your deadline
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Mini project",
                bestFor: "Few days left, solo work, or first working prototype",
                includes: "One clear problem, 3-5 modules, simple database, screenshots, and easy viva flow.",
              },
              {
                title: "Major project",
                bestFor: "Four to eight weeks, team submission, or stronger portfolio value",
                includes: "Authentication, role-based dashboard, APIs, testing notes, deployment plan, and report chapters.",
              },
              {
                title: "Advanced build",
                bestFor: "Placement-focused students who can explain architecture confidently",
                includes: "ML model, IoT data, analytics, security layer, integrations, or performance decisions where relevant.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <h3 className="font-heading text-lg font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-primary dark:text-emerald-200">
                  {item.bestFor}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.includes}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { href: "/tools/resume-ats-checker", label: "AI Resume ATS Checker", icon: Search },
            { href: "/tools/ai-resume-builder", label: "AI Resume Builder", icon: FileText },
            { href: "/tools/study-timetable-generator", label: "Study Timetable Generator", icon: TerminalSquare },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-[1rem] border border-primary/18 bg-white/84 p-4 text-sm font-semibold text-slate-800 shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-blue-50 dark:border-emerald-300/18 dark:bg-white/[0.06] dark:text-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" />
                  {item.label}
                </span>
                <ArrowRight className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" />
              </Link>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { title: "Ethical Use", text: "Use the generated kit as a roadmap and build the project yourself.", icon: ShieldCheck },
            { title: "Starter ZIP", text: "Download a source-code structure and documentation starter.", icon: FileArchive },
            { title: "Viva Ready", text: "Prepare explanation points for architecture, database, APIs, and future scope.", icon: Presentation },
            { title: "Portfolio Value", text: "Turn your project into resume bullets and interview stories.", icon: UsersRound },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-[1rem] border border-blue-950/10 bg-white/82 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <Icon className="size-5 text-primary dark:text-emerald-200" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
