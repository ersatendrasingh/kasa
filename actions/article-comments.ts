"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/admin/prisma";

const commentSchema = z.object({
  body: z.string().trim().min(2, "Write at least 2 characters.").max(1500, "Keep your comment under 1,500 characters."),
});

export type ArticleCommentActionState = {
  error?: string;
  success?: boolean;
  message?: string;
};

function articlePath(slug: string) {
  return `/blog/${slug}`;
}

export async function createArticleCommentAction(
  articleId: string,
  slug: string,
  parentId: string | null,
  _previousState: ArticleCommentActionState,
  formData: FormData,
): Promise<ArticleCommentActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in before joining the discussion." };
  }

  const parsed = commentSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Your comment could not be saved." };
  }

  const article = await prisma.article.findFirst({
    where: { id: articleId, slug, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!article) return { error: "This article is no longer available for discussion." };

  if (parentId) {
    const parent = await prisma.articleComment.findFirst({
      where: { id: parentId, articleId: article.id, parentId: null, status: "APPROVED" },
      select: { id: true },
    });
    if (!parent) return { error: "This conversation is no longer available for replies." };
  }

  await prisma.articleComment.create({
    data: { articleId: article.id, parentId, userId: session.user.id, body: parsed.data.body },
  });

  revalidatePath(articlePath(slug));
  return { success: true, message: parentId ? "Your reply is waiting for approval." : "Your comment is waiting for approval." };
}

export async function toggleArticleCommentLikeAction(commentId: string, slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in to like comments." };

  const comment = await prisma.articleComment.findFirst({
    where: { id: commentId, status: "APPROVED", article: { slug, status: "PUBLISHED" } },
    select: { id: true },
  });
  if (!comment) return { error: "This comment is no longer available." };

  const result = await prisma.$transaction(async (transaction) => {
    const existingLike = await transaction.articleCommentLike.findUnique({
      where: { commentId_userId: { commentId: comment.id, userId: session.user.id } },
      select: { id: true },
    });

    if (existingLike) {
      await transaction.articleCommentLike.delete({ where: { id: existingLike.id } });
      const updated = await transaction.articleComment.update({
        where: { id: comment.id },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
      return { liked: false, likeCount: updated.likeCount };
    }

    await transaction.articleCommentLike.create({
      data: { commentId: comment.id, userId: session.user.id },
    });
    const updated = await transaction.articleComment.update({
      where: { id: comment.id },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });
    return { liked: true, likeCount: updated.likeCount };
  });

  revalidatePath(articlePath(slug));
  return result;
}

export async function updateOwnArticleCommentAction(
  commentId: string,
  slug: string,
  _previousState: ArticleCommentActionState,
  formData: FormData,
): Promise<ArticleCommentActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in before editing your contribution." };

  const parsed = commentSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Your update could not be saved." };

  const comment = await prisma.articleComment.findFirst({
    where: {
      id: commentId,
      userId: session.user.id,
      status: { not: "REJECTED" },
      article: { slug, status: "PUBLISHED" },
    },
    select: { id: true, status: true },
  });
  if (!comment) return { error: "This contribution is no longer available to edit." };

  const editedAt = new Date();
  await prisma.$transaction([
    prisma.articleCommentLike.deleteMany({ where: { commentId: comment.id } }),
    prisma.articleComment.update({
      where: { id: comment.id },
      data: {
        body: parsed.data.body,
        status: "PENDING",
        editedAt,
        moderatedAt: null,
        moderatedById: null,
        likeCount: 0,
      },
    }),
  ]);

  revalidatePath(articlePath(slug));
  return {
    success: true,
    message: comment.status === "APPROVED"
      ? "Your edit is waiting for approval before it is public again."
      : "Your edit has been saved and is waiting for approval.",
  };
}
