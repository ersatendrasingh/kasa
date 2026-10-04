import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LeadCaptureModalTrigger } from "@/components/lead-capture-trigger";
import { PageHero } from "@/components/site/page-hero";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { siteButtonClasses } from "@/components/site/site-button";
import {
  BreadcrumbStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";

type CompanyPageTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  storyTitle: string;
  story: string;
  blocks: Array<{
    title: string;
    body: string;
    points: string[];
  }>;
  contactMode?: boolean;
  pathname?: string;
};

export function CompanyPageTemplate({
  eyebrow,
  title,
  description,
  points,
  storyTitle,
  story,
  blocks,
  contactMode = false,
  pathname,
}: CompanyPageTemplateProps) {
  const leadsEndpoint = "/api/leads";

  return (
    <>
      {pathname ? (
        <BreadcrumbStructuredData
          items={[
            { name: "Home", href: "/" },
            { name: "Company", href: "/why-kasa" },
            { name: title, href: pathname },
          ]}
        />
      ) : null}
      {pathname ? (
        <WebPageStructuredData
          name={title}
          description={description}
          href={pathname}
        />
      ) : null}
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        points={points}
        variant="solution"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Company", href: "/why-kasa" },
          { label: eyebrow },
        ]}
      />

      <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-[108rem] gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <aside className="rounded-[2rem] border border-blue-950/10 bg-[linear-gradient(135deg,#f8fcff,#effbf5)] p-6 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(69,145,255,0.12),rgba(88,201,138,0.09))]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[image:var(--button-solid)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] !text-white">
              <Sparkles className="size-4" aria-hidden="true" />
              KASA company
            </div>
            <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
              {storyTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {story}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ProductTourTrigger
                label="Take a Product Tour"
                variant="solid"
                size="sm"
                className="justify-center"
              />
              <Link
                href="/contact"
                className={siteButtonClasses({
                  variant: "outline",
                  size: "sm",
                  className: "justify-center",
                })}
              >
                Contact Team
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>

          <div className="grid gap-4 md:grid-cols-2">
            {blocks.map((block) => (
              <article
                key={block.title}
                className="flex items-start gap-4 rounded-[1.6rem] border border-blue-950/10 bg-white p-5 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-white/[0.04] sm:block"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/8 text-primary dark:bg-white/8 dark:text-emerald-200">
                  <BadgeCheck className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-xl font-semibold leading-tight text-slate-950 dark:text-white sm:mt-4">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {block.body}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {block.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {contactMode ? (
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef7ff_0%,#ffffff_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 dark:bg-[linear-gradient(180deg,#071126_0%,#061126_100%)]">
          <div className="mx-auto grid w-full max-w-[108rem] gap-6 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Talk to KASA
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl dark:text-white">
                Share your academy plan and get the right demo path.
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                Tell us about your courses, batches, payment flow, learners,
                faculty, and current tools. The team can map the right KASA
                setup before you start the product tour.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ["Demo plan", "Get a workflow-based product tour."],
                  ["Rollout scope", "Map domain, AWS, payments, email, and media."],
                  ["Team fit", "Discuss admin, faculty, learner, and CRM needs."],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="rounded-[1.2rem] border border-blue-950/10 bg-white/78 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <div className="font-heading text-base font-semibold text-slate-950 dark:text-white">
                      {title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-950/10 bg-white p-5 shadow-2xl shadow-blue-950/10 dark:border-white/10 dark:bg-surface sm:p-6">
              <h3 className="font-heading text-2xl font-semibold text-slate-950 dark:text-white">
                Start with a compact enquiry
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Share the basics now. The product tour can go deep once your
                team context is clear.
              </p>
              <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200">
                <a href="mailto:hello@getkasa.in" className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.05]">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  hello@getkasa.in
                </a>
                <a href="mailto:support@getkasa.in" className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.05]">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  Demo and support email
                </a>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.05]">
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  Built for education teams in India
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.05]">
                  <Globe2 className="size-4 text-primary" aria-hidden="true" />
                  Domain, AWS, payments, email, and LMS rollout support
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <LeadCaptureModalTrigger
                  endpoint={leadsEndpoint}
                  source="contact-page"
                  leadType="enquiry"
                  buttonLabel="Send enquiry"
                  modalTitle="Tell us about your academy"
                  modalEyebrow="Contact KASA"
                  icon={<Mail className="size-4" aria-hidden="true" />}
                  buttonClassName={siteButtonClasses({
                    size: "sm",
                    className: "w-full justify-center",
                  })}
                />
                <ProductTourTrigger
                  label="Take a Product Tour"
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-background px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <div className="mx-auto flex w-full max-w-[108rem] flex-col items-center justify-between gap-4 rounded-[2rem] border border-blue-950/10 bg-white p-6 text-center shadow-xl shadow-blue-950/6 md:flex-row md:text-left dark:border-white/10 dark:bg-white/[0.04]">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Ready for a walkthrough?
              </div>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950 dark:text-white">
                See the same workflows inside the actual KASA demo.
              </h2>
            </div>
            <ProductTourTrigger
              label="Take a Product Tour"
              variant="solid"
              size="md"
              className="justify-center"
            />
          </div>
        </section>
      )}
    </>
  );
}
