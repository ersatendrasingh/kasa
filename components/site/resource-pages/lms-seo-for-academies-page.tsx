import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  Braces,
  CircleDot,
  FileSearch,
  GitBranch,
  LayoutTemplate,
  Link2,
  ListChecks,
  MessageCircleMore,
  MousePointerClick,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  WebPageStructuredData,
} from "@/components/site/structured-data";
import type { PageSummary } from "@/lib/site-content";

const faqs: Array<[string, string]> = [
  [
    "Can an academy rank with only a homepage?",
    "A homepage can introduce the academy, but it usually cannot answer every specific search intent well. Separate course, solution, feature, location, comparison, pricing, and guide pages give each important question a focused destination while internal links keep the site connected.",
  ],
  [
    "What pages should an online academy website create first?",
    "Start with pages that reflect real offers and buyer questions: a clear homepage, individual program or course pages, audience or use-case pages, delivery and feature explanations, pricing or enquiry guidance, About, Contact, policies, and a few genuinely useful resources. Prioritize accuracy and usefulness over page count.",
  ],
  [
    "Should every keyword have a separate page?",
    "No. Create a separate page when the searcher expects a meaningfully different answer, offer, audience, or decision. Closely related phrases that share the same intent should normally be answered naturally on one strong page rather than split into thin variations.",
  ],
  [
    "How do internal links help an academy website?",
    "Internal links help learners and search engines discover related pages and understand their relationship. A useful guide can link to the relevant course, feature, solution, pricing, and enquiry path using descriptive anchor text that explains what the visitor will find next.",
  ],
  [
    "How long does academy SEO take to produce results?",
    "There is no guaranteed timeline. Results depend on crawlability, competition, site history, relevance, content quality, authority, demand, and ongoing improvements. Measure indexing, impressions, qualified clicks, enquiries, and enrolments instead of expecting an immediate ranking promise.",
  ],
  [
    "Is publishing a large number of AI-written pages a good SEO strategy?",
    "Volume alone is not a strategy. Pages should be accurate, useful, distinct, reviewed, and supported by real program details, examples, screenshots, policies, limitations, and expertise. Repetitive pages that add no new value can weaken the visitor experience and waste crawl attention.",
  ],
];

const pageRoles = [
  ["Homepage", "Brand + primary offer", "What does this academy help me achieve?", "/"],
  ["Solution", "Audience or operating need", "Is this designed for an institute like mine?", "/solutions/coaching-institutes"],
  ["Feature", "Capability evaluation", "How will live classes or course sales work?", "/features/live-class-management"],
  ["Resource", "Research and education", "How do I plan this properly?", "/resources/run-live-online-classes"],
  ["Comparison", "Alternative evaluation", "Which approach fits my requirements?", "/compare"],
  ["Pricing", "Commercial decision", "What is included and what needs scoping?", "/pricing"],
] as const;

const publishingChecks = [
  [Target, "One clear intent", "The page answers one recognisable search need instead of mixing unrelated topics."],
  [BookOpenText, "Complete answer", "Important questions, workflow, requirements, limitations, examples, and next steps are present."],
  [ShieldCheck, "Credible detail", "Real program facts, ownership, policies, screenshots, proof, and honest boundaries support the claims."],
  [LayoutTemplate, "Readable experience", "Headings, paragraphs, media, tables, and mobile layout make the answer easy to use."],
  [Link2, "Connected context", "Relevant pages link in and out with descriptive, natural anchors."],
  [MousePointerClick, "Useful next action", "The visitor can explore a course, feature, price, demo, or contact path without pressure."],
] as const;

export function LmsSeoForAcademiesPage({ page }: { page: PageSummary }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Resources", href: "/resources" },
          { name: page.title, href: `/resources/${page.slug}` },
        ]}
      />
      <WebPageStructuredData name={page.title} description={page.description} href={`/resources/${page.slug}`} pageType="Article" />
      <FaqStructuredData faqs={faqs} />

      <main className="overflow-hidden bg-[#f3f2ed] text-[#111318] dark:bg-[#07101f] dark:text-white">
        <section className="relative px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(17,19,24,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(17,19,24,.045)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)] dark:bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)]" />
          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><Link href="/resources" className="hover:text-primary">Resources</Link><span>/</span><span className="text-[#111318] dark:text-white">SEO for academies</span></nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center xl:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 border border-[#287d70]/20 bg-[#bfeee5] px-3 py-1.5 text-[.68rem] font-bold uppercase tracking-[.2em] text-[#123c4b]"><FileSearch className="size-3.5" />Academy search playbook</div>
                <h1 className="mt-5 max-w-2xl font-heading text-[2.4rem] font-semibold leading-[1.04] tracking-[-.045em] sm:text-5xl lg:text-[3.45rem]">Turn your academy website into a <span className="underline decoration-[#58cdb6] decoration-[.22em] underline-offset-[-.06em]">useful search destination.</span></h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">Create focused pages for real learner and buyer questions, connect them into a clear topic system, and guide qualified visitors toward the right program or conversation.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row"><ProductTourTrigger label="Map my website journey" variant="solid" size="sm" className="justify-center" /><Link href="/features/academy-website-builder" className="inline-flex h-10 items-center justify-center gap-2 border border-[#111318]/15 bg-white/60 px-5 text-sm font-semibold dark:border-white/15 dark:bg-white/5">Explore academy websites <ArrowRight className="size-4" /></Link></div>
              </div>

              <div className="border border-[#111318]/15 bg-white shadow-[10px_10px_0_#111318] dark:border-white/15 dark:bg-[#0b172a] dark:shadow-[10px_10px_0_#58cdb6]">
                <div className="flex items-center gap-3 border-b border-[#111318]/10 p-3 dark:border-white/10"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-[#ff6b5f]" /><span className="size-2.5 rounded-full bg-[#f4c94d]" /><span className="size-2.5 rounded-full bg-[#55c98b]" /></div><div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#111318]/10 px-3 py-2 text-[.68rem] text-slate-500 dark:border-white/10 dark:text-slate-400"><Search className="size-3.5" />best LMS for coaching institute</div></div>
                <div className="p-4 sm:p-5"><p className="text-[.6rem] font-semibold uppercase tracking-[.16em] text-slate-400">Search results · intent: evaluate</p><div className="mt-4 border-l-4 border-[#58cdb6] pl-4"><p className="text-[.66rem] text-emerald-700 dark:text-emerald-300">getkasa.in › compare › best-lms...</p><p className="mt-1 font-heading text-lg font-semibold text-[#194ea5] dark:text-blue-300">What makes the best LMS for coaching institutes?</p><p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">Evaluate batches, live and recorded delivery, payments, learner tracking, certificates, ownership, implementation, and support.</p></div><div className="mt-5 grid gap-2 sm:grid-cols-3">{[["Solution", "For institute fit"], ["Feature", "For capability"], ["Guide", "For planning"]].map(([type, purpose]) => <div key={type} className="border border-[#111318]/10 bg-[#f5f5f0] p-3 dark:border-white/10 dark:bg-white/[.04]"><p className="font-mono text-[.58rem] text-slate-400">PAGE TYPE</p><p className="mt-2 text-sm font-semibold">{type}</p><p className="mt-1 text-[.65rem] text-slate-500 dark:text-slate-400">{purpose}</p></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-[#111318]/10 pt-4 text-[.66rem] dark:border-white/10"><span className="flex items-center gap-2"><CircleDot className="size-3 text-emerald-500" />One query, one best destination</span><span className="font-mono text-slate-400">01 / 01</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#111318]/15 bg-[#111318] px-4 py-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">{[["01", "Discover", "A practical guide answers the early question."], ["02", "Evaluate", "A solution, feature, or comparison adds decision detail."], ["03", "Act", "Pricing, a relevant course, or a conversation becomes the next step."]].map(([number, title, text], index) => <div key={number} className="flex gap-4 border-white/15 p-2 md:border-r md:pr-6 last:border-r-0"><span className="font-mono text-xs text-[#65dec6]">{number}</span><div><h2 className="font-heading text-xl font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-300">{text}</p></div>{index < 2 ? <ArrowRight className="ml-auto hidden size-4 self-center text-[#65dec6] md:block" /> : null}</div>)}</div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-7 lg:grid-cols-[.34fr_.66fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary dark:text-[#65dec6]">Page architecture</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Different questions deserve different pages.</h2></div><p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">Do not create pages merely to repeat a keyword. Give every page a distinct job in the research and buying journey, then make that job obvious in its title, main heading, copy, proof, and links.</p></div>
            <div className="mt-8 overflow-hidden border border-[#111318]/15 dark:border-white/15"><div className="hidden grid-cols-[.18fr_.22fr_.44fr_.16fr] bg-[#111318] px-4 py-3 text-[.62rem] font-semibold uppercase tracking-[.14em] text-slate-300 md:grid"><span>Page</span><span>Role</span><span>Question answered</span><span>Example</span></div>{pageRoles.map(([type, role, question, href], index) => <div key={type} className="grid gap-3 border-b border-[#111318]/10 bg-white/60 p-4 last:border-b-0 md:grid-cols-[.18fr_.22fr_.44fr_.16fr] md:items-center dark:border-white/10 dark:bg-white/[.035]"><div className="flex items-center gap-3"><span className="font-mono text-[.6rem] text-primary/50 dark:text-[#65dec6]/70">0{index + 1}</span><strong className="text-sm">{type}</strong></div><span className="text-xs text-slate-500 dark:text-slate-400">{role}</span><span className="text-sm leading-6">{question}</span><Link href={href} className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-[#65dec6]">View example <ArrowRight className="size-3.5" /></Link></div>)}</div>
          </div>
        </section>

        <section className="border-y border-[#111318]/10 bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 dark:border-white/10 dark:bg-[#0a1526]">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.43fr_.57fr] lg:items-center">
            <div className="relative min-h-[28rem] border border-[#111318]/15 bg-[#eef0e8] p-5 dark:border-white/15 dark:bg-[#0c1b31]"><div className="flex items-center justify-between"><span className="text-[.62rem] font-bold uppercase tracking-[.16em]">Topic system / coaching academy</span><GitBranch className="size-4 text-primary dark:text-[#65dec6]" /></div><div className="absolute left-1/2 top-20 h-[19rem] w-px -translate-x-1/2 bg-[#111318]/15 dark:bg-white/15" /><div className="relative mx-auto mt-7 w-fit border-2 border-[#174f62] bg-[#bfeee5] px-5 py-3 text-center text-sm font-bold text-[#123c4b]">Coaching institute LMS</div><div className="relative mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3">{[["Live classes", "/features/live-class-management"], ["Course selling", "/features/course-selling-platform"], ["Exams & proof", "/features/exams-assignments-certificates"], ["Institute fit", "/solutions/coaching-institutes"], ["Implementation", "/compare/kasa-vs-custom-lms-development"], ["Price & scope", "/pricing"]].map(([label, href]) => <Link key={label} href={href} className="relative z-10 border border-[#111318]/15 bg-white p-3 text-center text-xs font-semibold transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-[#12233c]"><span className="absolute -top-8 left-1/2 h-8 w-px bg-[#111318]/15 dark:bg-white/15" />{label}</Link>)}</div><p className="absolute bottom-4 left-5 right-5 text-center font-mono text-[.58rem] uppercase tracking-[.13em] text-slate-400">Links express relationships · content earns usefulness</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary dark:text-[#65dec6]">Internal linking</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Build paths that make sense even without a search engine.</h2><p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">A useful internal link answers the visitor’s next question. A live-class guide can link to the live-class feature, the coaching-institute use case, pricing scope, and a product walkthrough because those are natural next decisions.</p><div className="mt-6 space-y-3">{[["Use descriptive anchors", "Prefer ‘live-class management workflow’ over repeated generic ‘click here’ text."], ["Link in both directions", "A guide can support a feature page, and the feature page can point back to deeper planning advice."], ["Keep important pages reachable", "Navigation, indexes, breadcrumbs, contextual links, and XML sitemaps should work together."], ["Remove orphaned and dead paths", "Every published page needs a clear owner, incoming context, and a maintained destination."]].map(([title, text], index) => <div key={title} className="grid gap-2 border-t border-[#111318]/10 py-3 sm:grid-cols-[2rem_.42fr_.58fr] dark:border-white/10"><span className="font-mono text-[.62rem] text-primary/50">0{index + 1}</span><h3 className="text-sm font-semibold">{title}</h3><p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></div>)}</div></div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl"><div className="grid gap-7 lg:grid-cols-[.36fr_.64fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary dark:text-[#65dec6]">Useful, not padded</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">A page earns its place by helping someone decide or do something.</h2><p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">Word count is not the goal. Cover the subject to the depth the visitor needs, remove repetition, and include the details generic competitors cannot honestly provide.</p></div><div className="grid gap-px overflow-hidden border border-[#111318]/15 bg-[#111318]/15 sm:grid-cols-2 dark:border-white/15 dark:bg-white/15">{publishingChecks.map(([Icon, title, text], index) => <article key={title} className="bg-[#f8f7f2] p-4 dark:bg-[#0c192d]"><div className="flex items-center justify-between"><Icon className="size-5 text-primary dark:text-[#65dec6]" /><span className="font-mono text-[.58rem] text-slate-400">0{index + 1}</span></div><h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></article>)}</div></div></div>
        </section>

        <section className="border-y border-white/10 bg-[linear-gradient(115deg,#123f76,#176b91_55%,#16816f)] px-4 py-12 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.36fr_.64fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em]">Before publishing</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">Technical basics protect good content from avoidable problems.</h2></div><div className="grid gap-3 sm:grid-cols-2">{[
            [Braces, "Indexability", "The intended canonical URL is crawlable, indexable, and not blocked by accidental directives."],
            [LayoutTemplate, "Page signals", "Title, main heading, description, URL, structured data, and visible copy agree on the page purpose."],
            [BarChart3, "Performance", "Mobile layout, media sizing, loading behavior, and interaction stability are tested on real pages."],
            [ListChecks, "Maintenance", "Sitemaps, redirects, broken links, duplicate pages, outdated facts, and conversions are reviewed regularly."],
          ].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof Braces; return <article key={String(title)} className="border border-white/15 bg-white/[.09] p-4 shadow-[0_12px_30px_-24px_rgba(0,0,0,.7)] backdrop-blur-sm"><ItemIcon className="size-5 text-[#7be2cf]" /><h3 className="mt-4 font-heading text-lg font-semibold">{String(title)}</h3><p className="mt-2 text-xs leading-5 text-blue-50/85">{String(text)}</p></article>; })}</div></div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.32fr_.68fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary dark:text-[#65dec6]">Academy SEO questions</p><h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">Build for relevance, clarity, and trust—not a ranking shortcut.</h2><div className="mt-6 border border-[#111318]/15 bg-[#111318] p-5 text-white dark:border-white/15"><MessageCircleMore className="size-5 text-[#65dec6]" /><p className="mt-4 font-heading text-lg font-semibold">Start with one real search journey.</p><p className="mt-2 text-sm leading-6 text-slate-300">Map the question, best page, proof, related context, and next useful action.</p><ProductTourTrigger label="Map the website workflow" variant="solid" size="sm" className="mt-5 w-full justify-center" /></div></div><div className="border-t border-[#111318]/15 dark:border-white/15">{faqs.map(([question, answer], index) => <details key={question} open={index === 0} className="group border-b border-[#111318]/15 py-5 dark:border-white/15"><summary className="flex cursor-pointer list-none items-start justify-between gap-5"><span className="flex gap-3"><span className="mt-1 font-mono text-[.62rem] text-primary/45">0{index + 1}</span><span className="font-heading text-base font-semibold leading-7 sm:text-lg">{question}</span></span><span className="grid size-8 shrink-0 place-items-center border border-[#111318]/20 text-primary transition group-open:rotate-45 dark:border-white/20 dark:text-[#65dec6]">+</span></summary><p className="mt-3 max-w-3xl pl-10 pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p></details>)}</div></div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-6 border-2 border-[#111318] bg-white p-6 shadow-[8px_8px_0_#58cdb6] sm:p-8 lg:flex-row lg:items-center lg:justify-between dark:bg-[#0b172a] dark:shadow-[8px_8px_0_#58cdb6]"><div><div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary dark:text-[#65dec6]"><Sparkles className="size-4" />Ready to connect discovery with enrolment?</div><h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-tight">Map one topic cluster around a real academy offer.</h2></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row"><ProductTourTrigger label="Plan the KASA journey" variant="solid" size="sm" className="justify-center" /><Link href="/resources" className="inline-flex h-10 items-center justify-center gap-2 border border-[#111318]/20 px-5 text-sm font-semibold dark:border-white/20">Explore all resources <ArrowRight className="size-4" /></Link></div></div></section>
      </main>
    </>
  );
}
