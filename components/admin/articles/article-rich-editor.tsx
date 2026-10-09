"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import type { Level } from "@tiptap/extension-heading";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";
import {
  BoldIcon,
  CheckIcon,
  ChevronDownIcon,
  Code2Icon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  EraserIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  Table2Icon,
  TypeIcon,
  Undo2Icon,
  UnderlineIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const headingOptions: Array<{ label: string; shortLabel: string; level: Level | 0 }> = [
  { label: "Paragraph", shortLabel: "Paragraph", level: 0 },
  { label: "Heading 1", shortLabel: "H1", level: 1 },
  { label: "Heading 2", shortLabel: "H2", level: 2 },
  { label: "Heading 3", shortLabel: "H3", level: 3 },
  { label: "Heading 4", shortLabel: "H4", level: 4 },
  { label: "Heading 5", shortLabel: "H5", level: 5 },
  { label: "Heading 6", shortLabel: "H6", level: 6 },
];

function ToolbarButton({
  active,
  children,
  disabled,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-9 place-items-center rounded-lg border border-transparent text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary",
        active && "border-primary bg-primary !text-white hover:bg-primary hover:!text-white [&_svg]:text-white",
        disabled && "cursor-not-allowed opacity-35 hover:border-transparent hover:bg-transparent hover:text-slate-600",
      )}
    >
      {children}
    </button>
  );
}

export function ArticleRichEditor({
  name,
  defaultValue,
  onChange,
}: {
  name: string;
  defaultValue: string;
  onChange?: (value: string) => void;
}) {
  const [html, setHtml] = useState(defaultValue || "");
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-2xl border border-blue-100",
        },
      }),
      Placeholder.configure({
        placeholder:
          "Write the article body with headings, examples, internal links, lists, and useful details...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TableKit.configure({
        table: {
          resizable: true,
          renderWrapper: true,
          HTMLAttributes: {
            class: "article-content-table",
          },
        },
      }),
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: defaultValue || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": "Article body editor",
        autocapitalize: "sentences",
        class:
          "article-rich-editor min-h-[32rem] max-w-none px-6 py-6 text-base leading-8 text-slate-800 outline-none dark:text-slate-100",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor }) => {
      const nextHtml = editor.getHTML();
      setHtml(nextHtml);
      onChange?.(nextHtml);
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return null;
      const text = currentEditor.getText().trim();
      const activeHeading = headingOptions.find(
        (option) => option.level !== 0 && currentEditor.isActive("heading", { level: option.level }),
      );

      return {
        blockLabel: activeHeading?.shortLabel || "Paragraph",
        headingLevel: activeHeading?.level || 0,
        bold: currentEditor.isActive("bold"),
        italic: currentEditor.isActive("italic"),
        underline: currentEditor.isActive("underline"),
        strike: currentEditor.isActive("strike"),
        code: currentEditor.isActive("code"),
        bulletList: currentEditor.isActive("bulletList"),
        orderedList: currentEditor.isActive("orderedList"),
        blockquote: currentEditor.isActive("blockquote"),
        codeBlock: currentEditor.isActive("codeBlock"),
        link: currentEditor.isActive("link"),
        table: currentEditor.isActive("table"),
        textAlign: (["center", "right", "justify"] as const).find((alignment) =>
          currentEditor.isActive({ textAlign: alignment }),
        ) || "left",
        canUndo: currentEditor.can().chain().focus().undo().run(),
        canRedo: currentEditor.can().chain().focus().redo().run(),
        words: text ? text.split(/\s+/).length : 0,
        characters: text.length,
      };
    },
  });

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    setLinkValue(editor.getAttributes("link").href || "");
    setLinkOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (!linkValue.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkOpen(false);
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkValue.trim() }).run();
    setLinkOpen(false);
  }, [editor, linkValue]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkValue("");
    setLinkOpen(false);
  }, [editor]);

  const uploadImage = useCallback(async (file: File | undefined) => {
    if (!editor || !file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/articles/media", {
        method: "POST",
        body,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Image upload failed.");
      editor.chain().focus().setImage({ src: payload.url, alt: imageAlt.trim() || file.name }).run();
      setImageAlt("");
      setImageOpen(false);
      toast.success("Image inserted into article");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }, [editor, imageAlt]);

  const insertImageUrl = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;
    editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || undefined }).run();
    setImageUrl("");
    setImageAlt("");
    setImageOpen(false);
    toast.success("Image inserted into article");
  }, [editor, imageAlt, imageUrl]);

  if (!editor) {
    return (
      <div className="grid min-h-[32rem] place-items-center rounded-2xl border border-blue-200 bg-white text-sm text-slate-500">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-blue-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
      <input type="hidden" name={name} value={html} />
      <div data-article-toolbar className="sticky top-16 z-40 flex items-center gap-1 overflow-x-auto rounded-t-2xl border-b border-blue-100 bg-white/95 p-3 shadow-[0_10px_20px_rgba(15,23,42,.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Text style"
              className="flex h-9 min-w-32 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-primary hover:text-primary dark:bg-slate-900 dark:text-white"
            >
              <TypeIcon className="size-4 text-primary" />
              <span>{editorState?.blockLabel || "Paragraph"}</span>
              <ChevronDownIcon className="ml-auto size-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border border-blue-100 bg-white p-1.5 shadow-xl dark:bg-slate-950">
            {headingOptions.map((option) => {
              const active = (editorState?.headingLevel || 0) === option.level;
              return (
                <DropdownMenuItem
                  key={option.level}
                  onSelect={() => {
                    if (option.level === 0) {
                      editor.chain().focus().setParagraph().run();
                    } else {
                      editor.chain().focus().setHeading({ level: option.level }).run();
                    }
                  }}
                  className={cn(
                    "min-h-10 gap-3 px-3 py-2",
                    option.level === 1 && "text-xl font-bold",
                    option.level === 2 && "text-lg font-bold",
                    option.level === 3 && "text-base font-bold",
                    option.level === 4 && "text-sm font-bold",
                    option.level === 5 && "text-sm font-semibold",
                    option.level === 6 && "text-xs font-semibold uppercase tracking-wide",
                  )}
                >
                  <span className="w-7 text-xs font-semibold text-slate-400">{option.level ? `H${option.level}` : "P"}</span>
                  <span className="flex-1">{option.label}</span>
                  {active ? <CheckIcon className="size-4 text-primary" /> : null}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="mx-1 h-9 w-px bg-blue-100" />
        <ToolbarButton
          label="Bold"
          active={editorState?.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editorState?.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editorState?.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Strike"
          active={editorState?.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          active={editorState?.code}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2Icon className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-9 w-px bg-blue-100" />
        <ToolbarButton
          label="Align left"
          active={editorState?.textAlign === "left"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeftIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          active={editorState?.textAlign === "center"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenterIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          active={editorState?.textAlign === "right"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRightIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Justify"
          active={editorState?.textAlign === "justify"}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustifyIcon className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-9 w-px bg-blue-100" />
        <ToolbarButton
          label="Bullet list"
          active={editorState?.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editorState?.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editorState?.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          active={editorState?.codeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2Icon className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-9 w-px bg-blue-100" />
        <ToolbarButton label="Link" active={editorState?.link} onClick={openLinkDialog}>
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Upload image" onClick={() => setImageOpen(true)}>
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Table tools"
              title="Table tools"
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-lg border border-transparent px-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-primary",
                editorState?.table && "border-primary bg-primary text-white hover:bg-primary hover:text-white",
              )}
            >
              <Table2Icon className="size-4" />
              <span>Table</span>
              <ChevronDownIcon className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 border border-blue-100 bg-white p-1.5 shadow-xl dark:bg-slate-950">
            <DropdownMenuItem
              onSelect={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="min-h-10 px-3"
            >
              <Table2Icon className="size-4 text-primary" />
              Insert 3 × 3 table
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Rows</DropdownMenuLabel>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().addRowBefore().run()} className="min-h-9 px-3">
              Add row above
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().addRowAfter().run()} className="min-h-9 px-3">
              Add row below
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().deleteRow().run()} className="min-h-9 px-3">
              Delete current row
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().addColumnBefore().run()} className="min-h-9 px-3">
              Add column before
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().addColumnAfter().run()} className="min-h-9 px-3">
              Add column after
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().deleteColumn().run()} className="min-h-9 px-3">
              Delete current column
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().toggleHeaderRow().run()} className="min-h-9 px-3">
              Toggle header row
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().mergeCells().run()} className="min-h-9 px-3">
              Merge selected cells
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!editorState?.table} onSelect={() => editor.chain().focus().splitCell().run()} className="min-h-9 px-3">
              Split current cell
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled={!editorState?.table} onSelect={() => editor.chain().focus().deleteTable().run()} className="min-h-10 px-3">
              Delete table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ToolbarButton
          label="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <MinusIcon className="size-4" />
        </ToolbarButton>
        <span className="mx-1 h-9 w-px bg-blue-100" />
        <ToolbarButton
          label="Undo"
          disabled={!editorState?.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2Icon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editorState?.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2Icon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <EraserIcon className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-blue-100 bg-slate-50/80 px-4 py-2 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
        <span>Tip: type <kbd className="rounded border bg-white px-1 py-0.5">##</kbd> then space for a heading</span>
        <span>{editorState?.words || 0} words · {editorState?.characters || 0} characters</span>
      </div>
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="overflow-hidden border-blue-200 bg-white p-0 shadow-2xl shadow-blue-950/15 sm:max-w-md dark:border-white/10 dark:bg-slate-950">
          <DialogHeader>
            <div className="px-5 pt-5">
              <DialogTitle>Edit link</DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-300">
                Add a useful internal or external URL for the selected text.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="grid gap-2 px-5 pb-5">
            <Label htmlFor="editor-link-url">URL</Label>
            <Input
              id="editor-link-url"
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
              placeholder="https://example.com/page"
              className="border-blue-200 bg-white text-slate-950 shadow-sm focus-visible:ring-blue-200 dark:bg-white dark:text-slate-950"
            />
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-blue-100 bg-white px-5 py-4 sm:flex-row sm:justify-end dark:border-white/10 dark:bg-slate-950">
            <Button type="button" variant="outline" className="bg-white" onClick={() => setLinkOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-white text-slate-800 hover:bg-blue-50 hover:text-primary"
              disabled={!editorState?.link}
              onClick={removeLink}
            >
              <XIcon className="size-4" />
              Remove link
            </Button>
            <Button type="button" className="!text-white" onClick={applyLink}>
              Apply link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="border-blue-200 bg-white shadow-2xl shadow-blue-950/15 sm:max-w-md dark:border-white/10 dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle>Upload image</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-300">
              Upload an article image and insert it at the current cursor position.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="editor-image-alt">Alt text</Label>
            <Input
              id="editor-image-alt"
              value={imageAlt}
              onChange={(event) => setImageAlt(event.target.value)}
              placeholder="Describe the image for accessibility and SEO"
              className="border-blue-200 bg-white text-slate-950"
            />
          </div>
          <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/70 p-8 text-center transition hover:bg-blue-50">
            <UploadCloudIcon className="size-8 text-primary" />
            <span className="mt-3 text-sm font-semibold text-slate-900">
              {uploading ? "Uploading..." : "Choose image"}
            </span>
            <span className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP, or GIF up to 4 MB</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                void uploadImage(event.currentTarget.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-blue-100" />
            or use image URL
            <span className="h-px flex-1 bg-blue-100" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="editor-image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="editor-image-url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    insertImageUrl();
                  }
                }}
                placeholder="https://example.com/image.jpg"
                className="border-blue-200 bg-white text-slate-950"
              />
              <Button type="button" disabled={!imageUrl.trim()} className="!text-white" onClick={insertImageUrl}>
                Insert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
