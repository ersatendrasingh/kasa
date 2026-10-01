import Link from "next/link";
import { ChevronRightIcon, FolderTreeIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import {
  createArticleCategoryAction,
  deleteArticleCategoryAction,
  updateArticleCategoryAction,
} from "@/actions/admin/articles";
import {
  adminTextInputClass,
  adminTextareaClass,
  ArticleAdminHero,
  ArticleMetric,
  ArticleTableFrame,
  articleTableCellClass,
  articleTableHeadClass,
  articleTableHeaderRowClass,
  articleTableRowClass,
} from "@/components/admin/articles/article-admin-primitives";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";
import { AdminShell } from "@/components/admin/layouts/admin-shell";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const db = prisma;

type ArticleCategoryWithCount = Prisma.ArticleCategoryGetPayload<{
  include: { _count: { select: { articles: true } } };
}>;

type CategorySearchParams = Promise<{ q?: string }>;

function AddCategorySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="!text-white">
          <PlusIcon className="size-4" />
          Add category
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-white sm:max-w-xl dark:bg-slate-950">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-heading text-2xl">Add category</SheetTitle>
          <SheetDescription>
            Create a reusable article category for filters, editorial organisation, and future category pages.
          </SheetDescription>
        </SheetHeader>
        <form action={createArticleCategoryAction} className="grid gap-5 px-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Category title</Label>
            <Input id="title" name="title" required minLength={2} placeholder="LMS Guides" className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-created from title if blank" className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} placeholder="Short category summary for readers and editors." className={adminTextareaClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input id="seoTitle" name="seoTitle" className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea id="seoDescription" name="seoDescription" rows={3} className={adminTextareaClass} />
          </div>
          <SheetFooter className="px-0">
            <ArticleSubmitButton pendingLabel="Creating…" className="h-11 !text-white">Create category</ArticleSubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function EditCategorySheet({ category }: { category: ArticleCategoryWithCount }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label={`Edit ${category.title}`}>
          <PencilIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-white sm:max-w-xl dark:bg-slate-950">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-heading text-2xl">Edit category</SheetTitle>
          <SheetDescription>
            Update the category title, search slug, description, and search metadata.
          </SheetDescription>
        </SheetHeader>
        <form action={updateArticleCategoryAction} className="grid gap-5 px-6 py-6">
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="isActive" value="false" />
          <div className="grid gap-2">
            <Label htmlFor={`category-title-${category.id}`}>Category title</Label>
            <Input id={`category-title-${category.id}`} name="title" required minLength={2} defaultValue={category.title} className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`category-slug-${category.id}`}>Slug</Label>
            <Input id={`category-slug-${category.id}`} name="slug" defaultValue={category.slug} className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`category-description-${category.id}`}>Description</Label>
            <Textarea id={`category-description-${category.id}`} name="description" rows={4} defaultValue={category.description || ""} className={adminTextareaClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`category-seo-title-${category.id}`}>SEO title</Label>
            <Input id={`category-seo-title-${category.id}`} name="seoTitle" defaultValue={category.seoTitle || ""} className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`category-seo-description-${category.id}`}>SEO description</Label>
            <Textarea id={`category-seo-description-${category.id}`} name="seoDescription" rows={3} defaultValue={category.seoDescription || ""} className={adminTextareaClass} />
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-sm font-semibold text-slate-800">
            <input type="checkbox" name="isActive" value="true" defaultChecked={category.isActive} className="size-4 accent-blue-700" />
            Visible in article filters
          </label>
          <SheetFooter className="px-0">
            <ArticleSubmitButton pendingLabel="Saving…" className="h-11 !text-white">Save category</ArticleSubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default async function ArticleCategoriesPage({
  searchParams,
}: {
  searchParams: CategorySearchParams;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const q = (params.q || "").trim();
  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};
  const [categories, articleCount, uncategorizedCount] = await Promise.all([
    db.articleCategory.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: { _count: { select: { articles: true } } },
      take: 100,
    }),
    db.article.count(),
    db.article.count({ where: { categoryId: null } }),
  ]);

  return (
    <AdminShell
      adminName={admin.name}
      adminEmail={admin.email}
      pageTitle="Article categories"
      pageDescription="Organise articles into clear collections for readers and future category landing pages."
      pageEyebrow="Editorial taxonomy"
      actions={<AddCategorySheet />}
      showHero={false}
      headerContent={
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <ChevronRightIcon className="size-4" />
          <Link href="/admin/articles" className="hover:text-foreground">Articles</Link>
          <ChevronRightIcon className="size-4" />
          <span className="truncate text-foreground">Categories</span>
        </div>
      }
    >
      <div className="grid gap-6">
        <ArticleAdminHero
          eyebrow="Editorial taxonomy"
          title="Article categories"
          description="Group articles into clear collections for navigation, filters, and future category landing pages."
          actions={<AddCategorySheet />}
        />
        <section className="rounded-2xl border border-blue-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff7ff_60%,#e8fff4_100%)] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <ArticleMetric label="Total categories" value={categories.length} />
            <ArticleMetric label="Total articles" value={articleCount} />
            <ArticleMetric label="Uncategorized" value={uncategorizedCount} />
          </div>
        </section>
        <Card>
          <CardContent className="grid gap-4 p-4">
            <form className="flex gap-3">
              <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border bg-white px-3">
                <SearchIcon className="size-4 text-primary" />
                <input name="q" defaultValue={q} placeholder="Search category title or slug" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </label>
              <ArticleSubmitButton pendingLabel="Searching…" className="h-11 !text-white">Search</ArticleSubmitButton>
            </form>
            <ArticleTableFrame>
              <Table>
                <TableHeader>
                  <TableRow className={articleTableHeaderRowClass}>
                    <TableHead className={articleTableHeadClass}>Category</TableHead>
                    <TableHead className={articleTableHeadClass}>Slug</TableHead>
                    <TableHead className={articleTableHeadClass}>Articles</TableHead>
                    <TableHead className={articleTableHeadClass}>Status</TableHead>
                    <TableHead className={`${articleTableHeadClass} text-right`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((item) => (
                    <TableRow key={item.id} className={articleTableRowClass}>
                      <TableCell className={articleTableCellClass}>
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-primary">
                            <FolderTreeIcon className="size-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.description || "No description yet"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.slug}</TableCell>
                      <TableCell><Badge variant="secondary">{item._count.articles} linked</Badge></TableCell>
                      <TableCell><Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Live" : "Hidden"}</Badge></TableCell>
                      <TableCell className={`${articleTableCellClass} text-right`}>
                        <div className="flex justify-end gap-2">
                          <EditCategorySheet category={item} />
                          <ConfirmActionButton
                            action={deleteArticleCategoryAction}
                            fields={[{ name: "id", value: item.id }]}
                            icon={Trash2Icon}
                            label={`Delete ${item.title}`}
                            title="Delete category?"
                            description="Articles linked to this category will remain available without a category."
                            confirmLabel="Delete category"
                            confirmVariant="destructive"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!categories.length ? (
                    <TableRow className={articleTableRowClass}>
                      <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </ArticleTableFrame>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
