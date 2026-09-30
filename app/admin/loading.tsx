import { BarChart3Icon, LoaderCircleIcon } from "lucide-react";

export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eff7ff_55%,#eefcf7_100%)] dark:bg-slate-950">
      <div className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-blue-100 dark:bg-slate-800">
        <div className="h-full w-2/3 animate-pulse rounded-r-full bg-[linear-gradient(90deg,#1d4ed8,#0ea5e9,#10b981)] shadow-[0_0_18px_rgba(14,165,233,.7)]" />
      </div>
      <div className="grid min-h-screen lg:grid-cols-[18.5rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-blue-100 bg-white/90 p-6 lg:block dark:border-white/10 dark:bg-slate-950/90">
          <div className="h-12 w-40 animate-pulse rounded-xl bg-blue-100 dark:bg-white/10" />
          <div className="mt-14 space-y-3">{Array.from({ length: 7 }, (_, index) => <div key={index} className="h-11 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.06]" />)}</div>
        </aside>
        <section className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div role="status" aria-live="polite" className="mb-7 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-200"><LoaderCircleIcon className="size-5 animate-spin" /></span>
            <div><p className="font-semibold text-slate-900 dark:text-white">Loading dashboard…</p><p className="text-sm text-slate-500 dark:text-slate-300">Your click worked. Fetching the latest data.</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl border border-blue-100 bg-white/80 dark:border-white/10 dark:bg-white/[0.05]" />)}</div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-3 border-b border-blue-100 px-6 py-5 dark:border-white/10"><BarChart3Icon className="size-5 text-blue-600" /><div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-white/10" /></div>
            <div className="space-y-4 p-6">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.06]" />)}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
