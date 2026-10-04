import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  LayoutTemplate,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import {
  FaqStructuredData,
  ItemListStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import { RelatedToolsBlock } from "@/components/site/related-tools-block";
import { siteContainerClasses } from "@/components/site/site-container";
import { siteButtonClasses } from "@/components/site/site-button";
import { ToolBreadcrumb } from "@/components/tools/tool-hero-extras";
import { tools, type ToolItem } from "@/lib/tools";

const pageTitle = "Free Student Tools for Resume, ATS, Projects, CGPA, Attendance and Exams";
const pageDescription =
  "Use KASA free student tools for resume building, ATS resume checking, career roadmap planning, final year project kits, interview questions, attendance, CGPA, GPA, marks, and exam planning.";

export const metadata: Metadata = {
  title: `${pageTitle} | KASA`,
  description: pageDescription,
  keywords: [
    "free student tools",
    "resume builder for students",
    "ATS resume checker",
    "career roadmap generator",
    "final year project ideas",
    "final year project documentation",
    "attendance calculator",
    "75 percent attendance calculator",
    "CGPA to percentage converter",
    "GPA calculator",
    "marks percentage calculator",
    "study timetable generator",
    "interview questions for freshers",
    "exam planning tools",
  ],
  alternates: {
    canonical: "/students",
  },
};

type Workflow = {
  title: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
  icon: LucideIcon;
};

const studentTools = tools.filter((tool) => tool.category === "Students" && tool.status === "Live");

function pickTool(slug: string) {
  return studentTools.find((tool) => tool.slug === slug);
}

const priorityToolSlugs = [
  "resume-builder-studio",
  "resume-ats-checker",
  "ai-career-roadmap",
  "final-year-project-kit-generator",
  "attendance-calculator",
  "cgpa-percentage-converter",
  "gpa-calculator",
  "study-timetable-generator",
  "final-exam-calculator",
  "marks-percentage-calculator",
  "assignment-deadline-planner",
  "study-hours-calculator",
];

const priorityTools = priorityToolSlugs.map(pickTool).filter(Boolean) as ToolItem[];

const workflows: Workflow[] = [
  {
    title: "Placement preparation without confusion",
    description:
      "Start with a clean resume, check it against the role, then revise interview questions that match your profile.",
    points: ["Build a student-friendly resume.", "Find missing keywords and weak bullets.", "Practice HR, project, and technical questions."],
    href: "/tools/resume-ats-checker",
    cta: "Check resume",
    icon: Trophy,
  },
  {
    title: "Final year project planning",
    description:
      "Turn a broad idea into modules, documentation structure, viva preparation, and resume-ready project points.",
    points: ["Pick a practical project direction.", "Prepare documentation and viva preparation.", "Add honest project points to your resume."],
    href: "/tools/final-year-project-kit-generator",
    cta: "Generate project kit",
    icon: LayoutTemplate,
  },
  {
    title: "Exam and semester control",
    description:
      "Use calculators to understand attendance risk, target marks, study hours, GPA, and CGPA before it becomes urgent.",
    points: ["Know safe attendance and recovery classes.", "Plan daily study hours before exams.", "Convert CGPA or calculate GPA accurately."],
    href: "/tools/study-timetable-generator",
    cta: "Plan study time",
    icon: BookOpenCheck,
  },
];

const studentOutcomes = [
  {
    title: "Placement profile",
    description: "Prepare resume sections, improve ATS keywords, and practice questions around your projects and target role.",
  },
  {
    title: "Semester planning",
    description: "Calculate attendance, final exam targets, GPA, CGPA, marks percentage, deadlines, and study hours before exams.",
  },
  {
    title: "Project readiness",
    description: "Move from a rough final year project idea to modules, documentation structure, viva preparation, and resume points.",
  },
];

const preparationGuide = [
  {
    title: "Before applying for internships or fresher jobs",
    description:
      "Create one clean resume, check it with the ATS resume checker, then update weak bullets with measurable project work, skills, education, and certifications.",
  },
  {
    title: "Before project review or viva",
    description:
      "Use the project kit generator to clarify problem statement, modules, tech stack, database design, documentation flow, viva questions, and resume-ready project lines.",
  },
  {
    title: "Before exams and attendance shortage",
    description:
      "Check attendance percentage, required classes, final exam score target, study hours, assignment deadline plan, and CGPA conversion from one student tools hub.",
  },
];

const faqs: Array<[string, string]> = [
  [
    "What can students use KASA for?",
    "Students can use KASA for resume building, ATS checking, career roadmap planning, final year project preparation, interview questions, attendance calculation, CGPA conversion, GPA calculation, marks percentage, and study planning.",
  ],
  [
    "Which tool should a student use first?",
    "For placements, start with the resume builder and ATS checker. For academics, start with the attendance calculator, GPA calculator, CGPA converter, or study timetable generator. For final year work, start with the project kit generator.",
  ],
  [
    "Are these tools useful for freshers and final year students?",
    "Yes. The resume, ATS, career roadmap, project kit, and interview question pages are especially useful for freshers, final year students, and students preparing for placements.",
  ],
  [
    "Are the calculators official university calculators?",
    "No. They are practical planning tools. Students should always compare the result with their college, board, or university's official formula before making final academic decisions.",
  ],
];

function ToolLinkCard({ tool }: { tool: ToolItem }) {
  const Icon = tool.icon;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex min-h-[11.5rem] flex-col border-b border-r border-[#193c36]/10 bg-white/70 p-5 transition hover:z-10 hover:bg-white hover:shadow-[0_20px_50px_rgba(25,60,54,0.10)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e8f8f0] text-[#177e70] transition group-hover:-rotate-3 group-hover:bg-[#177e70] group-hover:text-white dark:bg-primary/15 dark:text-emerald-200">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <ArrowRight className="size-4 text-[#8ba49f] transition group-hover:translate-x-1 group-hover:text-[#177e70]" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold leading-tight text-[#122c28] dark:text-white">
        {tool.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#58706b] dark:text-slate-300">
        {tool.description}
      </p>
    </Link>
  );
}

export default function StudentsPage() {
  return (
    <div className="relative overflow-hidden bg-[#fbfdf9] text-[#122c28] dark:bg-surface-strong dark:text-white">
      <WebPageStructuredData
        name={pageTitle}
        description={pageDescription}
        href="/students"
        image="/student-tools-hero.png"
      />
      <ItemListStructuredData
        name="KASA free student tools"
        items={priorityTools.map((tool) => ({
          title: tool.title,
          href: `/tools/${tool.slug}`,
          description: tool.description,
        }))}
      />
      <FaqStructuredData faqs={faqs} />

      <section className="relative border-b border-[#173d36]/10 bg-[radial-gradient(circle_at_82%_15%,rgba(112,219,190,0.28),transparent_28%),radial-gradient(circle_at_8%_72%,rgba(255,190,150,0.22),transparent_25%),linear-gradient(135deg,#f8fff9_0%,#f6fbf4_48%,#eefaf7_100%)] pb-10 pt-[8.75rem] dark:border-white/10 dark:bg-[radial-gradient(circle_at_82%_15%,rgba(52,181,146,0.16),transparent_28%),linear-gradient(135deg,#10211e,#122923)] sm:pt-[9.75rem] lg:pb-14 lg:pt-[10rem]">
        <div className={siteContainerClasses()}>
          <ToolBreadcrumb current="Students" />
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#177e70]/20 bg-white/75 px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#177e70] shadow-sm backdrop-blur dark:border-emerald-300/20 dark:bg-white/5 dark:text-emerald-200 sm:text-xs">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Your free student launchpad
              </div>
              <h1 className="mt-5 max-w-3xl font-heading text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[#102a26] sm:text-[3.4rem] lg:text-[3.8rem] dark:text-white">
                College is busy. Your next step should be clear.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#506b65] sm:text-lg sm:leading-8 dark:text-slate-300">
                Build a placement-ready resume, plan your final year project, protect attendance, calculate grades and prepare for exams—without jumping between random websites.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="#student-tools" className={siteButtonClasses({ size: "lg" })}>
                  Find my next tool
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link href="/students/interview-questions" className={siteButtonClasses({ variant: "outline", size: "lg" })}>
                  Practice interviews
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#173d36]/10 pt-5 text-sm font-medium text-[#405f58] dark:border-white/10 dark:text-slate-300">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1a9a7f]" />No sign-up for calculators</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1a9a7f]" />Built for Indian students</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1a9a7f]" />Practical, not generic</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[48rem] lg:max-w-none">
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-[#dff5ec] shadow-[0_28px_80px_rgba(27,94,82,0.18)] dark:border-white/10 dark:bg-[#17322d]">
                <div className="relative h-[23rem] sm:h-[29rem]">
                  <Image
                    src="/academy-online-student.jpg"
                    alt="Student preparing online with KASA study and career tools"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 52vw, 94vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,44,38,0.05),transparent_48%,rgba(10,44,38,0.22))]" />
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/75 bg-white/90 p-3.5 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#10241f]/90 sm:inset-x-6 sm:bottom-6 sm:p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#177e70] dark:text-emerald-200">Today&apos;s student plan</p>
                      <p className="mt-1 font-heading text-lg font-semibold text-[#122c28] dark:text-white">One goal. Four useful steps.</p>
                    </div>
                    <span className="rounded-full bg-[#e7f8f0] px-3 py-1 text-xs font-bold text-[#177e70] dark:bg-emerald-300/10 dark:text-emerald-200">Free tools</span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[0.68rem] font-bold text-[#44655d] sm:gap-2 sm:text-xs dark:text-slate-300">
                    {["Resume", "ATS check", "Project", "Interview"].map((label, index) => (
                      <div key={label} className="rounded-lg bg-[#f2f8f5] px-1 py-2 dark:bg-white/5">
                        <span className="mr-1 text-[#1a9a7f]">0{index + 1}</span>{label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute right-4 top-4 rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-[#10241f]/85 sm:right-6 sm:top-6">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#6d8881]">Student toolkit</p>
                  <p className="mt-1 text-xl font-bold text-[#153f37] dark:text-white">12 focused tools</p>
                </div>
              </div>
              <div className="absolute -left-5 top-[43%] hidden w-44 rotate-[-3deg] rounded-2xl bg-[#ffcfac] p-4 shadow-xl lg:block">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8b4e2d]">Start here</p>
                <p className="mt-1 text-sm font-bold leading-5 text-[#4d2c20]">Pick the deadline closest to you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#173d36]/10 bg-white dark:border-white/10 dark:bg-surface">
        <div className={siteContainerClasses({ className: "grid md:grid-cols-3" })}>
          {studentOutcomes.map((item, index) => (
            <div key={item.title} className="relative border-[#173d36]/10 px-0 py-6 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0 dark:border-white/10">
              <span className="text-xs font-bold tracking-[0.18em] text-[#1a9a7f]">0{index + 1}</span>
              <h2 className="mt-2 font-heading text-xl font-semibold text-[#122c28] dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#617871] dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="student-tools" className="relative bg-[#f7fbf7] py-14 dark:bg-surface-strong sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#177e70] dark:text-emerald-200">
                Choose by deadline
              </p>
              <h2 className="mt-3 max-w-2xl font-heading text-3xl font-semibold leading-[1.08] text-[#122c28] sm:text-[2.65rem] dark:text-white">
                What do you need to finish next?
              </h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-[#5a726c] dark:text-slate-300">
              Start from the task in front of you. Every tool is focused on a real student outcome—from clearing a resume screen to calculating how many classes you can miss.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-[#173d36]/10 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:grid sm:grid-cols-2 xl:grid-cols-4">
            {priorityTools.map((tool) => (
              <ToolLinkCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#153f37] py-14 text-white dark:bg-[#0b1c19] sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#72dfbd]">Three student tracks</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-[1.08] sm:text-[2.65rem]">
                Stop collecting tabs. Follow one useful path.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-white/68">
                Each track connects the tools that naturally belong together, so the output of one step helps with the next.
              </p>
              <Image src="/student-tools-hero.png" alt="Student planning study and career tasks" width={560} height={470} className="mx-auto mt-7 hidden max-h-56 w-auto object-contain opacity-90 lg:block" />
            </div>

            <div className="grid gap-3">
            {workflows.map((workflow) => {
              const Icon = workflow.icon;
              return (
                <article
                  key={workflow.title}
                  className="group grid gap-5 rounded-[1.2rem] border border-white/12 bg-white/[0.055] p-5 transition hover:border-[#72dfbd]/45 hover:bg-white/[0.08] sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-6"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-[#72dfbd]/12 text-[#72dfbd]">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold leading-tight">{workflow.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{workflow.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {workflow.points.map((point, index) => (
                        <span key={point} className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium text-white/75">
                          {index + 1}. {point}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={workflow.href} className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#8aebc9] sm:pt-1">
                    {workflow.cta}<ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf4] py-14 dark:bg-surface sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c66a42] dark:text-[#ffb791]">
                <GraduationCap className="size-4" aria-hidden="true" />Preparation guide
              </div>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-[1.1] text-[#122c28] sm:text-[2.5rem] dark:text-white">
                Use the tool. Then use the result.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#63766e] dark:text-slate-300">
                A calculator gives a number; a good plan tells you what to do next. These three moments are where the toolkit becomes genuinely useful.
              </p>
            </div>

            <div className="border-t border-[#4f392b]/15 dark:border-white/10">
              {preparationGuide.map((item, index) => (
                <div key={item.title} className="grid gap-3 border-b border-[#4f392b]/15 py-5 dark:border-white/10 sm:grid-cols-[3.5rem_0.8fr_1.2fr] sm:gap-5">
                  <span className="font-heading text-2xl font-semibold text-[#e38a5e]">0{index + 1}</span>
                  <h3 className="text-base font-bold leading-6 text-[#263e38] dark:text-white">{item.title}</h3>
                  <p className="text-sm leading-7 text-[#687a73] dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedToolsBlock
        context="home"
        pageTitle={pageTitle}
        keywords={metadata.keywords as string[]}
        title="Popular tools for students."
        description="Open a calculator, planner, converter, resume tool, or AI generator for placement preparation, exam planning, and project work."
        limit={8}
        className="py-14 sm:py-18"
      />

      <section className="bg-white py-14 dark:bg-surface sm:py-16">
        <div className={siteContainerClasses()}>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#177e70] dark:text-emerald-200">
              Student FAQs
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-[1.1] text-[#122c28] sm:text-[2.5rem] dark:text-white">
              Useful answers before you begin.
            </h2>
          </div>
          <div className="mt-7 grid overflow-hidden rounded-[1.25rem] border border-[#173d36]/10 md:grid-cols-2 dark:border-white/10">
            {faqs.map(([question, answer], index) => (
              <article key={question} className="bg-[#f8fbf7] p-6 md:even:border-l md:[&:nth-child(n+3)]:border-t border-[#173d36]/10 dark:border-white/10 dark:bg-white/[0.035]">
                <span className="text-xs font-bold text-[#1a9a7f]">0{index + 1}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold leading-tight text-[#122c28] dark:text-white">{question}</h3>
                <p className="mt-3 text-sm leading-7 text-[#60766f] dark:text-slate-300">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-14 dark:bg-surface sm:pb-16">
        <div className={siteContainerClasses()}>
          <div className="flex flex-col gap-5 rounded-[1.4rem] bg-[linear-gradient(110deg,#dff5ec,#e7f8f5_56%,#ffe9d8)] p-6 md:flex-row md:items-center md:justify-between md:p-8 dark:bg-[linear-gradient(110deg,#16342e,#153b35_56%,#403027)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#177e70] dark:text-emerald-200">
              <GraduationCap className="size-4" aria-hidden="true" />
              Your next task starts here
            </div>
            <h2 className="mt-2 max-w-3xl font-heading text-2xl font-semibold text-[#122c28] dark:text-white">
              Choose one useful tool, finish one real task, and move forward with clarity.
            </h2>
          </div>
          <Link href="/tools" className={siteButtonClasses({ size: "md" })}>
            Browse all tools
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
