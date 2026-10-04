import Link from "next/link";
import { ArticleCommentStatus, type Prisma } from "@prisma/client";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock3Icon,
  EyeIcon,
  ArrowRightIcon,
  MessageCircleMoreIcon,
  PencilIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { deleteArticleCommentAction, editArticleCommentAction, moderateArticleCommentAction } from "@/actions/admin/article-comments";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { ArticleAdminHero, ArticleMetric, adminSelectClass, adminTextInputClass } from "@/components/admin/articles/article-admin-primitives";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";

export const dynamic = "force-dynamic";

const statusFilters = ["ALL", ...Object.values(ArticleCommentStatus)] as const;

const pageSizes = [20, 50, 100] as const;

type CommentSearchParams = Promise<{ status?: string; q?: string; page?: string; perPage?: string }>;

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
  const requestedPerPage = Number.parseInt(params.perPage || "20", 10);
  const perPage = (pageSizes as readonly number[]).includes(requestedPerPage) ? requestedPerPage : 20;
  const requestedPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
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
  const [counts, totalComments] = await Promise.all([
    prisma.$transaction([
      prisma.articleComment.count({ where: { status: ArticleCommentStatus.PENDING } }),
      prisma.articleComment.count({ where: { status: ArticleCommentStatus.APPROVED } }),
      prisma.articleComment.count({ where: { status: ArticleCommentStatus.REJECTED } }),
    ]),
    prisma.articleComment.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalComments / perPage));
  const page = Math.min(requestedPage, totalPages);
  const comments = await prisma.articleComment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        article: { select: { title: true, slug: true } },
        parent: { select: { id: true, body: true, user: { select: { name: true } } } },
        user: { select: { name: true, email: true } },
        moderatedBy: { select: { name: true } },
        _count: { select: { replies: true, likes: true } },
      },
    });

  const commentsHref = ({ nextPage = 1, nextStatus = status, nextPerPage = perPage }: { nextPage?: number; nextStatus?: string; nextPerPage?: number } = {}) => {
    const query = new URLSearchParams();
    if (nextStatus !== "PENDING") query.set("status", nextStatus);
    if (q) query.set("q", q);
    if (nextPerPage !== 20) query.set("perPage", String(nextPerPage));
    if (nextPage > 1) query.set("page", String(nextPage));
    const value = query.toString();
    return value ? `/admin/comments?${value}` : "/admin/comments";
  };
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1);

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
      <form method="get" className="grid gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950 lg:grid-cols-[minmax(0,1fr)_190px_120px_auto]">
        <div className="relative"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input name="q" defaultValue={q} placeholder="Search a comment, author, email, or article" className={`${adminTextInputClass} w-full rounded-xl border border-input pl-10 pr-3 text-sm`} /></div>
        <select name="status" defaultValue={status} className={adminSelectClass}>{statusFilters.map((item) => <option key={item} value={item}>{item === "ALL" ? "All statuses" : item[0] + item.slice(1).toLowerCase()}</option>)}</select>
        <select name="perPage" defaultValue={perPage} className={adminSelectClass} aria-label="Contributions per page">{pageSizes.map((size) => <option key={size} value={size}>{size} per page</option>)}</select>
        <div className="flex gap-2"><Button type="submit" className="!text-white">Filter</Button><Button asChild variant="outline" className="bg-white"><Link href="/admin/comments">Reset</Link></Button></div>
      </form>
      <div className="flex flex-wrap gap-2">{statusFilters.map((item) => <Link key={item} href={commentsHref({ nextStatus: item })} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${status === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>{item === "ALL" ? "All" : item[0] + item.slice(1).toLowerCase()}{item === "PENDING" ? ` · ${counts[0]}` : ""}</Link>)}</div>
      <section className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/45">
        <div className="flex items-center justify-between gap-4 border-b border-blue-100 px-5 py-4 dark:border-white/10"><div><h2 className="font-heading text-lg font-semibold text-slate-950 dark:text-white">Review queue</h2><p className="mt-1 text-sm text-muted-foreground">Showing {totalComments ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, totalComments)} of {totalComments} matching contributions.</p></div><MessageCircleMoreIcon className="size-5 text-primary" /></div>
        <div className="divide-y divide-blue-100 dark:divide-white/10">
          {comments.map((comment) => <article key={comment.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${statusTone(comment.status)}`}>{comment.status}</span><span className="text-xs font-medium text-muted-foreground">{comment.parentId ? "Reply" : "Comment"} · {formatDate(comment.createdAt)}{comment.editedAt ? " · Edited" : ""}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">{comment.body}</p>{comment.parent ? <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><span className="font-semibold">Replying to {comment.parent.user.name || "KASA member"}:</span> <span className="line-clamp-1">{comment.parent.body}</span></div> : null}<div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>By <strong className="font-semibold text-foreground">{comment.user.name || "KASA member"}</strong>{comment.user.email ? ` · ${comment.user.email}` : ""}</span><Link href={`/blog/${comment.article.slug}#discussion`} target="_blank" className="font-semibold text-primary hover:underline">{comment.article.title}</Link><span>{comment._count.likes} likes · {comment._count.replies} replies</span>{comment.moderatedAt ? <span>Reviewed by {comment.moderatedBy?.name || "admin"}</span> : null}</div><details className="mt-4 rounded-xl border border-blue-100 bg-blue-50/45 p-3 dark:border-white/10 dark:bg-white/[0.04]"><summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary"><PencilIcon className="size-4" />Edit contribution</summary><form action={editArticleCommentAction} className="mt-3 grid gap-3"><input type="hidden" name="commentId" value={comment.id} /><textarea name="body" required minLength={2} maxLength={1500} defaultValue={comment.body} rows={4} className={`${adminTextInputClass} min-h-28 w-full rounded-xl border border-input p-3 text-sm leading-6`} /><div className="flex justify-end"><ArticleSubmitButton pendingLabel="Saving…" size="sm" className="!text-white">Save edit</ArticleSubmitButton></div></form></details></div><div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">{comment.status !== ArticleCommentStatus.APPROVED ? <ConfirmActionButton action={moderateArticleCommentAction} fields={[{ name: "commentId", value: comment.id }, { name: "status", value: "APPROVED" }]} icon={CheckCircle2Icon} label="Approve contribution" title="Approve this contribution?" description="It will be immediately visible on the public article." confirmLabel="Approve" /> : null}{comment.status !== ArticleCommentStatus.REJECTED ? <ConfirmActionButton action={moderateArticleCommentAction} fields={[{ name: "commentId", value: comment.id }, { name: "status", value: "REJECTED" }]} icon={XCircleIcon} label="Reject contribution" title="Reject this contribution?" description="It will be removed from the author and public discussion views." confirmLabel="Reject" confirmVariant="destructive" variant="destructive" /> : null}<ConfirmActionButton action={deleteArticleCommentAction} fields={[{ name: "commentId", value: comment.id }]} icon={Trash2Icon} label="Delete contribution" title="Permanently delete this contribution?" description="Its replies and likes will also be removed. This cannot be undone." confirmLabel="Delete permanently" confirmVariant="destructive" variant="destructive" /></div></article>)}
          {!comments.length ? <div className="px-5 py-14 text-center"><ShieldCheckIcon className="mx-auto size-7 text-primary/60" /><p className="mt-3 font-semibold text-foreground">Nothing to review here</p><p className="mt-1 text-sm text-muted-foreground">New comments and replies will arrive in this queue.</p></div> : null}
        </div>
        {totalComments > 0 ? <div className="flex flex-col gap-3 border-t border-blue-100 bg-blue-50/55 px-5 py-3 dark:border-white/10 dark:bg-white/[0.04] lg:flex-row lg:items-center lg:justify-between"><p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p><nav aria-label="Comment queue pagination" className="flex flex-wrap items-center gap-1.5">{page > 1 ? <Button asChild variant="outline" size="sm" className="bg-white"><Link href={commentsHref({ nextPage: page - 1 })}><ChevronLeftIcon className="size-4" />Previous</Link></Button> : <Button variant="outline" size="sm" className="bg-white" disabled><ChevronLeftIcon className="size-4" />Previous</Button>}{visiblePages.map((value, index) => <span key={value} className="contents">{index > 0 && value - visiblePages[index - 1] > 1 ? <span className="px-1 text-muted-foreground">…</span> : null}<Button asChild size="sm" variant={value === page ? "default" : "outline"} className={value === page ? "!text-white" : "bg-white"}><Link href={commentsHref({ nextPage: value })} aria-current={value === page ? "page" : undefined}>{value}</Link></Button></span>)}{page < totalPages ? <Button asChild variant="outline" size="sm" className="bg-white"><Link href={commentsHref({ nextPage: page + 1 })}>Next<ArrowRightIcon className="size-4" /></Link></Button> : <Button variant="outline" size="sm" className="bg-white" disabled>Next<ArrowRightIcon className="size-4" /></Button>}</nav></div> : null}
      </section>
    </AdminShell>
  );
}
