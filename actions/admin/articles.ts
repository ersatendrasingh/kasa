"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArticleStatus, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";
import {
  articleContentSchema,
  articleCategorySchema,
  articleCategoryUpdateSchema,
  articleDraftSchema,
  articleFeaturedSchema,
  articlePresentationSchema,
  articlePublishingSchema,
  articleSchema,
  articleSeoSchema,
  articleTagSchema,
  articleTagUpdateSchema,
  articleTaxonomyDeleteSchema,
  deleteArticleSchema,
} from "@/schemas/admin/articles";
import { formArray, formObject } from "@/actions/admin/action-utils";

const db = prisma;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 130);
}

async function uniqueArticleSlug(baseSlug: string, articleId?: string) {
  const base = baseSlug || "article";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const existing = await db.article.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === articleId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

function splitList(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullable(value: string | undefined) {
  const clean = value?.trim();
  return clean || null;
}

function readingTimeMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function revalidateArticleAdminPaths() {
  revalidatePath("/admin/articles");
  revalidatePath("/admin/articles/categories");
  revalidatePath("/admin/articles/tags");
  revalidatePath("/resources");
}

function parseFaqs(value: string | undefined) {
  const lines = (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const faqs = lines
    .map((line) => {
      const [question, ...answerParts] = line.split("|");
      const answer = answerParts.join("|").trim();
      return question?.trim() && answer ? { question: question.trim(), answer } : null;
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));

  return faqs.length ? faqs : Prisma.JsonNull;
}

async function syncArticleTags(articleId: string, tags: string[]) {
  await db.articleTagOnArticle.deleteMany({ where: { articleId } });

  for (const tagTitle of tags) {
    const slug = slugify(tagTitle);
    if (!slug) continue;

    const tag = await db.articleTag.upsert({
      where: { slug },
      update: { title: tagTitle },
      create: { title: tagTitle, slug },
    });

    await db.articleTagOnArticle.create({
      data: { articleId, tagId: tag.id },
    });
  }
}

function getPublishDates(status: string, scheduledAt?: string) {
  const scheduleDate = scheduledAt ? new Date(scheduledAt) : null;
  const validSchedule =
    scheduleDate && !Number.isNaN(scheduleDate.getTime()) ? scheduleDate : null;

  if (status === "PUBLISHED") {
    return { publishedAt: new Date(), scheduledAt: null };
  }

  if (status === "SCHEDULED") {
    return { publishedAt: null, scheduledAt: validSchedule };
  }

  return { publishedAt: null, scheduledAt: null };
}

async function upsertCategory(title: string, description?: string) {
  const categorySlug = slugify(title);
  const descriptionData = description === undefined ? {} : { description: nullable(description) };
  return db.articleCategory.upsert({
    where: { slug: categorySlug },
    update: {
      title,
      ...descriptionData,
      isActive: true,
    },
    create: {
      title,
      slug: categorySlug,
      description: nullable(description),
      isActive: true,
    },
  });
}

export async function createArticleDraftAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = articleDraftSchema.parse(formObject(formData));
  const categoryTitle = parsed.categoryTitle?.trim() || "Uncategorized";
  const category = await upsertCategory(categoryTitle);
  const baseSlug = slugify(parsed.slug || parsed.title);

  const article = await db.article.create({
    data: {
      title: parsed.title,
      slug: await uniqueArticleSlug(baseSlug),
      excerpt: null,
      content: "Start writing the article content here.",
      status: "DRAFT",
      categoryId: category.id,
      authorId: admin.id,
      authorName: admin.name,
      readingTimeMinutes: 1,
      allowIndexing: true,
    },
  });

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.id}?created=1`);
}

export async function createArticleCategoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleCategorySchema.parse(formObject(formData));
  const slug = slugify(parsed.slug || parsed.title);

  await db.articleCategory.upsert({
    where: { slug },
    update: {
      title: parsed.title,
      description: nullable(parsed.description),
      seoTitle: nullable(parsed.seoTitle),
      seoDescription: nullable(parsed.seoDescription),
      isActive: true,
    },
    create: {
      title: parsed.title,
      slug,
      description: nullable(parsed.description),
      seoTitle: nullable(parsed.seoTitle),
      seoDescription: nullable(parsed.seoDescription),
      isActive: true,
    },
  });

  revalidateArticleAdminPaths();
  redirect("/admin/articles/categories?created=1");
}

export async function updateArticleCategoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleCategoryUpdateSchema.parse(formObject(formData));
  const slug = slugify(parsed.slug || parsed.title);
  if (!slug) throw new Error("Category slug is required.");

  await db.articleCategory.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      slug,
      description: nullable(parsed.description),
      seoTitle: nullable(parsed.seoTitle),
      seoDescription: nullable(parsed.seoDescription),
      isActive: parsed.isActive,
    },
  });

  revalidateArticleAdminPaths();
  redirect("/admin/articles/categories?updated=1");
}

export async function deleteArticleCategoryAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleTaxonomyDeleteSchema.parse(formObject(formData));

  await db.$transaction([
    db.article.updateMany({
      where: { categoryId: parsed.id },
      data: { categoryId: null },
    }),
    db.articleCategory.delete({ where: { id: parsed.id } }),
  ]);

  revalidateArticleAdminPaths();
  redirect("/admin/articles/categories?deleted=1");
}

export async function createArticleTagAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleTagSchema.parse(formObject(formData));
  const slug = slugify(parsed.slug || parsed.title);

  await db.articleTag.upsert({
    where: { slug },
    update: {
      title: parsed.title,
      description: nullable(parsed.description),
    },
    create: {
      title: parsed.title,
      slug,
      description: nullable(parsed.description),
    },
  });

  revalidateArticleAdminPaths();
  redirect("/admin/articles/tags?created=1");
}

export async function updateArticleTagAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleTagUpdateSchema.parse(formObject(formData));
  const slug = slugify(parsed.slug || parsed.title);
  if (!slug) throw new Error("Tag slug is required.");

  await db.articleTag.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      slug,
      description: nullable(parsed.description),
    },
  });

  revalidateArticleAdminPaths();
  redirect("/admin/articles/tags?updated=1");
}

export async function deleteArticleTagAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleTaxonomyDeleteSchema.parse(formObject(formData));

  await db.articleTag.delete({ where: { id: parsed.id } });

  revalidateArticleAdminPaths();
  redirect("/admin/articles/tags?deleted=1");
}

export async function createArticleAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = articleSchema.parse(formObject(formData));
  const articleSlug = slugify(parsed.slug || parsed.title);
  const dates = getPublishDates(parsed.status, parsed.scheduledAt);
  const category = await upsertCategory(parsed.categoryTitle, parsed.categoryDescription);

  const article = await db.article.create({
    data: {
      title: parsed.title,
      slug: await uniqueArticleSlug(articleSlug),
      excerpt: nullable(parsed.excerpt),
      content: parsed.content,
      status: parsed.status,
      categoryId: category.id,
      authorId: admin.id,
      authorName: nullable(parsed.authorName) || admin.name,
      coverImage: nullable(parsed.coverImage),
      coverImageAlt: nullable(parsed.coverImageAlt),
      featured: parsed.featured,
      allowIndexing: parsed.allowIndexing,
      focusKeyword: nullable(parsed.focusKeyword),
      seoTitle: nullable(parsed.seoTitle),
      seoDescription: nullable(parsed.seoDescription),
      canonicalUrl: nullable(parsed.canonicalUrl),
      ogTitle: nullable(parsed.ogTitle),
      ogDescription: nullable(parsed.ogDescription),
      ogImage: nullable(parsed.ogImage),
      schemaType: parsed.schemaType,
      faqs: parseFaqs(parsed.faqs),
      readingTimeMinutes: readingTimeMinutes(parsed.content),
      ...dates,
    },
  });

  await syncArticleTags(article.id, splitList(parsed.tags));

  revalidatePath("/admin/articles");
  revalidatePath("/resources");
  redirect("/admin/articles?created=1");
}

export async function updateArticleAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = articleSchema.parse(formObject(formData));
  if (!parsed.id) throw new Error("Article id is required.");

  const dates = getPublishDates(parsed.status, parsed.scheduledAt);
  const category = await upsertCategory(parsed.categoryTitle, parsed.categoryDescription);

  await db.article.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      slug: parsed.slug ? await uniqueArticleSlug(slugify(parsed.slug), parsed.id) : undefined,
      excerpt: nullable(parsed.excerpt),
      content: parsed.content,
      status: parsed.status,
      categoryId: category.id,
      authorId: admin.id,
      authorName: nullable(parsed.authorName) || admin.name,
      coverImage: nullable(parsed.coverImage),
      coverImageAlt: nullable(parsed.coverImageAlt),
      featured: parsed.featured,
      allowIndexing: parsed.allowIndexing,
      focusKeyword: nullable(parsed.focusKeyword),
      seoTitle: nullable(parsed.seoTitle),
      seoDescription: nullable(parsed.seoDescription),
      canonicalUrl: nullable(parsed.canonicalUrl),
      ogTitle: nullable(parsed.ogTitle),
      ogDescription: nullable(parsed.ogDescription),
      ogImage: nullable(parsed.ogImage),
      schemaType: parsed.schemaType,
      faqs: parseFaqs(parsed.faqs),
      readingTimeMinutes: readingTimeMinutes(parsed.content),
      ...dates,
    },
  });

  await syncArticleTags(parsed.id, splitList(parsed.tags));

  revalidatePath("/admin/articles");
  revalidatePath("/resources");
  redirect("/admin/articles?updated=1");
}

export async function updateArticleContentAction(formData: FormData) {
  const parsed = await saveArticleContent(formData);
  redirect(`/admin/articles/${parsed.id}?saved=content`);
}

export async function autosaveArticleContentAction(formData: FormData) {
  const parsed = await saveArticleContent(formData);
  return { savedAt: new Date().toISOString(), id: parsed.id };
}

async function saveArticleContent(formData: FormData) {
  await requireAdmin();
  const parsed = articleContentSchema.parse(formObject(formData));

  await db.article.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      slug: parsed.slug ? await uniqueArticleSlug(slugify(parsed.slug), parsed.id) : undefined,
      excerpt: nullable(parsed.excerpt),
      content: parsed.content,
      readingTimeMinutes: readingTimeMinutes(parsed.content),
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${parsed.id}`);
  revalidatePath("/resources");
  return parsed;
}

export async function updateArticlePresentationAction(formData: FormData) {
  await requireAdmin();
  const presentationData = formObject(formData);
  const newCategoryTitle = String(presentationData.categoryTitleNew || "").trim();
  if (newCategoryTitle) presentationData.categoryTitle = newCategoryTitle;
  const parsed = articlePresentationSchema.parse(presentationData);
  const category = await upsertCategory(parsed.categoryTitle, parsed.categoryDescription);
  const selectedTags = [...formArray(formData, "tagTitles"), ...splitList(parsed.tags)];

  await db.article.update({
    where: { id: parsed.id },
    data: {
      categoryId: category.id,
      coverImage: nullable(parsed.coverImage),
      coverImageAlt: nullable(parsed.coverImageAlt),
    },
  });
  await syncArticleTags(parsed.id, selectedTags);

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${parsed.id}`);
  revalidatePath("/resources");
  redirect(`/admin/articles/${parsed.id}?saved=presentation`);
}

export async function updateArticleFeaturedAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleFeaturedSchema.parse(formObject(formData));

  await db.article.update({
    where: { id: parsed.id },
    data: { featured: parsed.featured },
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${parsed.id}`);
  revalidatePath("/resources");
  redirect(`/admin/articles/${parsed.id}?saved=featured`);
}

export async function updateArticleSeoAction(formData: FormData) {
  await requireAdmin();
  const parsed = articleSeoSchema.parse(formObject(formData));

  await db.article.update({
    where: { id: parsed.id },
    data: {
      slug: await uniqueArticleSlug(slugify(parsed.slug), parsed.id),
      allowIndexing: parsed.allowIndexing,
      focusKeyword: nullable(parsed.focusKeyword),
      seoTitle: nullable(parsed.seoTitle),
      seoDescription: nullable(parsed.seoDescription),
      canonicalUrl: nullable(parsed.canonicalUrl),
      schemaType: parsed.schemaType,
      faqs: parseFaqs(parsed.faqs),
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${parsed.id}`);
  revalidatePath("/resources");
  redirect(`/admin/articles/${parsed.id}?saved=seo`);
}

export async function updateArticlePublishingAction(formData: FormData) {
  await requireAdmin();
  const parsed = articlePublishingSchema.parse(formObject(formData));
  const dates = getPublishDates(parsed.status, parsed.scheduledAt);

  await db.article.update({
    where: { id: parsed.id },
    data: {
      status: parsed.status,
      ...dates,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${parsed.id}`);
  revalidatePath("/resources");
  redirect(`/admin/articles/${parsed.id}?saved=publishing`);
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const parsed = deleteArticleSchema.parse(formObject(formData));

  await db.article.delete({ where: { id: parsed.id } });

  revalidatePath("/admin/articles");
  revalidatePath("/resources");
  redirect("/admin/articles?deleted=1");
}

export async function bulkArticlesAction(formData: FormData) {
  await requireAdmin();
  const ids = formData.getAll("articleIds").map(String).filter(Boolean).slice(0, 100);
  const action = String(formData.get("bulkAction") || "");
  if (!ids.length) redirect("/admin/articles?bulkError=empty");

  if (action === "DELETE") {
    await db.article.deleteMany({ where: { id: { in: ids } } });
    revalidateArticleAdminPaths();
    redirect(`/admin/articles?bulk=deleted&count=${ids.length}`);
  }

  const status = {
    PUBLISH: ArticleStatus.PUBLISHED,
    REVIEW: ArticleStatus.REVIEW,
    DRAFT: ArticleStatus.DRAFT,
    ARCHIVE: ArticleStatus.ARCHIVED,
  }[action];
  if (!status) throw new Error("Unsupported bulk article action.");

  if (status === ArticleStatus.PUBLISHED) {
    await db.$transaction([
      db.article.updateMany({
        where: { id: { in: ids }, status: { not: ArticleStatus.PUBLISHED } },
        data: { publishedAt: new Date(), scheduledAt: null },
      }),
      db.article.updateMany({
        where: { id: { in: ids } },
        data: { status: ArticleStatus.PUBLISHED },
      }),
    ]);
  } else {
    await db.article.updateMany({
      where: { id: { in: ids } },
      data: { status, publishedAt: null, scheduledAt: null },
    });
  }

  revalidateArticleAdminPaths();
  redirect(`/admin/articles?bulk=${status.toLowerCase()}&count=${ids.length}`);
}
