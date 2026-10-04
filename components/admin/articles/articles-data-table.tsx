"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenTextIcon, CheckCircle2Icon, CircleAlertIcon, EyeIcon, ImageIcon, StarIcon } from "lucide-react";
import { bulkArticlesAction } from "@/actions/admin/articles";
import { ArticleTableFrame, articleTableCellClass, articleTableHeadClass, articleTableHeaderRowClass, articleTableRowClass } from "@/components/admin/articles/article-admin-primitives";
import { BulkDeleteArticlesDialog } from "@/components/admin/articles/bulk-delete-articles-dialog";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type ArticleTableItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  featured: boolean;
  viewCount: number;
  seoReady: boolean;
  seoMissing: string[];
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
};

function statusMeta(article: ArticleTableItem) {
  const styles: Record<string, string> = {
    PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    SCHEDULED: "border-violet-200 bg-violet-50 text-violet-700",
    REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
    DRAFT: "border-blue-200 bg-blue-50 text-blue-700",
    ARCHIVED: "border-slate-200 bg-slate-100 text-slate-600",
  };
  const date = article.status === "SCHEDULED" ? article.scheduledAt : article.publishedAt;
  return { label: article.status.charAt(0) + article.status.slice(1).toLowerCase(), className: styles[article.status] || styles.DRAFT, date };
}

export function ArticlesDataTable({ items }: { items: ArticleTableItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const selectedItems = useMemo(() => items.filter((item) => selected.has(item.id)), [items, selected]);
  const selectedCount = selected.size;
  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const canPublish = selectedItems.some((item) => item.status !== "PUBLISHED");
  const canReview = selectedItems.some((item) => item.status !== "REVIEW");
  const canDraft = selectedItems.some((item) => item.status !== "DRAFT");
  const canArchive = selectedItems.some((item) => item.status !== "ARCHIVED");

  function toggleAll(checked: boolean) { setSelected(checked ? new Set(items.map((item) => item.id)) : new Set()); }
  function toggleOne(id: string, checked: boolean) { setSelected((current) => { const next = new Set(current); if (checked) next.add(id); else next.delete(id); return next; }); }

  return <form action={bulkArticlesAction} className="grid min-w-0 gap-3">
    <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50/70 px-3 py-2 dark:bg-white/[0.05]">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedCount ? `${selectedCount} selected` : "Select articles to perform a bulk action"}</p>
      {selectedCount ? <div className="flex flex-wrap gap-2">{canPublish ? <ArticleSubmitButton name="bulkAction" value="PUBLISH" pendingLabel="Publishing…" size="sm" className="!text-white">Publish</ArticleSubmitButton> : null}{canReview ? <ArticleSubmitButton name="bulkAction" value="REVIEW" pendingLabel="Moving…" size="sm" variant="outline" className="bg-white">Send to review</ArticleSubmitButton> : null}{canDraft ? <ArticleSubmitButton name="bulkAction" value="DRAFT" pendingLabel="Moving…" size="sm" variant="outline" className="bg-white">Move to draft</ArticleSubmitButton> : null}{canArchive ? <ArticleSubmitButton name="bulkAction" value="ARCHIVE" pendingLabel="Archiving…" size="sm" variant="outline" className="bg-white">Archive</ArticleSubmitButton> : null}<BulkDeleteArticlesDialog ids={selectedIds} /></div> : null}
    </div>
    {selectedIds.map((id) => <input key={id} type="hidden" name="articleIds" value={id} />)}
    <ArticleTableFrame className="min-w-0 max-w-full">
      <Table className="min-w-[960px] table-fixed xl:min-w-0">
        <TableHeader><TableRow className={articleTableHeaderRowClass}><TableHead className={`${articleTableHeadClass} w-[4%]`}><Checkbox checked={allSelected} onCheckedChange={(value) => toggleAll(value === true)} aria-label="Select all articles on this page" /></TableHead><TableHead className={`${articleTableHeadClass} w-[33%]`}>Article</TableHead><TableHead className={`${articleTableHeadClass} w-[12%]`}>Status</TableHead><TableHead className={`${articleTableHeadClass} w-[14%]`}>Category</TableHead><TableHead className={`${articleTableHeadClass} w-[11%]`}>Views</TableHead><TableHead className={`${articleTableHeadClass} w-[9%]`}>SEO</TableHead><TableHead className={`${articleTableHeadClass} w-[10%]`}>Updated</TableHead><TableHead className={`${articleTableHeadClass} w-[7%] text-right`}>Action</TableHead></TableRow></TableHeader>
        <TableBody>{items.map((article) => { const meta = statusMeta(article); return <TableRow key={article.id} className={articleTableRowClass} data-state={selected.has(article.id) ? "selected" : undefined}>
          <TableCell className={articleTableCellClass}><Checkbox checked={selected.has(article.id)} onCheckedChange={(value) => toggleOne(article.id, value === true)} aria-label={`Select ${article.title}`} /></TableCell>
          <TableCell className={`${articleTableCellClass} whitespace-normal`}><Link href={`/admin/articles/${article.id}`} className="group flex min-w-0 items-center gap-3"><div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-blue-200 bg-blue-50">{article.coverImage ? <Image src={article.coverImage} alt={article.coverImageAlt || ""} fill sizes="56px" className="object-cover" /> : <div className="grid size-full place-items-center text-primary"><ImageIcon className="size-5" /></div>}{article.featured ? <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-amber-400 text-white shadow-sm"><StarIcon className="size-3 fill-current" /></span> : null}</div><div className="min-w-0"><p className="line-clamp-2 font-heading text-sm font-semibold leading-5 text-slate-950 group-hover:text-primary dark:text-white">{article.title}</p><p className="mt-1 line-clamp-1 break-all text-xs text-slate-500">/{article.slug}</p></div></Link></TableCell>
          <TableCell className={articleTableCellClass}><div className="grid justify-items-start gap-1.5"><Badge variant="outline" className={meta.className}>{meta.label}</Badge>{meta.date ? <span className="text-xs text-slate-500">{new Date(meta.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span> : <span className="text-xs text-slate-500">Not published</span>}</div></TableCell>
          <TableCell className={`${articleTableCellClass} whitespace-normal`}><div className="flex items-start gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><BookOpenTextIcon className="mt-0.5 size-4 shrink-0 text-primary" /><span className="line-clamp-2">{article.category || "Uncategorized"}</span></div></TableCell>
          <TableCell className={articleTableCellClass}><span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200"><EyeIcon className="size-4 text-primary" />{article.viewCount.toLocaleString("en-IN")}</span></TableCell>
          <TableCell className={articleTableCellClass}>{article.seoReady ? <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400"><CheckCircle2Icon className="size-4" />Ready</div> : <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400" title={article.seoMissing.join(", ")}><CircleAlertIcon className="size-4" />{article.seoMissing.length} missing</div>}</TableCell>
          <TableCell className={`${articleTableCellClass} whitespace-normal text-sm font-medium text-slate-600`}>{new Date(article.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
          <TableCell className={`${articleTableCellClass} text-right`}><Button asChild variant="outline" size="sm" className="bg-white"><Link href={`/admin/articles/${article.id}`}>Edit</Link></Button></TableCell>
        </TableRow>; })}{!items.length ? <TableRow className={articleTableRowClass}><TableCell colSpan={8} className="h-28 text-center text-muted-foreground">No articles found. Create a draft to start.</TableCell></TableRow> : null}</TableBody>
      </Table>
    </ArticleTableFrame>
  </form>;
}
