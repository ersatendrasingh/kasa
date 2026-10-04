"use server";

import { ArticleCommentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";

const moderationSchema = z.object({
  commentId: z.string().cuid(),
  status: z.enum([ArticleCommentStatus.APPROVED, ArticleCommentStatus.REJECTED]),
});

const editSchema = z.object({
  commentId: z.string().cuid(),
  body: z.string().trim().min(2).max(1500),
});

function revalidateCommentSurfaces(slug: string) {
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/comments");
}

export async function moderateArticleCommentAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = moderationSchema.parse({
    commentId: formData.get("commentId"),
    status: formData.get("status"),
  });

  const comment = await prisma.articleComment.findUnique({
    where: { id: parsed.commentId },
    select: { id: true, article: { select: { slug: true } } },
  });
  if (!comment) return;

  await prisma.articleComment.update({
    where: { id: comment.id },
    data: {
      status: parsed.status,
      moderatedAt: new Date(),
      moderatedById: admin.id,
    },
  });

  revalidateCommentSurfaces(comment.article.slug);
}

export async function deleteArticleCommentAction(formData: FormData) {
  await requireAdmin();
  const parsed = z.object({ commentId: z.string().cuid() }).parse({ commentId: formData.get("commentId") });
  const comment = await prisma.articleComment.findUnique({
    where: { id: parsed.commentId },
    select: { id: true, article: { select: { slug: true } } },
  });
  if (!comment) return;

  await prisma.articleComment.delete({ where: { id: comment.id } });
  revalidateCommentSurfaces(comment.article.slug);
}

export async function editArticleCommentAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = editSchema.parse({
    commentId: formData.get("commentId"),
    body: formData.get("body"),
  });
  const comment = await prisma.articleComment.findUnique({
    where: { id: parsed.commentId },
    select: { id: true, article: { select: { slug: true } } },
  });
  if (!comment) return;

  await prisma.articleComment.update({
    where: { id: comment.id },
    data: {
      body: parsed.body,
      editedAt: new Date(),
      moderatedAt: new Date(),
      moderatedById: admin.id,
    },
  });
  revalidateCommentSurfaces(comment.article.slug);
}
