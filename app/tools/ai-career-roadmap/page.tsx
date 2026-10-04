import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/site/structured-data";
import { siteContainerClasses } from "@/components/site/site-container";
import { ToolBreadcrumb } from "@/components/tools/tool-hero-extras";
import { AiCareerRoadmap } from "@/components/tools/ai-career-roadmap";

export const metadata: Metadata = {
  title: "AI Career Roadmap Generator for Students | Skills, Projects and Weekly Plan",
  description:
    "Create a free AI career roadmap for students and freshers. Get role-wise skills, weekly learning plan, project ideas, interview prep, portfolio tasks, and job search actions.",
  keywords: [
    "AI career roadmap",
    "career roadmap generator",
    "career roadmap for students",
    "roadmap for frontend developer",
    "roadmap for data analyst",
    "student career planner",
    "fresher job roadmap",
    "skills roadmap",
    "project based learning roadmap",
  ],
  alternates: { canonical: "/tools/ai-career-roadmap" },
  openGraph: {
    title: "AI Career Roadmap Generator for Students",
    description: "Generate a role-wise career roadmap with skills, projects, weekly tasks, interview prep, and job search actions.",
    url: "/tools/ai-career-roadmap",
    type: "website",
  },
};

const pageUrl = "https://www.getkasa.in/tools/ai-career-roadmap";

const faqs = [
  {
    question: "What is an AI Career Roadmap Generator?",
    answer:
      "It is a tool that creates a practical learning and career plan based on your target role, current skills, course, available time, and career goal.",
  },
  {
    question: "Can college students use this career roadmap tool?",
    answer:
      "Yes. It is designed for college students, freshers, and early career learners who want a clear plan for skills, projects, interviews, and job applications.",
  },
  {
    question: "Does it guarantee a job?",
    answer:
      "No. The roadmap gives structured guidance, but job selection depends on skills, projects, applications, interviews, market conditions, and consistency.",
  },
  {
    question: "What does the roadmap include?",
    answer:
      "It includes focus areas, skills to learn, weekly tasks, portfolio projects, interview questions, job search actions, free resources, and mistakes to avoid.",
  },
];

export default function AiCareerRoadmapPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#softwareapplication`,
      name: "AI Career Roadmap Generator",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description:
        "Free AI career roadmap generator for students and freshers with role-wise skills, weekly plan, projects, portfolio tasks, interview prep, and job search actions.",
      publisher: { "@type": "Organization", name: "KASA", url: "https://www.getkasa.in" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="bg-[#fbfdf9] text-[#122c28] dark:bg-surface-strong dark:text-white">
      <JsonLd data={jsonLd} />
      <section className="relative overflow-hidden border-b border-[#173d36]/10 bg-[radial-gradient(circle_at_82%_18%,rgba(111,222,191,0.30),transparent_27rem),radial-gradient(circle_at_8%_80%,rgba(255,191,151,0.24),transparent_22rem),linear-gradient(135deg,#f8fff9,#f4faf5_48%,#effaf7)] pb-12 pt-[8.75rem] dark:border-white/10 dark:bg-[radial-gradient(circle_at_82%_18%,rgba(68,192,155,0.18),transparent_27rem),linear-gradient(135deg,#10211e,#142a25)] sm:pt-[9.5rem] lg:pt-[10rem]">
        <div className={siteContainerClasses({ className: "relative" })}>
          <ToolBreadcrumb current="AI Career Roadmap" />
          <div className="mt-6 grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#177e70]/20 bg-white/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.17em] text-[#177e70] shadow-sm backdrop-blur dark:border-emerald-300/20 dark:bg-white/5 dark:text-emerald-200">
                <Sparkles className="size-4" aria-hidden="true" />
                Free personal career planner
              </div>
              <h1 className="mt-5 max-w-3xl font-heading text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[#102a26] sm:text-[3.5rem] lg:text-[4rem] dark:text-white">
                Turn “what should I learn?” into a plan you can follow.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#536d66] sm:text-lg sm:leading-8 dark:text-slate-300">
                Tell us your target role, current skills and available time. KASA turns them into weekly learning sprints, portfolio projects, interview preparation and job-search actions.
              </p>
              <Link href="#build-roadmap" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[image:var(--button-solid)] px-6 text-sm font-bold text-white shadow-[0_14px_35px_rgba(20,112,96,0.22)] transition hover:-translate-y-0.5">
                Build my roadmap <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#48645d] dark:text-slate-300">
                {['Skills in priority order', 'Weekly checkpoints', 'Projects with resume proof'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1a9a7f]" />{item}</span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[48rem]">
              <div className="rounded-[1.6rem] border border-white/80 bg-white/88 p-5 shadow-[0_28px_80px_rgba(22,79,69,0.16)] backdrop-blur dark:border-white/10 dark:bg-white/[0.055] sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-[#173d36]/10 pb-4 dark:border-white/10">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#177e70] dark:text-emerald-200">Preview · Frontend developer</p>
                    <h2 className="mt-1 font-heading text-xl font-semibold text-[#16332d] dark:text-white">12-week route to interview readiness</h2>
                  </div>
                  <span className="rounded-full bg-[#e6f7ef] px-3 py-1.5 text-xs font-bold text-[#177e70] dark:bg-emerald-300/10 dark:text-emerald-200">2 hrs/day</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-[4.5rem_1fr]">
                  {[['01–03', 'Foundation', 'Close JavaScript gaps and ship one responsive interface.'], ['04–07', 'Build proof', 'Create a React project with API, states and deployment.'], ['08–10', 'Interview', 'Practice DSA basics, frontend questions and project stories.'], ['11–12', 'Apply', 'Polish resume, portfolio and targeted applications.']].map(([weeks, title, body], index) => (
                    <div key={weeks} className="contents">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#739089] sm:block sm:pt-3"><span className="text-[#1a9a7f]">{weeks}</span><span className="sm:hidden">weeks</span></div>
                      <div className="relative rounded-xl border border-[#173d36]/10 bg-[#f7fbf8] p-3.5 dark:border-white/10 dark:bg-white/[0.04]">
                        <span className="absolute -left-[3.15rem] top-4 hidden h-px w-10 bg-[#8bcdbd] sm:block" />
                        <div className="flex items-start gap-3"><span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[#dff5ec] text-[0.65rem] font-bold text-[#177e70] dark:bg-emerald-300/10 dark:text-emerald-200">{index + 1}</span><div><h3 className="text-sm font-bold text-[#183a33] dark:text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-[#617871] dark:text-slate-300">{body}</p></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 hidden rotate-2 rounded-2xl bg-[#ffcfac] px-4 py-3 shadow-xl sm:block">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#8b4e2d]">Not another skill list</p>
                <p className="mt-1 text-sm font-bold text-[#4d2c20]">Every week ends with proof.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="build-roadmap"><AiCareerRoadmap /></div>

      <section className="bg-[#153f37] py-14 text-white dark:bg-[#0b1c19] sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7ce0bf]">From learning to proof</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-[1.08] sm:text-[2.55rem]">A roadmap is useful only when it changes what you do next.</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/68">The output connects skills, projects, interview preparation and applications instead of treating them as separate problems.</p>
            </div>
            <div className="border-t border-white/12">
              {[
          {
            title: "Skills become easier to prioritize",
            body: "Students often try to learn everything at once. This roadmap separates high-priority skills from optional skills so the first few weeks stay focused.",
            label: "Learn",
          },
          {
            title: "Projects become resume proof",
            body: "The roadmap suggests projects with skills and resume bullets, so learning does not stay theoretical.",
            label: "Build",
          },
          {
            title: "Interview prep starts early",
            body: "Each roadmap includes interview topics and practice questions, helping students prepare before applications begin.",
            label: "Prove",
          },
                ].map((section, index) => (
                  <div key={section.title} className="grid gap-3 border-b border-white/12 py-5 sm:grid-cols-[3.5rem_0.8fr_1.2fr] sm:items-start">
                    <span className="font-heading text-2xl font-semibold text-[#7ce0bf]">0{index + 1}</span>
                    <div><span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/45">{section.label}</span><h3 className="mt-1 text-base font-bold">{section.title}</h3></div>
                    <p className="text-sm leading-7 text-white/65">{section.body}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf4] py-14 dark:bg-surface sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c66a42] dark:text-[#ffb791]">Before you generate</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-[1.1] sm:text-[2.5rem]">Give honest inputs. Get a roadmap you can actually use.</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#677a73] dark:text-slate-300">This is planning guidance, not a job guarantee. Update the plan as your skills, projects and available time change.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/tools/resume-builder-studio" className="inline-flex items-center gap-2 text-sm font-bold text-[#177e70] dark:text-emerald-200">Build your resume <ArrowRight className="size-4" /></Link>
                <Link href="/tools/resume-ats-checker" className="inline-flex items-center gap-2 text-sm font-bold text-[#177e70] dark:text-emerald-200">Check ATS score <ArrowRight className="size-4" /></Link>
              </div>
            </div>
            <div className="grid overflow-hidden rounded-[1.25rem] border border-[#5a3f2c]/15 md:grid-cols-2 dark:border-white/10">
              {faqs.map((faq, index) => (
                <article key={faq.question} className="bg-white/55 p-5 md:even:border-l md:[&:nth-child(n+3)]:border-t border-[#5a3f2c]/15 dark:border-white/10 dark:bg-white/[0.035]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#c66a42] dark:text-[#ffb791]"><CircleDot className="size-3.5" />0{index + 1}</div>
                  <h3 className="mt-3 text-base font-bold text-[#2f403a] dark:text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6a7973] dark:text-slate-300">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
