"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDaysIcon, EyeIcon, LoaderCircleIcon, MailIcon, MoreHorizontalIcon, PhoneIcon, Trash2Icon, UserRoundIcon } from "lucide-react";
import { deleteAtsCandidateAction } from "@/actions/admin/ats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type AtsHistoryItem = { id: string; createdAt: string; status: string; score: number | null; jobMatchScore: number | null; targetRole: string | null; fileExtension: string | null; errorCode: string | null };
export type AtsCheckRow = AtsHistoryItem & { candidate: { id: string; name: string | null; email: string | null; phone: string | null; firstSeenAt: string; lastSeenAt: string; totalChecks: number; completedChecks: number }; roleFamily: string | null; hasJobDescription: boolean; history: AtsHistoryItem[] };

function statusClass(status: string) {
  if (status === "COMPLETED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "UNREADABLE") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function candidateLabel(candidate: AtsCheckRow["candidate"]) {
  return candidate.name || candidate.email || "Resume candidate";
}

function checkCountClass(count: number) {
  if (count >= 10) return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200";
  if (count >= 4) return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200";
  if (count >= 2) return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-200";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-200";
}

export function AtsCheckerBoard({ checks, total }: { checks: AtsCheckRow[]; total: number }) {
  const [selectedCandidate, setSelectedCandidate] = useState<AtsCheckRow | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<AtsCheckRow | null>(null);

  return <>
    <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_18px_45px_rgba(25,86,170,0.07)] dark:border-white/10 dark:bg-slate-950">
      <div className="flex flex-col gap-2 border-b border-blue-100 px-5 py-5 md:flex-row md:items-center md:justify-between dark:border-white/10"><div><h2 className="font-heading text-xl font-semibold text-slate-950 dark:text-white">Candidate checks</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Each candidate appears once; open the profile to review every recorded score.</p></div><span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-400/10 dark:text-blue-200">{total} matching candidates</span></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-sm"><thead className="border-b border-blue-100 bg-white text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"><tr><th className="px-5 py-4">Candidate</th><th className="px-5 py-4">Latest score</th><th className="px-5 py-4">Target role</th><th className="px-5 py-4">Check status</th><th className="px-5 py-4">Input</th><th className="px-5 py-4">Last check</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-blue-50 dark:divide-white/8">{checks.map((check) => <tr key={check.id} className="bg-white transition-colors hover:bg-blue-50/45 dark:bg-slate-950 dark:hover:bg-white/[0.04]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-400/15 dark:text-blue-200">{candidateLabel(check.candidate).slice(0, 1).toUpperCase()}</span><div><p className="font-semibold text-slate-900 dark:text-white">{candidateLabel(check.candidate)}</p><p className="mt-0.5 text-xs text-slate-500">{check.candidate.email || check.candidate.phone || "Contact not detected"}</p></div></div></td><td className="px-5 py-4"><p className="font-heading text-xl font-semibold text-slate-950 dark:text-white">{check.score == null ? "—" : `${check.score}/100`}</p>{check.jobMatchScore != null ? <p className="text-xs text-slate-500">Job match {check.jobMatchScore}%</p> : null}</td><td className="px-5 py-4"><p className="font-semibold text-slate-800 dark:text-white">{check.targetRole || "General review"}</p><p className="text-xs text-slate-500">{check.roleFamily || "No role family"}</p></td><td className="px-5 py-4"><div className="flex flex-wrap items-center gap-1.5"><Badge variant="outline" className={statusClass(check.status)}>{check.status.replaceAll("_", " ")}</Badge><Badge variant="outline" title={`${check.candidate.totalChecks} total checks by this candidate`} className={`px-1.5 py-0 text-[10px] font-bold ${checkCountClass(check.candidate.totalChecks)}`}>{check.candidate.totalChecks} {check.candidate.totalChecks === 1 ? "check" : "checks"}</Badge></div>{check.errorCode ? <p className="mt-1 text-xs text-rose-600">{check.errorCode.replaceAll("_", " ")}</p> : null}</td><td className="px-5 py-4"><p className="font-semibold uppercase text-slate-700 dark:text-slate-200">{check.fileExtension || "text"}</p><p className="text-xs text-slate-500">{check.hasJobDescription ? "Job matched" : "General review"}</p></td><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatDate(check.createdAt)}</td><td className="px-5 py-4 text-right"><RowActions check={check} onView={() => setSelectedCandidate(check)} onDelete={() => setCandidateToDelete(check)} /></td></tr>)}{checks.length === 0 ? <tr><td colSpan={7} className="px-5 py-14 text-center text-sm text-slate-500">No candidate checks match these filters.</td></tr> : null}</tbody></table></div>
    </section>
    <CandidateProfileDialog check={selectedCandidate} open={Boolean(selectedCandidate)} onOpenChange={(open) => !open && setSelectedCandidate(null)} />
    <DeleteCandidateDialog check={candidateToDelete} open={Boolean(candidateToDelete)} onOpenChange={(open) => !open && setCandidateToDelete(null)} />
  </>;
}

function RowActions({ check, onView, onDelete }: { check: AtsCheckRow; onView: () => void; onDelete: () => void }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon-sm" aria-label={`Actions for ${candidateLabel(check.candidate)}`} className="border-blue-200 bg-white text-slate-700 hover:bg-blue-50 dark:bg-transparent"><MoreHorizontalIcon className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 rounded-xl border-blue-100 p-1.5 shadow-xl"><DropdownMenuItem className="gap-2 rounded-lg px-2.5 py-2 font-medium" onSelect={onView}><EyeIcon className="size-4 text-blue-600" />View profile</DropdownMenuItem><DropdownMenuItem variant="destructive" className="gap-2 rounded-lg px-2.5 py-2 font-medium" onSelect={onDelete}><Trash2Icon className="size-4" />Delete candidate</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}

function CandidateProfileDialog({ check, open, onOpenChange }: { check: AtsCheckRow | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!check) return null;
  const candidate = check.candidate;
  const completedHistory = check.history.filter((item) => item.score != null);
  const bestScore = completedHistory.length ? Math.max(...completedHistory.map((item) => item.score || 0)) : null;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90svh] !w-[min(96vw,70rem)] !max-w-[70rem] sm:!max-w-[70rem] overflow-y-auto rounded-[1.4rem] border border-blue-100 p-0 shadow-2xl dark:border-white/10"><DialogHeader className="border-b border-blue-100 bg-[linear-gradient(120deg,#eff6ff,white_55%,#ecfeff)] px-6 py-6 text-left dark:border-white/10 dark:bg-blue-400/10 md:px-8"><div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center"><span className="grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><UserRoundIcon className="size-7" /></span><div><DialogTitle className="font-heading text-2xl text-slate-950 dark:text-white">{candidateLabel(candidate)}</DialogTitle><DialogDescription className="mt-1">Candidate profile, contact details, and complete ATS history.</DialogDescription><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-300"><Contact icon={MailIcon} value={candidate.email} fallback="Email not detected" /><Contact icon={PhoneIcon} value={candidate.phone} fallback="Phone not detected" /></div></div><div className="rounded-2xl border border-blue-100 bg-white/90 px-5 py-3 text-left shadow-sm dark:border-white/10 dark:bg-slate-950/70"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">Latest ATS score</p><p className="mt-1 font-heading text-3xl font-semibold text-slate-950 dark:text-white">{check.score == null ? "—" : `${check.score}/100`}</p><p className="mt-1 text-xs font-medium text-emerald-700">Best recorded: {bestScore == null ? "—" : `${bestScore}/100`}</p></div></div></DialogHeader><div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.6fr)] md:px-8"><div className="space-y-4"><section className="rounded-2xl border border-blue-100 bg-white p-5 dark:border-white/10 dark:bg-slate-950"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Candidate details</p><div className="mt-4 space-y-3"><Info icon={CalendarDaysIcon} label="First check" value={formatDate(candidate.firstSeenAt)} /><Info icon={CalendarDaysIcon} label="Last active" value={formatDate(candidate.lastSeenAt)} /></div></section><section className="rounded-2xl border border-blue-100 bg-blue-50/45 p-5 dark:border-white/10 dark:bg-blue-400/10"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Activity summary</p><div className="mt-4 grid grid-cols-2 gap-3"><Metric label="Total checks" value={candidate.totalChecks} /><Metric label="Completed" value={candidate.completedChecks} /></div></section></div><section className="overflow-hidden rounded-2xl border border-blue-100 bg-white dark:border-white/10 dark:bg-slate-950"><div className="flex items-center justify-between border-b border-blue-100 px-5 py-4 dark:border-white/10"><div><h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Check history</h3><p className="mt-0.5 text-sm text-slate-500">Every review associated with this candidate.</p></div><Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{check.history.length} checks</Badge></div><div className="divide-y divide-blue-50 dark:divide-white/8">{check.history.map((item, index) => <div key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="grid size-8 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-400/10">{check.history.length - index}</span><div><p className="font-semibold text-slate-800 dark:text-white">{item.targetRole || "General review"}</p><p className="mt-0.5 text-xs text-slate-500">{formatDate(item.createdAt)} · {(item.fileExtension || "text").toUpperCase()}{item.jobMatchScore != null ? ` · Job match ${item.jobMatchScore}%` : ""}</p>{item.errorCode ? <p className="mt-1 text-xs font-medium text-rose-600">{item.errorCode.replaceAll("_", " ")}</p> : null}</div><div className="flex items-center gap-3 sm:block sm:text-right"><Badge variant="outline" className={statusClass(item.status)}>{item.status.replaceAll("_", " ")}</Badge><p className="mt-1 font-heading text-xl font-semibold text-slate-900 dark:text-white">{item.score == null ? "—" : `${item.score}/100`}</p></div></div>)}</div></section></div></DialogContent></Dialog>;
}

function DeleteCandidateDialog({ check, open, onOpenChange }: { check: AtsCheckRow | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!check) return null;

  function submitDelete(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await deleteAtsCandidateAction(formData);
      if (!result.ok) {
        setError(result.message || "The candidate could not be deleted.");
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  }

  return <AlertDialog open={open} onOpenChange={(nextOpen) => { if (!isPending) onOpenChange(nextOpen); }}><AlertDialogContent className="max-w-md rounded-xl border border-rose-100 p-6"><AlertDialogHeader><AlertDialogTitle className="text-lg">Delete {candidateLabel(check.candidate)}?</AlertDialogTitle><AlertDialogDescription>This permanently removes the candidate details, document record, and {check.candidate.totalChecks} ATS {check.candidate.totalChecks === 1 ? "check" : "checks"}. This cannot be undone.</AlertDialogDescription></AlertDialogHeader><form action={submitDelete} className="mt-5"><input type="hidden" name="visitorId" value={check.candidate.id} />{error ? <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}<AlertDialogFooter><AlertDialogCancel type="button" disabled={isPending}>Cancel</AlertDialogCancel><Button type="submit" variant="destructive" disabled={isPending} className="min-w-24 bg-rose-600 text-white hover:bg-rose-700">{isPending ? <><LoaderCircleIcon className="size-4 animate-spin" />Deleting…</> : <><Trash2Icon className="size-4" />Delete</>}</Button></AlertDialogFooter></form></AlertDialogContent></AlertDialog>;
}

function Contact({ icon: Icon, value, fallback }: { icon: typeof MailIcon; value: string | null; fallback: string }) {
  return <span className="inline-flex items-center gap-1.5"><Icon className="size-3.5 text-blue-600" />{value || fallback}</span>;
}

function Info({ icon: Icon, label, value }: { icon: typeof MailIcon; label: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-400/10"><Icon className="size-4" /></span><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p><p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-white">{value}</p></div></div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-blue-100 bg-white p-3 dark:border-white/10 dark:bg-slate-950"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 font-heading text-2xl font-semibold text-slate-900 dark:text-white">{value}</p></div>;
}
