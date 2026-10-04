"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AdminDashboardLoader } from "@/components/admin/admin-dashboard-loader";

const ADMIN_NAVIGATION_START = "kasa:admin-navigation-start";
const ADMIN_NAVIGATION_STOP = "kasa:admin-navigation-stop";

export function startAdminNavigation() {
  window.dispatchEvent(new Event(ADMIN_NAVIGATION_START));
}

export function stopAdminNavigation() {
  window.dispatchEvent(new Event(ADMIN_NAVIGATION_STOP));
}

export function AdminNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const previousRouteKey = useRef(routeKey);

  useEffect(() => {
    if (previousRouteKey.current === routeKey) return;
    previousRouteKey.current = routeKey;
    setIsLoading(false);
  }, [routeKey]);

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => setIsLoading(false), 12000);
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

    const stop = () => setIsLoading(false);

    window.addEventListener(ADMIN_NAVIGATION_START, start);
    window.addEventListener(ADMIN_NAVIGATION_STOP, stop);
    window.addEventListener("popstate", start);
    window.addEventListener("pageshow", stop);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener(ADMIN_NAVIGATION_START, start);
      window.removeEventListener(ADMIN_NAVIGATION_STOP, stop);
      window.removeEventListener("popstate", start);
      window.removeEventListener("pageshow", stop);
      document.removeEventListener("click", handleClick, true);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  return isLoading ? <AdminDashboardLoader /> : null;
}
