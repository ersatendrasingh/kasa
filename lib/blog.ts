import { prisma } from "@/lib/admin/prisma";
import { ArticleStatus, Prisma } from "@prisma/client";

export const BLOG_BASE_PATH = "/blog";
export const SITE_URL = "https://www.getkasa.in";

const db = prisma;

export type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  categoryId: string | null;
  category?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
  } | null;
  tags?: Array<{
    tag: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
    };
  }>;
  authorName: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  featured: boolean;
  allowIndexing: boolean;
  focusKeyword: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  schemaType: string;
  faqs: unknown;
  readingTimeMinutes: number;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function publishedArticleWhere(now = new Date()): Prisma.ArticleWhereInput {
  return {
    status: ArticleStatus.PUBLISHED,
    AND: [
      {
        OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
      },
    ],
  };
}

export function articleHref(article: Pick<BlogArticle, "slug">) {
  return `${BLOG_BASE_PATH}/${article.slug}`;
}

export function absoluteUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function articleDisplayTitle(article: Pick<BlogArticle, "seoTitle" | "title">) {
  return article.seoTitle || article.title;
}

export function articleDescription(
  article: Pick<BlogArticle, "seoDescription" | "excerpt" | "content" | "title">,
) {
  if (article.seoDescription) return article.seoDescription;
  if (article.excerpt) return article.excerpt;
  const plain = article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain ? plain.slice(0, 155) : `${article.title} from the KASA blog.`;
}

export function articleKeywords(
  article: Pick<BlogArticle, "focusKeyword" | "category" | "tags">,
) {
  return Array.from(
    new Set(
      [
        article.focusKeyword,
        article.category?.title,
        ...(article.tags?.map(({ tag }) => tag.title) ?? []),
      ].filter((item): item is string => Boolean(item?.trim())),
    ),
  );
}

export function articleStructuredDataType(schemaType?: string | null) {
  if (["Article", "BlogPosting", "NewsArticle"].includes(schemaType || "")) return schemaType;
  if (schemaType === "TechArticle") return ["Article", "TechArticle"];
  return "Article";
}

export function articlePlainText(content: string) {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatArticleDate(date?: Date | null) {
  if (!date) return "Recently updated";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function parseArticleFaqs(value: unknown): Array<[string, string]> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (Array.isArray(item) && typeof item[0] === "string" && typeof item[1] === "string") {
        return [item[0], item[1]] as [string, string];
      }

      if (
        item &&
        typeof item === "object" &&
        "question" in item &&
        "answer" in item &&
        typeof item.question === "string" &&
        typeof item.answer === "string"
      ) {
        return [item.question, item.answer] as [string, string];
      }

      return null;
    })
    .filter(Boolean) as Array<[string, string]>;
}

export async function getBlogArticleBySlug(slug: string): Promise<BlogArticle | null> {
  return db.article.findFirst({
    where: {
      slug,
      ...publishedArticleWhere(),
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
        orderBy: {
          tag: {
            title: "asc",
          },
        },
      },
    },
  });
}

export async function getRelatedBlogArticles(article: BlogArticle, limit = 3): Promise<BlogArticle[]> {
  const tagIds = article.tags?.map((entry) => entry.tag.id) ?? [];
  const relatedFilters: Prisma.ArticleWhereInput[] = [];
  if (article.categoryId) relatedFilters.push({ categoryId: article.categoryId });
  if (tagIds.length) relatedFilters.push({ tags: { some: { tagId: { in: tagIds } } } });

  return db.article.findMany({
    where: {
      ...publishedArticleWhere(),
      id: { not: article.id },
      ...(relatedFilters.length ? { OR: relatedFilters } : {}),
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
}

export async function getLatestBlogArticles(limit = 4): Promise<BlogArticle[]> {
  return db.article.findMany({
    where: publishedArticleWhere(),
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
}

export async function getBlogTaxonomies() {
  const [categories, tags] = await Promise.all([
    db.articleCategory.findMany({
      where: { isActive: true },
      include: { _count: { select: { articles: true } } },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    }),
    db.articleTag.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { title: "asc" },
    }),
  ]);

  return { categories, tags };
}
