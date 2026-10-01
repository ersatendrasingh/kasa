"use client";

import { Trash2Icon } from "lucide-react";
import { bulkArticlesAction } from "@/actions/admin/articles";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";

export function BulkDeleteArticlesDialog({ ids }: { ids: string[] }) {
  return <AlertDialog><AlertDialogTrigger asChild><Button type="button" size="sm" variant="destructive"><Trash2Icon className="size-4" />Delete</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {ids.length} selected article{ids.length === 1 ? "" : "s"}?</AlertDialogTitle><AlertDialogDescription>This permanently removes the selected articles and their tag relationships. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><form action={bulkArticlesAction}><input type="hidden" name="bulkAction" value="DELETE" />{ids.map((id) => <input key={id} type="hidden" name="articleIds" value={id} />)}<AlertDialogAction asChild><ArticleSubmitButton pendingLabel="Deleting…" className="bg-destructive/10 text-destructive hover:bg-destructive/20">Delete permanently</ArticleSubmitButton></AlertDialogAction></form></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
