import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCommentStatus, type Prisma } from "@prisma/client";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  ListTree,
  Sparkles,
  Tag,
} from "lucide-react";
import { auth } from "@/auth";
import { ArticleDiscussion } from "@/components/site/article-discussion";
import { ArticleShare } from "@/components/site/article-share";
import { ArticleMobileToc } from "@/components/site/article-mobile-toc";
import { ArticleViewCounter } from "@/components/site/article-view-counter";
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  JsonLd,
} from "@/components/site/structured-data";
import { siteContainerClasses } from "@/components/site/site-container";
import {
  absoluteUrl,
  articleDescription,
  articleDisplayTitle,
  articleHref,
  articleKeywords,
  articlePlainText,
  articleStructuredDataType,
  BLOG_BASE_PATH,
  formatArticleDate,
  getBlogArticleBySlug,
  getRelatedBlogArticles,
  parseArticleFaqs,
  SITE_URL,
  type BlogArticle,
} from "@/lib/blog";
import { prisma } from "@/lib/admin/prisma";

export const dynamic = "force-dynamic";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);

  if (!article) {
    return {
      title: "Blog article not found",
      robots: { index: false, follow: false },
    };
  }

  const title = articleDisplayTitle(article);
  const description = articleDescription(article);
  const canonical = article.canonicalUrl || `${SITE_URL}${articleHref(article)}`;
  const image = absoluteUrl(article.ogImage || article.coverImage);
  const keywords = articleKeywords(article);

  return {
    title,
    description,
    keywords,
    authors: [{ name: article.authorName || "KASA Team" }],
    alternates: {
      canonical,
    },
    robots: {
      index: article.allowIndexing,
      follow: true,
      googleBot: {
        index: article.allowIndexing,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      url: canonical,
      siteName: "KASA",
      locale: "en_IN",
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.authorName || "KASA Team"],
      section: article.category?.title,
      tags: keywords,
      images: image ? [{ url: image, alt: article.coverImageAlt || article.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.ogTitle || title,
      description: article.ogDescription || description,
      images: image ? [image] : undefined,
    },
  };
}

type ArticleHeading = {
  id: string;
  level: number;
  text: string;
};

function headingSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function decodeHeadingText(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    );
}

function prepareArticleHtml(content: string) {
  const source = content?.trim() || "<p>This article is being prepared.</p>";
  const headings: ArticleHeading[] = [];
  const usedIds = new Map<string, number>();

  const html = source.replace(
    /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, levelValue: string, attributes: string, innerHtml: string) => {
      const text = decodeHeadingText(
        innerHtml.replace(/<[^>]+>/g, "").trim(),
      );
      if (!text) return match;

      const baseId = headingSlug(text) || `section-${headings.length + 1}`;
      const occurrence = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, occurrence + 1);
      const id = occurrence ? `${baseId}-${occurrence + 1}` : baseId;
      const cleanAttributes = attributes.replace(/\s+id=("[^"]*"|'[^']*')/i, "");

      headings.push({ id, level: Number(levelValue), text });
      return `<h${levelValue}${cleanAttributes} id="${id}">${innerHtml}</h${levelValue}>`;
    },
  );

  return { html, headings };
}

function RelatedArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={articleHref(article)}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-lg transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-surface-muted to-surface-strong">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            unoptimized
            sizes="(max-width: 767px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <BookOpenText className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-primary" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {article.category?.title || "Blog"}
        </p>
        <h3 className="mt-2 line-clamp-2 font-heading text-lg font-semibold leading-snug text-foreground">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {articleDescription(article)}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
          Read next <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export default async function BlogArticlePage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);

  if (!article) notFound();

  const [relatedArticles, session] = await Promise.all([getRelatedBlogArticles(article, 4), auth()]);
  const currentUserId = session?.user?.id;
  const visibleCommentWhere: Prisma.ArticleCommentWhereInput[] = [
    { status: ArticleCommentStatus.APPROVED },
    ...(currentUserId ? [{ status: ArticleCommentStatus.PENDING, userId: currentUserId }] : []),
  ];
  const comments = await prisma.articleComment.findMany({
    where: {
      articleId: article.id,
      parentId: null,
      OR: visibleCommentWhere,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
      likes: { where: { userId: currentUserId || "" }, select: { id: true } },
      replies: {
        where: {
          OR: visibleCommentWhere,
        },
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
          likes: { where: { userId: currentUserId || "" }, select: { id: true } },
        },
      },
    },
  });
  const discussionComments = comments.map((comment) => ({
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    likeCount: comment.likeCount,
    likedByCurrentUser: currentUserId ? comment.likes.length > 0 : false,
    author: comment.user,
    status: comment.status,
    replies: comment.replies.map((reply) => ({
      id: reply.id,
      body: reply.body,
      createdAt: reply.createdAt.toISOString(),
      likeCount: reply.likeCount,
      likedByCurrentUser: currentUserId ? reply.likes.length > 0 : false,
      author: reply.user,
      status: reply.status,
    })),
  }));
  const description = articleDescription(article);
  const faqs = parseArticleFaqs(article.faqs);
  const canonicalUrl = article.canonicalUrl || `${SITE_URL}${articleHref(article)}`;
  const image = absoluteUrl(article.ogImage || article.coverImage);
  const tags = article.tags ?? [];
  const preparedContent = prepareArticleHtml(article.content);
  const plainContent = articlePlainText(article.content);
  const sidebarHeadings = preparedContent.headings;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": articleStructuredDataType(article.schemaType),
    "@id": `${canonicalUrl}#article`,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: article.title,
    description,
    image,
    thumbnailUrl: image,
    datePublished: (article.publishedAt || article.createdAt).toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.authorName || "KASA Team",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    inLanguage: "en-IN",
    articleSection: article.category?.title,
    keywords: articleKeywords(article).join(", ") || undefined,
    about: article.focusKeyword
      ? { "@type": "Thing", name: article.focusKeyword }
      : undefined,
    wordCount: plainContent ? plainContent.split(/\s+/).length : undefined,
  };

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: BLOG_BASE_PATH },
          { name: article.title, href: articleHref(article) },
        ]}
      />
      <JsonLd data={articleJsonLd} />
      <FaqStructuredData faqs={faqs} />
      <ArticleMobileToc
        headings={sidebarHeadings}
        contentSectionId="article-reading-layout"
      />

      <main className="bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-muted via-background to-surface-strong">
          <div className="absolute -left-32 top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-primary/8 blur-3xl" />
          <div
            className={siteContainerClasses({
              className: "relative pb-14 pt-36 lg:pb-16",
            })}
          >
            <Link
              href={BLOG_BASE_PATH}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              <ArrowLeft className="size-4" />
              Back to blog
            </Link>

            <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {article.category ? (
                    <Link
                      href={`${BLOG_BASE_PATH}?category=${article.category.slug}`}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm"
                    >
                      {article.category.title}
                    </Link>
                  ) : null}
                  {article.featured ? (
                    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                      Featured
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-5 max-w-5xl font-heading text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                  {article.title}
                </h1>
                <p className="mt-5 line-clamp-3 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  {description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    By {article.authorName || "KASA Team"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    {formatArticleDate(article.publishedAt || article.updatedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="size-4 text-primary" />
                    {article.readingTimeMinutes || 1} min read
                  </span>
                  <ArticleViewCounter
                    articleId={article.id}
                    initialCount={article.viewCount || 0}
                  />
                  <ArticleShare
                    title={article.title}
                    description={description}
                    url={canonicalUrl}
                    placement="top"
                  />
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-8 border-card bg-gradient-to-br from-surface-muted to-surface-strong shadow-2xl">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.coverImageAlt || article.title}
                    fill
                    preload
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 38vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <BookOpenText className="mx-auto size-11 text-primary" />
                      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                        KASA Blog
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          id="article-reading-layout"
          className={siteContainerClasses({
            className:
              "grid gap-6 py-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:py-16 xl:grid-cols-[14rem_minmax(0,1fr)_18rem] 2xl:grid-cols-[16rem_minmax(0,1fr)_20rem] 2xl:gap-8",
          })}
        >
          <aside className="hidden self-start xl:sticky xl:top-28 xl:block">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-surface-muted to-card p-4 shadow-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                  <Sparkles className="size-3.5" />
                  KASA LMS
                </span>
                <h2 className="mt-4 font-heading text-xl font-semibold leading-tight text-foreground">
                  Turn your expertise into a branded academy.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Sell courses, run live classes and manage learners from one
                  workspace.
                </p>
                <ul className="mt-4 grid gap-2 text-sm font-medium text-foreground">
                  {[
                    "Your own academy website",
                    "Payments and course access",
                    "Exams, certificates and leads",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-primary/12 text-[0.6rem] text-primary">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/features"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Explore KASA LMS <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="rounded-3xl border border-border bg-[image:var(--promo-background)] p-4 text-promo-foreground shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-promo-muted">
                  Popular free tools
                </p>
                <h3 className="mt-2 font-heading text-lg font-semibold">
                  Create teaching material faster
                </h3>
                <div className="mt-4 grid gap-2">
                  {[
                    ["Lesson plan generator", "/tools/lesson-plan-generator"],
                    ["Question paper generator", "/tools/question-paper-generator"],
                    ["Quiz generator", "/tools/quiz-generator"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between rounded-xl border border-promo-foreground/15 bg-promo-foreground/5 px-3 py-2.5 text-sm font-medium text-promo-foreground transition hover:border-promo-accent/45 hover:bg-promo-foreground/10"
                    >
                      {label}
                      <ArrowRight className="size-4 shrink-0 text-promo-accent" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/tools"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-promo-accent"
                >
                  Browse all tools <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </aside>

          <article className="min-w-0 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-xl sm:p-10 lg:p-12">
            <div
              className="blog-article-body mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{
                __html: preparedContent.html,
              }}
            />

            {faqs.length ? (
              <section className="mx-auto mt-14 max-w-3xl border-t border-border pt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Helpful answers
                </p>
                <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground">
                  Frequently asked questions
                </h2>
                <div className="mt-6 grid gap-3">
                  {faqs.map(([question, answer], index) => (
                    <details
                      key={question}
                      className="group rounded-2xl border border-border bg-surface-muted px-5 py-4 open:bg-card open:shadow-sm"
                      open={index === 0}
                    >
                      <summary className="cursor-pointer pr-4 font-semibold text-foreground">
                        {question}
                      </summary>
                      <p className="mt-3 border-t border-border pt-3 text-sm leading-7 text-muted-foreground">
                        {answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <ArticleDiscussion
        key={discussionComments.map((comment) => `${comment.id}:${comment.status}:${comment.likeCount}:${comment.replies.map((reply) => `${reply.id}:${reply.status}:${reply.likeCount}`).join(",")}`).join("|")}
              articleId={article.id}
              slug={article.slug}
              comments={discussionComments}
              currentUser={currentUserId ? { id: currentUserId, name: session.user?.name || null } : null}
            />

            <footer className="mx-auto mt-12 flex max-w-3xl flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Written by {article.authorName || "KASA Team"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Practical education and product insights from KASA.
                </p>
              </div>
              <ArticleShare
                title={article.title}
                description={description}
                url={canonicalUrl}
              />
            </footer>
          </article>

          <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
            <div className="grid gap-5">
            {sidebarHeadings.length ? (
              <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <ListTree className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      On this page
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Jump to a section
                    </p>
                  </div>
                </div>
                <nav className="mt-5 grid gap-1 border-l border-border pl-3">
                  {sidebarHeadings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={
                        heading.level === 3
                          ? "ml-3 rounded-lg px-3 py-1.5 text-xs font-medium leading-5 text-muted-foreground transition hover:bg-accent hover:text-primary"
                          : "rounded-lg px-3 py-2 text-sm font-medium leading-5 text-foreground transition hover:bg-accent hover:text-primary"
                      }
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            ) : null}

            <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Article details
              </p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Reading time</dt>
                  <dd className="font-semibold text-foreground">
                    {article.readingTimeMinutes || 1} min
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="font-semibold text-foreground">
                    {formatArticleDate(article.updatedAt)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Author</dt>
                  <dd className="font-semibold text-foreground">
                    {article.authorName || "KASA Team"}
                  </dd>
                </div>
              </dl>
              {tags.length ? (
                <div className="mt-5 border-t border-border pt-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Tag className="size-4" />
                    Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 6).map(({ tag }) => (
                      <Link
                        key={tag.id}
                        href={`${BLOG_BASE_PATH}?tag=${tag.slug}`}
                        className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-primary"
                      >
                        #{tag.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            </div>
          </aside>
        </section>

        {relatedArticles.length ? (
          <section className="border-t border-border bg-surface-muted/70">
            <div
              className={siteContainerClasses({ className: "py-12 lg:py-16" })}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-promo-accent">
                Keep reading
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <h2 className="font-heading text-3xl font-semibold text-foreground">
                  Related articles
                </h2>
                <Link
                  href={BLOG_BASE_PATH}
                  className="hidden items-center gap-2 text-sm font-semibold text-primary sm:inline-flex"
                >
                  View all <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.slice(0, 3).map((item) => (
                  <RelatedArticleCard key={item.id} article={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className={siteContainerClasses({ className: "pb-14 lg:pb-20" })}>
          <div className="overflow-hidden rounded-3xl border border-border bg-[image:var(--promo-background)] px-6 py-10 text-promo-foreground shadow-2xl sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-promo-accent">
                Build with KASA
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight">
                Ready to run your courses, learners and academy from one place?
              </h2>
              <p className="mt-3 text-sm leading-6 text-promo-muted sm:text-base">
                Explore KASA LMS for course selling, live classes, assessments,
                payments and student management.
              </p>
            </div>
            <Link
              href="/pricing"
              className="mt-7 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary shadow-lg transition hover:opacity-90 lg:mt-0"
            >
              Explore KASA plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
