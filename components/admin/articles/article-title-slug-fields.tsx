"use client";

import { useState } from "react";
import { CheckIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 130);
}

export function ArticleTitleSlugFields({
  baseUrl,
  initialSlug,
  initialTitle,
  onChange,
}: {
  baseUrl: string;
  initialSlug: string;
  initialTitle: string;
  onChange?: (values: { title: string; slug: string }) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const titleSlug = slugify(initialTitle);
  const [slug, setSlug] = useState(
    initialSlug.startsWith(`${titleSlug}-`) ? titleSlug : initialSlug,
  );
  const [editingSlug, setEditingSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState(false);

  function updateTitle(value: string) {
    setTitle(value);
    const nextSlug = customSlug ? slug : slugify(value);
    if (!customSlug) setSlug(nextSlug);
    onChange?.({ title: value, slug: nextSlug });
  }

  function finishSlugEdit() {
    const nextSlug = slug || slugify(title);
    setSlug(nextSlug);
    onChange?.({ title, slug: nextSlug });
    setEditingSlug(false);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="title">Article title</Label>
      <Input
        id="title"
        name="title"
        required
        value={title}
        onChange={(event) => updateTitle(event.target.value)}
        className="h-12 bg-white text-slate-950 shadow-sm dark:bg-white dark:text-slate-950"
      />
      <input type="hidden" name="slug" value={slug} />
      <div className="flex min-w-0 items-center gap-1.5 pl-1 text-xs text-slate-500">
        <span className="shrink-0">{baseUrl}</span>
        {editingSlug ? (
          <div className="relative min-w-0 flex-1">
            <input
              autoFocus
              aria-label="Edit article slug"
              value={slug}
              onChange={(event) => {
                setCustomSlug(true);
                const nextSlug = slugify(event.target.value);
                setSlug(nextSlug);
                onChange?.({ title, slug: nextSlug });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  finishSlugEdit();
                }
                if (event.key === "Escape") {
                  setEditingSlug(false);
                }
              }}
              className="h-8 w-full min-w-0 rounded-md border border-blue-200 bg-white py-1 pl-2 pr-9 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-0.5 top-0.5 size-7 bg-blue-50 text-primary hover:bg-primary hover:text-white"
              onClick={finishSlugEdit}
              aria-label="Finish editing slug"
            >
              <CheckIcon className="size-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <span className="min-w-0 truncate font-semibold text-primary" aria-live="polite">
              {slug || "article-slug"}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 bg-blue-50 text-primary hover:bg-primary hover:text-white"
              onClick={() => setEditingSlug(true)}
              aria-label="Edit article slug"
              title="Edit slug"
            >
              <PencilIcon className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
