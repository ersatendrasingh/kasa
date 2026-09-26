import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Search,
  Target,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";
import { JsonLd } from "@/components/site/structured-data";
import { siteContainerClasses } from "@/components/site/site-container";
import { ResumeAtsChecker } from "@/components/tools/resume-ats-checker";
import { ToolBreadcrumb } from "@/components/tools/tool-hero-extras";
import { ToolSeoSection } from "@/components/tools/tool-seo-section";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker & ATS Score Checker",
  description:
    "Upload a PDF or DOCX to check your ATS score, find missing keywords, review skills, grammar and formatting, and download a free PDF report. No signup.",
  keywords: [
    "ATS resume checker",
    "ATS score checker",
    "resume ATS checker",
    "resume ATS score checker",
    "ATS resume checker free online",
    "ATS friendly resume checker",
    "ATS checker resume",
    "free ATS score checker",
    "free ATS resume checker",
    "AI resume checker",
    "resume keyword checker",
    "resume score checker",
  ],
  alternates: { canonical: "/tools/resume-ats-checker" },
  openGraph: {
    title: "Free ATS Resume Checker & ATS Score Checker",
    description: "Check your ATS score, missing keywords, skills, grammar and formatting. Get practical AI suggestions and download a free PDF report.",
    url: "/tools/resume-ats-checker",
    type: "website",
    siteName: "KASA",
    images: [{ url: "/kasa-hero.png", width: 1200, height: 630, alt: "KASA free ATS resume checker and ATS score report" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Checker & ATS Score Checker",
    description: "Upload your resume to check its ATS score, missing keywords, writing and formatting, then download a free report.",
    images: ["/kasa-hero.png"],
  },
};

const pageUrl = "https://www.getkasa.in/tools/resume-ats-checker";

const resumeAtsFaqs = [
  {
    question: "What is an ATS resume checker?",
    answer:
      "An ATS resume checker reviews resume content for role keywords, relevant skills, clear sections, measurable impact and readable writing. It helps identify gaps before you apply, but it does not reproduce every employer’s applicant tracking system.",
  },
  {
    question: "Is this ATS resume checker free online?",
    answer:
      "Yes. KASA is a free online ATS resume checker with no signup required. Upload or paste your resume, review the score and suggestions, and download the report as a PDF.",
  },
  {
    question: "How does the ATS score checker work?",
    answer:
      "The ATS score checker reviews six areas: keywords, skills, projects, impact, structure and clarity. Add a job description to measure requirement coverage separately from the overall resume-readiness score.",
  },
  {
    question: "Can I compare my resume with a job description?",
    answer: "Yes. Paste a job description to see matched, partial and missing requirements with evidence from your resume. The job-match score reports requirement coverage; it is not a hiring probability.",
  },
  {
    question: "Does the resume ATS checker find missing keywords?",
    answer: "Yes. It highlights role-specific terms and skills that are missing from the resume. Add only keywords that accurately describe your experience, projects or knowledge.",
  },
  {
    question: "Does the checker review grammar and resume formatting?",
    answer: "It suggests sentence-level writing corrections and reviews observable structure, headings, dates and consistency. Text extraction cannot fully verify fonts, margins, columns or how a specific employer’s ATS parses the file.",
  },
  {
    question: "Which resume files can I upload?",
    answer: "You can upload PDF, DOCX and TXT resumes up to 4 MB, or paste resume text directly. The tool automatically detects the likely role, experience level and skills after upload.",
  },
  {
    question: "What is a good ATS resume score?",
    answer:
      "Use the score as a diagnostic guide rather than a pass mark. A stronger score indicates clearer evidence and better role alignment, but recruiters, job requirements and ATS configurations vary.",
  },
  {
    question: "How can I make my resume ATS friendly?",
    answer: "Use familiar section headings, write concise achievement bullets, include relevant skills naturally, keep dates consistent and avoid claiming experience you cannot verify. Tailor the resume to each job description.",
  },
  {
    question: "Can freshers and experienced professionals use it?",
    answer: "Yes. Freshers can improve projects, internships and entry-level keywords. Experienced professionals can strengthen achievements, leadership evidence, domain skills and senior-role alignment.",
  },
  {
    question: "How is my resume data handled?",
    answer: "Your resume and optional job description are sent to the configured AI provider for analysis. Saving the resume text and report on your device is optional, and Reset clears the saved checker report.",
  },
  {
    question: "Does an ATS score guarantee interview selection?",
    answer:
      "No. An ATS score is an AI-assisted review estimate. Interview selection depends on the job description, recruiter judgment, competition and the evidence in your actual experience.",
  },
];

const useCases = [
  {
    title: "For Students",
    description: "Check internship resumes, college project resumes, placement resumes, and entry-level applications before applying.",
    icon: GraduationCap,
  },
  {
    title: "For Freshers",
    description: "Find missing skills, weak project descriptions, vague bullets, and role keywords for first job applications.",
    icon: UserRoundCheck,
  },
  {
    title: "For Experienced Professionals",
    description: "Improve achievement bullets, leadership signals, domain keywords, impact metrics, and senior role fit.",
    icon: BriefcaseBusiness,
  },
  {
    title: "For Career Switchers",
    description: "Map transferable skills to a new role and identify the projects, tools, and keywords your resume is missing.",
    icon: TrendingUp,
  },
  {
    title: "For Job Applications",
    description: "Run a final resume scan before applying to a role and fix obvious ATS rejection risks.",
    icon: Target,
  },
];

const resumeExamples = [
  {
    title: "Example Frontend Developer Resume Fix",
    focus: "React, TypeScript, Next.js, performance, UI ownership",
    fixes: [
      "Replace vague UI bullets with measurable feature and performance impact.",
      "Add missing keywords such as React, TypeScript, REST APIs, accessibility, and responsive design.",
      "Show project ownership, deployment links, and quantified improvements.",
    ],
  },
  {
    title: "Example Fresher Resume Fix",
    focus: "Projects, internships, skills, certifications, placement readiness",
    fixes: [
      "Move strong projects above generic coursework.",
      "Rewrite project bullets with tools used, problem solved, and result achieved.",
      "Add role-specific skills and remove unrelated filler sections.",
    ],
  },
  {
    title: "Example Data Analyst Resume Fix",
    focus: "SQL, Excel, Power BI, dashboards, insights, business metrics",
    fixes: [
      "Add analytics keywords that match the target role.",
      "Convert task descriptions into business impact bullets.",
      "Mention dashboard metrics, data cleaning, reporting, and stakeholder outcomes.",
    ],
  },
];

export default function ResumeAtsCheckerPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": `${pageUrl}#softwareapplication`,
      name: "KASA Free ATS Resume Checker",
      alternateName: ["ATS Score Checker", "Resume ATS Checker", "ATS Friendly Resume Checker", "AI Resume Checker"],
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Resume analysis and career tools",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript and a modern web browser",
      url: pageUrl,
      isAccessibleForFree: true,
      inLanguage: "en-IN",
      featureList: [
        "ATS resume score",
        "Job description match",
        "Missing keyword analysis",
        "Skills analysis",
        "Grammar and writing suggestions",
        "Resume formatting review",
        "Recruiter checklist",
        "Downloadable PDF report",
      ],
      offers: { "@type": "Offer", price: 0, priceCurrency: "INR", availability: "https://schema.org/InStock" },
      description:
        "Free online ATS resume checker and ATS score checker for PDF, DOCX and TXT resumes. Find missing keywords, skills gaps, writing issues and practical improvements.",
      publisher: {
        "@id": "https://www.getkasa.in/#organization",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Free ATS Resume Checker & ATS Score Checker",
      description: "Check your resume ATS score, missing keywords, skills, grammar and formatting, then download a free PDF report.",
      isPartOf: { "@id": "https://www.getkasa.in/#website" },
      mainEntity: { "@id": `${pageUrl}#softwareapplication` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.getkasa.in",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free AI Tools",
          item: "https://www.getkasa.in/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "ATS Resume Checker",
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#eef7ff] text-slate-950 dark:bg-surface-strong dark:text-white">
      <JsonLd data={jsonLd} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(43,168,255,0.24),transparent_26rem),radial-gradient(circle_at_14%_76%,rgba(34,181,115,0.11),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#eef7ff_48%,#f8fbff_100%)] dark:bg-[radial-gradient(circle_at_74%_24%,rgba(88,201,138,0.18),transparent_23rem),linear-gradient(180deg,rgba(18,35,67,0.96),rgba(6,17,38,1))]" />

      <section className="relative pb-2 pt-[7.75rem] sm:pt-[8.5rem] lg:pt-[9rem]">
        <div className={siteContainerClasses()}>
          <ToolBreadcrumb current="ATS Resume Checker" />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <h1 className="font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl dark:text-white">
                Free ATS Resume Checker &amp; ATS Score Checker
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
                Upload a PDF or DOCX to check your ATS score, find missing keywords, and get clear resume fixes before you apply.
              </p>
            </div>
            <p className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">No signup · PDF report included</p>
          </div>
        </div>
      </section>

      <ResumeAtsChecker />

      <ResumeAtsSeoContent />

      <ToolSeoSection
        eyebrow="ATS Resume Checker FAQ"
        title="ATS Resume Checker and ATS Score Checker FAQs"
        description="Learn how to read the ATS report, improve weak resume sections, and apply only the suggestions that match your real experience."
        keywords={[
          "free ATS resume checker",
          "ATS score checker",
          "resume ATS checker",
          "resume ATS score checker",
          "ATS resume checker free online",
          "ATS friendly resume checker",
          "AI resume checker",
          "resume keyword checker",
          "PDF resume checker",
        ]}
        faqs={resumeAtsFaqs}
        relatedTools={[
          { href: "/tools/ai-resume-builder", label: "AI Resume Builder" },
          { href: "/tools/resume-builder-studio", label: "Free Resume Builder" },
          { href: "/tools/final-year-project-kit-generator", label: "AI Final Year Project Kit Generator" },
          { href: "/tools/study-timetable-generator", label: "Study Timetable Generator" },
          { href: "/tools/gpa-calculator", label: "GPA Calculator" },
        ]}
      />
    </div>
  );
}

function ResumeAtsSeoContent() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className={siteContainerClasses()}>
        <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
          <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/88 p-5 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-surface/90 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
              Free Online ATS Resume Checker
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
              How the ATS resume checker and score checker works
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              <p>
                KASA&apos;s free ATS resume checker reads a PDF, DOCX, TXT file, or pasted resume text and organizes the findings into a clear report. The ATS score checker reviews keywords, skills, projects, measurable impact, structure, and writing clarity. Add a job description when you want an exact requirement match; otherwise, the review uses the target role detected from your resume.
              </p>
              <p>
                The report separates general resume readiness from job-description coverage. It shows skills already supported by the resume, missing keywords, grammar and formatting observations, stronger bullet suggestions, and recruiter checks. The score is an AI-assisted diagnostic estimate, not a result from an employer&apos;s private ATS and not a guarantee of interview selection.
              </p>
              <p>
                Students and freshers can use the resume ATS checker to improve projects, internships, placement resumes, technical skills, and entry-level keywords. Experienced professionals can strengthen quantified achievements, leadership evidence, domain expertise, and senior-role alignment. Career switchers can check whether transferable skills and recent projects clearly support the new target role.
              </p>
              <p>
                Use the checker after a major resume edit and before each important application. Fix the highest-priority issues first, add relevant terms only where they truthfully describe your work, and run another check after tailoring the resume. If you need to rebuild the document, continue with the{" "}
                <Link href="/tools/ai-resume-builder" className="font-semibold text-primary hover:underline dark:text-emerald-200">
                  AI Resume Builder
                </Link>
                {" "}or{" "}
                <Link href="/tools/resume-builder-studio" className="font-semibold text-primary hover:underline dark:text-emerald-200">
                  Free Resume Builder
                </Link>
                . Students can also pair it with the{" "}
                <Link href="/tools/final-year-project-kit-generator" className="font-semibold text-primary hover:underline dark:text-emerald-200">
                  AI Final Year Project Kit Generator
                </Link>
                {" "}and{" "}
                <Link href="/tools/study-timetable-generator" className="font-semibold text-primary hover:underline dark:text-emerald-200">
                  Study Timetable Generator
                </Link>
                {" "}to improve projects and interview preparation.
              </p>
            </div>
          </div>

          <aside className="rounded-[1.25rem] border border-blue-950/10 bg-white/80 p-5 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-white/[0.06]">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[image:var(--button-solid)] !text-white">
              <Lightbulb className="size-5 !text-white [stroke:white]" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-slate-950 dark:text-white">
              What the ATS report includes
            </h3>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {["ATS score", "Missing keywords", "Resume review", "Improved bullets", "Interview roadmap"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-blue-950/10 bg-white/82 p-5 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-surface/88 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
            Use Cases
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
            ATS-friendly resume checks for every job search stage
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;

              return (
                <div key={useCase.title} className="rounded-[1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                  <Icon className="size-5 text-primary dark:text-emerald-200" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {useCase.description}
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
                Example Resume Fixes
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
                Resume ATS checker examples by role
              </h2>
            </div>
            <Link href="/tools/ai-resume-builder" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline dark:text-emerald-200">
              Build a better resume
              <FileText className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {resumeExamples.map((example) => (
              <div key={example.title} className="rounded-[1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
                <h3 className="font-heading text-lg font-semibold text-slate-950 dark:text-white">
                  {example.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-primary dark:text-emerald-200">
                  {example.focus}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {example.fixes.map((fix) => (
                    <li key={fix} className="flex gap-2">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary dark:text-emerald-200" aria-hidden="true" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { href: "/tools/ai-resume-builder", label: "AI Resume Builder", icon: ListChecks },
            { href: "/tools/resume-builder-studio", label: "Free Resume Builder", icon: FileText },
            { href: "/tools/final-year-project-kit-generator", label: "Final Year Project Kit", icon: Search },
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
                <ArrowLeft className="size-4 rotate-180 text-primary dark:text-emerald-200" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
