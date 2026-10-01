import Link from "next/link";
import { ChevronRightIcon, HashIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import {
  createArticleTagAction,
  deleteArticleTagAction,
  updateArticleTagAction,
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

type ArticleTagWithCount = Prisma.ArticleTagGetPayload<{
  include: { _count: { select: { articles: true } } };
}>;

type TagSearchParams = Promise<{ q?: string }>;

function AddTagSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="!text-white">
          <PlusIcon className="size-4" />
          Add tag
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-white sm:max-w-xl dark:bg-slate-950">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-heading text-2xl">Add tag</SheetTitle>
          <SheetDescription>
            Create a reusable article tag for content clusters, search filters, and related reading.
          </SheetDescription>
        </SheetHeader>
        <form action={createArticleTagAction} className="grid gap-5 px-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Tag title</Label>
            <Input id="title" name="title" required minLength={2} placeholder="SEO" className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-created from title if blank" className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} placeholder="Short internal note for this topic." className={adminTextareaClass} />
          </div>
          <SheetFooter className="px-0">
            <ArticleSubmitButton pendingLabel="Creating…" className="h-11 !text-white">Create tag</ArticleSubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function EditTagSheet({ tag }: { tag: ArticleTagWithCount }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label={`Edit ${tag.title}`}>
          <PencilIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto bg-white sm:max-w-xl dark:bg-slate-950">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-heading text-2xl">Edit tag</SheetTitle>
          <SheetDescription>
            Update the tag title, slug, and description used for article discovery.
          </SheetDescription>
        </SheetHeader>
        <form action={updateArticleTagAction} className="grid gap-5 px-6 py-6">
          <input type="hidden" name="id" value={tag.id} />
          <div className="grid gap-2">
            <Label htmlFor={`tag-title-${tag.id}`}>Tag title</Label>
            <Input id={`tag-title-${tag.id}`} name="title" required minLength={2} defaultValue={tag.title} className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`tag-slug-${tag.id}`}>Slug</Label>
            <Input id={`tag-slug-${tag.id}`} name="slug" defaultValue={tag.slug} className={adminTextInputClass} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`tag-description-${tag.id}`}>Description</Label>
            <Textarea id={`tag-description-${tag.id}`} name="description" rows={4} defaultValue={tag.description || ""} className={adminTextareaClass} />
          </div>
          <SheetFooter className="px-0">
            <ArticleSubmitButton pendingLabel="Saving…" className="h-11 !text-white">Save tag</ArticleSubmitButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default async function ArticleTagsPage({
  searchParams,
}: {
  searchParams: TagSearchParams;
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
  const [tags, articleLinks] = await Promise.all([
    db.articleTag.findMany({
      where,
      orderBy: { title: "asc" },
      include: { _count: { select: { articles: true } } },
      take: 160,
    }),
    db.articleTagOnArticle.count(),
  ]);

  return (
    <AdminShell
      adminName={admin.name}
      adminEmail={admin.email}
      pageTitle="Article tags"
      pageDescription="Manage cross-category article discovery signals for search, related reading, and content clusters."
      pageEyebrow="Editorial discovery"
      actions={<AddTagSheet />}
      showHero={false}
      headerContent={
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
          <ChevronRightIcon className="size-4" />
          <Link href="/admin/articles" className="hover:text-foreground">Articles</Link>
          <ChevronRightIcon className="size-4" />
          <span className="truncate text-foreground">Tags</span>
        </div>
      }
    >
      <div className="grid gap-6">
        <ArticleAdminHero
          eyebrow="Editorial discovery"
          title="Article tags"
          description="Build reusable topic signals for article filters, related reading, and content clusters."
          actions={<AddTagSheet />}
        />
        <section className="rounded-2xl border border-blue-200 bg-[linear-gradient(135deg,#ffffff_0%,#eff7ff_60%,#e8fff4_100%)] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <ArticleMetric label="Total tags" value={tags.length} />
            <ArticleMetric label="Article links" value={articleLinks} />
            <ArticleMetric label="Visible tags" value={tags.length} />
          </div>
        </section>
        <Card>
          <CardContent className="grid gap-4 p-4">
            <form className="flex gap-3">
              <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border bg-white px-3">
                <SearchIcon className="size-4 text-primary" />
                <input name="q" defaultValue={q} placeholder="Search tags" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </label>
              <ArticleSubmitButton pendingLabel="Searching…" className="h-11 !text-white">Search</ArticleSubmitButton>
            </form>
            <ArticleTableFrame>
              <Table>
                <TableHeader>
                  <TableRow className={articleTableHeaderRowClass}>
                    <TableHead className={articleTableHeadClass}>Tag</TableHead>
                    <TableHead className={articleTableHeadClass}>Slug</TableHead>
                    <TableHead className={articleTableHeadClass}>Articles</TableHead>
                    <TableHead className={articleTableHeadClass}>Description</TableHead>
                    <TableHead className={`${articleTableHeadClass} text-right`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((item) => (
                    <TableRow key={item.id} className={articleTableRowClass}>
                      <TableCell className={articleTableCellClass}>
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-primary">
                            <HashIcon className="size-5" />
                          </div>
                          <p className="font-semibold">{item.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.slug}</TableCell>
                      <TableCell><Badge variant="secondary">{item._count.articles} linked</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{item.description || "No description yet"}</TableCell>
                      <TableCell className={`${articleTableCellClass} text-right`}>
                        <div className="flex justify-end gap-2">
                          <EditTagSheet tag={item} />
                          <ConfirmActionButton
                            action={deleteArticleTagAction}
                            fields={[{ name: "id", value: item.id }]}
                            icon={Trash2Icon}
                            label={`Delete ${item.title}`}
                            title="Delete tag?"
                            description="This removes the tag and its article links. Articles remain available."
                            confirmLabel="Delete tag"
                            confirmVariant="destructive"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!tags.length ? (
                    <TableRow className={articleTableRowClass}>
                      <TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                        No tags found.
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
