"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;
const getServerSnapshot = () => "Today";
const getClientSnapshot = () =>
  new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(new Date());

export function CurrentDayBadge() {
  const day = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200">
      <span className="size-2 rounded-full bg-emerald-500" />
      {day} · Live
    </span>
  );
}
