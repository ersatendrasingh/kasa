"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  CheckCircle2Icon,
  HeartIcon,
  LoaderIcon,
  LogInIcon,
  MessageCircleIcon,
  MessageSquareReplyIcon,
  PencilIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import {
  createArticleCommentAction,
  toggleArticleCommentLikeAction,
  updateOwnArticleCommentAction,
  type ArticleCommentActionState,
} from "@/actions/article-comments";

type DiscussionReply = {
  id: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
  likeCount: number;
  likedByCurrentUser: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  author: { id: string; name: string | null; image: string | null };
};

type DiscussionComment = DiscussionReply & { replies: DiscussionReply[] };
type CurrentUser = { id: string; name: string | null } | null;

const initialState: ArticleCommentActionState = {};

function initials(name: string | null) {
  return (name || "KASA member")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function relativeDate(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function PendingNotice() {
  return (
    <p className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
      <ShieldCheckIcon className="size-3.5" />
      Waiting for approval — only you and the KASA team can see this.
    </p>
  );
}

function CommentComposer({
  articleId,
  slug,
  parentId,
  compact = false,
}: {
  articleId: string;
  slug: string;
  parentId: string | null;
  compact?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const createComment = createArticleCommentAction.bind(null, articleId, slug, parentId);
  const [state, formAction, isSubmitting] = useActionState(createComment, initialState);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={compact ? "mt-4 rounded-2xl border border-border bg-background/70 p-3" : "mt-7 overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_55%)] p-4 shadow-sm sm:p-5"}
    >
      {!compact ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">+</span>
          Share your perspective
        </div>
      ) : null}
      <label className={compact ? "block" : "mt-4 block"}>
        <span className="sr-only">{parentId ? "Your reply" : "Your comment"}</span>
        <textarea
          name="body"
          required
          minLength={2}
          maxLength={1500}
          rows={compact ? 3 : 4}
          placeholder={parentId ? "Write a considered reply…" : "Add a thoughtful comment, question, or practical takeaway…"}
          className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-1.5 text-xs leading-5 text-muted-foreground">
          <ShieldCheckIcon className="size-3.5 text-primary" />
          Every contribution is reviewed before it is public.
        </p>
        <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70">
          {isSubmitting ? <LoaderIcon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
          {isSubmitting ? "Sending…" : parentId ? "Post reply" : "Post comment"}
        </button>
      </div>
      {state.error ? <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{state.error}</p> : null}
      {state.success ? <p role="status" className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><CheckCircle2Icon className="size-4" />{state.message}</p> : null}
    </form>
  );
}

function EditCommentForm({ commentId, slug, body, onCancel }: { commentId: string; slug: string; body: string; onCancel: () => void }) {
  const router = useRouter();
  const updateComment = updateOwnArticleCommentAction.bind(null, commentId, slug);
  const [state, formAction, isSubmitting] = useActionState(updateComment, initialState);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <form action={formAction} className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3">
      <label className="block"><span className="sr-only">Edit your contribution</span><textarea name="body" required minLength={2} maxLength={1500} rows={3} defaultValue={body} className="w-full resize-y rounded-xl border border-border bg-card px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /></label>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">Edits are marked and reviewed before appearing publicly.</p><div className="flex gap-2"><button type="button" onClick={onCancel} className="h-9 rounded-full px-3 text-xs font-semibold text-muted-foreground hover:bg-background">Cancel</button><button type="submit" disabled={isSubmitting} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60">{isSubmitting ? <LoaderIcon className="size-3.5 animate-spin" /> : <PencilIcon className="size-3.5" />}{isSubmitting ? "Saving…" : "Save edit"}</button></div></div>
      {state.error ? <p role="alert" className="mt-3 text-sm font-medium text-destructive">{state.error}</p> : null}
      {state.success ? <p role="status" className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">{state.message}</p> : null}
    </form>
  );
}

function CommentCard({
  comment,
  articleId,
  slug,
  currentUser,
  onLike,
}: {
  comment: DiscussionComment;
  articleId: string;
  slug: string;
  currentUser: CurrentUser;
  onLike: (commentId: string) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const isPending = comment.status === "PENDING";

  const renderEntry = (entry: DiscussionReply, isReply = false) => {
    const isEntryPending = entry.status === "PENDING";
    const canInteract = entry.status === "APPROVED";

    return (
      <div key={entry.id} className={isReply ? "border-l-2 border-primary/15 pl-4 sm:pl-5" : ""}>
        <div className="flex items-start gap-3">
          <span className={`grid shrink-0 place-items-center rounded-full text-xs font-bold ${isReply ? "size-8 bg-primary/8 text-primary" : "size-10 bg-primary/10 text-primary"}`}>{initials(entry.author.name)}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-semibold text-foreground">{entry.author.name || "KASA member"}</p>
              {currentUser?.id === entry.author.id ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">You</span> : null}
              <span className="text-xs text-muted-foreground">{relativeDate(entry.createdAt)}</span>
              {entry.editedAt ? <span className="text-xs font-medium text-muted-foreground">Edited</span> : null}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{entry.body}</p>
            {isEntryPending ? <PendingNotice /> : null}
            {canInteract ? (
              <div className="mt-3 flex items-center gap-2">
                {currentUser ? <button type="button" onClick={() => onLike(entry.id)} aria-pressed={entry.likedByCurrentUser} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${entry.likedByCurrentUser ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300" : "bg-surface-muted text-muted-foreground hover:text-rose-600"}`}><HeartIcon className={`size-3.5 ${entry.likedByCurrentUser ? "fill-current" : ""}`} />{entry.likeCount || "Like"}</button> : <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><HeartIcon className="size-3.5" />{entry.likeCount || "Be the first to like"}</span>}
                {!isReply && currentUser ? <button type="button" onClick={() => setIsReplying((value) => !value)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-primary/10 hover:text-primary"><MessageSquareReplyIcon className="size-3.5" />Reply</button> : null}
                {currentUser?.id === entry.author.id ? <button type="button" onClick={() => setEditingCommentId(entry.id)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-primary/10 hover:text-primary"><PencilIcon className="size-3.5" />Edit</button> : null}
              </div>
            ) : null}
            {currentUser?.id === entry.author.id && !canInteract ? <div className="mt-3"><button type="button" onClick={() => setEditingCommentId(entry.id)} className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:text-primary"><PencilIcon className="size-3.5" />Edit</button></div> : null}
            {editingCommentId === entry.id ? <EditCommentForm commentId={entry.id} slug={slug} body={entry.body} onCancel={() => setEditingCommentId(null)} /> : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <article className={`rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md ${isPending ? "border-amber-200/80" : "border-border"}`}>
      {renderEntry(comment)}
      {comment.replies.length ? <div className="mt-5 grid gap-5">{comment.replies.map((reply) => renderEntry(reply, true))}</div> : null}
      {isReplying && !isPending ? <CommentComposer articleId={articleId} slug={slug} parentId={comment.id} compact /> : null}
    </article>
  );
}

export function ArticleDiscussion({
  articleId,
  slug,
  comments: initialComments,
  currentUser,
}: {
  articleId: string;
  slug: string;
  comments: DiscussionComment[];
  currentUser: CurrentUser;
}) {
  const [comments, setComments] = useState(initialComments);
  const [, startLikeTransition] = useTransition();
  const callbackUrl = encodeURIComponent(`/blog/${slug}#discussion`);

  function toggleLike(commentId: string) {
    startLikeTransition(async () => {
      const result = await toggleArticleCommentLikeAction(commentId, slug);
      if (!("likeCount" in result)) return;
      setComments((items) => items.map((comment) => (
        comment.id === commentId
          ? { ...comment, likedByCurrentUser: result.liked, likeCount: result.likeCount }
          : { ...comment, replies: comment.replies.map((reply) => reply.id === commentId ? { ...reply, likedByCurrentUser: result.liked, likeCount: result.likeCount } : reply) }
      )));
    });
  }

  return (
    <section id="discussion" className="mx-auto mt-14 max-w-3xl scroll-mt-28 border-t border-border pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><MessageCircleIcon className="size-4" />Community discussion</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Share what you think</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Useful questions, experiences, and ideas make this guide better for everyone.</p>
        </div>
        <span className="w-fit rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
      </div>
      {currentUser ? <CommentComposer articleId={articleId} slug={slug} parentId={null} /> : <div className="relative mt-7 overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_60%)] p-5 sm:p-6"><SparklesIcon className="absolute -right-2 -top-2 size-24 text-primary/10" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-xl"><h3 className="font-heading text-lg font-semibold text-foreground">Join the conversation with a free account</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Create an account to comment, reply, and like helpful community insights. Guest contributions are not enabled.</p></div><div className="flex shrink-0 flex-wrap gap-2"><Link href={`/login?callbackUrl=${callbackUrl}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"><LogInIcon className="size-4" />Log in</Link><Link href={`/signup?callbackUrl=${callbackUrl}`} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary-hover"><UserRoundPlusIcon className="size-4" />Create account</Link></div></div></div>}
      <div className="mt-8 grid gap-4">
        {comments.map((comment) => <CommentCard key={comment.id} comment={comment} articleId={articleId} slug={slug} currentUser={currentUser} onLike={toggleLike} />)}
        {!comments.length ? <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 px-5 py-9 text-center"><MessageCircleIcon className="mx-auto size-6 text-primary/60" /><p className="mt-3 font-semibold text-foreground">Start a useful discussion</p><p className="mt-1 text-sm text-muted-foreground">Every new contribution is reviewed before it is shared publicly.</p></div> : null}
      </div>
    </section>
  );
}
