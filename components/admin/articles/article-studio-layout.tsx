"use client";

import { useState, type ReactNode } from "react";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ArticleStudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_var(--article-sidebar-width)] xl:transition-[grid-template-columns] xl:duration-300 xl:ease-out",
        sidebarCollapsed
          ? "[--article-sidebar-width:0rem] xl:[&>aside]:pointer-events-none xl:[&>aside]:invisible xl:[&>aside]:translate-x-4 xl:[&>aside]:opacity-0"
          : "[--article-sidebar-width:17rem] xl:[&>aside]:translate-x-0 xl:[&>aside]:opacity-100",
      )}
    >
      {children}
      <button
        type="button"
        aria-expanded={!sidebarCollapsed}
        aria-controls="article-settings-sidebar"
        title={sidebarCollapsed ? "Show article settings" : "Hide article settings"}
        onClick={() => setSidebarCollapsed((current) => !current)}
        className={cn(
          "absolute right-3 top-3 z-50 hidden size-9 place-items-center rounded-xl border border-blue-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-primary hover:bg-blue-50 hover:text-primary xl:grid dark:border-white/10 dark:bg-slate-950 dark:text-slate-300",
          sidebarCollapsed && "right-0 border-primary text-primary",
        )}
      >
        {sidebarCollapsed ? (
          <PanelRightOpenIcon className="size-4" />
        ) : (
          <PanelRightCloseIcon className="size-4" />
        )}
        <span className="sr-only">
          {sidebarCollapsed ? "Show article settings" : "Hide article settings"}
        </span>
      </button>
    </div>
  );
}
