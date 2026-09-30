import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileArchive,
  FileImage,
  FileStack,
  Gauge,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { pdfTools } from "@/lib/pdf-tools";

export const metadata: Metadata = {
  title: "Free PDF Tools - Private, Fast & No Uploads | KASA PDF",
  description: "Merge, split, compress, convert, rotate, watermark, protect and unlock PDFs free. Your files are processed privately in your browser with no signup.",
  keywords: ["free PDF tools", "merge PDF", "split PDF", "compress PDF", "PDF to JPG", "JPG to PDF", "private PDF tools", "PDF editor online"],
  alternates: { canonical: "/pdf-tools" },
};

const icons = [FileStack, FileArchive, Gauge, FileImage, FileImage, FileStack, FileArchive, FileStack, Sparkles, LockKeyhole, ShieldCheck];

export default function PdfToolsPage() {
  return (
    <main className="min-h-screen bg-[#f3f1ec] text-[#191919] dark:bg-[#0d0e10] dark:text-white">
      <section className="relative overflow-hidden bg-[#17181b] pt-48 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,90,95,.28),transparent_26rem),radial-gradient(circle_at_20%_80%,rgba(124,92,255,.18),transparent_22rem),linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:auto,auto,36px_36px,36px_36px]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3b3c42] bg-[#232429] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#e4e4e7]"><ShieldCheck className="size-3.5 text-[#ff696e]" /> Private browser processing</div>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-[-.045em] sm:text-5xl">Fast, private PDF tools<span className="text-[#ff696e]">.</span></h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#b8b8be] sm:text-base">Merge, split, compress, convert, organise, and secure PDFs without uploads, accounts, or download paywalls.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[{ icon: Zap, value: "Instant", label: "Local processing" }, { icon: ShieldCheck, value: "Private", label: "Zero uploads" }, { icon: Check, value: "Free", label: "No daily quota" }].map(({ icon: Icon, value, label }) => <div key={value} className="flex items-center gap-2.5 rounded-xl border border-[#38393f] bg-[#202126] px-3.5 py-2"><span className="grid size-7 place-items-center rounded-lg bg-[#303137] text-[#ff696e]"><Icon className="size-3.5" /></span><div className="flex items-baseline gap-1.5"><strong className="text-xs text-white">{value}</strong><span className="text-[11px] text-[#96969d]">{label}</span></div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div><span className="text-xs font-bold uppercase tracking-[.18em] text-black/38 dark:text-white/38">The toolkit</span><h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Pick a job. Finish it fast.</h2></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pdfTools.map((tool, index) => {
            const Icon = icons[index];
            return <Link key={tool.slug} href={`/pdf-tools/${tool.slug}`} className="group relative overflow-hidden rounded-[1.4rem] border border-black/10 bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_65px_rgba(34,28,22,.12)] dark:border-white/10 dark:bg-[#151619]">
              <div className="absolute -right-10 -top-10 size-32 rounded-full opacity-[.08] blur-2xl transition group-hover:opacity-20" style={{ background: tool.accent }} />
              <div className="relative flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl text-white shadow-lg" style={{ background: tool.accent, boxShadow: `0 12px 28px ${tool.accent}2d` }}><Icon className="size-5" /></span><ArrowRight className="size-5 text-black/25 transition group-hover:translate-x-1 group-hover:text-black dark:text-white/25 dark:group-hover:text-white" /></div>
              <h3 className="relative mt-7 font-heading text-xl font-semibold">{tool.title}</h3><p className="relative mt-3 min-h-20 text-sm leading-6 text-black/48 dark:text-white/48">{tool.description}</p><span className="relative mt-5 inline-flex rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-black/48 dark:border-white/10 dark:text-white/48">{tool.outcome}</span>
            </Link>;
          })}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-16 dark:border-white/10 dark:bg-[#131416]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
          <div><span className="text-xs font-bold uppercase tracking-[.18em] text-[#e94d52]">The KASA PDF difference</span><h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight">Privacy you don’t have to take on faith.</h2><p className="mt-5 text-sm leading-7 text-black/50 dark:text-white/48">Because processing runs in your browser, there is no document upload to delete later. Open a tool, finish the job, and close the tab.</p></div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2">{[["01", "No server queue", "Work begins as soon as you choose a file."], ["02", "No forced account", "Every core workflow starts without signup."], ["03", "Honest controls", "Quality and page ranges are visible before processing."], ["04", "Download means download", "No paywall appears after the work is done."]].map(([number, title, copy]) => <div key={number} className="bg-[#f8f7f3] p-6 dark:bg-[#191a1e]"><span className="font-mono text-xs text-[#e94d52]">{number}</span><h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-black/46 dark:text-white/44">{copy}</p></div>)}</div>
        </div>
      </section>
    </main>
  );
}
