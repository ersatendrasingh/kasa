import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { siteContainerClasses } from "@/components/site/site-container";
import { tools } from "@/lib/tools";

type FaqItem = {
  question: string;
  answer: string;
};

type RelatedTool = {
  href: string;
  label: string;
};

export function ToolSeoSection({
  eyebrow,
  title,
  description,
  keywords,
  faqs,
  relatedTools,
}: {
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
  faqs: FaqItem[];
  relatedTools: RelatedTool[];
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const suggestedTools = getSuggestedTools(title, keywords, relatedTools);
  const practicalCards = getPracticalCards(title, keywords);
  const exampleSet = getToolExampleSet(title, keywords);

  return (
    <section className="relative pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className={siteContainerClasses()}>
        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/86 p-5 shadow-xl shadow-blue-950/8 backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:p-7">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                {eyebrow}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </p>
              <div className="mt-5 grid gap-3">
                {practicalCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                      <Sparkles className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" />
                      {card.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.1rem] border border-blue-950/10 bg-white/78 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                  {exampleSet.eyebrow}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-slate-950 dark:text-white">
                  {exampleSet.title}
                </h3>
                <div className="mt-4 grid gap-3">
                  {exampleSet.examples.map((example) => (
                    <div key={example.title} className="rounded-[0.9rem] bg-blue-50/70 p-3 dark:bg-white/[0.05]">
                      <div className="text-sm font-semibold text-slate-950 dark:text-white">
                        {example.title}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {example.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Next useful tools
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {suggestedTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-center justify-between gap-3 rounded-[1rem] border border-primary/18 bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-blue-50 dark:border-emerald-300/18 dark:bg-white/[0.06] dark:text-slate-100"
                    >
                      <span className="flex items-center gap-2">
                        {tool.auto ? <Sparkles className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" /> : <CheckCircle2 className="size-4 text-primary dark:text-emerald-200" aria-hidden="true" />}
                        {tool.label}
                      </span>
                      <ArrowRight className="size-4 text-primary transition group-hover:translate-x-1 dark:text-emerald-200" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[1.1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]"
                >
                  <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getSuggestedTools(title: string, keywords: string[], relatedTools: RelatedTool[]) {
  const haystack = `${title} ${keywords.join(" ")} ${relatedTools.map((tool) => tool.label).join(" ")}`.toLowerCase();
  const suggestions: RelatedTool[] = [...relatedTools];
  const add = (slugs: string[]) => {
    slugs.forEach((slug) => {
      const tool = tools.find((item) => item.slug === slug);
      if (!tool) return;
      const href = `/tools/${tool.slug}`;
      if (suggestions.some((item) => item.href === href)) return;
      suggestions.push({ href, label: tool.title });
    });
  };

  if (/resume|ats|career|placement|job|interview/.test(haystack)) {
    add(["resume-ats-checker", "ai-resume-builder", "final-year-project-kit-generator", "study-timetable-generator"]);
  }
  if (/project|viva|coding|btech|bca|computer/.test(haystack)) {
    add(["final-year-project-kit-generator", "ai-resume-builder", "resume-ats-checker"]);
  }
  if (/attendance|study|exam|grade|gpa|cgpa|marks|scholarship|student/.test(haystack)) {
    add(["study-timetable-generator", "exam-score-goal-planner", "final-exam-calculator", "gpa-calculator"]);
  }
  if (/quiz|question|worksheet|lesson|assignment|teacher|assessment|report card/.test(haystack)) {
    add(["question-paper-generator", "quiz-generator", "worksheet-generator", "lesson-plan-generator", "assignment-generator", "report-card-generator"]);
  }
  if (/course|pricing|profit|fee|receipt|admission|batch|certificate|academy|institute/.test(haystack)) {
    add(["course-pricing-calculator", "profit-calculator", "fee-receipt-generator", "admission-form-generator", "batch-capacity-calculator", "certificate-generator"]);
  }

  return suggestions.slice(0, 6).map((tool) => ({ ...tool, auto: !relatedTools.some((item) => item.href === tool.href) }));
}

function getPracticalCards(title: string, keywords: string[]) {
  const haystack = `${title} ${keywords.join(" ")}`.toLowerCase();

  if (/resume|ats|career|placement|job|interview/.test(haystack)) {
    return [
      {
        title: "Use it before applying",
        text: "Run the check after each major resume edit, then rewrite weak bullets with specific skills, projects, numbers, and proof of impact.",
      },
      {
        title: "Do not copy blindly",
        text: "Treat suggestions as editing prompts. Keep only the skills and achievements you can explain confidently in an interview.",
      },
    ];
  }

  if (/project|viva|coding|btech|bca|computer/.test(haystack)) {
    return [
      {
        title: "Choose a finishable scope",
        text: "Pick a project that fits your deadline, team size, and current stack instead of chasing a topic that sounds advanced but stays incomplete.",
      },
      {
        title: "Prepare the explanation",
        text: "Use the output to clarify modules, data flow, database design, screenshots, testing, limitations, and viva answers.",
      },
    ];
  }

  if (/attendance|study|exam|grade|gpa|cgpa|marks|scholarship|student/.test(haystack)) {
    return [
      {
        title: "Check the numbers first",
        text: "Enter realistic marks, dates, credits, or study hours so the result becomes a practical planning guide instead of a guess.",
      },
      {
        title: "Confirm official rules",
        text: "Use the result for planning, then verify school, college, university, or scholarship rules wherever the final decision matters.",
      },
    ];
  }

  if (/quiz|question|worksheet|lesson|assignment|teacher|assessment|report card/.test(haystack)) {
    return [
      {
        title: "Adapt for your class",
        text: "Review the generated material for grade level, syllabus fit, difficulty, marks distribution, and classroom language.",
      },
      {
        title: "Add teacher context",
        text: "Improve the output by including chapter goals, examples already taught, expected format, and any assessment constraints.",
      },
    ];
  }

  return [
    {
      title: "Start with real inputs",
      text: "Use details from your actual course, batch, fee, certificate, or business case so the output supports a real decision.",
    },
    {
      title: "Review before sharing",
      text: "Check names, numbers, dates, policies, and formatting before sending generated material to students, parents, or team members.",
    },
  ];
}

function getToolExampleSet(title: string, keywords: string[]) {
  const haystack = `${title} ${keywords.join(" ")}`.toLowerCase();

  if (/board percentage|class 10|class 12|best of five/.test(haystack)) {
    return {
      eyebrow: "Board examples",
      title: "Use the right rule before sharing your percentage.",
      examples: [
        { title: "CBSE Class 10", text: "Check all subjects first, then compare best-of-five only if your school or form allows that rule." },
        { title: "ICSE result", text: "Enter English and the relevant best subjects separately if your admission form follows a specific ICSE pattern." },
        { title: "State board", text: "Use all theory and practical totals exactly as printed on the marksheet when the board does not mention best-of-five." },
        { title: "College form", text: "Keep both the calculated percentage and the subject-wise marks ready before uploading documents." },
      ],
    };
  }

  if (/attendance|75%|bunk|shortage/.test(haystack)) {
    return {
      eyebrow: "Semester examples",
      title: "Attendance rules feel different across colleges, so plan with context.",
      examples: [
        { title: "Engineering semester", text: "Use lecture count and lab count separately when your department tracks theory and practical attendance." },
        { title: "Medical college", text: "Avoid using the result as a proxy for official rules because clinical, practical, and theory attendance may differ." },
        { title: "DU college", text: "Estimate how many classes you can miss before internals or society events make the shortage harder to recover." },
        { title: "AKTU or VTU", text: "Use the calculator weekly during the semester so one low-attendance subject does not surprise you near exams." },
      ],
    };
  }

  if (/marks percentage|percentage calculator/.test(haystack)) {
    return {
      eyebrow: "Marks examples",
      title: "Convert common result situations without mental math.",
      examples: [
        { title: "CBSE total", text: "For 420 out of 500, enter scored and total marks to get 84% and quickly compare against your target." },
        { title: "ICSE subjects", text: "Calculate the overall percentage first, then repeat with the subject group your school asks for." },
        { title: "University semester", text: "Add internal, theory, practical, and assignment marks before checking the percentage." },
        { title: "PDF or form entry", text: "Use the result summary when you need to copy marks into scholarship, admission, or placement forms." },
      ],
    };
  }

  if (/cgpa|gpa|grade point/.test(haystack)) {
    return {
      eyebrow: "Conversion examples",
      title: "CGPA formulas are not universal, so choose carefully.",
      examples: [
        { title: "CBSE-style formula", text: "A 9.5 multiplier is useful for quick planning when that formula matches the required format." },
        { title: "University formula", text: "Some colleges use 10x, 9.25x, or custom tables, so official notices should override generic conversion." },
        { title: "4-point GPA", text: "Use the result for broad comparison only; international applications may ask for official evaluation." },
        { title: "Resume usage", text: "Keep the original CGPA visible when the converted percentage is not officially certified." },
      ],
    };
  }

  if (/final exam|final grade|required final/.test(haystack)) {
    return {
      eyebrow: "Grade scenarios",
      title: "Plan the final exam with realistic score ranges.",
      examples: [
        { title: "Pass target", text: "Check the minimum final score needed to cross the passing grade before planning higher targets." },
        { title: "Scholarship target", text: "Use a stricter target when your scholarship or branch-change rule needs a high final percentage." },
        { title: "Weighted coursework", text: "Enter assignment, quiz, midterm, and final weights exactly as your syllabus defines them." },
        { title: "Retake decision", text: "Compare possible final scores to decide whether extra tutoring or a retake plan is needed." },
      ],
    };
  }

  if (/study timetable|study hours|score goal|assignment deadline/.test(haystack)) {
    return {
      eyebrow: "Planning examples",
      title: "Turn deadlines into a schedule you can actually follow.",
      examples: [
        { title: "Board exam week", text: "Give more sessions to weak chapters, then reserve shorter slots for formulas, diagrams, and definitions." },
        { title: "College internals", text: "Split limited evenings between notes, previous questions, and one quick revision block per subject." },
        { title: "Competitive exam", text: "Keep mock-test review as a separate task instead of counting it as normal study time." },
        { title: "Assignment sprint", text: "Plan research, outline, writing, review, and submission buffers instead of doing everything the night before." },
      ],
    };
  }

  if (/resume|ats|career|placement|job|interview/.test(haystack)) {
    return {
      eyebrow: "Resume examples",
      title: "Different applicants need different proof.",
      examples: [
        { title: "Fresher", text: "Show projects, internships, coursework, certifications, and tools you can explain without exaggeration." },
        { title: "Experienced profile", text: "Move from responsibility lists to achievements with metrics, team ownership, revenue, quality, or delivery impact." },
        { title: "Career switcher", text: "Connect transferable work to the target role, then add recent projects that prove the new skill." },
        { title: "PDF export", text: "Download a clean version only after checking headings, links, spacing, and whether the best evidence appears early." },
      ],
    };
  }

  if (/project|viva|coding|btech|bca|computer/.test(haystack)) {
    return {
      eyebrow: "Project examples",
      title: "Match the idea to your branch, stack, and deadline.",
      examples: [
        { title: "BTech CSE", text: "A MERN or Spring Boot dashboard works well when you can explain auth, APIs, database, and deployment." },
        { title: "BCA or MCA", text: "A smaller management system can still be strong if documentation, screenshots, testing, and viva answers are clear." },
        { title: "AI/ML project", text: "Use a dataset, baseline model, evaluation metric, and limitation section instead of only showing predictions." },
        { title: "Portfolio version", text: "After submission, polish the README and add resume bullets that describe your actual contribution." },
      ],
    };
  }

  if (/certificate|receipt|admission|report card/.test(haystack)) {
    return {
      eyebrow: "Document examples",
      title: "Small document details create trust.",
      examples: [
        { title: "Parent sharing", text: "Check spelling, dates, student names, fee amounts, and course names before sending files on WhatsApp." },
        { title: "Institute records", text: "Use consistent IDs, batch names, and issue dates so generated files match admin records." },
        { title: "Print handoff", text: "Preview spacing before printing certificates, receipts, or report cards for offline distribution." },
        { title: "Audit trail", text: "Keep downloaded PDFs organized by batch or month when accounts or faculty need to verify them later." },
      ],
    };
  }

  if (/course pricing|profit|batch capacity|fee/.test(haystack)) {
    return {
      eyebrow: "Business examples",
      title: "Use real operating numbers, not wishful targets.",
      examples: [
        { title: "Recorded course", text: "Include editing, ads, platform fees, support time, and refund risk before deciding the launch price." },
        { title: "Live batch", text: "Calculate teacher hours, batch size, doubt support, and occupancy before promising discounts." },
        { title: "Coaching centre", text: "Compare rent, staff, local demand, and parent affordability before setting monthly or semester fees." },
        { title: "Growth decision", text: "Use break-even and margin together so a high-revenue course does not hide weak profitability." },
      ],
    };
  }

  if (/quiz|question|worksheet|lesson|assignment|teacher|assessment/.test(haystack)) {
    return {
      eyebrow: "Classroom examples",
      title: "Teacher tools need syllabus context.",
      examples: [
        { title: "Class 6 worksheet", text: "Use simple language, short instructions, and enough space for handwritten answers." },
        { title: "Board revision", text: "Mix marks-based questions, definitions, diagrams, and previous-year style prompts." },
        { title: "Online quiz", text: "Keep answer explanations short so students learn from wrong attempts immediately." },
        { title: "Homework task", text: "Add submission format, rubric, examples, and a realistic deadline before sharing." },
      ],
    };
  }

  return {
    eyebrow: "Practical examples",
    title: "Use the output in a real workflow.",
    examples: [
      { title: "Before sharing", text: "Review names, dates, numbers, and formatting so the final result looks intentional." },
      { title: "Before deciding", text: "Compare at least two scenarios when the result affects fees, batches, study plans, or submissions." },
      { title: "Before exporting", text: "Check the preview and keep a copy of the inputs used to create the result." },
      { title: "Before acting", text: "Confirm official rules wherever college, board, scholarship, or finance decisions are involved." },
    ],
  };
}
