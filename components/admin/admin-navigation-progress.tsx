"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const ADMIN_NAVIGATION_START = "kasa:admin-navigation-start";

export function startAdminNavigation() {
  window.dispatchEvent(new Event(ADMIN_NAVIGATION_START));
}

export function AdminNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loadingFromRoute, setLoadingFromRoute] = useState<string | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const start = () => {
      setLoadingFromRoute(routeKey);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => setLoadingFromRoute(null), 12000);
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (
        destination.origin !== current.origin ||
        !destination.pathname.startsWith("/admin") ||
        `${destination.pathname}${destination.search}${destination.hash}` ===
          `${current.pathname}${current.search}${current.hash}`
      ) return;

      start();
    };

    const stop = () => setLoadingFromRoute(null);

    window.addEventListener(ADMIN_NAVIGATION_START, start);
    window.addEventListener("popstate", start);
    window.addEventListener("pageshow", stop);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener(ADMIN_NAVIGATION_START, start);
      window.removeEventListener("popstate", start);
      window.removeEventListener("pageshow", stop);
      document.removeEventListener("click", handleClick, true);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [routeKey]);

  if (loadingFromRoute !== routeKey) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]" role="status" aria-live="polite">
      <div className="h-1 overflow-hidden bg-blue-100/80">
        <div className="h-full w-2/3 animate-pulse rounded-r-full bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-400 shadow-[0_0_18px_rgba(14,165,233,.65)]" />
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-xl shadow-blue-950/15 backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/95 dark:text-white">
        <span className="grid size-6 place-items-center rounded-full bg-primary text-white shadow-sm">
          <LoaderCircleIcon className="size-3.5 animate-spin" />
        </span>
        Loading…
      </div>
    </div>
  );
}
