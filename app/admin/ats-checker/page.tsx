import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { BarChart3Icon, CheckCircle2Icon, FileWarningIcon, UsersIcon } from "lucide-react";
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
type Params = { status?: string; score?: string; format?: string; role?: string; from?: string; to?: string };

function date(value?: string, end = false) { if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined; const parsed = new Date(`${value}T00:00:00.000Z`); if (end) parsed.setUTCDate(parsed.getUTCDate() + 1); return Number.isNaN(parsed.getTime()) ? undefined : parsed; }

export default async function AtsCheckerAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const status = statuses.includes(params.status as (typeof statuses)[number]) ? params.status! : "ALL";
  const score = scoreOptions.includes(params.score as (typeof scoreOptions)[number]) ? params.score! : "ALL";
  const role = String(params.role || "").trim().slice(0, 80), format = String(params.format || "").trim().toLowerCase().slice(0, 12), from = date(params.from), to = date(params.to, true);
  const where: Prisma.AtsResumeCheckWhereInput = { ...(status !== "ALL" ? { status: status as AtsCheckStatus } : {}), ...(role ? { targetRole: { contains: role, mode: "insensitive" } } : {}), ...(format ? { fileExtension: format } : {}), ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } } : {}) };
  if (score === "LOW") where.atsScore = { lt: 50 }; if (score === "MID") where.atsScore = { gte: 50, lt: 75 }; if (score === "HIGH") where.atsScore = { gte: 75 }; if (score === "NO_SCORE") where.atsScore = null;
  const [checks, total, attention, average, visitors, formats] = await Promise.all([
    prisma.atsResumeCheck.findMany({ where, include: { visitor: true }, orderBy: { createdAt: "desc" }, take: 100 }), prisma.atsResumeCheck.count({ where }), prisma.atsResumeCheck.count({ where: { ...where, status: { not: "COMPLETED" } } }), prisma.atsResumeCheck.aggregate({ where: { ...where, status: "COMPLETED", atsScore: { not: null } }, _avg: { atsScore: true } }), prisma.atsResumeCheck.groupBy({ where, by: ["visitorId"] }), prisma.atsResumeCheck.findMany({ where: { fileExtension: { not: null } }, distinct: ["fileExtension"], select: { fileExtension: true }, orderBy: { fileExtension: "asc" } }),
  ]);
  const ids = [...new Set(checks.map((check) => check.visitorId))];
  const history = ids.length ? await prisma.atsResumeCheck.findMany({ where: { visitorId: { in: ids } }, orderBy: { createdAt: "desc" }, take: 500 }) : [];
  const historyMap = new Map<string, AtsHistoryItem[]>();
  for (const item of history) { const list = historyMap.get(item.visitorId) || []; list.push({ id: item.id, createdAt: item.createdAt.toISOString(), status: item.status, score: item.atsScore, jobMatchScore: item.jobMatchScore, targetRole: item.targetRole, fileExtension: item.fileExtension, errorCode: item.errorCode }); historyMap.set(item.visitorId, list); }
  const rows: AtsCheckRow[] = checks.map((check) => ({ id: check.id, createdAt: check.createdAt.toISOString(), status: check.status, score: check.atsScore, jobMatchScore: check.jobMatchScore, targetRole: check.targetRole, roleFamily: check.roleFamily, fileExtension: check.fileExtension, errorCode: check.errorCode, hasJobDescription: check.hasJobDescription, candidate: { id: check.visitorId, name: decryptPrivateValue(check.visitor.candidateNameEncrypted), email: decryptPrivateValue(check.visitor.emailEncrypted), phone: decryptPrivateValue(check.visitor.phoneEncrypted), firstSeenAt: check.visitor.firstSeenAt.toISOString(), lastSeenAt: check.visitor.lastSeenAt.toISOString(), totalChecks: check.visitor.totalChecks, completedChecks: check.visitor.completedChecks }, history: historyMap.get(check.visitorId) || [] }));
  const cards = [["Total checks", total, "Matching current filters", BarChart3Icon, "text-blue-600"], ["Candidates", visitors.length, "Unique resume profiles", UsersIcon, "text-violet-600"], ["Average score", average._avg.atsScore == null ? "—" : Math.round(average._avg.atsScore), "Completed checks only", CheckCircle2Icon, "text-emerald-600"], ["Needs attention", attention, "Unreadable, invalid, or failed", FileWarningIcon, "text-amber-600"]] as const;
  return <AdminShell adminName={admin.name} adminEmail={admin.email} pageTitle="ATS checker intelligence" pageDescription="See candidate details, score changes, and uploads that need attention." pageEyebrow="Tool analytics" actions={<Button asChild variant="outline"><Link href="/tools/resume-ats-checker" target="_blank">Open ATS checker</Link></Button>}>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, helper, Icon, tone]) => <Card key={label} className="border-blue-100 bg-white shadow-[0_10px_28px_rgba(31,93,173,0.05)] dark:border-white/10 dark:bg-slate-950"><CardContent className="flex items-start justify-between gap-4 p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 font-heading text-4xl font-semibold text-slate-950 dark:text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{helper}</p></div><Icon className={`size-5 ${tone}`} /></CardContent></Card>)}</section>
    <Card className="border-blue-100 bg-white shadow-[0_10px_28px_rgba(31,93,173,0.05)] dark:border-white/10 dark:bg-slate-950"><CardContent className="p-5"><form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7" method="get"><Filter label="Check status"><select name="status" defaultValue={status} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="ALL">All outcomes</option>{atsCheckStatuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></Filter><Filter label="Score range"><select name="score" defaultValue={score} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="ALL">All scores</option><option value="LOW">Below 50</option><option value="MID">50–74</option><option value="HIGH">75–100</option><option value="NO_SCORE">No score</option></select></Filter><Filter label="Input type"><select name="format" defaultValue={format} className="h-10 w-full rounded-lg border border-blue-200 bg-white px-3 text-sm text-slate-800 dark:bg-slate-950 dark:text-white"><option value="">All types</option>{formats.flatMap((item) => item.fileExtension ? [<option key={item.fileExtension} value={item.fileExtension}>{item.fileExtension.toUpperCase()}</option>] : [])}</select></Filter><Filter label="Target role"><Input name="role" defaultValue={role} placeholder="e.g. Data Analyst" className="border-blue-200" /></Filter><Filter label="From date"><Input name="from" type="date" defaultValue={params.from} className="border-blue-200" /></Filter><Filter label="To date"><Input name="to" type="date" defaultValue={params.to} className="border-blue-200" /></Filter><div className="flex items-end gap-2"><Button type="submit" className="flex-1">Apply</Button><Button asChild variant="outline"><Link href="/admin/ats-checker">Clear</Link></Button></div></form></CardContent></Card>
    <AtsCheckerBoard checks={rows} />
  </AdminShell>;
}
function Filter({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-slate-500"><span>{label}</span>{children}</label>; }
