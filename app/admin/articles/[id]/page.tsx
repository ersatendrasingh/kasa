import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeftIcon, BookOpenTextIcon, CheckIcon, ChevronRightIcon, ImageIcon, SearchCheckIcon, SendIcon, StarIcon, Trash2Icon } from "lucide-react";
import {
  deleteArticleAction,
  autosaveArticleContentAction,
  updateArticleFeaturedAction,
  updateArticlePresentationAction,
  updateArticlePublishingAction,
  updateArticleSeoAction,
} from "@/actions/admin/articles";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { ArticleCoverUpload } from "@/components/admin/articles/article-cover-upload";
import { adminTextInputClass } from "@/components/admin/articles/article-admin-primitives";
import { ArticlePublishingControls } from "@/components/admin/articles/article-publishing-controls";
import { ArticleContentEditor } from "@/components/admin/articles/article-content-editor";
import { ArticleFeatureToggle } from "@/components/admin/articles/article-feature-toggle";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";
import { ArticleSaveToast } from "@/components/admin/articles/article-save-toast";
import { ArticleSeoEditor } from "@/components/admin/articles/article-seo-editor";
import { ArticleStudioLayout } from "@/components/admin/articles/article-studio-layout";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";
import { BLOG_BASE_PATH, SITE_URL } from "@/lib/blog";

export const dynamic = "force-dynamic";

const db = prisma;
const inputClassName = adminTextInputClass;

type ArticleDetailParams = Promise<{ id: string }>;
type ArticleDetailSearchParams = Promise<{ saved?: string }>;

function datetimeValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function faqEntries(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { question?: string; answer?: string };
      return record.question && record.answer
        ? { question: record.question, answer: record.answer }
        : null;
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));
}

export default async function AdminArticleDetailPage({
  params,
  searchParams,
}: {
  params: ArticleDetailParams;
  searchParams: ArticleDetailSearchParams;
}) {
  const admin = await requireAdmin();
  const requestHeaders = await headers();
  const { id } = await params;
  const query = await searchParams;
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || new URL(SITE_URL).host;
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0];
  const protocol = forwardedProtocol || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  const siteOrigin = `${protocol}://${host}`;
  const [article, categories, tags] = await Promise.all([
    db.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    db.articleCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: { _count: { select: { articles: true } } },
      take: 100,
    }),
    db.articleTag.findMany({
      orderBy: { title: "asc" },
      include: { _count: { select: { articles: true } } },
      take: 140,
    }),
  ]);

  if (!article) notFound();

  const selectedTagSet = new Set(
    article.tags.map((item) => item.tag.id),
  );
  return (
    <AdminShell
      adminName={admin.name}
      adminEmail={admin.email}
      pageTitle={article.title}
      pageDescription="Edit article in focused sections. Save only the part you are working on."
      pageEyebrow="Article studio"
      showHero={false}
      headerContent={
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
          <ChevronRightIcon className="size-4" />
          <Link href="/admin/articles" className="hover:text-foreground">
            Articles
          </Link>
          <ChevronRightIcon className="size-4" />
          <span className="truncate text-foreground">Details</span>
        </div>
      }
    >
      <div className="grid gap-6">
        <ArticleSaveToast saved={query.saved} />

        <section className="rounded-2xl border border-blue-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff7ff_58%,#e8fff4_100%)] p-5 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,.94),rgba(15,59,117,.55))] xl:p-4">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    article.status === "PUBLISHED" ? "default" : "secondary"
                  }
                >
                  {article.status}
                </Badge>
                {article.featured ? (
                  <Badge variant="secondary">
                    <StarIcon className="mr-1 size-3" /> Featured
                  </Badge>
                ) : null}
                <span className="text-sm text-muted-foreground">
                  Updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-IN")}
                </span>
              </div>
              <h1 className="mt-3 line-clamp-2 font-heading text-2xl font-semibold leading-tight tracking-normal text-slate-950 md:text-3xl dark:text-white xl:mt-2 xl:line-clamp-1 xl:text-xl">
                {article.title}
              </h1>
            </div>
            <div className="flex shrink-0 flex-wrap justify-start gap-2 xl:justify-end">
              <Button asChild variant="outline" className="bg-white">
                <Link href="/admin/articles">
                  <ArrowLeftIcon className="size-4" />
                  Back
                </Link>
              </Button>
              <ArticleFeatureToggle action={updateArticleFeaturedAction} articleId={article.id} featured={article.featured} />
              <ConfirmActionButton
                action={deleteArticleAction}
                fields={[{ name: "id", value: article.id }]}
                icon={Trash2Icon}
                label="Delete"
                title="Delete this article?"
                description="This permanently removes the article and its tag links."
                confirmLabel="Delete"
                variant="outline"
                confirmVariant="destructive"
              />
            </div>
          </div>
        </section>

        <ArticleStudioLayout>
          <div className="grid min-w-0 gap-6">
            <Card className="!overflow-visible">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <IconTile>
                    <BookOpenTextIcon className="size-5" />
                  </IconTile>
                  <CardTitle>Article content</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ArticleContentEditor
                  articleId={article.id}
                  baseUrl={`${siteOrigin}${BLOG_BASE_PATH}/`}
                  initialContent={article.content}
                  initialExcerpt={article.excerpt || ""}
                  initialSlug={article.slug}
                  initialTitle={article.title}
                  saveAction={autosaveArticleContentAction}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <IconTile>
                    <SearchCheckIcon className="size-5" />
                  </IconTile>
                  <CardTitle>Search preview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form action={updateArticleSeoAction} className="grid gap-4">
                  <input type="hidden" name="id" value={article.id} />
                  <input type="hidden" name="allowIndexing" value="true" />
                  <ArticleSeoEditor
                    articleTitle={article.title}
                    baseUrl={`${siteOrigin}${BLOG_BASE_PATH}/`}
                    initialSlug={article.slug}
                    initialTitle={article.seoTitle || ""}
                    initialDescription={article.seoDescription || ""}
                    initialCanonicalUrl={article.canonicalUrl || ""}
                    initialFaqs={faqEntries(article.faqs)}
                    initialFocusKeyword={article.focusKeyword || ""}
                    initialSchemaType={article.schemaType || "Article"}
                  />
                  <div className="flex justify-end">
                    <ArticleSubmitButton className="h-11 min-w-36 !text-white">Save SEO</ArticleSubmitButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <aside id="article-settings-sidebar" className="grid h-fit min-w-0 self-start gap-6 xl:sticky xl:top-44 xl:max-h-[calc(100svh-12rem)] xl:overflow-y-auto xl:pr-1 xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <IconTile>
                    <SendIcon className="size-5" />
                  </IconTile>
                  <CardTitle>Publish</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  action={updateArticlePublishingAction}
                  className="grid gap-4"
                >
                  <input type="hidden" name="id" value={article.id} />
                  <ArticlePublishingControls
                    initialStatus={article.status}
                    initialScheduledAt={datetimeValue(article.scheduledAt)}
                  />
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <IconTile>
                    <ImageIcon className="size-5" />
                  </IconTile>
                  <CardTitle>Presentation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  action={updateArticlePresentationAction}
                  className="grid gap-4"
                >
                  <input type="hidden" name="id" value={article.id} />
                  <ArticleCoverUpload
                    articleId={article.id}
                    initialAlt={article.coverImageAlt}
                    initialUrl={article.coverImage}
                    title={article.title}
                  />
                  <div className="grid gap-2">
                    <Label>Categories</Label>
                    <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                      <div className="flex border-b border-blue-100 bg-blue-50/60 text-xs font-semibold">
                        <span className="border-b-2 border-primary px-3 py-2 text-primary">
                          All categories
                        </span>
                        <span className="px-3 py-2 text-blue-900/65">
                          Most used
                        </span>
                      </div>
                      <div className="max-h-52 overflow-y-auto p-2">
                        {categories.length ? (
                          categories.map((item, index) => (
                            <label
                              key={item.id}
                              className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
                            >
                              <input
                                type="radio"
                                name="categoryTitle"
                                value={item.title}
                                defaultChecked={
                                  article.category?.id
                                    ? article.category.id === item.id
                                    : index === 0
                                }
                                className="peer sr-only"
                              />
                              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded border border-blue-300 bg-white text-white transition peer-checked:border-primary peer-checked:bg-primary">
                                <CheckIcon className="size-3" />
                              </span>
                              <span className="leading-5">
                                {item.title}
                                <span className="block text-xs font-medium text-blue-900/60">
                                  {item._count?.articles || 0} articles
                                </span>
                              </span>
                            </label>
                          ))
                        ) : (
                          <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50">
                            <input
                              type="radio"
                              name="categoryTitle"
                              value="LMS Guides"
                              defaultChecked
                              className="peer sr-only"
                            />
                            <span className="grid size-4 place-items-center rounded border border-blue-300 bg-white text-white peer-checked:border-primary peer-checked:bg-primary">
                              <CheckIcon className="size-3" />
                            </span>
                            <span>LMS Guides</span>
                          </label>
                        )}
                      </div>
                      <details className="border-t border-blue-100 bg-white px-3 py-2">
                        <summary className="cursor-pointer text-xs font-semibold text-primary">
                          Add new category
                        </summary>
                        <div className="mt-3 grid gap-2">
                          <Input
                            name="categoryTitleNew"
                            placeholder="New category name"
                            className={inputClassName}
                          />
                          <p className="text-xs text-blue-900/60">
                            A new category is created only when this field is
                            filled.
                          </p>
                        </div>
                      </details>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tags</Label>
                    <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                      <div className="flex border-b border-blue-100 bg-blue-50/60 text-xs font-semibold">
                        <span className="border-b-2 border-primary px-3 py-2 text-primary">
                          All tags
                        </span>
                        <span className="px-3 py-2 text-blue-900/65">
                          Most used
                        </span>
                      </div>
                      <div className="max-h-56 overflow-y-auto p-2">
                        {tags.length ? (
                          tags.map((item) => (
                            <label
                              key={item.id}
                              className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
                            >
                              <input
                                type="checkbox"
                                name="tagTitles"
                                value={item.title}
                                defaultChecked={selectedTagSet.has(item.id)}
                                className="peer sr-only"
                              />
                              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded border border-blue-300 bg-white text-white transition peer-checked:border-primary peer-checked:bg-primary">
                                <CheckIcon className="size-3" />
                              </span>
                              <span className="leading-5">
                                {item.title}
                                <span className="block text-xs font-medium text-blue-900/60">
                                  {item._count?.articles || 0} articles
                                </span>
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="rounded-xl bg-blue-50 p-3 text-sm font-medium text-blue-900/75">
                            Create tags from the Tags page, then attach them
                            here.
                          </p>
                        )}
                      </div>
                      <details className="border-t border-blue-100 bg-white px-3 py-2">
                        <summary className="cursor-pointer text-xs font-semibold text-primary">
                          Add new tag
                        </summary>
                        <div className="mt-3 grid gap-2">
                          <Input
                            id="tags"
                            name="tags"
                            defaultValue=""
                            placeholder="New tags, comma separated"
                            className={inputClassName}
                          />
                          <p className="text-xs text-blue-900/60">
                            Separate multiple tags with commas.
                          </p>
                        </div>
                      </details>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <ArticleSubmitButton className="h-11 min-w-36 !text-white">Save presentation</ArticleSubmitButton>
                  </div>
                </form>
              </CardContent>
            </Card>

          </aside>
        </ArticleStudioLayout>
      </div>
    </AdminShell>
  );
}

function IconTile({ children }: { children: ReactNode }) {
  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary">
      {children}
    </div>
  );
}
