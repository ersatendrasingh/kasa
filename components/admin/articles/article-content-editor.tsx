"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { SaveIcon } from "lucide-react";
import { startAdminNavigation, stopAdminNavigation } from "@/components/admin/admin-navigation-progress";
import { ArticleRichEditor } from "@/components/admin/articles/article-rich-editor";
import { ArticleTitleSlugFields } from "@/components/admin/articles/article-title-slug-fields";
import { adminTextareaClass } from "@/components/admin/articles/article-admin-primitives";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContentValues = { title: string; slug: string; excerpt: string; content: string };
type SaveAction = (formData: FormData) => Promise<{ savedAt: string }>;

function contentSignature(values: ContentValues) {
  return JSON.stringify(values);
}

function cleanGeneratedSlug(slug: string, title: string) {
  const titleSlug = title
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 130);
  return slug.startsWith(`${titleSlug}-`) ? titleSlug : slug;
}

export function ArticleContentEditor({
  articleId,
  baseUrl,
  initialContent,
  initialExcerpt,
  initialSlug,
  initialTitle,
  saveAction,
}: {
  articleId: string;
  baseUrl: string;
  initialContent: string;
  initialExcerpt: string;
  initialSlug: string;
  initialTitle: string;
  saveAction: SaveAction;
}) {
  const initialSnapshot: ContentValues = { title: initialTitle, slug: cleanGeneratedSlug(initialSlug, initialTitle), excerpt: initialExcerpt, content: initialContent };
  const [values, setValues] = useState<ContentValues>(() => initialSnapshot);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [changeVersion, setChangeVersion] = useState(0);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSignature = useRef(contentSignature(initialSnapshot));
  const latestValues = useRef(initialSnapshot);
  const saveRequest = useRef(0);
  const draftKey = `kasa:article:${articleId}:draft`;

  const persistDraft = useCallback((next: ContentValues) => {
    localStorage.setItem(draftKey, JSON.stringify({ ...next, storedAt: new Date().toISOString() }));
  }, [draftKey]);

  const save = useCallback((next: ContentValues, showGlobalLoader = false) => {
    const signature = contentSignature(next);
    if (signature === lastSavedSignature.current) {
      setSaveState("saved");
      return;
    }
    if (next.title.trim().length < 2 || next.content.replace(/<[^>]+>/g, " ").trim().length < 20) return;
    if (showGlobalLoader) startAdminNavigation();
    const requestId = ++saveRequest.current;
    setSaveState("saving");
    const formData = new FormData();
    formData.set("id", articleId);
    formData.set("title", next.title);
    formData.set("slug", next.slug);
    formData.set("excerpt", next.excerpt);
    formData.set("content", next.content);
    startTransition(async () => {
      try {
        await saveAction(formData);
        lastSavedSignature.current = signature;
        if (requestId !== saveRequest.current) return;
        if (contentSignature(latestValues.current) === signature) {
          localStorage.removeItem(draftKey);
          setSaveState("saved");
        } else {
          setSaveState("unsaved");
          setChangeVersion((version) => version + 1);
        }
      } catch {
        if (requestId === saveRequest.current) setSaveState("error");
      } finally {
        if (showGlobalLoader) stopAdminNavigation();
      }
    });
  }, [articleId, draftKey, saveAction, startTransition]);

  const update = useCallback((next: Partial<ContentValues>) => {
    setValues((current) => {
      const changed = Object.entries(next).some(([key, value]) => current[key as keyof ContentValues] !== value);
      if (!changed) return current;
      const merged = { ...current, ...next };
      latestValues.current = merged;
      persistDraft(merged);
      setSaveState(contentSignature(merged) === lastSavedSignature.current ? "saved" : "unsaved");
      setChangeVersion((version) => version + 1);
      return merged;
    });
  }, [persistDraft]);

  useEffect(() => {
    if (changeVersion === 0) return;
    if (timer.current) clearTimeout(timer.current);
    if (contentSignature(values) === lastSavedSignature.current) return;
    timer.current = setTimeout(() => save(values), 1800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [changeVersion, save, values]); // Save only after the user stops editing.

  const saving = isPending || saveState === "saving";
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        save(latestValues.current, true);
      }}
    >
      <ArticleTitleSlugFields
        initialTitle={initialTitle}
        initialSlug={initialSlug}
        baseUrl={baseUrl}
        onChange={({ title, slug }) => update({ title, slug })}
      />
      <div className="grid gap-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" rows={3} value={values.excerpt} onChange={(event) => update({ excerpt: event.target.value })} className={adminTextareaClass} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="content">Story body</Label>
        <ArticleRichEditor name="content" defaultValue={initialContent} onChange={(content) => update({ content })} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="h-11 min-w-36 !text-white">
          <SaveIcon />
          {saving ? "Saving" : "Save now"}
        </Button>
      </div>
    </form>
  );
}
