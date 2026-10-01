"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const messages: Record<string, string> = {
  ai: "AI provider updated",
  media: "Media storage provider updated",
  demo: "Demo preferences saved",
};

export function SettingsSaveToast({ saved }: { saved?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!saved) return;
    toast.success(messages[saved] || "Settings saved");
    router.replace(pathname, { scroll: false });
  }, [pathname, router, saved]);

  return null;
}
