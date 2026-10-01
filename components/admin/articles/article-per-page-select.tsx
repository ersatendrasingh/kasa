"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startAdminNavigation } from "@/components/admin/admin-navigation-progress";
import { adminSelectClass } from "@/components/admin/articles/article-admin-primitives";

export function ArticlePerPageSelect({ value }: { value: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><span>Rows per page</span><select value={value} className={`${adminSelectClass} h-9 w-20 rounded-lg`} onChange={(event) => { const params = new URLSearchParams(searchParams.toString()); params.set("perPage", event.target.value); params.delete("page"); startAdminNavigation(); router.push(`${pathname}?${params.toString()}`, { scroll: false }); }}><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></label>;
}
