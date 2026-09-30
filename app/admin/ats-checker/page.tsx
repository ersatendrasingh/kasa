import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ArrowRightIcon, BarChart3Icon, CheckCircle2Icon, ChevronLeftIcon, FileWarningIcon, UsersIcon } from "lucide-react";
import { AtsCheckerBoard, type AtsCheckRow, type AtsHistoryItem } from "@/components/admin/ats/ats-checker-board";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/admin/auth";
import { decryptPrivateValue } from "@/lib/admin/crypto";
import { prisma } from "@/lib/admin/prisma";
import { atsCheckStatuses, type AtsCheckStatus } from "@/lib/ats/analytics";

export const dynamic = "force-dynamic";
const statuses = ["ALL", ...atsCheckStatuses] as const;
const scoreOptions = ["ALL", "LOW", "MID", "HIGH", "NO_SCORE"] as const;
const checkCountOptions = ["ALL", "ONE", "TWO_TO_THREE", "FOUR_TO_NINE", "TEN_PLUS"] as const;
type Params = { status?: string; score?: string; checkCount?: string; format?: string; role?: string; from?: string; to?: string; page?: string };
const pageSize = 20;

function date(value?: string, end = false) { if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined; const parsed = new Date(`${value}T00:00:00.000Z`); if (end) parsed.setUTCDate(parsed.getUTCDate() + 1); return Number.isNaN(parsed.getTime()) ? undefined : parsed; }

export default async function AtsCheckerAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const status = statuses.includes(params.status as (typeof statuses)[number]) ? params.status! : "ALL";
  const score = scoreOptions.includes(params.score as (typeof scoreOptions)[number]) ? params.score! : "ALL";
  const checkCount = checkCountOptions.includes(params.checkCount as (typeof checkCountOptions)[number]) ? params.checkCount! : "ALL";
  const role = String(params.role || "").trim().slice(0, 80), format = String(params.format || "").trim().toLowerCase().slice(0, 12), from = date(params.from), to = date(params.to, true);
  const where: Prisma.AtsResumeCheckWhereInput = { ...(status !== "ALL" ? { status: status as AtsCheckStatus } : {}), ...(role ? { targetRole: { contains: role, mode: "insensitive" } } : {}), ...(format ? { fileExtension: format } : {}), ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } } : {}) };
  if (score === "LOW") where.atsScore = { lt: 50 }; if (score === "MID") where.atsScore = { gte: 50, lt: 75 }; if (score === "HIGH") where.atsScore = { gte: 75 }; if (score === "NO_SCORE") where.atsScore = null;
  if (checkCount === "ONE") where.visitor = { totalChecks: 1 };
  if (checkCount === "TWO_TO_THREE") where.visitor = { totalChecks: { gte: 2, lte: 3 } };
  if (checkCount === "FOUR_TO_NINE") where.visitor = { totalChecks: { gte: 4, lte: 9 } };
  if (checkCount === "TEN_PLUS") where.visitor = { totalChecks: { gte: 10 } };
  const [total, attention, average, visitors, formats] = await Promise.all([
    prisma.atsResumeCheck.count({ where }), prisma.atsResumeCheck.count({ where: { ...where, status: { not: "COMPLETED" } } }), prisma.atsResumeCheck.aggregate({ where: { ...where, status: "COMPLETED", atsScore: { not: null } }, _avg: { atsScore: true } }), prisma.atsResumeCheck.groupBy({ where, by: ["visitorId"] }), prisma.atsResumeCheck.findMany({ where: { fileExtension: { not: null } }, distinct: ["fileExtension"], select: { fileExtension: true }, orderBy: { fileExtension: "asc" } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const page = Math.min(requestedPage, totalPages);
  const checks = await prisma.atsResumeCheck.findMany({ where, include: { visitor: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize });
  const ids = [...new Set(checks.map((check) => check.visitorId))];
  const history = ids.length ? await prisma.atsResumeCheck.findMany({ where: { visitorId: { in: ids } }, orderBy: { createdAt: "desc" }, take: 500 }) : [];
  const historyMap = new Map<string, AtsHistoryItem[]>();
  for (const item of history) { const list = historyMap.get(item.visitorId) || []; list.push({ id: item.id, createdAt: item.createdAt.toISOString(), status: item.status, score: item.atsScore, jobMatchScore: item.jobMatchScore, targetRole: item.targetRole, fileExtension: item.fileExtension, errorCode: item.errorCode }); historyMap.set(item.visitorId, list); }
  const rows: AtsCheckRow[] = checks.map((check) => ({ id: check.id, createdAt: check.createdAt.toISOString(), status: check.status, score: check.atsScore, jobMatchScore: check.jobMatchScore, targetRole: check.targetRole, roleFamily: check.roleFamily, fileExtension: check.fileExtension, errorCode: check.errorCode, hasJobDescription: check.hasJobDescription, candidate: { id: check.visitorId, name: decryptPrivateValue(check.visitor.candidateNameEncrypted), email: decryptPrivateValue(check.visitor.emailEncrypted), phone: decryptPrivateValue(check.visitor.phoneEncrypted), firstSeenAt: check.visitor.firstSeenAt.toISOString(), lastSeenAt: check.visitor.lastSeenAt.toISOString(), totalChecks: check.visitor.totalChecks, completedChecks: check.visitor.completedChecks }, history: historyMap.get(check.visitorId) || [] }));
  const cards = [["Total checks", total, "Matching current filters", BarChart3Icon, "text-blue-600"], ["Candidates", visitors.length, "Unique resume profiles", UsersIcon, "text-violet-600"], ["Average score", average._avg.atsScore == null ? "—" : Math.round(average._avg.atsScore), "Completed checks only", CheckCircle2Icon, "text-emerald-600"], ["Needs attention", attention, "Unreadable, invalid, or failed", FileWarningIcon, "text-amber-600"]] as const;
  const paginationHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (status !== "ALL") query.set("status", status);
    if (score !== "ALL") query.set("score", score);
    if (checkCount !== "ALL") query.set("checkCount", checkCount);
    if (format) query.set("format", format);
    if (role) query.set("role", role);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    if (targetPage > 1) query.set("page", String(targetPage));
    const value = query.toString();
    return value ? `/admin/ats-checker?${value}` : "/admin/ats-checker";
  };
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1);
  return <AdminShell adminName={admin.name} adminEmail={admin.email} pageTitle="ATS checker intelligence" pageDescription="See candidate details, score changes, and uploads that need attention." pageEyebrow="Tool analytics" actions={<Button asChild variant="outline"><Link href="/tools/resume-ats-checker" target="_blank">Open ATS checker</Link></Button>}>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, helper, Icon, tone]) => <Card key={label} className="border-blue-100 bg-white shadow-[0_10px_28px_rgba(31,93,173,0.05)] dark:border-white/10 dark:bg-slate-950"><CardContent className="flex items-start justify-between gap-4 p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 font-heading text-4xl font-semibold text-slate-950 dark:text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{helper}</p></div><Icon className={`size-5 ${tone}`} /></CardContent></Card>)}</section>
    <Card className="border-blue-100 bg-white shadow-[0_10px_28px_rgba(31,93,173,0.05)] dark:border-white/10 dark:bg-slate-950"><CardContent className="p-5"><form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8" method="get"><Filter label="Check status"><select name="status" defaultValue={status} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="ALL">All outcomes</option>{atsCheckStatuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></Filter><Filter label="Score range"><select name="score" defaultValue={score} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="ALL">All scores</option><option value="LOW">Below 50</option><option value="MID">50–74</option><option value="HIGH">75–100</option><option value="NO_SCORE">No score</option></select></Filter><Filter label="Check frequency"><select name="checkCount" defaultValue={checkCount} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="ALL">Any check count</option><option value="ONE">First-time · 1</option><option value="TWO_TO_THREE">Repeat · 2–3</option><option value="FOUR_TO_NINE">Frequent · 4–9</option><option value="TEN_PLUS">High activity · 10+</option></select></Filter><Filter label="Input type"><select name="format" defaultValue={format} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="">All types</option>{formats.flatMap((item) => item.fileExtension ? [<option key={item.fileExtension} value={item.fileExtension}>{item.fileExtension.toUpperCase()}</option>] : [])}</select></Filter><Filter label="Target role"><Input name="role" defaultValue={role} placeholder="e.g. Data Analyst" className="border-blue-200" /></Filter><Filter label="From date"><Input name="from" type="date" defaultValue={params.from} className="border-blue-200" /></Filter><Filter label="To date"><Input name="to" type="date" defaultValue={params.to} className="border-blue-200" /></Filter><div className="flex items-end gap-2"><Button type="submit" className="flex-1">Apply</Button><Button asChild variant="outline"><Link href="/admin/ats-checker">Clear</Link></Button></div></form></CardContent></Card>
    <AtsCheckerBoard checks={rows} total={total} />
    <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/55 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04] lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-300">Showing {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} of {total} checks</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {page > 1 ? <Button asChild variant="outline" size="sm" className="bg-white"><Link href={paginationHref(page - 1)}><ChevronLeftIcon className="size-4" />Previous</Link></Button> : <Button variant="outline" size="sm" className="bg-white" disabled><ChevronLeftIcon className="size-4" />Previous</Button>}
        {visiblePages.map((value, index) => <span key={value} className="contents">{index > 0 && value - visiblePages[index - 1] > 1 ? <span className="px-1 text-slate-500">…</span> : null}<Button asChild size="sm" variant={value === page ? "default" : "outline"} className={value === page ? "!text-white" : "bg-white"}><Link href={paginationHref(value)}>{value}</Link></Button></span>)}
        {page < totalPages ? <Button asChild variant="outline" size="sm" className="bg-white"><Link href={paginationHref(page + 1)}>Next<ArrowRightIcon className="size-4" /></Link></Button> : <Button variant="outline" size="sm" className="bg-white" disabled>Next<ArrowRightIcon className="size-4" /></Button>}
      </div>
    </div>
  </AdminShell>;
}
function Filter({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span>{label}</span>{children}</label>; }
