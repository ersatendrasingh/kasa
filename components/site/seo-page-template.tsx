import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  FileBadge,
  Layers3,
  Lightbulb,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { RelatedToolsBlock } from "@/components/site/related-tools-block";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import { industrySeoPageContent } from "@/lib/industry-page-content";
import {
  allSeoPages,
  getRelatedSeoPages,
  type PageSummary,
} from "@/lib/site-content";
import seoPageContent from "@/lib/seo-page-content.json";

type SeoPageTemplateProps = {
  page: PageSummary;
};

type SeoPageContent = {
  template: "feature" | "solution" | "resource" | "compare";
  image: string;
  imageAlt: string;
  spotlightTitle: string;
  spotlightBody: string;
  metrics: [string, string][];
  steps: string[];
  proof: string[];
  faqs: [string, string][];
};

const enrichedPages = {
  ...(seoPageContent as unknown as Record<string, SeoPageContent>),
  ...(industrySeoPageContent as Record<string, SeoPageContent>),
};

function pageVariant(page: PageSummary) {
  const match = allSeoPages.find((item) => item.slug === page.slug);
  if (match?.group === "Solutions") return "solution";
  if (match?.group === "Resources") return "resource";
  if (match?.group === "Compare") return "compare";
  return "feature";
}

const templateCopy = {
  feature: {
    eyebrow: "Capability deep dive",
    title: "How this feature works inside the KASA operating system.",
    description:
      "A feature page should explain the workflow, the operational benefit, and the connected modules that make the capability useful for a real academy team.",
    workflowTitle: "Feature workflow",
    proofTitle: "Where this feature creates leverage",
    faqTitle: "Feature questions",
  },
  solution: {
    eyebrow: "Solution blueprint",
    title: "How this solution fits the day-to-day work of the team.",
    description:
      "A solution page should speak to the business model, team roles, delivery style, and growth goals behind the search intent.",
    workflowTitle: "Solution workflow",
    proofTitle: "Why this team type chooses KASA",
    faqTitle: "Solution questions",
  },
  resource: {
    eyebrow: "Practical guide",
    title: "A step-by-step guide with product links where KASA can help.",
    description:
      "A resource page should educate first, then connect the reader to relevant LMS workflows, features, comparisons, and product tour CTAs.",
    workflowTitle: "Guide structure",
    proofTitle: "What to remember before choosing tools",
    faqTitle: "Guide FAQs",
  },
  compare: {
    eyebrow: "Decision support",
    title: "A comparison that makes tradeoffs clear before the demo.",
    description:
      "A comparison page should help buyers understand ownership, speed, cost, control, operations, and long-term growth before choosing a platform.",
    workflowTitle: "Decision path",
    proofTitle: "KASA advantage in this comparison",
    faqTitle: "Comparison FAQs",
  },
} as const;

const groupLabel = {
  feature: "Features",
  solution: "Solutions",
  resource: "Resources",
  compare: "Compare",
} as const;

const groupHref = {
  feature: "/features",
  solution: "/solutions",
  resource: "/resources",
  compare: "/compare",
} as const;

export function SeoPageTemplate({ page }: SeoPageTemplateProps) {
  const variant = pageVariant(page);
  const content = enrichedPages[page.slug];
  const copy = templateCopy[content?.template ?? variant];
  const playbook = getPagePlaybook(page, content?.template ?? variant);
  const relatedPages = getRelatedSeoPages(page);

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: groupLabel[variant], href: groupHref[variant] },
          { name: page.title, href: `${groupHref[variant]}/${page.slug}` },
        ]}
      />
      <WebPageStructuredData
        name={page.title}
        description={page.description}
        href={`${groupHref[variant]}/${page.slug}`}
        image={content?.image}
        pageType={variant === "resource" ? "Article" : "WebPage"}
      />
      {content?.faqs.length ? <FaqStructuredData faqs={content.faqs} /> : null}
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        points={page.heroPoints}
        variant={variant}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: groupLabel[variant], href: groupHref[variant] },
          { label: page.eyebrow },
        ]}
      />

      {content ? (
        <section className="relative overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid w-full max-w-[108rem] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-blue-950/10 bg-white shadow-2xl shadow-blue-950/10 dark:border-white/10 dark:bg-surface">
              <Image
                src={content.image}
                alt={content.imageAlt}
                fill
                sizes="(min-width: 1024px) 44rem, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05),rgba(2,6,23,0.58))]" />
              <div className="inner-media-overlay absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/20 bg-slate-950/88 p-4 shadow-2xl shadow-black/20 backdrop-blur">
                <p className="inner-media-overlay-kicker text-xs font-semibold uppercase tracking-[0.18em]">
                  {content.template === "compare"
                    ? "Decision view"
                    : content.template === "resource"
                      ? "Guide view"
                      : content.template === "solution"
                        ? "Team workflow"
                        : "Product workflow"}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {content.metrics.map(([value, label]) => (
                    <div key={`${value}-${label}`}>
                      <div className="font-heading text-xl font-semibold">
                        {value}
                      </div>
                      <div className="inner-media-overlay-muted text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
                {content.spotlightTitle}
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                {content.spotlightBody}
              </p>
              <div className="mt-6 grid gap-3">
                {content.steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-3 rounded-2xl border border-blue-950/10 bg-white p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-[108rem]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
              {copy.title}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
              {copy.description}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {page.outcomes.map((outcome, index) => (
              <article
                key={outcome}
                className="group rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/6 transition hover:-translate-y-1 hover:border-primary/40 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-4">
                  <CheckCircle2 className="size-7 text-primary" aria-hidden="true" />
                  <span className="font-heading text-3xl font-semibold text-slate-100 dark:text-white/10">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:bg-[linear-gradient(180deg,#071126_0%,#061126_100%)]">
        <div className="mx-auto w-full max-w-[108rem]">
          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary dark:text-emerald-200">
                {playbook.eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
                {playbook.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {playbook.description}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {playbook.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                    {card.label}
                  </p>
                  <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-slate-950 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {card.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef7ff_0%,#f8fbff_48%,#ffffff_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:bg-[linear-gradient(180deg,#071126_0%,#0b1833_52%,#061126_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(43,168,255,0.14),transparent_30rem),radial-gradient(circle_at_90%_16%,rgba(34,181,115,0.12),transparent_32rem)] dark:bg-[radial-gradient(circle_at_10%_14%,rgba(69,145,255,0.12),transparent_30rem),radial-gradient(circle_at_90%_16%,rgba(88,201,138,0.1),transparent_32rem)]" />
        <div className="relative mx-auto grid w-full max-w-[108rem] gap-6 lg:grid-cols-[0.36fr_0.64fr]">
          <aside className="overflow-hidden rounded-[2rem] border border-blue-950/10 bg-white/88 p-6 shadow-2xl shadow-blue-950/8 dark:border-white/10 dark:bg-surface/88">
            <div className="inline-flex size-13 items-center justify-center rounded-2xl bg-[image:var(--button-solid)] !text-white shadow-lg shadow-blue-950/12">
              <Lightbulb className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
              {copy.workflowTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {content?.spotlightBody ??
                "Each inner page is part of the same LMS system: website, checkout, learners, live classes, faculty, certificates, CRM, and reporting stay connected instead of becoming separate tools."}
            </p>
            <div className="mt-6 grid gap-3">
              {(content?.steps ?? [
                "Own brand",
                "Connected access",
                "Admin control",
                "Growth visibility",
              ]).slice(0, 4).map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-blue-950/10 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                  >
                    <BadgeCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </aside>

          <div className="grid gap-5">
            {page.sections.map((section, index) => {
              const icons = [Layers3, BookOpenCheck, Radio, FileBadge];
              const Icon = icons[index % icons.length];

              return (
                <article
                  key={section.title}
                  className="rounded-[1.6rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/7 dark:border-white/10 dark:bg-surface sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/8 text-primary dark:bg-white/8 dark:text-emerald-200 sm:size-12">
                      <Icon className="size-5 sm:size-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:text-emerald-200">
                        Workflow {index + 1}
                      </p>
                      <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-slate-950 dark:text-white">
                        {section.title}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {section.body}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {section.points.map((point) => (
                          <span
                            key={point}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-950/10 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                          >
                            <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {content ? (
        <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto w-full max-w-[108rem]">
            <div className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {copy.proofTitle}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
                  What this means for your academy decision.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Use these points to decide whether this workflow matters for
                  your academy now, what your team should prepare before a demo,
                  and which connected KASA pages are worth reading next.
              </p>
              </div>
              <div
                className={[
                  "grid gap-4",
                  content.template === "compare"
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3",
                ].join(" ")}
              >
                {content.proof.map((item) => (
                  <article
                    key={item}
                    className="flex items-start gap-3 rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-white/[0.04] sm:block"
                  >
                    <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary sm:mt-0" aria-hidden="true" />
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:mt-4">
                      {item}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {content?.faqs.length ? (
        <section className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:bg-[linear-gradient(180deg,#071126_0%,#061126_100%)]">
          <div className="mx-auto w-full max-w-[108rem]">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {copy.faqTitle}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
                Questions this page should answer before the product tour.
              </h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
              {content.faqs.map(([question, answer]) => (
                <article
                  key={question}
                  className="rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <h3 className="font-heading text-lg font-semibold text-slate-950 dark:text-white">
                    {question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <RelatedToolsBlock
        context={variant}
        pageTitle={page.title}
        keywords={page.keywords}
        title="Try a free tool related to this topic."
        description="Give visitors a quick calculator, planner, or AI generator that matches this page, then let them continue into the deeper KASA workflow."
        limit={4}
        className="py-6 sm:py-8"
      />

      <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-[108rem]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Explore next
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
              Related KASA pages for the same buying journey.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
              Continue through the topic cluster and compare connected workflows
              before choosing the right LMS setup.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[1.5rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/6 transition hover:-translate-y-1 hover:border-primary/40 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">
                    {item.group}
                  </p>
                  <Sparkles className="size-5 text-primary/50" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold leading-tight text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read page
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-blue-950/10 bg-[linear-gradient(135deg,#f8fcff,#effbf5)] p-6 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(69,145,255,0.12),rgba(88,201,138,0.09))]">
            <div className="grid gap-5 lg:grid-cols-[0.75fr_0.25fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm dark:bg-white/8 dark:text-emerald-200">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Ready to map your workflow?
                </div>
                <h2 className="mt-4 font-heading text-2xl font-semibold text-slate-950 dark:text-white">
                  See how this page connects to your academy setup.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Book a walkthrough and we will show the storefront, learner
                  dashboard, live classes, payments, certificates, and admin
                  workflows that match your business model.
                </p>
              </div>
              <ProductTourTrigger
                label="Take a Product Tour"
                variant="solid"
                size="md"
                className="justify-center"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function getPagePlaybook(page: PageSummary, variant: SeoPageContent["template"]) {
  const primarySection = page.sections[0];
  const secondarySection = page.sections[1] ?? page.sections[0];
  const primaryKeyword = page.keywords[0] ?? page.eyebrow.toLowerCase();
  const secondaryKeyword = page.keywords[1] ?? page.title.toLowerCase();

  if (variant === "solution") {
    return {
      eyebrow: "Team-specific playbook",
      title: `${page.eyebrow} needs a workflow that matches how the team actually teaches.`,
      description:
        "This section makes the solution page less generic by tying the page to roles, operating rhythm, and rollout decisions an education business has to make.",
      cards: [
        {
          label: "Best fit",
          title: page.title,
          text: `Use this path when ${primaryKeyword} is the main operating model, not just one marketing phrase on the website.`,
        },
        {
          label: "Daily workflow",
          title: primarySection.title,
          text: primarySection.body,
        },
        {
          label: "Rollout decision",
          title: secondarySection.title,
          text: `Start with the workflow around ${secondaryKeyword}, then connect enrolment, payment, learner access, faculty work, and reporting.`,
        },
        {
          label: "Proof to prepare",
          title: "Before the demo",
          text: "Bring current batch size, course formats, fee collection process, learner support gaps, and the one workflow your team wants to fix first.",
        },
      ],
    };
  }

  if (variant === "feature") {
    return {
      eyebrow: "Feature-specific playbook",
      title: `${page.eyebrow} should solve one operational problem clearly.`,
      description:
        "Feature pages now include a practical operating view so the content is not only hero, benefits, feature cards, and FAQ.",
      cards: [
        {
          label: "Where it appears",
          title: page.title,
          text: `This feature matters when teams are actively managing ${primaryKeyword} and need it connected to the rest of the academy system.`,
        },
        {
          label: "Admin action",
          title: primarySection.title,
          text: primarySection.body,
        },
        {
          label: "Learner impact",
          title: secondarySection.title,
          text: `The learner experience should make ${secondaryKeyword} feel simple while admins still keep control of rules and reporting.`,
        },
        {
          label: "Demo check",
          title: "What to verify",
          text: "Ask how this feature connects with course access, live classes, payments, certificates, CRM, and analytics before treating it as a standalone module.",
        },
      ],
    };
  }

  if (variant === "compare") {
    return {
      eyebrow: "Decision worksheet",
      title: "Compare the tradeoff, not only the headline promise.",
      description:
        "Comparison pages need stronger decision support, so this block turns the topic into a practical buying checklist.",
      cards: [
        {
          label: "Option being compared",
          title: page.title,
          text: `Use this comparison when your team is weighing ${primaryKeyword} against speed, ownership, cost, maintenance, and learner experience.`,
        },
        {
          label: "Operational question",
          title: primarySection.title,
          text: primarySection.body,
        },
        {
          label: "Hidden cost",
          title: secondarySection.title,
          text: `Check what happens after launch: content updates, payment issues, support tickets, faculty onboarding, reporting, and future course expansion.`,
        },
        {
          label: "Decision evidence",
          title: "Before choosing",
          text: "List your launch deadline, technical support capacity, expected enrolments, branding needs, and integrations before comparing platforms.",
        },
      ],
    };
  }

  return {
    eyebrow: "Guide worksheet",
    title: "Turn the guide into an implementation checklist.",
    description:
      "Resource pages should educate first, so this block converts broad advice into next actions a founder or academy team can use.",
    cards: [
      {
        label: "Use case",
        title: page.title,
        text: `Use this guide when ${primaryKeyword} is an active planning question and the team needs a clearer sequence of decisions.`,
      },
      {
        label: "First step",
        title: primarySection.title,
        text: primarySection.body,
      },
      {
        label: "Second step",
        title: secondarySection.title,
        text: `After the first decision, connect ${secondaryKeyword} with pricing, content access, learner support, and reporting.`,
      },
      {
        label: "Useful output",
        title: "What to document",
        text: "Write down the target learner, course format, price range, launch date, support model, and the metric you will review after launch.",
      },
    ],
  };
}
