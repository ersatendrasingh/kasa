import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDot, Mail, MessageCircleMore, Route, ShieldCheck, Sparkles } from "lucide-react";
import { ContactEnquiryForm } from "@/components/site/contact-enquiry-form";
import { BreadcrumbStructuredData, WebPageStructuredData } from "@/components/site/structured-data";

export const metadata: Metadata = {
  title: "Contact KASA | Book LMS Demo for Your Academy",
  description:
    "Contact KASA to discuss LMS software for coaching institutes, online academies, trainers, and EdTech teams.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Home", href: "/" }, { name: "Company", href: "/why-kasa" }, { name: "Contact KASA", href: "/contact" }]} />
      <WebPageStructuredData name="Contact KASA" description="Tell KASA about your academy workflow and plan a focused LMS conversation." href="/contact" />

      <main className="overflow-hidden bg-[#f7f8fb] text-slate-950 dark:bg-[#061126] dark:text-white">
        <section className="relative bg-[#f7f4ed] px-4 pb-16 pt-32 text-slate-950 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 dark:bg-[#09162c] dark:text-white">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-48 top-0 size-[32rem] rounded-full bg-blue-200/55 blur-[125px] dark:bg-blue-500/10" />
            <div className="absolute -right-32 bottom-0 size-[35rem] rounded-full bg-emerald-200/60 blur-[135px] dark:bg-emerald-400/10" />
            <div className="absolute left-[43%] top-0 h-full w-px bg-blue-950/[.06] dark:bg-white/10" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-white/55"><Link href="/" className="transition hover:text-primary dark:hover:text-white">Home</Link><span>/</span><span className="text-slate-900 dark:text-white">Contact KASA</span></nav>

            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center xl:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300"><MessageCircleMore className="size-4" />A conversation with context</div>
                <h1 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-[1.04] tracking-[-.04em] sm:text-5xl lg:text-[3.35rem]">Bring the workflow.<span className="mt-1 block bg-[image:var(--stat-gradient)] bg-clip-text text-transparent">We’ll bring the right demo.</span></h1>
                <p className="mt-6 max-w-lg text-[.96rem] leading-7 text-slate-600 dark:text-slate-300">Tell us how your academy sells, teaches, supports, and proves learning. We will prepare around your real operation—not run a generic feature tour.</p>

                <div className="mt-8 hidden max-w-lg border-y border-blue-950/10 py-2 sm:block dark:border-white/10">
                  {[["01", "Offer", "Programs, batches, and delivery model"], ["02", "Operation", "Tools, handoffs, and daily friction"], ["03", "Scale", "Learners, faculty, storage, and live usage"], ["04", "Goal", "What must work first after rollout"]].map(([number, title, text]) => (
                    <div key={number} className="grid grid-cols-[2rem_5rem_1fr] items-center gap-2 border-b border-blue-950/[.07] py-3 last:border-0 dark:border-white/8">
                      <span className="font-mono text-[.65rem] text-primary/55 dark:text-emerald-300/70">{number}</span><span className="text-xs font-semibold text-slate-950 dark:text-white">{title}</span><span className="text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</span>
                    </div>
                  ))}
                </div>

                <a href="mailto:contact@getkasa.in" className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-primary sm:mt-6 dark:text-white"><span className="grid size-10 place-items-center rounded-full border border-primary/15 bg-white/70 transition group-hover:bg-white dark:border-white/15 dark:bg-white/5 dark:group-hover:bg-white/10"><Mail className="size-4" /></span><span><span className="block text-[.62rem] uppercase tracking-[.16em] text-slate-400">Prefer email?</span>contact@getkasa.in</span></a>
              </div>

              <div className="relative lg:pl-4">
                <div className="absolute -left-5 top-10 hidden h-[72%] w-px bg-gradient-to-b from-transparent via-blue-400/45 to-transparent lg:block" />
                <div className="absolute -right-4 -top-4 hidden rounded-full border border-primary/15 bg-white/90 px-4 py-2 text-[.65rem] font-semibold uppercase tracking-[.16em] text-primary shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2 dark:border-white/15 dark:bg-[#0c2449]/90 dark:text-emerald-200"><CircleDot className="size-3 text-emerald-600 dark:text-emerald-300" />Routes to KASA Leads</div>
                <div className="overflow-hidden rounded-[1.75rem] border border-blue-950/10 bg-white shadow-[0_40px_100px_-42px_rgba(20,65,130,.5)] dark:border-white/15 dark:bg-[#0a1730]"><ContactEnquiryForm /></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-950/8 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/8 dark:bg-[#08152a]">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[.34fr_.66fr]">
              <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">After you press send</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">A clear path—not a sales maze.</h2></div>
              <div className="grid border-l border-t border-blue-950/10 sm:grid-cols-3 dark:border-white/10">
                {[["01", "Context review", "We read the workflow, goals, current setup, and constraints you shared."], ["02", "Focused conversation", "The discussion starts with your academy model and the handoffs that need attention."], ["03", "Relevant walkthrough", "The demo uses one realistic program or batch instead of a generic feature parade."]].map(([number, title, text]) => <article key={number} className="border-b border-r border-blue-950/10 p-5 dark:border-white/10"><span className="text-xs font-semibold text-primary/50 dark:text-emerald-200/50">{number}</span><h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.7fr_.3fr] lg:items-center">
            <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-primary dark:text-emerald-300">Bring one real example</p><h2 className="mt-3 max-w-4xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">The best contact request describes a real program, batch, or operational problem.</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">You do not need a finished requirement document. A rough learner journey, current tool list, expected users, and the first problem you want to solve are enough to begin.</p></div>
            <div className="border-l border-blue-950/10 pl-6 dark:border-white/10"><Sparkles className="size-5 text-primary dark:text-emerald-300" /><p className="mt-4 font-heading text-xl font-semibold">Planning something early?</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Share the idea before choosing a stack. We can still discuss what KASA can and cannot cover.</p><Link href="/why-kasa" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-emerald-300">Read why KASA exists <ArrowRight className="size-4" /></Link></div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {[[Route, "Workflow before features", "We map how information moves between sales, teaching, learning, and proof."], [ShieldCheck, "Honest scope", "Fit, dependencies, limits, and rollout responsibilities belong in the conversation."], [Mail, "One direct channel", "Use the form or email contact@getkasa.in—both reach the KASA team."]].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof Route; return <article key={String(title)} className="rounded-2xl border border-blue-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/[.035]"><ItemIcon className="size-5 text-primary dark:text-emerald-300" /><h3 className="mt-4 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></article>; })}
          </div>
        </section>
      </main>
    </>
  );
}
