import { LoaderIcon } from "lucide-react";

export function AdminDashboardLoader() {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-white/50 p-4 backdrop-blur-md dark:bg-slate-950/60"
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
    >
      <div className="relative flex flex-col items-center text-center">
        <span className="absolute top-1/2 size-24 -translate-y-1/2 rounded-full bg-primary/15 blur-2xl dark:bg-blue-300/15" />
        <LoaderIcon className="relative size-11 animate-spin text-primary" strokeWidth={1.65} />
      </div>
    </div>
  );
}
