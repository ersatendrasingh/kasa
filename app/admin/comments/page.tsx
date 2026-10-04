import Link from "next/link";
import { ArticleCommentStatus, type Prisma } from "@prisma/client";
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  Clock3Icon,
  EyeIcon,
  MessageCircleMoreIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { deleteArticleCommentAction, moderateArticleCommentAction } from "@/actions/admin/article-comments";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { ArticleAdminHero, ArticleMetric, adminSelectClass, adminTextInputClass } from "@/components/admin/articles/article-admin-primitives";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";

export const dynamic = "force-dynamic";

const statusFilters = ["ALL", ...Object.values(ArticleCommentStatus)] as const;

type CommentSearchParams = Promise<{ status?: string; q?: string }>;

function statusTone(status: ArticleCommentStatus) {
  if (status === ArticleCommentStatus.APPROVED) return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200";
  if (status === ArticleCommentStatus.REJECTED) return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200";
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(value);
}

export default async function AdminCommentsPage({ searchParams }: { searchParams: CommentSearchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const requestedStatus = params.status || "PENDING";
  const status = (statusFilters as readonly string[]).includes(requestedStatus) ? requestedStatus : "PENDING";
  const q = (params.q || "").trim().slice(0, 100);
  const where: Prisma.ArticleCommentWhereInput = {
    ...(status === "ALL" ? {} : { status: status as ArticleCommentStatus }),
    ...(q ? {
      OR: [
        { body: { contains: q, mode: "insensitive" } },
        { article: { title: { contains: q, mode: "insensitive" } } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ],
    } : {}),
  };
  const [counts, comments] = await Promise.all([
    prisma.$transaction([
      prisma.articleComment.count({ where: { status: ArticleCommentStatus.PENDING } }),
      prisma.articleComment.count({ where: { status: ArticleCommentStatus.APPROVED } }),
      prisma.articleComment.count({ where: { status: ArticleCommentStatus.REJECTED } }),
    ]),
    prisma.articleComment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        article: { select: { title: true, slug: true } },
        parent: { select: { id: true, body: true, user: { select: { name: true } } } },
        user: { select: { name: true, email: true } },
        moderatedBy: { select: { name: true } },
        _count: { select: { replies: true, likes: true } },
      },
    }),
  ]);

  const filterHref = (nextStatus: string) => {
    const query = new URLSearchParams();
    if (nextStatus !== "PENDING") query.set("status", nextStatus);
    if (q) query.set("q", q);
    const value = query.toString();
    return value ? `/admin/comments?${value}` : "/admin/comments";
  };

  return (
    <AdminShell
      adminName={admin.name}
      adminEmail={admin.email}
      showHero={false}
      headerContent={<div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground"><Link href="/admin" className="hover:text-foreground">Admin</Link><ChevronRightIcon className="size-4" /><span className="truncate text-foreground">Comment moderation</span></div>}
    >
      <ArticleAdminHero
        eyebrow="Community safety"
        title="Comment moderation"
        description="Review every new article comment and reply before it becomes visible to the public. Authors can always see their own pending contribution."
        actions={<Button asChild variant="outline" className="bg-white"><Link href="/blog" target="_blank"><EyeIcon className="size-4" />View blog</Link></Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <ArticleMetric label="Waiting for review" value={counts[0]} icon={<Clock3Icon className="size-5" />} />
        <ArticleMetric label="Approved contributions" value={counts[1]} icon={<CheckCircle2Icon className="size-5" />} />
        <ArticleMetric label="Rejected contributions" value={counts[2]} icon={<XCircleIcon className="size-5" />} />
      </div>
      <form method="get" className="grid gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950 sm:grid-cols-[minmax(0,1fr)_190px_auto]">
        <div className="relative"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input name="q" defaultValue={q} placeholder="Search a comment, author, email, or article" className={`${adminTextInputClass} w-full rounded-xl border border-input pl-10 pr-3 text-sm`} /></div>
        <select name="status" defaultValue={status} className={adminSelectClass}>{statusFilters.map((item) => <option key={item} value={item}>{item === "ALL" ? "All statuses" : item[0] + item.slice(1).toLowerCase()}</option>)}</select>
        <div className="flex gap-2"><Button type="submit" className="!text-white">Filter</Button><Button asChild variant="outline" className="bg-white"><Link href="/admin/comments">Reset</Link></Button></div>
      </form>
      <div className="flex flex-wrap gap-2">{statusFilters.map((item) => <Link key={item} href={filterHref(item)} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${status === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>{item === "ALL" ? "All" : item[0] + item.slice(1).toLowerCase()}{item === "PENDING" ? ` · ${counts[0]}` : ""}</Link>)}</div>
      <section className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/45">
        <div className="flex items-center justify-between gap-4 border-b border-blue-100 px-5 py-4 dark:border-white/10"><div><h2 className="font-heading text-lg font-semibold text-slate-950 dark:text-white">Review queue</h2><p className="mt-1 text-sm text-muted-foreground">Showing up to 100 newest matching contributions.</p></div><MessageCircleMoreIcon className="size-5 text-primary" /></div>
        <div className="divide-y divide-blue-100 dark:divide-white/10">
          {comments.map((comment) => <article key={comment.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${statusTone(comment.status)}`}>{comment.status}</span><span className="text-xs font-medium text-muted-foreground">{comment.parentId ? "Reply" : "Comment"} · {formatDate(comment.createdAt)}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">{comment.body}</p>{comment.parent ? <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><span className="font-semibold">Replying to {comment.parent.user.name || "KASA member"}:</span> <span className="line-clamp-1">{comment.parent.body}</span></div> : null}<div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>By <strong className="font-semibold text-foreground">{comment.user.name || "KASA member"}</strong>{comment.user.email ? ` · ${comment.user.email}` : ""}</span><Link href={`/blog/${comment.article.slug}#discussion`} target="_blank" className="font-semibold text-primary hover:underline">{comment.article.title}</Link><span>{comment._count.likes} likes · {comment._count.replies} replies</span>{comment.moderatedAt ? <span>Reviewed by {comment.moderatedBy?.name || "admin"}</span> : null}</div></div><div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">{comment.status !== ArticleCommentStatus.APPROVED ? <ConfirmActionButton action={moderateArticleCommentAction} fields={[{ name: "commentId", value: comment.id }, { name: "status", value: "APPROVED" }]} icon={CheckCircle2Icon} label="Approve contribution" title="Approve this contribution?" description="It will be immediately visible on the public article." confirmLabel="Approve" /> : null}{comment.status !== ArticleCommentStatus.REJECTED ? <ConfirmActionButton action={moderateArticleCommentAction} fields={[{ name: "commentId", value: comment.id }, { name: "status", value: "REJECTED" }]} icon={XCircleIcon} label="Reject contribution" title="Reject this contribution?" description="It will be removed from the author and public discussion views." confirmLabel="Reject" confirmVariant="destructive" variant="destructive" /> : null}<ConfirmActionButton action={deleteArticleCommentAction} fields={[{ name: "commentId", value: comment.id }]} icon={Trash2Icon} label="Delete contribution" title="Permanently delete this contribution?" description="Its replies and likes will also be removed. This cannot be undone." confirmLabel="Delete permanently" confirmVariant="destructive" variant="destructive" /></div></article>)}
          {!comments.length ? <div className="px-5 py-14 text-center"><ShieldCheckIcon className="mx-auto size-7 text-primary/60" /><p className="mt-3 font-semibold text-foreground">Nothing to review here</p><p className="mt-1 text-sm text-muted-foreground">New comments and replies will arrive in this queue.</p></div> : null}
        </div>
      </section>
    </AdminShell>
  );
}
