import Link from "next/link";
import { ArticleStatus, type Prisma } from "@prisma/client";
import {
  ArrowRightIcon,
  BookOpenTextIcon,
  CalendarClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
  FilePenLineIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  Settings2Icon,
} from "lucide-react";
import { createArticleDraftAction } from "@/actions/admin/articles";
import {
  adminSelectClass,
  adminTextInputClass,
  ArticleAdminHero,
  ArticleMetric,
} from "@/components/admin/articles/article-admin-primitives";
import { ArticleDashboardToast } from "@/components/admin/articles/article-dashboard-toast";
import { ArticlePerPageSelect } from "@/components/admin/articles/article-per-page-select";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";
import { ArticlesDataTable, type ArticleTableItem } from "@/components/admin/articles/articles-data-table";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";

export const dynamic = "force-dynamic";

const db = prisma;
const statusFilters = ["ALL", ...Object.values(ArticleStatus)] as const;

type CategoryOption = {
  id: string;
  title: string;
  slug: string;
};

type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  category: { title: string } | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  updatedAt: Date;
};

type ArticlesSearchParams = Promise<{
  status?: string;
  category?: string;
  q?: string;
  page?: string;
  perPage?: string;
  bulk?: string;
  bulkError?: string;
  count?: string;
}>;

const perPageOptions = [10, 20, 50] as const;

function cleanQuery(value: string | undefined) {
  return (value || "").trim().slice(0, 80);
}

function QuickCreateArticle({ categories }: { categories: CategoryOption[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="h-10 rounded-xl px-4 !text-white">
          <PlusIcon className="size-4" />
          Add article
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-white sm:max-w-xl dark:bg-slate-950">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-heading text-2xl">Create article</SheetTitle>
          <SheetDescription>
            Start with a lightweight draft. Content, media, SEO, and publishing are edited on the article studio page.
          </SheetDescription>
        </SheetHeader>
        <form action={createArticleDraftAction} className="grid gap-6 px-6 py-6">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
            <div className="flex gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm">
                <BookOpenTextIcon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Draft first, polish section by section</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  A long article should not be saved from one crowded form. Create the draft, then work in focused cards.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Article title</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={2}
              placeholder="e.g. Best LMS setup checklist for coaching institutes"
              className={adminTextInputClass}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="auto-created from title if blank"
              className={adminTextInputClass}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryTitle">Starting category</Label>
            <select
              id="categoryTitle"
              name="categoryTitle"
              defaultValue={categories[0]?.title || "LMS Guides"}
              className={adminSelectClass}
            >
              {categories.length ? (
                categories.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.title}
                  </option>
                ))
              ) : (
                <option value="LMS Guides">LMS Guides</option>
              )}
            </select>
          </div>
          <SheetFooter className="px-0">
            <ArticleSubmitButton pendingLabel="Creating…" className="h-11 !text-white">
              Create draft
            </ArticleSubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: ArticlesSearchParams;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const requestedStatus = params.status || "";
  const status = (statusFilters as readonly string[]).includes(requestedStatus) ? requestedStatus : "ALL";
  const articleStatus = status === "ALL" ? undefined : status as ArticleStatus;
  const category = cleanQuery(params.category);
  const q = cleanQuery(params.q);
  const requestedPerPage = Number(params.perPage || 10);
  const perPage = perPageOptions.includes(requestedPerPage as (typeof perPageOptions)[number]) ? requestedPerPage : 10;
  const requestedPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const where: Prisma.ArticleWhereInput = {
    ...(articleStatus ? { status: articleStatus } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
            { focusKeyword: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [categories, stats, totalArticles] = await Promise.all([
    db.articleCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: { _count: { select: { articles: true } } },
      take: 100,
    }),
    db.$transaction([
      db.article.count(),
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.article.count({ where: { status: "SCHEDULED" } }),
      db.article.count({
        where: {
          seoTitle: { not: null },
          seoDescription: { not: null },
          excerpt: { not: null },
        },
      }),
    ]),
    db.article.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalArticles / perPage));
  const page = Math.min(requestedPage, totalPages);
  const articles = await db.article.findMany({
    where,
    orderBy: [
      { publishedAt: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    skip: (page - 1) * perPage,
    take: perPage,
    include: { category: true },
  });
  const tableItems: ArticleTableItem[] = articles.map((article) => {
    const seo = getSeoReadiness(article);
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.status,
      category: article.category?.title || null,
      coverImage: article.coverImage,
      coverImageAlt: article.coverImageAlt,
      featured: article.featured,
      seoReady: seo.ready,
      seoMissing: seo.missing,
      publishedAt: article.publishedAt?.toISOString() || null,
      scheduledAt: article.scheduledAt?.toISOString() || null,
      updatedAt: article.updatedAt.toISOString(),
    };
  });
  const paginationHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (category) query.set("category", category);
    if (status !== "ALL") query.set("status", status);
    if (perPage !== 10) query.set("perPage", String(perPage));
    if (targetPage > 1) query.set("page", String(targetPage));
    const value = query.toString();
    return value ? `/admin/articles?${value}` : "/admin/articles";
  };
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1);

  return (
    <AdminShell
      adminName={admin.name}
      adminEmail={admin.email}
      pageTitle="Articles workspace"
      pageDescription="Create drafts quickly, then edit article content, presentation, SEO, and publishing in focused sections."
      pageEyebrow="Editorial studio"
      actions={<QuickCreateArticle categories={categories} />}
      showHero={false}
      headerContent={
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <ChevronRightIcon className="size-4" />
          <span className="truncate text-foreground">Articles</span>
        </div>
      }
    >
      <div className="grid gap-6">
        <ArticleDashboardToast bulk={params.bulk} bulkError={params.bulkError} count={params.count} />
        <ArticleAdminHero
          eyebrow="Content CMS"
          title="Articles dashboard"
          description="Review drafts, published posts, scheduling status, and SEO readiness before opening the article studio."
          actions={
            <>
              <Button asChild variant="outline" className="h-10 rounded-xl bg-white">
                <Link href="/admin/articles/categories">Categories</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-xl bg-white">
                <Link href="/admin/articles/tags">Tags</Link>
              </Button>
              <QuickCreateArticle categories={categories} />
            </>
          }
        />
        <section className="rounded-2xl border border-blue-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff7ff_60%,#e8fff4_100%)] p-6 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,.92),rgba(15,59,117,.45),rgba(6,78,59,.28))]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <ArticleMetric icon={<BookOpenTextIcon />} label="Total articles" value={stats[0]} />
            <ArticleMetric icon={<CheckCircle2Icon />} label="Published" value={stats[1]} />
            <ArticleMetric icon={<FilePenLineIcon />} label="Drafts" value={stats[2]} />
            <ArticleMetric icon={<CalendarClockIcon />} label="Scheduled" value={stats[3]} />
            <ArticleMetric icon={<SearchIcon />} label="SEO ready" value={stats[4]} />
          </div>
        </section>

        <Card className="overflow-hidden">
          <CardContent className="grid gap-5 p-4">
            <form className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_13rem_12rem_auto_auto]">
              <input type="hidden" name="perPage" value={perPage} />
              <label className="flex h-11 items-center gap-2 rounded-xl border border-input bg-white px-3 shadow-sm dark:bg-white">
                <SearchIcon className="size-4 text-primary" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search article title, slug, keyword..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500"
                />
              </label>
              <select name="category" defaultValue={category} className={adminSelectClass}>
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>{item.title}</option>
                ))}
              </select>
              <select name="status" defaultValue={status} className={adminSelectClass}>
                {statusFilters.map((item) => (
                  <option key={item} value={item}>{item === "ALL" ? "All statuses" : item}</option>
                ))}
              </select>
              <ArticleSubmitButton pendingLabel="Filtering…" className="h-11 rounded-xl !text-white">
                <Settings2Icon className="size-4" />
                Filter
              </ArticleSubmitButton>
              <Button asChild variant="outline" className="h-11 rounded-xl">
                <Link href="/admin/articles">
                  <RotateCcwIcon className="size-4" />
                  Reset
                </Link>
              </Button>
            </form>

            <ArticlesDataTable items={tableItems} />
            <div className="flex flex-col gap-3 rounded-xl bg-blue-50/55 px-4 py-3 dark:bg-white/[0.04] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2"><ArticlePerPageSelect value={perPage} /><p className="text-sm text-muted-foreground">Showing {totalArticles ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, totalArticles)} of {totalArticles}</p></div>
              <div className="flex flex-wrap items-center gap-1.5">
                {page > 1 ? <Button asChild variant="outline" size="sm" className="bg-white"><Link href={paginationHref(page - 1)}><ChevronLeftIcon className="size-4" />Previous</Link></Button> : <Button variant="outline" size="sm" className="bg-white" disabled><ChevronLeftIcon className="size-4" />Previous</Button>}
                {visiblePages.map((value, index) => <span key={value} className="contents">{index > 0 && value - visiblePages[index - 1] > 1 ? <span className="px-1 text-muted-foreground">…</span> : null}<Button asChild size="sm" variant={value === page ? "default" : "outline"} className={value === page ? "!text-white" : "bg-white"}><Link href={paginationHref(value)}>{value}</Link></Button></span>)}
                {page < totalPages ? <Button asChild variant="outline" size="sm" className="bg-white"><Link href={paginationHref(page + 1)}>Next<ArrowRightIcon className="size-4" /></Link></Button> : <Button variant="outline" size="sm" className="bg-white" disabled>Next<ArrowRightIcon className="size-4" /></Button>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

function getSeoReadiness(article: ArticleListItem) {
  const checks = [
    [article.seoTitle, "SEO title"],
    [article.seoDescription, "SEO description"],
    [article.excerpt, "Excerpt"],
  ] as const;
  const missing = checks.filter(([value]) => !value).map(([, label]) => label);

  return { ready: missing.length === 0, missing };
}
