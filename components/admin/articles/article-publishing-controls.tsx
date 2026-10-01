"use client";

import { useState } from "react";
import { CalendarClockIcon } from "lucide-react";
import { adminSelectClass, adminTextInputClass } from "@/components/admin/articles/article-admin-primitives";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { articleStatuses } from "@/schemas/admin/articles";

const statusLabels: Record<(typeof articleStatuses)[number], string> = {
  DRAFT: "Draft",
  REVIEW: "In review",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export function ArticlePublishingControls({
  initialScheduledAt,
  initialStatus,
}: {
  initialScheduledAt: string;
  initialStatus: (typeof articleStatuses)[number];
}) {
  const [status, setStatus] = useState(initialStatus);
  const scheduled = status === "SCHEDULED";
  const buttonLabel = scheduled
    ? "Schedule article"
    : status === "PUBLISHED"
      ? "Publish article"
      : "Save status";

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className={adminSelectClass}
        >
          {articleStatuses.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>
      </div>

      {scheduled ? (
        <div className="grid gap-2 rounded-xl border border-violet-200 bg-violet-50/70 p-3" aria-live="polite">
          <Label htmlFor="scheduledAt" className="flex items-center gap-2">
            <CalendarClockIcon className="size-4 text-violet-700" />
            Publish on
          </Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            defaultValue={initialScheduledAt}
            className={`${adminTextInputClass} h-10`}
          />
        </div>
      ) : (
        <input type="hidden" name="scheduledAt" value="" />
      )}

      <ArticleSubmitButton className="h-11 !text-white">{buttonLabel}</ArticleSubmitButton>
    </div>
  );
}
