"use client";

import { useState } from "react";
import { ImageIcon, LoaderCircleIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ArticleCoverUpload({
  articleId,
  initialAlt,
  initialUrl,
  title,
}: {
  articleId?: string;
  initialAlt?: string | null;
  initialUrl?: string | null;
  title: string;
}) {
  const [url, setUrl] = useState(initialUrl || "");
  const [altText, setAltText] = useState(initialAlt || title);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("coverImageAlt", altText.trim());
      if (articleId) body.append("articleId", articleId);
      const response = await fetch("/api/admin/articles/media", {
        method: "POST",
        body,
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Image upload failed.");
      setUrl(payload.url);
      toast.success(
        articleId ? "Cover image uploaded and saved" : "Image uploaded",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name="coverImage" value={url} />
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
        {url ? (
          // Dynamic upload URLs can be local or point at a configured S3-compatible host.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={altText || title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="grid aspect-video place-items-center bg-blue-50 text-center">
            <div>
              <ImageIcon className="mx-auto size-8 text-primary" />
              <p className="mt-2 text-sm font-semibold text-primary">
                No cover image
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Upload a cover image for listing cards and sharing.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-blue-100 p-3">
          {url ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setUrl("");
                toast.info("Cover image removed. Save presentation to confirm");
              }}
            >
              <Trash2Icon className="size-4" />
              Remove
            </Button>
          ) : null}
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold !text-white shadow-sm transition hover:opacity-95">
            {uploading ? <LoaderCircleIcon className="size-4 animate-spin text-white" /> : <UploadCloudIcon className="size-4 text-white" />}
            {uploading ? "Uploading..." : url ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                void upload(event.currentTarget.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="coverImageAlt">Image description</Label>
        <Input
          id="coverImageAlt"
          name="coverImageAlt"
          value={altText}
          maxLength={180}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Describe the cover image"
          className="h-10 bg-white text-slate-950"
        />
      </div>
    </div>
  );
}
