import { Check, HelpCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/site/structured-data";
import { pdfTools, type PdfToolDefinition } from "@/lib/pdf-tools";
import { pdfToolDeepDives, pdfToolGuides } from "@/lib/pdf-tool-guides";

export function PdfToolGuide({ tool }: { tool: PdfToolDefinition }) {
  const guide = pdfToolGuides[tool.slug];
  const deepDive = pdfToolDeepDives[tool.slug];
  const url = `https://www.getkasa.in/pdf-tools/${tool.slug}`;
  const relatedTools = pdfTools.filter((item) => item.slug !== tool.slug).slice(0, 3);
  const usefulKasaLinks = tool.slug === "jpg-to-pdf" || tool.slug === "pdf-to-jpg"
    ? [{ href: "/tools/resume-ats-checker", label: "ATS Resume Checker", copy: "Check a resume before converting or sharing it." }, { href: "/tools/resume-builder-studio", label: "Resume Builder", copy: "Create a clean, ATS-friendly resume first." }]
    : tool.slug === "protect-pdf" || tool.slug === "unlock-pdf" || tool.slug === "add-pdf-watermark"
      ? [{ href: "/features/course-selling-platform", label: "Course selling platform", copy: "Control access and payments for course material." }, { href: "/features/exams-assignments-certificates", label: "Exams and certificates", copy: "Run protected academic workflows from one place." }]
      : [{ href: "/tools/final-year-project-kit-generator", label: "Final Year Project Kit", copy: "Build project documents, viva questions, and starter files." }, { href: "/tools/resume-builder-studio", label: "Resume Builder", copy: "Create a polished resume ready for PDF export." }];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${tool.title} by KASA`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            url,
            description: tool.description,
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: guide.stepsHeading,
            step: guide.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.body,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.getkasa.in/" },
              { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://www.getkasa.in/pdf-tools" },
              { "@type": "ListItem", position: 3, name: tool.title, item: url },
            ],
          },
        ]}
      />

      <section className="border-t border-black/10 bg-[#f4f2ed] py-14 text-[#181817] dark:border-white/10 dark:bg-[#0d0e10] dark:text-white sm:py-18">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-black/48 dark:text-white/48"><Link href="/" className="transition hover:text-black dark:hover:text-white">Home</Link><span aria-hidden="true">/</span><Link href="/pdf-tools" className="transition hover:text-black dark:hover:text-white">PDF tools</Link><span aria-hidden="true">/</span><span className="text-black dark:text-white">{tool.title}</span></nav>
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[.18em]" style={{ color: tool.accent }}>{guide.eyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">{guide.heading}</h2>
            <div className="mt-6 grid gap-4 text-[15px] leading-7 text-black/62 dark:text-white/58 md:grid-cols-2">
              {guide.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_.82fr] lg:items-start">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{guide.stepsHeading}</h2>
              <ol className="mt-6 grid gap-3">
                {guide.steps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[2.75rem_1fr] gap-4 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#17181b]">
                    <span className="grid size-11 place-items-center rounded-xl font-mono text-sm font-bold text-white" style={{ background: tool.accent }}>{String(index + 1).padStart(2, "0")}</span>
                    <div><h3 className="font-heading text-base font-semibold">{step.title}</h3><p className="mt-1.5 text-sm leading-6 text-black/55 dark:text-white/52">{step.body}</p></div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="rounded-3xl bg-[#18191d] p-6 text-white sm:p-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#b8b8be]"><ShieldCheck className="size-4" style={{ color: tool.accent }} /> Your finished file</div>
              <h2 className="mt-4 font-heading text-2xl font-semibold">{guide.outputHeading}</h2>
              <p className="mt-3 text-sm leading-6 text-[#b8b8be]">{guide.outputIntro}</p>
              <ul className="mt-5 grid gap-3">
                {guide.outputPoints.map((point) => <li key={point} className="flex items-start gap-3 text-sm text-[#e4e4e7]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full" style={{ background: `${tool.accent}25`, color: tool.accent }}><Check className="size-3" /></span>{point}</li>)}
              </ul>
              {guide.note ? <p className="mt-6 border-t border-[#34353a] pt-5 text-xs leading-5 text-[#9c9ca3]"><strong className="text-white">Worth knowing:</strong> {guide.note}</p> : null}
            </aside>
          </div>

          <section className="mt-16 border-t border-black/10 pt-12 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-[.16em]" style={{ color: tool.accent }}>Practical guide</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">Before you download, know what makes the result useful</h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">{deepDive.map((section) => <article key={section.heading} className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#17181b]"><h3 className="font-heading text-lg font-semibold leading-6">{section.heading}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-6 text-black/58 dark:text-white/55">{paragraph}</p>)}</article>)}</div>
          </section>

          <div className="mt-16 border-t border-black/10 pt-12 dark:border-white/10">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white shadow-sm dark:bg-[#202126]"><HelpCircle className="size-5" style={{ color: tool.accent }} /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/38">Questions people actually ask</p><h2 className="mt-1 font-heading text-2xl font-semibold">{tool.title} FAQ</h2></div></div>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {guide.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-black/10 bg-white p-5 open:border-black/25 dark:border-white/10 dark:bg-[#17181b] dark:open:border-white/25">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-[15px] font-semibold leading-6"><span>{faq.question}</span><span className="text-xl font-normal text-black/35 transition group-open:rotate-45 dark:text-white/35">+</span></summary>
                  <p className="mt-3 pr-7 text-sm leading-6 text-black/55 dark:text-white/52">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-6 border-t border-black/10 pt-12 dark:border-white/10 lg:grid-cols-2">
            <section><p className="text-xs font-bold uppercase tracking-[.16em] text-black/42 dark:text-white/42">Related PDF tools</p><h2 className="mt-2 font-heading text-2xl font-semibold">Keep the document moving</h2><div className="mt-5 grid gap-3">{relatedTools.map((item) => <Link key={item.slug} href={`/pdf-tools/${item.slug}`} className="group rounded-2xl border border-black/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-black/25 hover:shadow-lg dark:border-white/10 dark:bg-[#17181b] dark:hover:border-white/25"><strong className="text-sm">{item.title}</strong><span className="mt-1 block text-xs leading-5 text-black/52 dark:text-white/52">{item.description}</span></Link>)}</div></section>
            <section><p className="text-xs font-bold uppercase tracking-[.16em] text-black/42 dark:text-white/42">Useful KASA tools</p><h2 className="mt-2 font-heading text-2xl font-semibold">Continue with the next task</h2><div className="mt-5 grid gap-3">{usefulKasaLinks.map((item) => <Link key={item.href} href={item.href} className="group rounded-2xl border border-black/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-black/25 hover:shadow-lg dark:border-white/10 dark:bg-[#17181b] dark:hover:border-white/25"><strong className="text-sm">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-black/52 dark:text-white/52">{item.copy}</span></Link>)}</div></section>
          </div>
        </div>
      </section>
    </>
  );
}
