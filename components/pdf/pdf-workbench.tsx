"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import JSZip from "jszip";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt";
import { decryptPDF } from "@pdfsmaller/pdf-decrypt";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileImage,
  Files,
  FileStack,
  FileText,
  GripVertical,
  LockKeyhole,
  Minimize2,
  Plus,
  RotateCw,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { type PdfToolDefinition, pdfTools } from "@/lib/pdf-tools";

type WorkFile = { id: string; file: File };
type ResultFile = { url: string; name: string; size: number };
type PreviewData = { status: "loading" | "ready" | "error"; pages: string[]; totalPages?: number; error?: string };
type MergeProgress = { open: boolean; percent: number; title: string; detail: string };
type SplitMode = "every-page" | "sections";
type CompressionPreset = "strong" | "balanced" | "quality";
type CompressionReport = { originalSize: number; outputSize: number; savedPercent: number; method: "original" | "lossless" | "raster"; selectableText: boolean };
type JpgResolution = "web" | "sharp" | "print";
type JpgLivePreview = { status: "loading" | "ready" | "error"; url?: string; size?: number; width?: number; height?: number; pageNumber?: number };
type ImagePageSize = "auto" | "a4" | "letter";
type ImageOrientation = "auto" | "portrait" | "landscape";
type ImageFit = "contain" | "cover";
type ImagePreviewData = { url: string; width: number; height: number; rotation: 0 | 90 | 180 | 270 };
type PdfRotation = 0 | 90 | 180 | 270;
type WatermarkLayout = "diagonal" | "horizontal" | "tiled";
type WatermarkPosition = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";
type WatermarkFontStyle = "regular" | "bold";

const heroToolDetails: Record<PdfToolDefinition["slug"], { kind: "workflow" | "export" | "security" | "review"; label: string; title: string; detail: string; points: [string, string, string] }> = {
  "merge-pdf": { kind: "workflow", label: "Merge plan", title: "One PDF, in your exact order", detail: "Arrange the pages before making the final document.", points: ["Reorder pages", "Drag to organise", "Review before download"] },
  "split-pdf": { kind: "workflow", label: "Split plan", title: "Choose every break with confidence", detail: "Make one PDF per page or build your own sections.", points: ["Every page", "Custom sections", "ZIP download"] },
  "compress-pdf": { kind: "review", label: "Compression check", title: "Smaller only when it helps", detail: "The tool keeps your original if compression would make it bigger.", points: ["Safe comparison", "Quality control", "Original stays available"] },
  "pdf-to-jpg": { kind: "export", label: "Image export", title: "Choose how each page leaves the PDF", detail: "Preview selected pages and tune the JPG result before export.", points: ["Select pages", "Tune resolution", "ZIP of JPGs"] },
  "jpg-to-pdf": { kind: "export", label: "PDF layout", title: "Turn images into a deliberate document", detail: "Arrange photos, pick a page size, and check the layout before saving.", points: ["Drag to reorder", "A4, Letter, or auto", "Fit or fill images"] },
  "rotate-pdf": { kind: "review", label: "Page correction", title: "Fix only the pages that need it", detail: "Choose individual pages and rotate them without rebuilding the PDF.", points: ["Visual page check", "90°, 180°, or 270°", "No quality loss"] },
  "delete-pdf-pages": { kind: "review", label: "Clean-up plan", title: "See what leaves before it leaves", detail: "Mark unwanted pages visually and keep at least one page in the result.", points: ["Click to remove", "Odd/even shortcuts", "Review clean PDF"] },
  "extract-pdf-pages": { kind: "workflow", label: "Extraction plan", title: "Build a focused PDF from the right pages", detail: "Select what you need and set the final order yourself.", points: ["Pick pages visually", "Drag output order", "Original quality kept"] },
  "add-pdf-watermark": { kind: "review", label: "Watermark studio", title: "Style it on a real page first", detail: "Preview wording, pattern, placement, and the exact pages before saving.", points: ["Live page preview", "Colour and opacity", "Choose pages"] },
  "protect-pdf": { kind: "security", label: "Security setup", title: "Create a protected copy you control", detail: "Confirm a password locally before AES-256 encryption is applied.", points: ["AES-256 encryption", "Password confirmation", "Original untouched"] },
  "unlock-pdf": { kind: "security", label: "Authorised unlock", title: "Remove a password you already know", detail: "Create a local unlocked copy without flattening the document.", points: ["Known password only", "Structure preserved", "Original untouched"] },
};

const heroHeadlines: Record<PdfToolDefinition["slug"], string> = {
  "merge-pdf": "Merge PDF files online, in the exact order you need",
  "split-pdf": "Split PDF pages without losing your place",
  "compress-pdf": "Compress PDF files without getting a bigger download",
  "pdf-to-jpg": "Convert PDF pages into crisp JPG images",
  "jpg-to-pdf": "Turn JPG images into one clean, ready-to-send PDF",
  "rotate-pdf": "Fix sideways PDF pages without losing quality",
  "delete-pdf-pages": "Remove PDF pages without guessing page numbers",
  "extract-pdf-pages": "Extract PDF pages and put them in your order",
  "add-pdf-watermark": "Add a professional watermark that fits your PDF",
  "protect-pdf": "Password-protect PDFs before you share them",
  "unlock-pdf": "Unlock a PDF you are authorised to access",
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function pdfColor(value: string) {
  const normalized = value.replace("#", "").padEnd(6, "0").slice(0, 6);
  const parsed = Number.parseInt(normalized, 16);
  return rgb(((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255);
}

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  return pdfjs;
}

async function renderPdfPages(file: File, quality: number, scale: number, password?: string, onProgress?: (current: number, total: number) => void, selectedPages?: number[]) {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), password });
  const documentProxy = await task.promise;
  const pageNumbersToRender = selectedPages?.length ? selectedPages : Array.from({ length: documentProxy.numPages }, (_, index) => index + 1);
  const images: { bytes: Uint8Array; width: number; height: number; pageNumber: number }[] = [];
  for (let renderIndex = 0; renderIndex < pageNumbersToRender.length; renderIndex += 1) {
    const pageNumber = pageNumbersToRender[renderIndex];
    const page = await documentProxy.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Your browser could not create an image canvas.");
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Could not render this page."))), "image/jpeg", quality),
    );
    images.push({ bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height, pageNumber });
    onProgress?.(renderIndex + 1, pageNumbersToRender.length);
  }
  return images;
}

async function imageBytes(file: File) {
  if (file.type === "image/jpeg") return { bytes: new Uint8Array(await file.arrayBuffer()), kind: "jpg" as const };
  if (file.type === "image/png") return { bytes: new Uint8Array(await file.arrayBuffer()), kind: "png" as const };
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare this image.");
  context.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Could not convert this image."))), "image/jpeg", 0.94),
  );
  return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "jpg" as const };
}

async function preparedImageBytes(file: File, rotation: 0 | 90 | 180 | 270) {
  if (rotation === 0) return imageBytes(file);
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const quarterTurn = rotation === 90 || rotation === 270;
  canvas.width = quarterTurn ? bitmap.height : bitmap.width;
  canvas.height = quarterTurn ? bitmap.width : bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not rotate this image.");
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(rotation * Math.PI / 180);
  context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  const keepsAlpha = file.type === "image/png";
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not prepare this image.")), keepsAlpha ? "image/png" : "image/jpeg", 0.94));
  return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: keepsAlpha ? "png" as const : "jpg" as const };
}

function outputName(file: File, suffix: string, extension = "pdf") {
  const base = file.name.replace(/\.[^.]+$/, "");
  return `${base}-${suffix}.${extension}`;
}

const sourceColors = ["#ff5a5f", "#6d5dfc", "#0f9f82", "#e48a13", "#2878d0", "#c83f84"];
const compressionProfiles: Record<CompressionPreset, { label: string; copy: string; quality: number; scale: number }> = {
  strong: { label: "Strong", copy: "Smallest practical file for sharing", quality: 0.48, scale: 0.95 },
  balanced: { label: "Balanced", copy: "Clear text with useful savings", quality: 0.64, scale: 1.2 },
  quality: { label: "High quality", copy: "Sharper pages with lighter compression", quality: 0.8, scale: 1.5 },
};
const jpgResolutionProfiles: Record<JpgResolution, { label: string; copy: string; scale: number }> = {
  web: { label: "Web", copy: "Fast sharing and forms", scale: 1 },
  sharp: { label: "Sharp", copy: "Best everyday clarity", scale: 1.6 },
  print: { label: "Print", copy: "Fine text and printing", scale: 2.2 },
};

export function PdfWorkbench({ tool, children }: { tool: PdfToolDefinition; children?: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const jpgPreviewUrlRef = useRef<string | null>(null);
  const imagePreviewUrlsRef = useRef(new Set<string>());
  const [files, setFiles] = useState<WorkFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultFile | null>(null);
  const [quality, setQuality] = useState(76);
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(22);
  const [watermarkLayout, setWatermarkLayout] = useState<WatermarkLayout>("diagonal");
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>("center");
  const [watermarkFontStyle, setWatermarkFontStyle] = useState<WatermarkFontStyle>("bold");
  const [watermarkColor, setWatermarkColor] = useState("#d12f45");
  const [watermarkSize, setWatermarkSize] = useState(42);
  const [watermarkAngle, setWatermarkAngle] = useState(-35);
  const [watermarkSelectedPages, setWatermarkSelectedPages] = useState<number[]>([]);
  const [watermarkFocusPage, setWatermarkFocusPage] = useState(1);
  const [watermarkProgress, setWatermarkProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your watermark", detail: "Reading the selected pages" });
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [securityProgress, setSecurityProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your secure copy", detail: "Your document stays in this browser" });
  const [previews, setPreviews] = useState<Record<string, PreviewData>>({});
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
  const [pageOrder, setPageOrder] = useState<string[]>([]);
  const [draggedPageKey, setDraggedPageKey] = useState<string | null>(null);
  const [mergeProgress, setMergeProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your PDFs", detail: "Reading the selected files" });
  const [splitMode, setSplitMode] = useState<SplitMode>("every-page");
  const [splitCuts, setSplitCuts] = useState<number[]>([]);
  const [splitProgress, setSplitProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your PDF", detail: "Reading the selected pages" });
  const [compressionPreset, setCompressionPreset] = useState<CompressionPreset>("balanced");
  const [compressionReport, setCompressionReport] = useState<CompressionReport | null>(null);
  const [compressionProgress, setCompressionProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Analysing your PDF", detail: "Comparing safe compression options" });
  const [jpgResolution, setJpgResolution] = useState<JpgResolution>("sharp");
  const [jpgSelectedPages, setJpgSelectedPages] = useState<number[]>([]);
  const [jpgFocusPage, setJpgFocusPage] = useState(1);
  const [jpgLivePreview, setJpgLivePreview] = useState<JpgLivePreview>({ status: "loading" });
  const [jpgProgress, setJpgProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing JPG images", detail: "Reading selected PDF pages" });
  const [imagePreviews, setImagePreviews] = useState<Record<string, ImagePreviewData>>({});
  const [imageFocusId, setImageFocusId] = useState<string | null>(null);
  const [imagePageSize, setImagePageSize] = useState<ImagePageSize>("auto");
  const [imageOrientation, setImageOrientation] = useState<ImageOrientation>("auto");
  const [imageFit, setImageFit] = useState<ImageFit>("contain");
  const [imageMargin, setImageMargin] = useState<0 | 24 | 48>(24);
  const [imagePdfProgress, setImagePdfProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your images", detail: "Building the PDF page plan" });
  const [rotateSelectedPages, setRotateSelectedPages] = useState<number[]>([]);
  const [rotateFocusPage, setRotateFocusPage] = useState(1);
  const [rotatePageAngles, setRotatePageAngles] = useState<Record<number, PdfRotation>>({});
  const [rotateProgress, setRotateProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your PDF", detail: "Checking every page orientation" });
  const [deleteSelectedPages, setDeleteSelectedPages] = useState<number[]>([]);
  const [deleteFocusPage, setDeleteFocusPage] = useState(1);
  const [deleteProgress, setDeleteProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing your PDF", detail: "Checking the pages you marked" });
  const [extractSelectedPages, setExtractSelectedPages] = useState<number[]>([]);
  const [extractFocusPage, setExtractFocusPage] = useState(1);
  const [draggedExtractPage, setDraggedExtractPage] = useState<number | null>(null);
  const [extractProgress, setExtractProgress] = useState<MergeProgress>({ open: false, percent: 0, title: "Preparing selected pages", detail: "Building the new PDF page plan" });

  const mergePages = useMemo(() => {
    const available = new Map(files.flatMap((item, fileIndex) => (previews[item.id]?.pages ?? []).map((src, pageIndex) => {
      const key = `${item.id}:${pageIndex + 1}`;
      return [key, {
        key,
        src,
        fileId: item.id,
        fileName: item.file.name,
        fileIndex,
        sourcePage: pageIndex + 1,
        sourceTotal: previews[item.id]?.totalPages ?? previews[item.id]?.pages.length ?? 0,
      }] as const;
    })));
    return pageOrder.flatMap((key) => {
      const page = available.get(key);
      return page ? [page] : [];
    });
  }, [files, pageOrder, previews]);
  const mergeReady = tool.slug !== "merge-pdf" || (files.length > 0 && mergePages.length > 0 && files.every((item) => previews[item.id]?.status === "ready") && mergePages.length === pageOrder.length);
  const splitPreview = tool.slug === "split-pdf" && files[0] ? previews[files[0].id] : undefined;
  const splitGroups = useMemo(() => {
    const total = splitPreview?.totalPages ?? 0;
    if (!total) return [] as number[][];
    if (splitMode === "every-page") return Array.from({ length: total }, (_, index) => [index]);
    const cuts = [...new Set(splitCuts)].filter((page) => page > 0 && page < total).sort((a, b) => a - b);
    const groups: number[][] = [];
    let start = 0;
    for (const cut of cuts) {
      groups.push(Array.from({ length: cut - start }, (_, index) => start + index));
      start = cut;
    }
    groups.push(Array.from({ length: total - start }, (_, index) => start + index));
    return groups;
  }, [splitCuts, splitMode, splitPreview?.totalPages]);
  const splitReady = tool.slug !== "split-pdf" || (splitPreview?.status === "ready" && splitGroups.length > 0 && splitPreview.pages.length === splitPreview.totalPages && (splitMode === "every-page" || splitCuts.length > 0));
  const compressionPreview = tool.slug === "compress-pdf" && files[0] ? previews[files[0].id] : undefined;
  const compressionReady = tool.slug !== "compress-pdf" || (compressionPreview?.status === "ready" && compressionPreview.pages.length === compressionPreview.totalPages);
  const jpgPreview = tool.slug === "pdf-to-jpg" && files[0] ? previews[files[0].id] : undefined;
  const jpgSourceFile = tool.slug === "pdf-to-jpg" ? files[0]?.file : undefined;
  const selectedPreviewPage = jpgFocusPage;
  const jpgReady = tool.slug !== "pdf-to-jpg" || (jpgPreview?.status === "ready" && jpgSelectedPages.length > 0 && jpgPreview.pages.length === jpgPreview.totalPages);
  const rotatePreview = tool.slug === "rotate-pdf" && files[0] ? previews[files[0].id] : undefined;
  const rotateChangedPages = Object.values(rotatePageAngles).filter((angle) => angle !== 0).length;
  const rotateReady = tool.slug !== "rotate-pdf" || (rotatePreview?.status === "ready" && rotatePreview.pages.length === rotatePreview.totalPages && rotateChangedPages > 0);
  const deletePreview = tool.slug === "delete-pdf-pages" && files[0] ? previews[files[0].id] : undefined;
  const deleteTotalPages = deletePreview?.totalPages ?? 0;
  const deleteRemainingPages = Math.max(0, deleteTotalPages - deleteSelectedPages.length);
  const deleteReady = tool.slug !== "delete-pdf-pages" || (deletePreview?.status === "ready" && deletePreview.pages.length === deleteTotalPages && deleteSelectedPages.length > 0 && deleteRemainingPages > 0);
  const extractPreview = tool.slug === "extract-pdf-pages" && files[0] ? previews[files[0].id] : undefined;
  const extractTotalPages = extractPreview?.totalPages ?? 0;
  const extractReady = tool.slug !== "extract-pdf-pages" || (extractPreview?.status === "ready" && extractPreview.pages.length === extractTotalPages && extractSelectedPages.length > 0);
  const watermarkPreview = tool.slug === "add-pdf-watermark" && files[0] ? previews[files[0].id] : undefined;
  const watermarkTotalPages = watermarkPreview?.totalPages ?? 0;
  const watermarkReady = tool.slug !== "add-pdf-watermark" || (watermarkPreview?.status === "ready" && watermarkPreview.pages.length === watermarkTotalPages && watermark.trim().length > 0 && watermarkSelectedPages.length > 0);
  const securityReady = tool.slug === "protect-pdf" ? password.length >= 4 && password === passwordConfirm : tool.slug === "unlock-pdf" ? password.length > 0 : true;

  useEffect(() => {
    if (!jpgSourceFile || !selectedPreviewPage || jpgPreview?.status !== "ready") return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setJpgLivePreview((current) => ({ ...current, status: "loading", pageNumber: selectedPreviewPage }));
      void renderPdfPages(jpgSourceFile, quality / 100, jpgResolutionProfiles[jpgResolution].scale, undefined, undefined, [selectedPreviewPage])
        .then(([image]) => {
          if (!image) throw new Error("Could not render this page.");
          const url = URL.createObjectURL(new Blob([new Uint8Array(image.bytes)], { type: "image/jpeg" }));
          if (cancelled) {
            URL.revokeObjectURL(url);
            return;
          }
          if (jpgPreviewUrlRef.current) URL.revokeObjectURL(jpgPreviewUrlRef.current);
          jpgPreviewUrlRef.current = url;
          setJpgLivePreview({ status: "ready", url, size: image.bytes.length, width: image.width, height: image.height, pageNumber: selectedPreviewPage });
        })
        .catch(() => { if (!cancelled) setJpgLivePreview({ status: "error", pageNumber: selectedPreviewPage }); });
    }, 220);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [jpgPreview?.status, jpgResolution, jpgSourceFile, quality, selectedPreviewPage]);

  useEffect(() => () => {
    if (jpgPreviewUrlRef.current) URL.revokeObjectURL(jpgPreviewUrlRef.current);
  }, []);

  useEffect(() => () => {
    imagePreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function buildMergePreview(item: WorkFile) {
    setPreviews((current) => ({ ...current, [item.id]: { status: "loading", pages: [] } }));
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await item.file.arrayBuffer()) });
      const documentProxy = await task.promise;
      setPreviews((current) => ({ ...current, [item.id]: { status: "loading", pages: [], totalPages: documentProxy.numPages } }));
      setPageOrder((current) => {
        const keys = Array.from({ length: documentProxy.numPages }, (_, index) => `${item.id}:${index + 1}`);
        return [...current.filter((key) => !key.startsWith(`${item.id}:`)), ...keys];
      });
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
        const page = await documentProxy.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(0.34, 170 / baseViewport.width) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Preview canvas is not available in this browser.");
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        pages.push(canvas.toDataURL("image/jpeg", 0.72));
        setPreviews((current) => ({ ...current, [item.id]: { status: pageNumber === documentProxy.numPages ? "ready" : "loading", pages: [...pages], totalPages: documentProxy.numPages } }));
      }
    } catch {
      setPreviews((current) => ({ ...current, [item.id]: { status: "error", pages: [], error: "Preview unavailable" } }));
      setPageOrder((current) => current.filter((key) => !key.startsWith(`${item.id}:`)));
      setError(`Could not create a page preview for ${item.file.name}.`);
    }
  }

  async function buildSplitPreview(item: WorkFile) {
    setPreviews({ [item.id]: { status: "loading", pages: [] } });
    try {
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await item.file.arrayBuffer()) });
      const documentProxy = await task.promise;
      const pages: string[] = [];
      if (tool.slug === "pdf-to-jpg") {
        setJpgSelectedPages(Array.from({ length: documentProxy.numPages }, (_, index) => index + 1));
        setJpgFocusPage(1);
      }
      if (tool.slug === "rotate-pdf") {
        const everyPage = Array.from({ length: documentProxy.numPages }, (_, index) => index + 1);
        setRotateSelectedPages(everyPage);
        setRotateFocusPage(1);
        setRotatePageAngles(Object.fromEntries(everyPage.map((pageNumber) => [pageNumber, 0])));
      }
      if (tool.slug === "delete-pdf-pages") {
        setDeleteSelectedPages([]);
        setDeleteFocusPage(1);
      }
      if (tool.slug === "extract-pdf-pages") {
        setExtractSelectedPages([]);
        setExtractFocusPage(1);
      }
      if (tool.slug === "add-pdf-watermark") {
        setWatermarkSelectedPages(Array.from({ length: documentProxy.numPages }, (_, index) => index + 1));
        setWatermarkFocusPage(1);
      }
      setPreviews({ [item.id]: { status: "loading", pages: [], totalPages: documentProxy.numPages } });
      for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
        const page = await documentProxy.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(0.42, 210 / baseViewport.width) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Preview canvas is not available in this browser.");
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        pages.push(canvas.toDataURL("image/jpeg", 0.78));
        setPreviews({ [item.id]: { status: pageNumber === documentProxy.numPages ? "ready" : "loading", pages: [...pages], totalPages: documentProxy.numPages } });
      }
    } catch {
      setPreviews({ [item.id]: { status: "error", pages: [], error: "Preview unavailable" } });
      setError(`Could not create page previews for ${item.file.name}.`);
    }
  }

  async function buildImagePreview(item: WorkFile) {
    try {
      const bitmap = await createImageBitmap(item.file);
      const url = URL.createObjectURL(item.file);
      imagePreviewUrlsRef.current.add(url);
      setImagePreviews((current) => ({ ...current, [item.id]: { url, width: bitmap.width, height: bitmap.height, rotation: 0 } }));
      setImageFocusId((current) => current ?? item.id);
    } catch {
      setError(`Could not preview ${item.file.name}.`);
    }
  }

  function addFiles(incoming: FileList | File[]) {
    const accepted = [...incoming].filter((file) => {
      const wantsPdf = tool.accept.includes("pdf");
      return wantsPdf ? file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") : file.type.startsWith("image/");
    });
    if (!accepted.length) {
      setError(tool.accept.includes("pdf") ? "Please choose a PDF file." : "Please choose JPG, PNG, or WebP images.");
      return;
    }
    setError("");
    setResult(null);
    setCompressionReport(null);
    if (tool.slug === "pdf-to-jpg") {
      setJpgSelectedPages([]);
      setJpgFocusPage(1);
      setJpgLivePreview({ status: "loading" });
    }
    const next = accepted.map((file) => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file }));
    setFiles((current) => (tool.multiple ? [...current, ...next] : next.slice(0, 1)));
    if (tool.slug === "merge-pdf") {
      void (async () => {
        for (const item of next) await buildMergePreview(item);
      })();
    }
    if (tool.slug === "split-pdf") {
      setSplitCuts([]);
      void buildSplitPreview(next[0]);
    }
    if (tool.slug === "compress-pdf") void buildSplitPreview(next[0]);
    if (tool.slug === "pdf-to-jpg") void buildSplitPreview(next[0]);
    if (tool.slug === "rotate-pdf") void buildSplitPreview(next[0]);
    if (tool.slug === "delete-pdf-pages") void buildSplitPreview(next[0]);
    if (tool.slug === "extract-pdf-pages") void buildSplitPreview(next[0]);
    if (tool.slug === "add-pdf-watermark") void buildSplitPreview(next[0]);
    if (tool.slug === "jpg-to-pdf") next.forEach((item) => void buildImagePreview(item));
  }

  function move(index: number, direction: -1 | 1) {
    setResult(null);
    setFiles((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function dropFile(overFileId: string) {
    if (!draggedFileId || draggedFileId === overFileId) return;
    setResult(null);
    setFiles((current) => {
      const from = current.findIndex((item) => item.id === draggedFileId);
      const to = current.findIndex((item) => item.id === overFileId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedFileId(null);
  }

  function removeFile(fileId: string) {
    setFiles((current) => current.filter((item) => item.id !== fileId));
    setPreviews((current) => {
      const next = { ...current };
      delete next[fileId];
      return next;
    });
    setImagePreviews((current) => {
      const preview = current[fileId];
      if (preview) {
        URL.revokeObjectURL(preview.url);
        imagePreviewUrlsRef.current.delete(preview.url);
      }
      const next = { ...current };
      delete next[fileId];
      return next;
    });
    setImageFocusId((current) => current === fileId ? files.find((item) => item.id !== fileId)?.id ?? null : current);
    setPageOrder((current) => current.filter((key) => !key.startsWith(`${fileId}:`)));
    setResult(null);
  }

  function dropPage(overPageKey: string) {
    if (!draggedPageKey || draggedPageKey === overPageKey) return;
    setPageOrder((current) => {
      const from = current.indexOf(draggedPageKey);
      const to = current.indexOf(overPageKey);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setResult(null);
    setDraggedPageKey(null);
  }

  function removeMergePage(pageKey: string) {
    setPageOrder((current) => current.filter((key) => key !== pageKey));
    setResult(null);
  }

  function moveMergePage(pageKey: string, direction: -1 | 1) {
    setPageOrder((current) => {
      const index = current.indexOf(pageKey);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }

  function toggleSplitAfter(pageNumber: number) {
    setSplitCuts((current) => current.includes(pageNumber) ? current.filter((page) => page !== pageNumber) : [...current, pageNumber]);
    setResult(null);
  }

  function toggleJpgPage(pageNumber: number) {
    setJpgSelectedPages((current) => {
      const next = current.includes(pageNumber) ? current.filter((page) => page !== pageNumber) : [...current, pageNumber].sort((a, b) => a - b);
      if (!next.includes(jpgFocusPage) && next.length) setJpgFocusPage(next[0]);
      return next;
    });
    setResult(null);
  }

  function rotateImage(fileId: string) {
    setImagePreviews((current) => {
      const preview = current[fileId];
      if (!preview) return current;
      return { ...current, [fileId]: { ...preview, rotation: ((preview.rotation + 90) % 360) as 0 | 90 | 180 | 270 } };
    });
    setResult(null);
  }

  function turnPdfPages(pageNumbers: number[], change: 90 | 180 | 270) {
    if (!pageNumbers.length) return;
    setRotatePageAngles((current) => {
      const next = { ...current };
      pageNumbers.forEach((pageNumber) => {
        next[pageNumber] = (((next[pageNumber] ?? 0) + change) % 360) as PdfRotation;
      });
      return next;
    });
    setResult(null);
  }

  function toggleRotatePage(pageNumber: number) {
    setRotateFocusPage(pageNumber);
    setRotateSelectedPages((current) => current.includes(pageNumber) ? current.filter((page) => page !== pageNumber) : [...current, pageNumber].sort((a, b) => a - b));
  }

  function toggleDeletePage(pageNumber: number) {
    setDeleteFocusPage(pageNumber);
    setDeleteSelectedPages((current) => current.includes(pageNumber) ? current.filter((page) => page !== pageNumber) : [...current, pageNumber].sort((a, b) => a - b));
    setResult(null);
  }

  function selectDeletePreset(kind: "first" | "last" | "odd" | "even" | "invert" | "clear") {
    const everyPage = Array.from({ length: deleteTotalPages }, (_, index) => index + 1);
    setDeleteSelectedPages((current) => {
      if (kind === "clear") return [];
      if (kind === "first") return deleteTotalPages > 1 ? [1] : [];
      if (kind === "last") return deleteTotalPages > 1 ? [deleteTotalPages] : [];
      if (kind === "odd") return everyPage.filter((page) => page % 2 === 1).slice(0, Math.max(0, deleteTotalPages - 1));
      if (kind === "even") return everyPage.filter((page) => page % 2 === 0).slice(0, Math.max(0, deleteTotalPages - 1));
      const inverted = everyPage.filter((page) => !current.includes(page));
      return inverted.length === deleteTotalPages ? inverted.slice(0, -1) : inverted;
    });
    setResult(null);
  }

  function toggleExtractPage(pageNumber: number) {
    setExtractFocusPage(pageNumber);
    setExtractSelectedPages((current) => current.includes(pageNumber) ? current.filter((page) => page !== pageNumber) : [...current, pageNumber]);
    setResult(null);
  }

  function selectExtractPreset(kind: "all" | "first" | "last" | "odd" | "even" | "invert" | "clear") {
    const everyPage = Array.from({ length: extractTotalPages }, (_, index) => index + 1);
    setExtractSelectedPages((current) => {
      if (kind === "clear") return [];
      if (kind === "all") return everyPage;
      if (kind === "first") return extractTotalPages ? [1] : [];
      if (kind === "last") return extractTotalPages ? [extractTotalPages] : [];
      if (kind === "odd") return everyPage.filter((page) => page % 2 === 1);
      if (kind === "even") return everyPage.filter((page) => page % 2 === 0);
      return everyPage.filter((page) => !current.includes(page));
    });
    setResult(null);
  }

  function moveExtractPage(pageNumber: number, direction: -1 | 1) {
    setExtractSelectedPages((current) => {
      const index = current.indexOf(pageNumber);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }

  function dropExtractPage(overPageNumber: number) {
    if (draggedExtractPage === null || draggedExtractPage === overPageNumber) return;
    setExtractSelectedPages((current) => {
      const from = current.indexOf(draggedExtractPage);
      const to = current.indexOf(overPageNumber);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedExtractPage(null);
    setResult(null);
  }

  function toggleWatermarkPage(pageNumber: number) {
    setWatermarkFocusPage(pageNumber);
    setWatermarkSelectedPages((current) => current.includes(pageNumber) ? current.filter((page) => page !== pageNumber) : [...current, pageNumber].sort((a, b) => a - b));
    setResult(null);
  }

  function selectWatermarkPages(kind: "all" | "odd" | "even" | "first" | "last" | "clear") {
    const everyPage = Array.from({ length: watermarkTotalPages }, (_, index) => index + 1);
    if (kind === "all") setWatermarkSelectedPages(everyPage);
    if (kind === "odd") setWatermarkSelectedPages(everyPage.filter((page) => page % 2 === 1));
    if (kind === "even") setWatermarkSelectedPages(everyPage.filter((page) => page % 2 === 0));
    if (kind === "first") setWatermarkSelectedPages(watermarkTotalPages ? [1] : []);
    if (kind === "last") setWatermarkSelectedPages(watermarkTotalPages ? [watermarkTotalPages] : []);
    if (kind === "clear") setWatermarkSelectedPages([]);
    setResult(null);
  }

  async function run() {
    if (!files.length) return;
    if ((tool.slug === "protect-pdf" || tool.slug === "unlock-pdf") && !password) {
      setError("Enter the document password first.");
      return;
    }
    if (tool.slug === "protect-pdf" && password !== passwordConfirm) {
      setError("The two password entries do not match.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      let blob: Blob;
      let name: string;
      let completedPageCount = 0;
      const first = files[0].file;

      if (tool.slug === "merge-pdf") {
        if (!mergeReady || !mergePages.length) throw new Error("Please wait until every page preview is ready.");
        setMergeProgress({ open: true, percent: 6, title: "Preparing your PDFs", detail: `${mergePages.length} pages in your chosen order` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const output = await PDFDocument.create();
        const sourceDocuments = new Map<string, PDFDocument>();
        for (let outputIndex = 0; outputIndex < mergePages.length; outputIndex += 1) {
          const page = mergePages[outputIndex];
          const item = files.find((candidate) => candidate.id === page.fileId);
          if (!item) throw new Error("A source file is no longer available.");
          setMergeProgress({
            open: true,
            percent: 10 + Math.round((outputIndex / mergePages.length) * 72),
            title: `Adding page ${outputIndex + 1} of ${mergePages.length}`,
            detail: `${page.fileName} · source page ${page.sourcePage}`,
          });
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          let source = sourceDocuments.get(item.id);
          if (!source) {
            source = await PDFDocument.load(await item.file.arrayBuffer());
            sourceDocuments.set(item.id, source);
          }
          const [copiedPage] = await output.copyPages(source, [page.sourcePage - 1]);
          output.addPage(copiedPage);
          completedPageCount += 1;
        }
        setMergeProgress({ open: true, percent: 88, title: "Building the final PDF", detail: `${output.getPageCount()} pages in the selected order` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        blob = new Blob([new Uint8Array(await output.save({ useObjectStreams: true }))], { type: "application/pdf" });
        name = "merged-document.pdf";
      } else if (tool.slug === "split-pdf") {
        if (!splitReady) throw new Error("Please wait until every page preview is ready.");
        const source = await PDFDocument.load(await first.arrayBuffer());
        const groups = splitGroups;
        const zip = new JSZip();
        setSplitProgress({ open: true, percent: 8, title: "Preparing split files", detail: `${groups.length} PDFs will be created` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        for (let index = 0; index < groups.length; index += 1) {
          const firstPage = groups[index][0] + 1;
          const lastPage = groups[index][groups[index].length - 1] + 1;
          setSplitProgress({ open: true, percent: 12 + Math.round((index / groups.length) * 76), title: `Creating file ${index + 1} of ${groups.length}`, detail: `Page${groups[index].length > 1 ? "s" : ""} ${firstPage}${lastPage > firstPage ? `-${lastPage}` : ""}` });
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const output = await PDFDocument.create();
          const pages = await output.copyPages(source, groups[index]);
          pages.forEach((page) => output.addPage(page));
          zip.file(`part-${String(index + 1).padStart(2, "0")}.pdf`, await output.save());
        }
        setSplitProgress({ open: true, percent: 92, title: "Packing your downloads", detail: `${groups.length} PDF files in one ZIP` });
        blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        name = outputName(first, "split", "zip");
      } else if (tool.slug === "compress-pdf") {
        if (!compressionReady) throw new Error("Please wait until every page preview is ready.");
        const profile = compressionProfiles[compressionPreset];
        const originalBytes = new Uint8Array(await first.arrayBuffer());
        setCompressionProgress({ open: true, percent: 8, title: "Analysing your PDF", detail: `${formatBytes(originalBytes.length)} original file` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        const source = await PDFDocument.load(originalBytes);
        const losslessBytes = new Uint8Array(await source.save({ useObjectStreams: true, addDefaultPage: false }));
        setCompressionProgress({ open: true, percent: 22, title: "Trying lossless optimisation", detail: "Preserving text, links, forms, and vectors" });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        let rasterBytes: Uint8Array | null = null;
        try {
          const images = await renderPdfPages(first, profile.quality, profile.scale, undefined, (current, total) => {
            setCompressionProgress({ open: true, percent: 24 + Math.round((current / total) * 58), title: `Testing ${profile.label.toLowerCase()} compression`, detail: `Rendering page ${current} of ${total}` });
          });
          const rasterOutput = await PDFDocument.create();
          for (const image of images) {
            const embedded = await rasterOutput.embedJpg(image.bytes);
            const page = rasterOutput.addPage([image.width, image.height]);
            page.drawImage(embedded, { x: 0, y: 0, width: image.width, height: image.height });
          }
          rasterBytes = new Uint8Array(await rasterOutput.save({ useObjectStreams: true }));
        } catch {
          rasterBytes = null;
        }

        setCompressionProgress({ open: true, percent: 90, title: "Choosing the smallest safe result", detail: "A larger output will never replace your original" });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const safeCandidates = [
          { bytes: originalBytes, method: "original" as const, selectableText: true },
          { bytes: losslessBytes, method: "lossless" as const, selectableText: true },
        ];
        const safeBest = safeCandidates.reduce((smallest, candidate) => candidate.bytes.length < smallest.bytes.length ? candidate : smallest);
        const best = rasterBytes && rasterBytes.length <= safeBest.bytes.length * 0.92
          ? { bytes: rasterBytes, method: "raster" as const, selectableText: false }
          : safeBest;
        const savedPercent = Math.max(0, Math.round((1 - best.bytes.length / originalBytes.length) * 100));
        setCompressionReport({ originalSize: originalBytes.length, outputSize: best.bytes.length, savedPercent, method: best.method, selectableText: best.selectableText });
        blob = new Blob([new Uint8Array(best.bytes)], { type: "application/pdf" });
        name = outputName(first, "compressed");
      } else if (tool.slug === "pdf-to-jpg") {
        if (!jpgReady) throw new Error("Select at least one page and wait for the previews to finish.");
        const selectedPages = [...jpgSelectedPages].sort((a, b) => a - b);
        const resolution = jpgResolutionProfiles[jpgResolution];
        setJpgProgress({ open: true, percent: 6, title: "Preparing JPG images", detail: `${selectedPages.length} selected ${selectedPages.length === 1 ? "page" : "pages"}` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const images = await renderPdfPages(first, quality / 100, resolution.scale, undefined, (current, total) => {
          setJpgProgress({ open: true, percent: 10 + Math.round((current / total) * 78), title: `Rendering image ${current} of ${total}`, detail: `${resolution.label} resolution · ${quality}% quality` });
        }, selectedPages);
        const zip = new JSZip();
        images.forEach((image) => zip.file(`page-${String(image.pageNumber).padStart(3, "0")}.jpg`, image.bytes));
        setJpgProgress({ open: true, percent: 92, title: "Packing your JPG files", detail: "Keeping original PDF page numbers in every filename" });
        blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
        name = outputName(first, "jpg-pages", "zip");
      } else if (tool.slug === "jpg-to-pdf") {
        setImagePdfProgress({ open: true, percent: 6, title: "Preparing your images", detail: `${files.length} PDF ${files.length === 1 ? "page" : "pages"} planned` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const output = await PDFDocument.create();
        for (let index = 0; index < files.length; index += 1) {
          const item = files[index];
          const rotation = imagePreviews[item.id]?.rotation ?? 0;
          setImagePdfProgress({ open: true, percent: 10 + Math.round((index / files.length) * 78), title: `Creating page ${index + 1} of ${files.length}`, detail: item.file.name });
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          const image = await preparedImageBytes(item.file, rotation);
          const embedded = image.kind === "png" ? await output.embedPng(image.bytes) : await output.embedJpg(image.bytes);
          let pageWidth: number;
          let pageHeight: number;
          if (imagePageSize === "auto") {
            const imageScale = Math.min(1, 1440 / Math.max(embedded.width, embedded.height));
            pageWidth = embedded.width * imageScale + imageMargin * 2;
            pageHeight = embedded.height * imageScale + imageMargin * 2;
          } else {
            const base = imagePageSize === "a4" ? [595.28, 841.89] : [612, 792];
            const wantsLandscape = imageOrientation === "landscape" || (imageOrientation === "auto" && embedded.width > embedded.height);
            [pageWidth, pageHeight] = wantsLandscape ? [base[1], base[0]] : base;
          }
          const availableWidth = Math.max(1, pageWidth - imageMargin * 2);
          const availableHeight = Math.max(1, pageHeight - imageMargin * 2);
          const drawScale = imageFit === "cover"
            ? Math.max(availableWidth / embedded.width, availableHeight / embedded.height)
            : Math.min(availableWidth / embedded.width, availableHeight / embedded.height);
          const drawWidth = embedded.width * drawScale;
          const drawHeight = embedded.height * drawScale;
          const page = output.addPage([pageWidth, pageHeight]);
          page.drawImage(embedded, { x: (pageWidth - drawWidth) / 2, y: (pageHeight - drawHeight) / 2, width: drawWidth, height: drawHeight });
        }
        setImagePdfProgress({ open: true, percent: 92, title: "Finishing your PDF", detail: "Preserving the exact page order shown in the workspace" });
        blob = new Blob([new Uint8Array(await output.save({ useObjectStreams: true }))], { type: "application/pdf" });
        name = "images-to-pdf.pdf";
      } else if (tool.slug === "rotate-pdf") {
        if (!rotateReady) throw new Error("Rotate at least one page before creating the new PDF.");
        setRotateProgress({ open: true, percent: 8, title: "Preparing page rotations", detail: `${rotateChangedPages} ${rotateChangedPages === 1 ? "page" : "pages"} will change` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const source = await PDFDocument.load(await first.arrayBuffer());
        source.getPages().forEach((page, index) => {
          const change = rotatePageAngles[index + 1] ?? 0;
          if (change) page.setRotation(degrees((page.getRotation().angle + change) % 360));
          setRotateProgress({ open: true, percent: 12 + Math.round(((index + 1) / source.getPageCount()) * 76), title: `Checking page ${index + 1} of ${source.getPageCount()}`, detail: change ? `Applying ${change === 270 ? "90° left" : `${change}° right`}` : "Keeping its original orientation" });
        });
        setRotateProgress({ open: true, percent: 92, title: "Saving the corrected PDF", detail: "Keeping original text, links, and page quality" });
        blob = new Blob([new Uint8Array(await source.save())], { type: "application/pdf" });
        name = outputName(first, "rotated");
      } else if (tool.slug === "delete-pdf-pages") {
        if (!deleteReady) throw new Error(deleteRemainingPages === 0 ? "Keep at least one page in the PDF." : "Select at least one page to delete.");
        setDeleteProgress({ open: true, percent: 8, title: "Preparing the cleaned PDF", detail: `${deleteSelectedPages.length} ${deleteSelectedPages.length === 1 ? "page" : "pages"} marked for removal` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const source = await PDFDocument.load(await first.arrayBuffer());
        const selected = new Set(deleteSelectedPages.map((page) => page - 1));
        const indices = source.getPageIndices().filter((index) => !selected.has(index));
        if (!indices.length) throw new Error("Keep at least one page in the PDF.");
        const output = await PDFDocument.create();
        const pages = await output.copyPages(source, indices);
        pages.forEach((page, index) => {
          output.addPage(page);
          setDeleteProgress({ open: true, percent: 12 + Math.round(((index + 1) / pages.length) * 76), title: `Keeping page ${indices[index] + 1}`, detail: `Output page ${index + 1} of ${pages.length}` });
        });
        setDeleteProgress({ open: true, percent: 92, title: "Saving the cleaned PDF", detail: "Preserving the original order and page quality" });
        blob = new Blob([new Uint8Array(await output.save({ useObjectStreams: true }))], { type: "application/pdf" });
        name = outputName(first, "pages-removed");
      } else if (tool.slug === "extract-pdf-pages") {
        if (!extractReady) throw new Error("Select at least one page for the new PDF.");
        setExtractProgress({ open: true, percent: 8, title: "Preparing selected pages", detail: `${extractSelectedPages.length} ${extractSelectedPages.length === 1 ? "page" : "pages"} in your chosen order` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const source = await PDFDocument.load(await first.arrayBuffer());
        const indices = extractSelectedPages.map((page) => page - 1);
        if (!indices.length) throw new Error("At least one page must remain in the output PDF.");
        const output = await PDFDocument.create();
        const pages = await output.copyPages(source, indices);
        pages.forEach((page, index) => {
          output.addPage(page);
          setExtractProgress({ open: true, percent: 12 + Math.round(((index + 1) / pages.length) * 76), title: `Adding output page ${index + 1} of ${pages.length}`, detail: `Source page ${extractSelectedPages[index]}` });
        });
        setExtractProgress({ open: true, percent: 92, title: "Saving the extracted PDF", detail: "Preserving page dimensions, text, and quality" });
        blob = new Blob([new Uint8Array(await output.save({ useObjectStreams: true }))], { type: "application/pdf" });
        name = outputName(first, "extracted");
      } else if (tool.slug === "add-pdf-watermark") {
        if (!watermarkReady) throw new Error(watermark.trim() ? "Select at least one page for the watermark." : "Enter your watermark text.");
        setWatermarkProgress({ open: true, percent: 8, title: "Preparing your watermark", detail: `${watermarkSelectedPages.length} ${watermarkSelectedPages.length === 1 ? "page" : "pages"} selected` });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const source = await PDFDocument.load(await first.arrayBuffer());
        const font = await source.embedFont(watermarkFontStyle === "bold" ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
        const selectedPages = new Set(watermarkSelectedPages);
        const cleanText = watermark.trim();
        const ink = pdfColor(watermarkColor);
        source.getPages().forEach((page, index) => {
          if (!selectedPages.has(index + 1)) return;
          const { width, height } = page.getSize();
          const requestedSize = watermarkLayout === "tiled" ? Math.min(watermarkSize, 34) : watermarkSize;
          const naturalWidth = font.widthOfTextAtSize(cleanText, requestedSize);
          const fontSize = Math.max(10, naturalWidth > width * 0.78 ? requestedSize * ((width * 0.78) / naturalWidth) : requestedSize);
          const textWidth = font.widthOfTextAtSize(cleanText, fontSize);
          if (watermarkLayout === "tiled") {
            const horizontalStep = Math.max(150, textWidth + 60);
            const verticalStep = Math.max(95, fontSize * 3.2);
            for (let y = -20; y < height + verticalStep; y += verticalStep) {
              for (let x = -textWidth / 2; x < width + horizontalStep; x += horizontalStep) {
                page.drawText(cleanText, { x, y, size: fontSize, font, color: ink, opacity: opacity / 100, rotate: degrees(watermarkAngle) });
              }
            }
          } else {
            const margin = 34;
            let x = (width - textWidth) / 2;
            let y = (height - fontSize) / 2;
            if (watermarkPosition === "top-left") { x = margin; y = height - fontSize - margin; }
            if (watermarkPosition === "top-right") { x = width - textWidth - margin; y = height - fontSize - margin; }
            if (watermarkPosition === "bottom-left") { x = margin; y = margin; }
            if (watermarkPosition === "bottom-right") { x = width - textWidth - margin; y = margin; }
            page.drawText(cleanText, { x: Math.max(margin / 2, x), y, size: fontSize, font, color: ink, opacity: opacity / 100, rotate: degrees(watermarkLayout === "horizontal" ? 0 : watermarkAngle) });
          }
          setWatermarkProgress({ open: true, percent: 12 + Math.round(((index + 1) / source.getPageCount()) * 76), title: `Watermarking page ${index + 1}`, detail: watermarkLayout === "tiled" ? "Applying a repeated pattern" : `Placing ${watermarkLayout} text at ${watermarkPosition.replace("-", " ")}` });
        });
        setWatermarkProgress({ open: true, percent: 92, title: "Saving your PDF", detail: "Keeping original text, links, vectors, and page quality" });
        blob = new Blob([new Uint8Array(await source.save({ useObjectStreams: true }))], { type: "application/pdf" });
        name = outputName(first, "watermarked");
      } else if (tool.slug === "protect-pdf") {
        setSecurityProgress({ open: true, percent: 15, title: "Encrypting your PDF", detail: "Applying AES-256 protection locally" });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const encrypted = await encryptPDF(new Uint8Array(await first.arrayBuffer()), password);
        setSecurityProgress({ open: true, percent: 88, title: "Saving the protected copy", detail: "Your original PDF remains unchanged" });
        blob = new Blob([new Uint8Array(encrypted)], { type: "application/pdf" });
        name = outputName(first, "protected");
      } else {
        setSecurityProgress({ open: true, percent: 15, title: "Verifying the password", detail: "Decrypting this authorised copy locally" });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const decrypted = await decryptPDF(new Uint8Array(await first.arrayBuffer()), password);
        setSecurityProgress({ open: true, percent: 88, title: "Saving the unlocked copy", detail: "Keeping its document structure intact" });
        blob = new Blob([new Uint8Array(decrypted)], { type: "application/pdf" });
        name = outputName(first, "unlocked");
      }

      const url = URL.createObjectURL(blob);
      setResult((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { url, name, size: blob.size };
      });
      if (tool.slug === "merge-pdf") {
        setMergeProgress({ open: true, percent: 100, title: "Merge complete", detail: `${completedPageCount} pages are ready to download` });
        window.setTimeout(() => setMergeProgress((current) => ({ ...current, open: false })), 1100);
      }
      if (tool.slug === "split-pdf") {
        setSplitProgress({ open: true, percent: 100, title: "Split complete", detail: `${splitGroups.length} PDFs are ready to download` });
        window.setTimeout(() => setSplitProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "compress-pdf") {
        const finalSize = blob.size;
        setCompressionProgress({ open: true, percent: 100, title: finalSize < first.size ? "Compression complete" : "PDF already optimised", detail: finalSize < first.size ? `${formatBytes(first.size - finalSize)} saved` : "The original was already the smallest safe version" });
        window.setTimeout(() => setCompressionProgress((current) => ({ ...current, open: false })), 1100);
      }
      if (tool.slug === "pdf-to-jpg") {
        setJpgProgress({ open: true, percent: 100, title: "JPG package ready", detail: `${jpgSelectedPages.length} images are ready inside the ZIP` });
        window.setTimeout(() => setJpgProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "jpg-to-pdf") {
        setImagePdfProgress({ open: true, percent: 100, title: "PDF ready", detail: `${files.length} images became ${files.length} ordered PDF pages` });
        window.setTimeout(() => setImagePdfProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "rotate-pdf") {
        setRotateProgress({ open: true, percent: 100, title: "Rotation complete", detail: `${rotateChangedPages} corrected ${rotateChangedPages === 1 ? "page is" : "pages are"} ready to review` });
        window.setTimeout(() => setRotateProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "delete-pdf-pages") {
        setDeleteProgress({ open: true, percent: 100, title: "Cleaned PDF ready", detail: `${deleteRemainingPages} ${deleteRemainingPages === 1 ? "page remains" : "pages remain"} in the original order` });
        window.setTimeout(() => setDeleteProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "extract-pdf-pages") {
        setExtractProgress({ open: true, percent: 100, title: "Extracted PDF ready", detail: `${extractSelectedPages.length} selected ${extractSelectedPages.length === 1 ? "page is" : "pages are"} ready to review` });
        window.setTimeout(() => setExtractProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "add-pdf-watermark") {
        setWatermarkProgress({ open: true, percent: 100, title: "Watermarked PDF ready", detail: `${watermarkSelectedPages.length} ${watermarkSelectedPages.length === 1 ? "page is" : "pages are"} ready to review` });
        window.setTimeout(() => setWatermarkProgress((current) => ({ ...current, open: false })), 1000);
      }
      if (tool.slug === "protect-pdf" || tool.slug === "unlock-pdf") {
        setSecurityProgress({ open: true, percent: 100, title: tool.slug === "protect-pdf" ? "Protected PDF ready" : "Unlocked PDF ready", detail: tool.slug === "protect-pdf" ? "Password encryption is now applied" : "The password prompt has been removed" });
        window.setTimeout(() => setSecurityProgress((current) => ({ ...current, open: false })), 1000);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "This file could not be processed.";
      setError(message.includes("password") ? "The password is incorrect or this encryption type is not supported." : message);
      if (tool.slug === "merge-pdf") setMergeProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "split-pdf") setSplitProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "compress-pdf") setCompressionProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "pdf-to-jpg") setJpgProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "jpg-to-pdf") setImagePdfProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "rotate-pdf") setRotateProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "delete-pdf-pages") setDeleteProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "extract-pdf-pages") setExtractProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "add-pdf-watermark") setWatermarkProgress((current) => ({ ...current, open: false }));
      if (tool.slug === "protect-pdf" || tool.slug === "unlock-pdf") setSecurityProgress((current) => ({ ...current, open: false }));
    } finally {
      setBusy(false);
    }
  }

  const showsSettings = false;
  const passwordStrength = password.length >= 14 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) ? "strong" : password.length >= 9 && /[A-Za-z]/.test(password) && /\d/.test(password) ? "good" : password.length >= 4 ? "weak" : "empty";
  const focusedImageItem = files.find((item) => item.id === imageFocusId) ?? files[0];
  const focusedImagePreview = focusedImageItem ? imagePreviews[focusedImageItem.id] : undefined;
  const focusedQuarterTurn = focusedImagePreview?.rotation === 90 || focusedImagePreview?.rotation === 270;
  const focusedWidth = focusedImagePreview ? (focusedQuarterTurn ? focusedImagePreview.height : focusedImagePreview.width) : 1;
  const focusedHeight = focusedImagePreview ? (focusedQuarterTurn ? focusedImagePreview.width : focusedImagePreview.height) : 1;
  const heroDetail = heroToolDetails[tool.slug];
  const watermarkPositionStyle: React.CSSProperties = watermarkPosition === "top-left" ? { left: "9%", top: "10%" }
    : watermarkPosition === "top-right" ? { right: "9%", top: "10%" }
      : watermarkPosition === "bottom-left" ? { left: "9%", bottom: "10%" }
        : watermarkPosition === "bottom-right" ? { right: "9%", bottom: "10%" }
          : { left: "50%", top: "50%", transform: `translate(-50%, -50%) rotate(${watermarkLayout === "horizontal" ? 0 : watermarkAngle}deg)` };

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-[#181817] dark:bg-[#0d0e10] dark:text-white">
      {mergeProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="Merge progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative grid size-16 shrink-0 place-items-center">
                <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" />
                  <circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - mergeProgress.percent} className="transition-all duration-300" />
                </svg>
                <span className="text-xs font-bold">{mergeProgress.percent}%</span>
              </div>
              <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Creating merged PDF</p><h2 className="mt-1 font-heading text-xl font-semibold">{mergeProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{mergeProgress.detail}</p></div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${mergeProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">
              {mergePages.slice(0, 5).map((page, index) => (
                <div key={page.key} className="relative aspect-[.72] w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#24252a]"><Image src={page.src} alt="" fill sizes="48px" unoptimized className="object-contain" /><span className="absolute bottom-0 right-0 bg-[#17181b] px-1 text-[8px] font-bold text-white">{index + 1}</span></div>
              ))}
              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Your page order and original quality are being preserved.</div>
            </div>
          </div>
        </div>
      ) : null}

      {splitProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="Split progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative grid size-16 shrink-0 place-items-center">
                <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" />
                  <circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - splitProgress.percent} className="transition-all duration-300" />
                </svg>
                <span className="text-xs font-bold">{splitProgress.percent}%</span>
              </div>
              <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Splitting PDF locally</p><h2 className="mt-1 font-heading text-xl font-semibold">{splitProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{splitProgress.detail}</p></div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${splitProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">
              {(splitPreview?.pages ?? []).slice(0, 5).map((src, index) => (
                <div key={index} className="relative aspect-[.72] w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#24252a]"><Image src={src} alt="" fill sizes="48px" unoptimized className="object-contain" /><span className="absolute bottom-0 right-0 bg-[#17181b] px-1 text-[8px] font-bold text-white">{index + 1}</span></div>
              ))}
              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Your original PDF stays unchanged while new files are prepared.</div>
            </div>
          </div>
        </div>
      ) : null}

      {compressionProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="Compression progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative grid size-16 shrink-0 place-items-center">
                <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" />
                  <circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - compressionProgress.percent} className="transition-all duration-300" />
                </svg>
                <span className="text-xs font-bold">{compressionProgress.percent}%</span>
              </div>
              <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Smart PDF compression</p><h2 className="mt-1 font-heading text-xl font-semibold">{compressionProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{compressionProgress.detail}</p></div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${compressionProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 rounded-xl border border-white/10 bg-[#202126] p-4"><div className="flex items-center gap-2 text-xs font-bold text-white"><ShieldCheck className="size-4" style={{ color: tool.accent }} /> No-size-increase guarantee</div><p className="mt-2 text-xs leading-5 text-[#9b9ca3]">If compression cannot make this PDF smaller safely, the original bytes are kept instead.</p></div>
          </div>
        </div>
      ) : null}

      {jpgProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="JPG conversion progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative grid size-16 shrink-0 place-items-center">
                <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - jpgProgress.percent} className="transition-all duration-300" /></svg>
                <span className="text-xs font-bold">{jpgProgress.percent}%</span>
              </div>
              <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">PDF to JPG</p><h2 className="mt-1 font-heading text-xl font-semibold">{jpgProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{jpgProgress.detail}</p></div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${jpgProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">{jpgSelectedPages.slice(0, 5).map((pageNumber) => { const src = jpgPreview?.pages[pageNumber - 1]; return src ? <div key={pageNumber} className="relative aspect-[.72] w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#24252a]"><Image src={src} alt="" fill sizes="48px" unoptimized className="object-contain" /><span className="absolute bottom-0 right-0 bg-[#17181b] px-1 text-[8px] font-bold text-white">{pageNumber}</span></div> : null; })}<div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Rendering happens locally and keeps the source page number in each JPG filename.</div></div>
          </div>
        </div>
      ) : null}

      {imagePdfProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="JPG to PDF progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4"><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - imagePdfProgress.percent} className="transition-all duration-300" /></svg><span className="text-xs font-bold">{imagePdfProgress.percent}%</span></div><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">JPG to PDF</p><h2 className="mt-1 font-heading text-xl font-semibold">{imagePdfProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{imagePdfProgress.detail}</p></div></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${imagePdfProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">{files.slice(0, 5).map((item, index) => { const preview = imagePreviews[item.id]; return preview ? <div key={item.id} className="relative aspect-[.72] w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#24252a]"><Image src={preview.url} alt="" fill sizes="48px" unoptimized className="object-cover" style={{ transform: `rotate(${preview.rotation}deg)` }} /><span className="absolute bottom-0 right-0 bg-[#17181b] px-1 text-[8px] font-bold text-white">{index + 1}</span></div> : null; })}<div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Images stay on your device while the ordered PDF is built.</div></div>
          </div>
        </div>
      ) : null}

      {rotateProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="PDF rotation progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4"><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - rotateProgress.percent} className="transition-all duration-300" /></svg><span className="text-xs font-bold">{rotateProgress.percent}%</span></div><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Rotating PDF locally</p><h2 className="mt-1 font-heading text-xl font-semibold">{rotateProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{rotateProgress.detail}</p></div></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${rotateProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">{(rotatePreview?.pages ?? []).slice(0, 5).map((src, index) => { const angle = rotatePageAngles[index + 1] ?? 0; const quarterTurn = angle === 90 || angle === 270; return <div key={index} className={`relative w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#24252a] ${quarterTurn ? "aspect-[1.38]" : "aspect-[.72]"}`}><Image src={src} alt="" fill sizes="48px" unoptimized className="object-contain" style={{ transform: `rotate(${angle}deg)` }} /><span className="absolute bottom-0 right-0 bg-[#17181b] px-1 text-[8px] font-bold text-white">{index + 1}</span></div>; })}<div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Only orientation metadata changes. Text and vector content are not rebuilt as images.</div></div>
          </div>
        </div>
      ) : null}

      {deleteProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="Delete PDF pages progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4"><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - deleteProgress.percent} className="transition-all duration-300" /></svg><span className="text-xs font-bold">{deleteProgress.percent}%</span></div><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Cleaning PDF locally</p><h2 className="mt-1 font-heading text-xl font-semibold">{deleteProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{deleteProgress.detail}</p></div></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${deleteProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">{(deletePreview?.pages ?? []).slice(0, 5).map((src, index) => { const removed = deleteSelectedPages.includes(index + 1); return <div key={index} className={`relative aspect-[.72] w-12 shrink-0 overflow-hidden rounded-md border bg-[#24252a] ${removed ? "border-red-400/60 opacity-45" : "border-white/10"}`}><Image src={src} alt="" fill sizes="48px" unoptimized className="object-contain" /><span className={`absolute bottom-0 right-0 px-1 text-[8px] font-bold text-white ${removed ? "bg-red-600" : "bg-[#17181b]"}`}>{removed ? "×" : index + 1}</span></div>; })}<div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Removed pages are omitted; every kept page is copied at its original quality.</div></div>
          </div>
        </div>
      ) : null}

      {extractProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="Extract PDF pages progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4"><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - extractProgress.percent} className="transition-all duration-300" /></svg><span className="text-xs font-bold">{extractProgress.percent}%</span></div><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Extracting pages locally</p><h2 className="mt-1 font-heading text-xl font-semibold">{extractProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{extractProgress.detail}</p></div></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${extractProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex gap-2 overflow-hidden">{extractSelectedPages.slice(0, 5).map((pageNumber, index) => { const src = extractPreview?.pages[pageNumber - 1]; return src ? <div key={`${pageNumber}-${index}`} className="relative aspect-[.72] w-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#24252a]"><Image src={src} alt="" fill sizes="48px" unoptimized className="object-contain" /><span className="absolute bottom-0 right-0 bg-[#17181b] px-1 text-[8px] font-bold text-white">{index + 1}</span></div> : null; })}<div className="flex min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-[#202126] px-3 text-xs leading-5 text-[#9b9ca3]">Only selected pages are copied, in the exact order shown in your output list.</div></div>
          </div>
        </div>
      ) : null}

      {watermarkProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="Watermark progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4"><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - watermarkProgress.percent} className="transition-all duration-300" /></svg><span className="text-xs font-bold">{watermarkProgress.percent}%</span></div><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Watermarking locally</p><h2 className="mt-1 font-heading text-xl font-semibold">{watermarkProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{watermarkProgress.detail}</p></div></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${watermarkProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 rounded-xl border border-white/10 bg-[#202126] p-4"><div className="flex items-center gap-2 text-xs font-bold text-white"><ShieldCheck className="size-4" style={{ color: tool.accent }} /> Original PDF quality stays intact</div><p className="mt-2 text-xs leading-5 text-[#9b9ca3]">The watermark is added as PDF text. Existing text, links, images, and vectors are not flattened.</p></div>
          </div>
        </div>
      ) : null}

      {securityProgress.open ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-live="polite" aria-label="PDF security progress">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#18191d] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)] sm:p-7">
            <div className="flex items-center gap-4"><div className="relative grid size-16 shrink-0 place-items-center"><svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="#303137" strokeWidth="6" /><circle cx="32" cy="32" r="27" fill="none" stroke={tool.accent} strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - securityProgress.percent} className="transition-all duration-300" /></svg><LockKeyhole className="size-5" style={{ color: tool.accent }} /></div><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#8f9097]">Secure browser processing</p><h2 className="mt-1 font-heading text-xl font-semibold">{securityProgress.title}</h2><p className="mt-1 truncate text-sm text-[#aaaab1]">{securityProgress.detail}</p></div></div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#2c2d32]"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${securityProgress.percent}%`, background: tool.accent }} /></div>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#202126] px-4 py-3 text-xs leading-5 text-[#b6b7bd]"><ShieldCheck className="size-4 shrink-0" style={{ color: tool.accent }} /> No file or password is uploaded or stored.</div>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden border-b border-black/10 bg-[#17181b] pt-48 text-white dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_72%_28%,color-mix(in_srgb,var(--tool-accent)_36%,transparent),transparent_27rem),linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:auto,32px_32px,32px_32px]" style={{ "--tool-accent": tool.accent } as React.CSSProperties} />
        <div className="relative mx-auto max-w-7xl px-5 pb-9 sm:px-8 lg:px-10">
          <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white">
            <ArrowLeft className="size-4" /> All PDF tools
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3b3c42] bg-[#232429] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#e4e4e7]">
                <ShieldCheck className="size-3.5" style={{ color: tool.accent }} /> Private by design
              </div>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{heroHeadlines[tool.slug]}<span style={{ color: tool.accent }}>.</span></h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">{tool.description}</p>
            </div>
            <div className="w-full max-w-sm rounded-2xl border p-4 shadow-[0_18px_45px_rgba(0,0,0,.2)] lg:w-[22rem]" style={{ borderColor: `${tool.accent}85`, background: "#0b1f3a" }}><span className="text-[10px] font-bold uppercase tracking-[.16em]" style={{ color: tool.accent }}>{heroDetail.label}</span><strong className="mt-2 block font-heading text-base leading-5 text-white">{heroDetail.title}</strong><p className="mt-1.5 text-xs leading-5 text-white/90">{heroDetail.detail}</p><div className="mt-4 flex flex-wrap gap-1.5">{heroDetail.points.map((point) => <span key={point} className="rounded-full px-2.5 py-1 text-[9px] font-bold text-white" style={{ background: tool.accent }}>{point}</span>)}</div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-[1.75rem] border border-black/10 bg-white p-4 shadow-[0_24px_80px_rgba(30,25,18,.08)] dark:border-white/10 dark:bg-[#151619] sm:p-7">
            {!files.length ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
                className={`group flex min-h-[19rem] w-full cursor-pointer flex-col items-center justify-center rounded-[1.35rem] border-2 border-dashed p-7 text-center transition ${dragging ? "scale-[.995] border-[var(--tool-accent)] bg-black/[.035]" : "border-black/15 bg-[#faf9f6] hover:border-black/35 dark:border-white/15 dark:bg-[#1a1b1f] dark:hover:border-white/35"}`}
                style={{ "--tool-accent": tool.accent } as React.CSSProperties}
              >
                <span className="grid size-16 place-items-center rounded-2xl text-white shadow-xl transition group-hover:-translate-y-1" style={{ background: tool.accent, boxShadow: `0 18px 45px ${tool.accent}35` }}><UploadCloud className="size-7" /></span>
                <strong className="mt-5 font-heading text-2xl tracking-tight">Drop {tool.accept.includes("pdf") ? "PDF" : "images"} here</strong>
                <span className="mt-3 max-w-md text-sm leading-6 text-black/50 dark:text-white/48">or click to choose from your device. Your files never leave this browser tab.</span>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#181817] px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-black">Choose {tool.accept.includes("pdf") ? "PDF" : "images"}<ArrowRight className="size-4" /></span>
              </button>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-5 dark:border-white/10">
                  <div><span className="text-xs font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Ready to process</span><h2 className="mt-1 font-heading text-2xl font-semibold">{files.length} {files.length === 1 ? "file" : "files"}</h2></div>
                  {tool.multiple ? <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white dark:border-white/15 dark:hover:bg-white dark:hover:text-black"><Plus className="size-4" /> Add more</button> : ["split-pdf", "compress-pdf", "pdf-to-jpg", "rotate-pdf", "delete-pdf-pages", "extract-pdf-pages", "add-pdf-watermark"].includes(tool.slug) ? <button type="button" onClick={() => { if (inputRef.current) inputRef.current.value = ""; inputRef.current?.click(); }} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white dark:border-white/15 dark:hover:bg-white dark:hover:text-black"><FileText className="size-4" /> Change PDF</button> : null}
                </div>

                {!["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-jpg", "jpg-to-pdf", "rotate-pdf", "delete-pdf-pages", "extract-pdf-pages", "add-pdf-watermark"].includes(tool.slug) ? <div className="mt-5 grid gap-3">
                  {files.map((item, index) => (
                    <div
                      key={item.id}
                      draggable={tool.slug === "merge-pdf"}
                      onDragStart={(event) => { setDraggedFileId(item.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", item.id); }}
                      onDragEnd={() => setDraggedFileId(null)}
                      onDragOver={(event) => { if (tool.slug === "merge-pdf") { event.preventDefault(); event.dataTransfer.dropEffect = "move"; } }}
                      onDrop={(event) => { event.preventDefault(); dropFile(item.id); }}
                      className={`flex items-center gap-3 rounded-2xl border bg-[#faf9f6] p-3 transition dark:bg-[#1a1b1f] ${draggedFileId === item.id ? "scale-[.985] border-dashed border-black/35 opacity-55 dark:border-white/35" : "border-black/10 dark:border-white/10"}`}
                    >
                      {tool.multiple ? <span className="cursor-grab rounded-lg p-1 text-black/30 active:cursor-grabbing dark:text-white/30" title={tool.slug === "merge-pdf" ? "Drag to reorder" : undefined}><GripVertical className="size-4 shrink-0" /></span> : null}
                      {tool.slug === "merge-pdf" && previews[item.id]?.pages[0] ? (
                        <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10">
                          <Image src={previews[item.id].pages[0]} alt={`First page of ${item.file.name}`} fill sizes="44px" unoptimized className="object-contain" />
                        </span>
                      ) : <span className="grid size-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: tool.accent }}>{tool.accept.includes("pdf") ? <FileText className="size-5" /> : <FileImage className="size-5" />}</span>}
                      <div className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.file.name}</strong><span className="mt-1 block text-xs text-black/42 dark:text-white/42">{formatBytes(item.file.size)} · {index + 1} of {files.length}{tool.slug === "merge-pdf" ? previews[item.id]?.status === "ready" ? ` · ${previews[item.id].pages.length} pages` : previews[item.id]?.status === "error" ? " · Preview unavailable" : " · Rendering preview..." : ""}</span></div>
                      {tool.multiple ? <div className="flex gap-1"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid size-8 cursor-pointer place-items-center rounded-lg hover:bg-black/5 disabled:opacity-20 dark:hover:bg-white/10"><ArrowDown className="size-4 rotate-180" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === files.length - 1} className="grid size-8 cursor-pointer place-items-center rounded-lg hover:bg-black/5 disabled:opacity-20 dark:hover:bg-white/10"><ArrowDown className="size-4" /></button></div> : null}
                      <button type="button" onClick={() => removeFile(item.id)} className="grid size-9 cursor-pointer place-items-center rounded-xl text-black/40 transition hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-500/10"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                </div> : null}

                {tool.slug === "merge-pdf" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div><div className="flex items-center gap-2"><Files className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Arrange pages</h3></div><p className="mt-1 text-xs font-medium text-black/50 dark:text-white/50">Drag any preview to set the exact order of your final PDF.</p></div>
                      <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold dark:border-white/10 dark:bg-[#202126]">{files.length} {files.length === 1 ? "file" : "files"} · {mergePages.length} {mergePages.length === 1 ? "page" : "pages"}</span>
                    </div>
                    <div className="max-h-[44rem] overflow-y-auto p-4 sm:p-5">
                      {mergePages.length ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                          {mergePages.map((page, outputIndex) => {
                            const sourceColor = sourceColors[page.fileIndex % sourceColors.length];
                            return (
                            <div
                              key={page.key}
                              draggable
                              onDragStart={(event) => { setDraggedPageKey(page.key); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", page.key); }}
                              onDragEnd={() => setDraggedPageKey(null)}
                              onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
                              onDrop={(event) => { event.preventDefault(); dropPage(page.key); }}
                              className={`group relative cursor-grab rounded-xl border bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing dark:bg-[#1c1d21] ${draggedPageKey === page.key ? "scale-[.97] border-dashed border-black/35 opacity-45 dark:border-white/35" : "border-black/10 dark:border-white/10"}`}
                            >
                              <div className="relative aspect-[.72] overflow-hidden rounded-lg bg-[#eceae5] dark:bg-[#25262b]">
                                <Image src={page.src} alt={`Output page ${outputIndex + 1} from ${page.fileName}`} fill sizes="(max-width: 640px) 45vw, 150px" unoptimized className="object-contain" />
                                <span className="absolute left-2 top-2 z-10 inline-flex min-w-9 items-center justify-center rounded-md bg-[#17181b] px-2 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-lg ring-2 ring-white">{String(outputIndex + 1).padStart(2, "0")}</span>
                                <span className="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-lg bg-white text-[#17181b] shadow-md" title="Drag to reorder"><GripVertical className="size-4" /></span>
                              </div>
                              <div className="mt-2 flex items-start gap-2">
                                <span className="mt-1 size-2.5 shrink-0 rounded-full" style={{ background: sourceColor }} />
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 break-all text-[11px] font-bold leading-4" title={page.fileName}>{page.fileName}</p>
                                  <p className="mt-1 text-[10px] font-semibold" style={{ color: sourceColor }}>File {page.fileIndex + 1} · Page {page.sourcePage} of {page.sourceTotal}</p>
                                </div>
                                <div className="grid shrink-0 gap-0.5">
                                  <button type="button" onClick={() => moveMergePage(page.key, -1)} disabled={outputIndex === 0} className="grid size-7 cursor-pointer place-items-center rounded-lg text-black/45 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-20 dark:text-white/45 dark:hover:bg-white/10" aria-label={`Move output page ${outputIndex + 1} back`} title="Move left"><ArrowLeft className="size-3.5" /></button>
                                  <button type="button" onClick={() => moveMergePage(page.key, 1)} disabled={outputIndex === mergePages.length - 1} className="grid size-7 cursor-pointer place-items-center rounded-lg text-black/45 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-20 dark:text-white/45 dark:hover:bg-white/10" aria-label={`Move output page ${outputIndex + 1} forward`} title="Move right"><ArrowRight className="size-3.5" /></button>
                                  <button type="button" onClick={() => removeMergePage(page.key)} className="grid size-7 cursor-pointer place-items-center rounded-lg text-black/35 transition hover:bg-red-50 hover:text-red-600 dark:text-white/35 dark:hover:bg-red-500/10" aria-label={`Remove page ${page.sourcePage} from ${page.fileName}`} title="Remove this page"><Trash2 className="size-3.5" /></button>
                                </div>
                              </div>
                            </div>
                          );})}
                        </div>
                      ) : (
                        <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-black/15 text-center dark:border-white/15">
                          <div><RotateCcw className="mx-auto size-5 animate-spin text-black/35 dark:text-white/35" /><p className="mt-2 text-xs text-black/45 dark:text-white/45">Rendering page previews locally...</p></div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {tool.slug === "split-pdf" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2"><Scissors className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Choose where the PDF should split</h3></div>
                        <p className="mt-1 max-w-xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">The colored cards below are the files you will receive. Review every page before splitting.</p>
                        <p className="mt-2 truncate text-xs font-bold" title={files[0].file.name}>{files[0].file.name} <span className="font-medium text-black/40 dark:text-white/40">· {formatBytes(files[0].file.size)}</span></p>
                      </div>
                      <button type="button" onClick={() => removeFile(files[0].id)} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl text-black/40 transition hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-500/10" aria-label="Remove PDF" title="Remove PDF"><Trash2 className="size-4" /></button>
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="grid gap-2 rounded-2xl bg-black/[.045] p-1.5 dark:bg-white/[.06] sm:grid-cols-2">
                        <button type="button" onClick={() => { setSplitMode("every-page"); setResult(null); }} className={`cursor-pointer rounded-xl px-4 py-3 text-left transition ${splitMode === "every-page" ? "bg-white shadow-sm ring-1 ring-black/10 dark:bg-[#24252a] dark:ring-white/10" : "hover:bg-white/60 dark:hover:bg-white/5"}`}>
                          <strong className="block text-sm">Every page separately</strong><span className="mt-1 block text-xs text-black/45 dark:text-white/45">Page 1, page 2, page 3... each becomes its own PDF.</span>
                        </button>
                        <button type="button" onClick={() => { setSplitMode("sections"); setResult(null); }} className={`cursor-pointer rounded-xl px-4 py-3 text-left transition ${splitMode === "sections" ? "bg-white shadow-sm ring-1 ring-black/10 dark:bg-[#24252a] dark:ring-white/10" : "hover:bg-white/60 dark:hover:bg-white/5"}`}>
                          <strong className="block text-sm">Create sections</strong><span className="mt-1 block text-xs text-black/45 dark:text-white/45">Choose “Split after” on a page to start the next PDF.</span>
                        </button>
                      </div>

                      {splitPreview?.pages.length ? (
                        <div className="mt-5 max-h-[42rem] overflow-y-auto pr-1">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {splitPreview.pages.map((src, pageIndex) => {
                              const groupIndex = Math.max(0, splitGroups.findIndex((group) => group.includes(pageIndex)));
                              const groupColor = sourceColors[groupIndex % sourceColors.length];
                              const pageNumber = pageIndex + 1;
                              const hasCut = splitCuts.includes(pageNumber);
                              return (
                                <div key={pageNumber} className="overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition dark:bg-[#1c1d21]" style={{ borderColor: `${groupColor}70` }}>
                                  <div className="relative aspect-[.72] overflow-hidden rounded-lg bg-[#eceae5] dark:bg-[#25262b]">
                                    <Image src={src} alt={`Page ${pageNumber} preview`} fill sizes="(max-width: 640px) 45vw, 170px" unoptimized className="object-contain" />
                                    <span className="absolute left-2 top-2 z-10 rounded-md bg-[#17181b] px-2 py-1 text-[10px] font-extrabold text-white shadow-lg ring-2 ring-white">PAGE {String(pageNumber).padStart(2, "0")}</span>
                                    <span className="absolute bottom-2 left-2 z-10 rounded-md px-2 py-1 text-[10px] font-extrabold text-white shadow-md" style={{ background: groupColor }}>PART {String(groupIndex + 1).padStart(2, "0")}</span>
                                  </div>
                                  {splitMode === "sections" && pageNumber < (splitPreview.totalPages ?? 0) ? (
                                    <button type="button" onClick={() => toggleSplitAfter(pageNumber)} className={`mt-2 flex min-h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 text-[10px] font-bold transition ${hasCut ? "border-transparent text-white" : "border-black/10 text-black/55 hover:border-black/25 dark:border-white/10 dark:text-white/55 dark:hover:border-white/25"}`} style={hasCut ? { background: tool.accent } : undefined}><Scissors className="size-3" />{hasCut ? "Split added" : `Split after page ${pageNumber}`}</button>
                                  ) : <div className="mt-2 flex h-9 items-center justify-center text-[10px] font-semibold text-black/38 dark:text-white/38">{splitMode === "every-page" ? `Creates part-${String(groupIndex + 1).padStart(2, "0")}.pdf` : "Last page"}</div>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5 grid min-h-40 place-items-center rounded-xl border border-dashed border-black/15 text-center dark:border-white/15">
                          <div><RotateCcw className="mx-auto size-5 animate-spin text-black/35 dark:text-white/35" /><p className="mt-2 text-xs text-black/45 dark:text-white/45">Rendering every page for review...</p></div>
                        </div>
                      )}

                      {splitGroups.length && splitPreview ? (
                        <div className="mt-6 border-t border-black/10 pt-5 dark:border-white/10">
                          <div className="flex flex-wrap items-end justify-between gap-2"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Download plan</span><h4 className="mt-1 font-heading text-lg font-semibold">{splitGroups.length} PDF {splitGroups.length === 1 ? "file" : "files"} inside one ZIP</h4></div><span className="text-xs font-semibold text-black/45 dark:text-white/45">Nothing is created until you click Split PDF</span></div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {splitGroups.map((group, groupIndex) => {
                              const groupColor = sourceColors[groupIndex % sourceColors.length];
                              const firstPage = group[0] + 1;
                              const lastPage = group[group.length - 1] + 1;
                              return (
                                <div key={`${firstPage}-${lastPage}`} className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#1c1d21]">
                                  <div className="flex shrink-0 -space-x-5">{group.slice(0, 3).map((page) => <span key={page} className="relative h-14 w-10 overflow-hidden rounded-md border-2 border-white bg-[#eceae5] shadow-sm dark:border-[#1c1d21]"><Image src={splitPreview.pages[page]} alt="" fill sizes="40px" unoptimized className="object-contain" /></span>)}</div>
                                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: groupColor }} />
                                  <div className="min-w-0 flex-1"><strong className="block text-xs">part-{String(groupIndex + 1).padStart(2, "0")}.pdf</strong><span className="mt-1 block text-[10px] font-semibold" style={{ color: groupColor }}>Page{group.length > 1 ? "s" : ""} {firstPage}{lastPage > firstPage ? `-${lastPage}` : ""} · {group.length} {group.length === 1 ? "page" : "pages"}</span></div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {tool.slug === "compress-pdf" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2"><Minimize2 className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Smart compression workspace</h3></div>
                        <p className="mt-1 max-w-xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">We compare lossless optimisation, image compression, and your original PDF—then keep the smallest safe result.</p>
                        <p className="mt-2 truncate text-xs font-bold" title={files[0].file.name}>{files[0].file.name} <span className="font-medium text-black/40 dark:text-white/40">· {formatBytes(files[0].file.size)} · {compressionPreview?.totalPages ?? "…"} pages</span></p>
                      </div>
                      <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"><ShieldCheck className="size-3.5" /> Never larger</span><button type="button" onClick={() => removeFile(files[0].id)} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl text-black/40 transition hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-500/10" aria-label="Remove PDF" title="Remove PDF"><Trash2 className="size-4" /></button></div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Choose your priority</span>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {(Object.keys(compressionProfiles) as CompressionPreset[]).map((preset) => {
                          const profile = compressionProfiles[preset];
                          const active = compressionPreset === preset;
                          return <button key={preset} type="button" onClick={() => { setCompressionPreset(preset); setCompressionReport(null); setResult(null); }} className={`cursor-pointer rounded-xl border p-4 text-left transition ${active ? "border-transparent text-white shadow-lg" : "border-black/10 bg-white hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#1c1d21]"}`} style={active ? { background: tool.accent, boxShadow: `0 12px 30px ${tool.accent}30` } : undefined}><strong className="flex items-center gap-2 text-sm">{preset === "balanced" ? <Sparkles className="size-4" /> : <Minimize2 className="size-4" />}{profile.label}</strong><span className={`mt-2 block text-[11px] leading-4 ${active ? "text-white/75" : "text-black/45 dark:text-white/45"}`}>{profile.copy}</span></button>;
                        })}
                      </div>

                      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_14rem]">
                        <div>
                          <div className="flex items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Page preview</span><h4 className="mt-1 font-heading text-lg font-semibold">Check readability before compressing</h4></div><span className="text-xs font-semibold text-black/40 dark:text-white/40">Original pages</span></div>
                          {compressionPreview?.pages.length ? <div className="mt-3 max-h-[28rem] overflow-y-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#18191d]"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{compressionPreview.pages.map((src, index) => <div key={index} className="overflow-hidden rounded-lg border border-black/10 bg-[#f3f1ec] p-1.5 dark:border-white/10 dark:bg-[#24252a]"><div className="relative aspect-[.72] overflow-hidden rounded-md bg-white"><Image src={src} alt={`Page ${index + 1} preview`} fill sizes="160px" unoptimized className="object-contain" /><span className="absolute left-2 top-2 rounded-md bg-[#17181b] px-2 py-1 text-[9px] font-extrabold text-white shadow-md">PAGE {String(index + 1).padStart(2, "0")}</span></div></div>)}</div></div> : <div className="mt-3 grid min-h-44 place-items-center rounded-xl border border-dashed border-black/15 bg-white text-center dark:border-white/15 dark:bg-[#18191d]"><div><RotateCcw className="mx-auto size-5 animate-spin text-black/35 dark:text-white/35" /><p className="mt-2 text-xs text-black/45 dark:text-white/45">Preparing page previews...</p></div></div>}
                        </div>
                        <div className="grid content-start gap-2">
                          <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><strong className="text-xs">1. Lossless first</strong><p className="mt-1.5 text-[11px] leading-4 text-black/45 dark:text-white/45">Tries a smaller structure while keeping selectable text and vectors.</p></div>
                          <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><strong className="text-xs">2. Visual candidate</strong><p className="mt-1.5 text-[11px] leading-4 text-black/45 dark:text-white/45">Tests your chosen quality only when it may produce a meaningful saving.</p></div>
                          <div className="rounded-xl border border-emerald-500/25 bg-emerald-50 p-4 dark:bg-emerald-400/10"><strong className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300"><ShieldCheck className="size-3.5" /> 3. Smallest wins</strong><p className="mt-1.5 text-[11px] leading-4 text-emerald-800/65 dark:text-emerald-200/60">If neither option helps, your original PDF is returned unchanged.</p></div>
                        </div>
                      </div>

                      {compressionReport ? (
                        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21] sm:p-5">
                          <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Verified result</span><h4 className="mt-1 font-heading text-lg font-semibold">{compressionReport.savedPercent > 0 ? `${compressionReport.savedPercent}% smaller` : "Already optimised - original kept"}</h4></div><span className="rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white" style={{ background: tool.accent }}>{compressionReport.method === "raster" ? "Image compression" : compressionReport.method === "lossless" ? "Lossless" : "No inflation"}</span></div>
                          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div className="rounded-xl bg-[#f4f2ed] p-4 dark:bg-[#24252a]"><span className="text-[10px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Before</span><strong className="mt-1 block text-xl">{formatBytes(compressionReport.originalSize)}</strong></div><ArrowRight className="size-5 text-black/30 dark:text-white/30" /><div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-400/10"><span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">After</span><strong className="mt-1 block text-xl text-emerald-800 dark:text-emerald-200">{formatBytes(compressionReport.outputSize)}</strong></div></div>
                          <p className="mt-3 text-xs text-black/48 dark:text-white/48">{compressionReport.selectableText ? "Selectable text, links, vectors, and supported forms are preserved." : "This smaller version rebuilds visible pages as images; selectable text and form fields are flattened."}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {tool.slug === "pdf-to-jpg" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div className="min-w-0"><div className="flex items-center gap-2"><FileImage className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Visual JPG studio</h3></div><p className="mt-1 max-w-xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">Select pages, tune resolution and quality, then inspect a real generated JPG before exporting.</p><p className="mt-2 truncate text-xs font-bold" title={files[0].file.name}>{files[0].file.name} <span className="font-medium text-black/40 dark:text-white/40">· {formatBytes(files[0].file.size)} · {jpgPreview?.totalPages ?? "…"} pages</span></p></div>
                      <div className="flex items-center gap-2"><span className="rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-orange-800 dark:bg-orange-400/10 dark:text-orange-300">{jpgSelectedPages.length} selected</span><button type="button" onClick={() => removeFile(files[0].id)} className="grid size-9 cursor-pointer place-items-center rounded-xl text-black/40 transition hover:bg-red-50 hover:text-red-600 dark:text-white/40 dark:hover:bg-red-500/10" aria-label="Remove PDF"><Trash2 className="size-4" /></button></div>
                    </div>

                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,.78fr)]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">PDF pages</span><h4 className="mt-1 font-heading text-lg font-semibold">Choose what goes into the ZIP</h4></div><div className="flex gap-2"><button type="button" onClick={() => setJpgSelectedPages(Array.from({ length: jpgPreview?.totalPages ?? 0 }, (_, index) => index + 1))} className="cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-bold hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21]">Select all</button><button type="button" onClick={() => setJpgSelectedPages([])} className="cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-bold hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21]">Clear</button></div></div>
                        {jpgPreview?.pages.length ? <div className="mt-3 max-h-[38rem] overflow-y-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#18191d]"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{jpgPreview.pages.map((src, index) => { const pageNumber = index + 1; const selected = jpgSelectedPages.includes(pageNumber); const focused = jpgFocusPage === pageNumber; return <div key={pageNumber} className={`group rounded-xl border p-1.5 transition ${focused ? "ring-2" : ""}`} style={{ borderColor: selected ? tool.accent : "rgba(0,0,0,.1)", ...(focused ? { boxShadow: `0 0 0 2px ${tool.accent}` } : {}) }}><button type="button" onClick={() => setJpgFocusPage(pageNumber)} className="relative block aspect-[.72] w-full cursor-pointer overflow-hidden rounded-lg bg-[#eceae5] dark:bg-[#25262b]"><Image src={src} alt={`PDF page ${pageNumber}`} fill sizes="160px" unoptimized className="object-contain" /><span className="absolute left-2 top-2 rounded-md bg-[#17181b] px-2 py-1 text-[9px] font-extrabold text-white">PAGE {String(pageNumber).padStart(2, "0")}</span>{focused ? <span className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-[9px] font-bold text-white" style={{ background: tool.accent }}>LIVE PREVIEW</span> : null}</button><button type="button" onClick={() => toggleJpgPage(pageNumber)} className={`mt-1.5 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold transition ${selected ? "text-white" : "bg-[#f1efe9] text-black/55 dark:bg-[#292a2f] dark:text-white/55"}`} style={selected ? { background: tool.accent } : undefined}>{selected ? <Check className="size-3" /> : <Plus className="size-3" />}{selected ? "Included" : "Add page"}</button></div>; })}</div></div> : <div className="mt-3 grid min-h-48 place-items-center rounded-xl border border-dashed border-black/15 bg-white text-center dark:border-white/15 dark:bg-[#18191d]"><div><RotateCcw className="mx-auto size-5 animate-spin text-black/35 dark:text-white/35" /><p className="mt-2 text-xs text-black/45 dark:text-white/45">Rendering PDF pages...</p></div></div>}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Output controls</span>
                        <div className="mt-2 grid grid-cols-3 gap-2">{(Object.keys(jpgResolutionProfiles) as JpgResolution[]).map((resolution) => { const profile = jpgResolutionProfiles[resolution]; const active = jpgResolution === resolution; return <button key={resolution} type="button" onClick={() => { setJpgResolution(resolution); setResult(null); }} className={`cursor-pointer rounded-xl border px-2 py-3 text-center transition ${active ? "border-transparent text-white shadow-md" : "border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]"}`} style={active ? { background: tool.accent } : undefined}><strong className="block text-xs">{profile.label}</strong><span className={`mt-1 block text-[9px] leading-3 ${active ? "text-white/75" : "text-black/40 dark:text-white/40"}`}>{profile.copy}</span></button>; })}</div>
                        <label className="mt-3 grid gap-2 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.14em] text-black/45 dark:text-white/45"><span>JPG quality</span><span className="text-sm" style={{ color: tool.accent }}>{quality}%</span></span><input type="range" min="38" max="94" value={quality} onChange={(event) => { setQuality(Number(event.target.value)); setResult(null); }} style={{ accentColor: tool.accent }} /><span className="text-[10px] leading-4 text-black/40 dark:text-white/40">Preview regenerates automatically when this changes.</span></label>

                        <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]">
                          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10"><div><span className="text-[9px] font-bold uppercase tracking-[.14em] text-black/40 dark:text-white/40">Actual JPG preview</span><strong className="mt-0.5 block text-xs">page-{String(jpgFocusPage).padStart(3, "0")}.jpg</strong></div>{jpgLivePreview.status === "ready" ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">READY</span> : null}</div>
                          <div className="relative aspect-[.72] bg-[#eceae5] dark:bg-[#25262b]">{jpgLivePreview.status === "ready" && jpgLivePreview.url ? <Image src={jpgLivePreview.url} alt={`Generated JPG preview for page ${jpgFocusPage}`} fill sizes="320px" unoptimized className="object-contain" /> : <div className="absolute inset-0 grid place-items-center text-center"><div><RotateCcw className="mx-auto size-5 animate-spin text-black/35 dark:text-white/35" /><p className="mt-2 text-[10px] text-black/45 dark:text-white/45">Generating real JPG preview...</p></div></div>}</div>
                          <div className="grid grid-cols-2 gap-px bg-black/10 dark:bg-white/10">{[["Dimensions", jpgLivePreview.width && jpgLivePreview.height ? `${jpgLivePreview.width} × ${jpgLivePreview.height}` : "—"], ["Est. page size", jpgLivePreview.size ? formatBytes(jpgLivePreview.size) : "—"]].map(([label, value]) => <div key={label} className="bg-white p-3 dark:bg-[#1c1d21]"><span className="block text-[9px] font-bold uppercase tracking-wide text-black/38 dark:text-white/38">{label}</span><strong className="mt-1 block text-xs">{value}</strong></div>)}</div>
                        </div>
                        <div className="mt-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><div className="flex items-center justify-between text-xs font-bold"><span>ZIP manifest</span><span>{jpgSelectedPages.length} JPGs</span></div><p className="mt-2 text-[10px] leading-4 text-black/45 dark:text-white/45">Files keep their original page numbers, for example {jpgSelectedPages.slice(0, 3).map((page) => `page-${String(page).padStart(3, "0")}.jpg`).join(", ") || "select pages above"}{jpgSelectedPages.length > 3 ? "…" : ""}</p></div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {tool.slug === "jpg-to-pdf" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div><div className="flex items-center gap-2"><FileStack className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Build your PDF pages</h3></div><p className="mt-1 max-w-xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">Drag the actual image cards into order. Rotate, remove, and inspect how each one will sit on the final PDF page.</p></div>
                      <span className="rounded-full bg-blue-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-800 dark:bg-blue-400/10 dark:text-blue-300">{files.length} PDF {files.length === 1 ? "page" : "pages"}</span>
                    </div>

                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
                      <div className="min-w-0">
                        <div className="flex items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Page order</span><h4 className="mt-1 font-heading text-lg font-semibold">Preview, arrange, and fix every image</h4></div><span className="text-xs font-semibold text-black/40 dark:text-white/40">Drag to reorder</span></div>
                        <div className="mt-3 max-h-[42rem] overflow-y-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#18191d]">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{files.map((item, index) => { const preview = imagePreviews[item.id]; const focused = focusedImageItem?.id === item.id; return <div key={item.id} draggable onDragStart={(event) => { setDraggedFileId(item.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", item.id); }} onDragEnd={() => setDraggedFileId(null)} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); dropFile(item.id); }} className={`group cursor-grab rounded-xl border bg-[#faf9f6] p-2 transition active:cursor-grabbing dark:bg-[#24252a] ${draggedFileId === item.id ? "scale-[.97] border-dashed opacity-45" : focused ? "ring-2" : "border-black/10 dark:border-white/10"}`} style={focused ? { boxShadow: `0 0 0 2px ${tool.accent}`, borderColor: tool.accent } : undefined}>
                            <button type="button" onClick={() => setImageFocusId(item.id)} className="relative block aspect-[.78] w-full cursor-pointer overflow-hidden rounded-lg bg-[#e8e6e0] dark:bg-[#303137]">{preview ? <Image src={preview.url} alt={item.file.name} fill sizes="180px" unoptimized className="object-contain transition" style={{ transform: `rotate(${preview.rotation}deg)` }} /> : <RotateCcw className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin text-black/30" />}<span className="absolute left-2 top-2 rounded-md bg-[#17181b] px-2 py-1 text-[9px] font-extrabold text-white shadow-md">PAGE {String(index + 1).padStart(2, "0")}</span><span className="absolute right-2 top-2 grid size-7 place-items-center rounded-md bg-white text-[#17181b] shadow-md"><GripVertical className="size-3.5" /></span>{focused ? <span className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-[9px] font-bold text-white" style={{ background: tool.accent }}>LIVE PAGE</span> : null}</button>
                            <p className="mt-2 line-clamp-2 break-all text-[10px] font-bold leading-4" title={item.file.name}>{item.file.name}</p><p className="mt-0.5 text-[9px] text-black/40 dark:text-white/40">{preview ? `${preview.width} × ${preview.height}px` : "Reading image…"} · {formatBytes(item.file.size)}</p>
                            <div className="mt-2 grid grid-cols-2 gap-1"><button type="button" onClick={() => rotateImage(item.id)} className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg bg-white text-[9px] font-bold hover:bg-blue-50 hover:text-blue-700 dark:bg-[#1c1d21] dark:hover:bg-blue-500/10"><RotateCw className="size-3" /> Rotate</button><button type="button" onClick={() => removeFile(item.id)} className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-lg bg-white text-[9px] font-bold hover:bg-red-50 hover:text-red-600 dark:bg-[#1c1d21] dark:hover:bg-red-500/10"><Trash2 className="size-3" /> Remove</button></div>
                          </div>; })}</div>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Live PDF page</span>
                        <div className="mt-2 rounded-xl border border-black/10 bg-[#dedbd4] p-5 dark:border-white/10 dark:bg-[#24252a]">
                          <div className="relative mx-auto max-h-[24rem] w-full overflow-hidden bg-white shadow-[0_14px_35px_rgba(0,0,0,.16)]" style={{ aspectRatio: imagePageSize === "auto" ? `${focusedWidth} / ${focusedHeight}` : imageOrientation === "landscape" || (imageOrientation === "auto" && focusedWidth > focusedHeight) ? "1.414 / 1" : "1 / 1.414", padding: imageMargin === 0 ? 0 : imageMargin === 24 ? "5%" : "9%" }}>{focusedImagePreview ? <div className="relative size-full overflow-hidden"><Image src={focusedImagePreview.url} alt="Live PDF page layout" fill sizes="300px" unoptimized className={imageFit === "cover" ? "object-cover" : "object-contain"} style={{ transform: `rotate(${focusedImagePreview.rotation}deg)` }} /></div> : <div className="grid size-full place-items-center text-xs text-black/35">Preparing preview…</div>}<span className="absolute bottom-2 right-2 rounded bg-[#17181b] px-2 py-1 text-[8px] font-bold text-white">PAGE {String(Math.max(1, files.findIndex((item) => item.id === focusedImageItem?.id) + 1)).padStart(2, "0")}</span></div>
                        </div>
                        <p className="mt-2 truncate text-center text-[10px] font-semibold text-black/45 dark:text-white/45" title={focusedImageItem?.file.name}>{focusedImageItem?.file.name}</p>

                        <div className="mt-4 grid gap-3">
                          <div><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Page size</span><div className="mt-1.5 grid grid-cols-3 gap-1">{(["auto", "a4", "letter"] as ImagePageSize[]).map((value) => <button key={value} type="button" onClick={() => { setImagePageSize(value); setResult(null); }} className={`h-9 cursor-pointer rounded-lg border text-[10px] font-bold uppercase transition ${imagePageSize === value ? "border-transparent text-white" : "border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]"}`} style={imagePageSize === value ? { background: tool.accent } : undefined}>{value}</button>)}</div></div>
                          <div><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Orientation</span><div className="mt-1.5 grid grid-cols-3 gap-1">{(["auto", "portrait", "landscape"] as ImageOrientation[]).map((value) => <button key={value} type="button" disabled={imagePageSize === "auto" && value !== "auto"} onClick={() => { setImageOrientation(value); setResult(null); }} className={`h-9 cursor-pointer rounded-lg border text-[9px] font-bold capitalize transition disabled:cursor-not-allowed disabled:opacity-30 ${imageOrientation === value ? "border-transparent text-white" : "border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]"}`} style={imageOrientation === value ? { background: tool.accent } : undefined}>{value}</button>)}</div></div>
                          <div className="grid grid-cols-2 gap-2"><div><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Image fit</span><div className="mt-1.5 grid grid-cols-2 gap-1">{(["contain", "cover"] as ImageFit[]).map((value) => <button key={value} type="button" onClick={() => { setImageFit(value); setResult(null); }} className={`h-9 cursor-pointer rounded-lg border text-[9px] font-bold capitalize ${imageFit === value ? "border-transparent text-white" : "border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]"}`} style={imageFit === value ? { background: tool.accent } : undefined}>{value === "contain" ? "Fit" : "Fill"}</button>)}</div></div><div><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Margin</span><div className="mt-1.5 grid grid-cols-3 gap-1">{([0, 24, 48] as const).map((value) => <button key={value} type="button" onClick={() => { setImageMargin(value); setResult(null); }} className={`h-9 cursor-pointer rounded-lg border text-[9px] font-bold ${imageMargin === value ? "border-transparent text-white" : "border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]"}`} style={imageMargin === value ? { background: tool.accent } : undefined}>{value === 0 ? "None" : value === 24 ? "S" : "L"}</button>)}</div></div></div>
                        </div>
                        <div className={`mt-3 rounded-xl border p-3 text-[10px] leading-4 ${imageFit === "cover" ? "border-amber-500/25 bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200" : "border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"}`}>{imageFit === "cover" ? "Fill may crop the image edges to cover the whole page." : "Fit keeps the complete image visible without cropping."}</div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {tool.slug === "rotate-pdf" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div><div className="flex items-center gap-2"><RotateCw className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Correct the pages you can actually see</h3></div><p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">Click page previews to select them, then rotate the whole selection. You can still fix any single page with the controls on its card.</p></div>
                      <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide dark:border-white/10 dark:bg-[#202126]">{rotatePreview?.totalPages ?? 0} pages · {rotateChangedPages} corrected</span>
                    </div>

                    <div className="border-b border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[.025] sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Bulk rotation</span><p className="mt-1 text-xs font-semibold">{rotateSelectedPages.length ? `${rotateSelectedPages.length} ${rotateSelectedPages.length === 1 ? "page" : "pages"} selected` : "Choose at least one page below"}</p></div><div className="flex gap-2"><button type="button" onClick={() => setRotateSelectedPages(Array.from({ length: rotatePreview?.totalPages ?? 0 }, (_, index) => index + 1))} className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-bold hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21]">Select all</button><button type="button" onClick={() => setRotateSelectedPages([])} className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-bold hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21]">Clear</button></div></div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <button type="button" disabled={!rotateSelectedPages.length} onClick={() => turnPdfPages(rotateSelectedPages, 270)} className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#18191d] text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-30"><RotateCcw className="size-4" /> Left 90°</button>
                        <button type="button" disabled={!rotateSelectedPages.length} onClick={() => turnPdfPages(rotateSelectedPages, 90)} className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-30" style={{ background: tool.accent }}><RotateCw className="size-4" /> Right 90°</button>
                        <button type="button" disabled={!rotateSelectedPages.length} onClick={() => turnPdfPages(rotateSelectedPages, 180)} className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 bg-white text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-[#1c1d21]"><span className="text-sm">↻</span> Turn 180°</button>
                        <button type="button" disabled={!rotateSelectedPages.length} onClick={() => { setRotatePageAngles((current) => { const next = { ...current }; rotateSelectedPages.forEach((page) => { next[page] = 0; }); return next; }); setResult(null); }} className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 bg-white text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-[#1c1d21]"><X className="size-3.5" /> Reset selected</button>
                      </div>
                    </div>

                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
                      <div className="min-w-0"><div className="flex items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Page previews</span><h4 className="mt-1 font-heading text-lg font-semibold">Select and correct page by page</h4></div><span className="text-[10px] font-semibold text-black/40 dark:text-white/40">Changes shown live</span></div>
                        <div className="mt-3 max-h-[46rem] overflow-y-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#18191d]">
                          {rotatePreview?.pages.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{rotatePreview.pages.map((src, index) => { const pageNumber = index + 1; const angle = rotatePageAngles[pageNumber] ?? 0; const selected = rotateSelectedPages.includes(pageNumber); const focused = rotateFocusPage === pageNumber; const quarterTurn = angle === 90 || angle === 270; return <article key={pageNumber} className={`rounded-xl border bg-[#faf9f6] p-2 transition dark:bg-[#24252a] ${selected ? "ring-2" : "border-black/10 dark:border-white/10"}`} style={selected ? { borderColor: tool.accent, boxShadow: `0 0 0 1px ${tool.accent}` } : undefined}>
                            <button type="button" onClick={() => toggleRotatePage(pageNumber)} className={`relative block w-full cursor-pointer overflow-hidden rounded-lg bg-[#e8e6e0] transition-all dark:bg-[#303137] ${quarterTurn ? "aspect-[1.38]" : "aspect-[.72]"}`}><Image src={src} alt={`Page ${pageNumber} rotated ${angle} degrees`} fill sizes="180px" unoptimized className="object-contain transition-transform duration-300" style={{ transform: `rotate(${angle}deg)` }} /><span className="absolute left-2 top-2 rounded-md bg-[#17181b] px-2 py-1 text-[9px] font-extrabold text-white shadow-md">PAGE {String(pageNumber).padStart(2, "0")}</span><span className={`absolute right-2 top-2 grid size-7 place-items-center rounded-md text-xs font-bold shadow-md ${selected ? "text-white" : "bg-white text-black"}`} style={selected ? { background: tool.accent } : undefined}>{selected ? <Check className="size-3.5" /> : "+"}</span>{focused ? <span className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-[8px] font-bold text-white" style={{ background: tool.accent }}>LIVE PREVIEW</span> : null}</button>
                            <div className="mt-2 flex items-center justify-between gap-2"><div><strong className="block text-[10px]">Page {pageNumber}</strong><span className="text-[9px] font-semibold" style={{ color: angle ? tool.accent : undefined }}>{angle === 0 ? "Original" : angle === 270 ? "90° left" : `${angle}° right`}</span></div><div className="flex gap-1"><button type="button" onClick={() => { setRotateFocusPage(pageNumber); turnPdfPages([pageNumber], 270); }} aria-label={`Rotate page ${pageNumber} left`} className="grid size-8 cursor-pointer place-items-center rounded-lg bg-white text-black/55 hover:text-black dark:bg-[#1c1d21] dark:text-white/55 dark:hover:text-white"><RotateCcw className="size-3.5" /></button><button type="button" onClick={() => { setRotateFocusPage(pageNumber); turnPdfPages([pageNumber], 90); }} aria-label={`Rotate page ${pageNumber} right`} className="grid size-8 cursor-pointer place-items-center rounded-lg bg-white text-black/55 hover:text-black dark:bg-[#1c1d21] dark:text-white/55 dark:hover:text-white"><RotateCw className="size-3.5" /></button></div></div>
                          </article>; })}</div> : <div className="grid min-h-64 place-items-center text-center"><div><RotateCcw className="mx-auto size-6 animate-spin text-black/30 dark:text-white/30" /><p className="mt-3 text-xs font-semibold text-black/45 dark:text-white/45">Rendering every page preview…</p></div></div>}
                        </div>
                      </div>

                      <aside className="min-w-0 xl:sticky xl:top-32 xl:self-start"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Corrected page</span><div className="mt-2 rounded-xl border border-black/10 bg-[#dedbd4] p-5 dark:border-white/10 dark:bg-[#24252a]">{(() => { const angle = rotatePageAngles[rotateFocusPage] ?? 0; const quarterTurn = angle === 90 || angle === 270; const src = rotatePreview?.pages[rotateFocusPage - 1]; return <div className={`relative mx-auto w-full overflow-hidden bg-white shadow-[0_14px_35px_rgba(0,0,0,.16)] transition-all duration-300 ${quarterTurn ? "aspect-[1.414]" : "aspect-[.707]"}`}>{src ? <Image src={src} alt={`Live corrected preview of page ${rotateFocusPage}`} fill sizes="280px" unoptimized className="object-contain transition-transform duration-300" style={{ transform: `rotate(${angle}deg)` }} /> : <div className="grid size-full place-items-center text-xs text-black/35">Preparing preview…</div>}<span className="absolute bottom-2 right-2 rounded bg-[#17181b] px-2 py-1 text-[8px] font-bold text-white">PAGE {String(rotateFocusPage).padStart(2, "0")}</span></div>; })()}</div>
                        <div className="mt-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><div className="flex items-center justify-between"><div><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Page {rotateFocusPage}</span><strong className="mt-1 block text-sm">{(rotatePageAngles[rotateFocusPage] ?? 0) === 0 ? "No rotation" : (rotatePageAngles[rotateFocusPage] ?? 0) === 270 ? "90° counter-clockwise" : `${rotatePageAngles[rotateFocusPage]}° clockwise`}</strong></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${(rotatePageAngles[rotateFocusPage] ?? 0) ? "text-white" : "bg-black/5 text-black/45 dark:bg-white/10 dark:text-white/45"}`} style={(rotatePageAngles[rotateFocusPage] ?? 0) ? { background: tool.accent } : undefined}>{(rotatePageAngles[rotateFocusPage] ?? 0) ? "CHANGED" : "ORIGINAL"}</span></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => turnPdfPages([rotateFocusPage], 270)} className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#18191d] text-[10px] font-bold text-white"><RotateCcw className="size-3.5" /> Left</button><button type="button" onClick={() => turnPdfPages([rotateFocusPage], 90)} className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-[10px] font-bold text-white" style={{ background: tool.accent }}><RotateCw className="size-3.5" /> Right</button></div></div>
                        <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"><strong className="block">Quality stays intact</strong><span className="mt-1 block opacity-80">Rotation changes page orientation without turning text or vectors into screenshots.</span></div>
                      </aside>
                    </div>
                  </div>
                ) : null}

                {tool.slug === "delete-pdf-pages" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div><div className="flex items-center gap-2"><Trash2 className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Mark unwanted pages visually</h3></div><p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">Open a thumbnail to inspect it, then use its clear Remove page button. Red pages disappear from the new PDF; clean pages show their new output number.</p></div>
                      <div className="flex gap-2"><span className="rounded-full bg-red-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-red-700 dark:bg-red-400/10 dark:text-red-300">{deleteSelectedPages.length} remove</span><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{deleteRemainingPages} keep</span></div>
                    </div>

                    <div className="border-b border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[.025] sm:p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Quick selection</span><p className="mt-1 text-xs font-semibold">Useful for covers, blank backs, and scanned odd/even sheets</p></div><button type="button" onClick={() => selectDeletePreset("clear")} className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-bold hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21]">Undo all marks</button></div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{([['first', 'First page'], ['last', 'Last page'], ['odd', 'Odd pages'], ['even', 'Even pages'], ['invert', 'Invert choice']] as const).map(([kind, label]) => <button key={kind} type="button" onClick={() => selectDeletePreset(kind)} disabled={deleteTotalPages < 2} className="h-10 cursor-pointer rounded-xl border border-black/10 bg-white text-[10px] font-bold transition hover:-translate-y-0.5 hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-[#1c1d21] dark:hover:border-red-400/40 dark:hover:text-red-300">{label}</button>)}</div>
                    </div>

                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
                      <div className="min-w-0"><div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Document pages</span><h4 className="mt-1 font-heading text-lg font-semibold">Choose exactly what leaves</h4></div><span className="rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-bold text-black/50 dark:bg-white/10 dark:text-white/55">Preview par click karein, neeche se remove karein</span></div>
                        <div className="mt-3 max-h-[46rem] overflow-y-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#18191d]">
                          {deletePreview?.pages.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{deletePreview.pages.map((src, index) => { const pageNumber = index + 1; const removed = deleteSelectedPages.includes(pageNumber); const outputPageNumber = removed ? null : pageNumber - deleteSelectedPages.filter((page) => page < pageNumber).length; const focused = deleteFocusPage === pageNumber; return <article key={pageNumber} className={`min-w-0 rounded-xl border p-2.5 transition ${removed ? "border-red-500/60 bg-red-50 ring-2 ring-red-500/15 dark:bg-red-500/10" : focused ? "border-black/25 bg-[#faf9f6] shadow-md dark:border-white/25 dark:bg-[#24252a]" : "border-black/10 bg-[#faf9f6] dark:border-white/10 dark:bg-[#24252a]"}`}>
                            <button type="button" onClick={() => setDeleteFocusPage(pageNumber)} className="relative block aspect-[.72] w-full cursor-zoom-in overflow-hidden rounded-lg bg-[#e8e6e0] dark:bg-[#303137]" aria-label={`Preview page ${pageNumber}`}><Image src={src} alt={`Source PDF page ${pageNumber}`} fill sizes="220px" unoptimized className={`object-contain transition duration-200 ${removed ? "scale-[.97] opacity-30 grayscale" : ""}`} /><span className="absolute left-2 top-2 rounded-md bg-[#17181b] px-2 py-1 text-[9px] font-extrabold text-white shadow-md">PAGE {String(pageNumber).padStart(2, "0")}</span>{removed ? <span className="absolute inset-0 grid place-items-center bg-red-950/10"><span className="rounded-full bg-red-600 px-3 py-2 text-[9px] font-extrabold text-white shadow-xl">REMOVED</span></span> : <span className="absolute bottom-2 left-2 rounded-md bg-emerald-600 px-2 py-1 text-[8px] font-bold text-white">OUTPUT {String(outputPageNumber).padStart(2, "0")}</span>}</button>
                            <div className="mt-2.5 min-w-0"><strong className="block text-xs">Page {pageNumber}</strong><span className={`block truncate text-[9px] font-semibold ${removed ? "text-red-600 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>{removed ? "Not in final PDF" : `Final page ${outputPageNumber}`}</span></div>
                            <button type="button" onClick={() => toggleDeletePage(pageNumber)} className={`mt-2.5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[10px] font-extrabold transition ${removed ? "border border-red-500/30 bg-white text-red-700 hover:bg-red-50 dark:bg-[#1c1d21] dark:text-red-300 dark:hover:bg-red-500/10" : "bg-red-600 text-white hover:bg-red-700"}`} aria-label={removed ? `Restore page ${pageNumber}` : `Remove page ${pageNumber}`}>{removed ? <><RotateCcw className="size-3.5" /> Restore page</> : <><Trash2 className="size-3.5" /> Remove page</>}</button>
                          </article>; })}</div> : <div className="grid min-h-64 place-items-center text-center"><div><RotateCcw className="mx-auto size-6 animate-spin text-black/30 dark:text-white/30" /><p className="mt-3 text-xs font-semibold text-black/45 dark:text-white/45">Rendering every page preview…</p></div></div>}
                        </div>
                      </div>

                      <aside className="min-w-0 xl:sticky xl:top-32 xl:self-start"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Focused source page</span><div className={`mt-2 rounded-xl border p-5 transition ${deleteSelectedPages.includes(deleteFocusPage) ? "border-red-500/30 bg-red-100 dark:bg-red-500/10" : "border-black/10 bg-[#dedbd4] dark:border-white/10 dark:bg-[#24252a]"}`}><div className="relative mx-auto aspect-[.707] w-full overflow-hidden bg-white shadow-[0_14px_35px_rgba(0,0,0,.16)]">{deletePreview?.pages[deleteFocusPage - 1] ? <Image src={deletePreview.pages[deleteFocusPage - 1]} alt={`Focused preview of page ${deleteFocusPage}`} fill sizes="280px" unoptimized className={`object-contain transition ${deleteSelectedPages.includes(deleteFocusPage) ? "opacity-35 grayscale" : ""}`} /> : <div className="grid size-full place-items-center text-xs text-black/35">Preparing preview…</div>}{deleteSelectedPages.includes(deleteFocusPage) ? <span className="absolute inset-0 grid place-items-center"><span className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xl">REMOVED</span></span> : null}</div><button type="button" onClick={() => toggleDeletePage(deleteFocusPage)} className={`mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-extrabold ${deleteSelectedPages.includes(deleteFocusPage) ? "border border-red-500/30 bg-white text-red-700 dark:bg-[#1c1d21] dark:text-red-300" : "bg-red-600 text-white"}`}>{deleteSelectedPages.includes(deleteFocusPage) ? <><RotateCcw className="size-4" /> Restore page {deleteFocusPage}</> : <><Trash2 className="size-4" /> Remove page {deleteFocusPage}</>}</button></div>
                        <div className="mt-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Output plan</span><div className="mt-2 grid grid-cols-2 gap-2"><div className="rounded-lg bg-red-50 p-3 dark:bg-red-500/10"><strong className="block text-lg text-red-700 dark:text-red-300">{deleteSelectedPages.length}</strong><span className="text-[9px] font-bold uppercase text-red-700/65 dark:text-red-300/65">Removed</span></div><div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/10"><strong className="block text-lg text-emerald-700 dark:text-emerald-300">{deleteRemainingPages}</strong><span className="text-[9px] font-bold uppercase text-emerald-700/65 dark:text-emerald-300/65">Kept</span></div></div><p className="mt-3 text-[10px] leading-4 text-black/45 dark:text-white/45">Kept pages close the gaps automatically while preserving their original order.</p></div>
                        <div className={`mt-3 rounded-xl border p-3 text-[10px] leading-4 ${deleteRemainingPages === 0 ? "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200" : "border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"}`}><strong className="block">{deleteRemainingPages === 0 ? "Keep at least one page" : "Original quality stays intact"}</strong><span className="mt-1 block opacity-80">{deleteRemainingPages === 0 ? "Restore any page before creating the cleaned PDF." : "Pages are copied structurally; they are not converted into screenshots."}</span></div>
                      </aside>
                    </div>
                  </div>
                ) : null}

                {tool.slug === "extract-pdf-pages" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                      <div><div className="flex items-center gap-2"><FileStack className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Build a new PDF from the pages you need</h3></div><p className="mt-1 max-w-2xl text-xs font-medium leading-5 text-black/50 dark:text-white/50">Open a thumbnail to inspect it, then use Add to PDF. Selected pages appear in the output list where you can drag them into any order.</p></div>
                      <span className="rounded-full bg-teal-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-teal-800 dark:bg-teal-400/10 dark:text-teal-300">{extractSelectedPages.length} selected · {extractTotalPages} total</span>
                    </div>

                    <div className="border-b border-black/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[.025] sm:p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Quick selection</span><p className="mt-1 text-xs font-semibold">Start with a useful group, then fine-tune individual pages</p></div><button type="button" onClick={() => selectExtractPreset("clear")} className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-bold hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21]">Clear selection</button></div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{([['all', 'All pages'], ['first', 'First page'], ['last', 'Last page'], ['odd', 'Odd pages'], ['even', 'Even pages'], ['invert', 'Invert']] as const).map(([kind, label]) => <button key={kind} type="button" onClick={() => selectExtractPreset(kind)} disabled={!extractTotalPages} className="h-10 cursor-pointer rounded-xl border border-black/10 bg-white text-[10px] font-bold transition hover:-translate-y-0.5 hover:border-teal-400 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:bg-[#1c1d21] dark:hover:border-teal-400/40 dark:hover:text-teal-300">{label}</button>)}</div>
                    </div>

                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
                      <div className="min-w-0"><div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Source pages</span><h4 className="mt-1 font-heading text-lg font-semibold">Choose pages with confidence</h4></div><span className="rounded-full bg-black/5 px-3 py-1.5 text-[9px] font-bold text-black/50 dark:bg-white/10 dark:text-white/55">Preview par click karein, button se add karein</span></div>
                        <div className="mt-3 max-h-[48rem] overflow-y-auto rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#18191d]">
                          {extractPreview?.pages.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{extractPreview.pages.map((src, index) => { const pageNumber = index + 1; const selectedIndex = extractSelectedPages.indexOf(pageNumber); const selected = selectedIndex >= 0; const focused = extractFocusPage === pageNumber; return <article key={pageNumber} className={`min-w-0 rounded-xl border p-2.5 transition ${selected ? "border-teal-500/60 bg-teal-50 ring-2 ring-teal-500/15 dark:bg-teal-500/10" : focused ? "border-black/25 bg-[#faf9f6] shadow-md dark:border-white/25 dark:bg-[#24252a]" : "border-black/10 bg-[#faf9f6] dark:border-white/10 dark:bg-[#24252a]"}`}>
                            <button type="button" onClick={() => setExtractFocusPage(pageNumber)} className="relative block aspect-[.72] w-full cursor-zoom-in overflow-hidden rounded-lg bg-[#e8e6e0] dark:bg-[#303137]" aria-label={`Preview source page ${pageNumber}`}><Image src={src} alt={`Source PDF page ${pageNumber}`} fill sizes="220px" unoptimized className="object-contain" /><span className="absolute left-2 top-2 rounded-md bg-[#17181b] px-2 py-1 text-[9px] font-extrabold text-white shadow-md">PAGE {String(pageNumber).padStart(2, "0")}</span>{selected ? <span className="absolute bottom-2 left-2 rounded-md bg-teal-600 px-2 py-1 text-[8px] font-bold text-white">OUTPUT {String(selectedIndex + 1).padStart(2, "0")}</span> : null}<span className={`absolute right-2 top-2 grid size-7 place-items-center rounded-md shadow-md ${selected ? "bg-teal-600 text-white" : "bg-white text-black/45"}`}>{selected ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}</span></button>
                            <div className="mt-2.5 min-w-0"><strong className="block text-xs">Source page {pageNumber}</strong><span className={`block truncate text-[9px] font-semibold ${selected ? "text-teal-700 dark:text-teal-300" : "text-black/40 dark:text-white/40"}`}>{selected ? `Final page ${selectedIndex + 1}` : "Not selected"}</span></div>
                            <button type="button" onClick={() => toggleExtractPage(pageNumber)} className={`mt-2.5 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[10px] font-extrabold transition ${selected ? "border border-red-500/25 bg-white text-red-600 hover:bg-red-50 dark:bg-[#1c1d21] dark:text-red-300 dark:hover:bg-red-500/10" : "bg-teal-600 text-white hover:bg-teal-700"}`} aria-label={selected ? `Remove source page ${pageNumber} from output` : `Add source page ${pageNumber} to output`}>{selected ? <><X className="size-3.5 shrink-0" /> Remove page</> : <><Plus className="size-3.5 shrink-0" /> Add to PDF</>}</button>
                          </article>; })}</div> : <div className="grid min-h-64 place-items-center text-center"><div><RotateCcw className="mx-auto size-6 animate-spin text-black/30 dark:text-white/30" /><p className="mt-3 text-xs font-semibold text-black/45 dark:text-white/45">Rendering every source page…</p></div></div>}
                        </div>
                      </div>

                      <aside className="min-w-0 xl:sticky xl:top-32 xl:self-start"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/40 dark:text-white/40">Focused source page</span><div className="mt-2 rounded-xl border border-black/10 bg-[#dedbd4] p-4 dark:border-white/10 dark:bg-[#24252a]"><div className="relative mx-auto aspect-[.707] w-full overflow-hidden bg-white shadow-[0_14px_35px_rgba(0,0,0,.16)]">{extractPreview?.pages[extractFocusPage - 1] ? <Image src={extractPreview.pages[extractFocusPage - 1]} alt={`Focused source page ${extractFocusPage}`} fill sizes="280px" unoptimized className="object-contain" /> : <div className="grid size-full place-items-center text-xs text-black/35">Preparing preview…</div>}<span className="absolute bottom-2 right-2 rounded bg-[#17181b] px-2 py-1 text-[8px] font-bold text-white">SOURCE {String(extractFocusPage).padStart(2, "0")}</span></div><button type="button" onClick={() => toggleExtractPage(extractFocusPage)} className={`mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-extrabold ${extractSelectedPages.includes(extractFocusPage) ? "border border-teal-500/30 bg-white text-teal-700 dark:bg-[#1c1d21] dark:text-teal-300" : "bg-teal-600 text-white"}`}>{extractSelectedPages.includes(extractFocusPage) ? <><X className="size-4" /> Remove page {extractFocusPage}</> : <><Plus className="size-4" /> Add page {extractFocusPage}</>}</button></div>

                        <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#1c1d21]"><div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10"><div><span className="text-[9px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">Output order</span><strong className="mt-0.5 block text-sm">{extractSelectedPages.length ? `${extractSelectedPages.length} selected pages` : "No pages yet"}</strong></div>{extractSelectedPages.length > 1 ? <span className="text-[9px] font-semibold text-black/35 dark:text-white/35">Drag to reorder</span> : null}</div>
                          {extractSelectedPages.length ? <div className="max-h-64 overflow-y-auto p-2">{extractSelectedPages.map((pageNumber, index) => <div key={pageNumber} draggable onDragStart={(event) => { setDraggedExtractPage(pageNumber); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", String(pageNumber)); }} onDragEnd={() => setDraggedExtractPage(null)} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); dropExtractPage(pageNumber); }} className={`mb-1.5 flex items-center gap-2 rounded-lg border p-2 transition last:mb-0 ${draggedExtractPage === pageNumber ? "border-dashed opacity-40" : "border-black/10 bg-[#faf9f6] dark:border-white/10 dark:bg-[#24252a]"}`}><span className="cursor-grab text-black/30 active:cursor-grabbing dark:text-white/30"><GripVertical className="size-4" /></span><span className="grid size-7 shrink-0 place-items-center rounded-md bg-teal-600 text-[9px] font-bold text-white">{index + 1}</span><span className="min-w-0 flex-1 text-[10px] font-bold">Source page {pageNumber}</span><button type="button" onClick={() => moveExtractPage(pageNumber, -1)} disabled={index === 0} className="grid size-7 cursor-pointer place-items-center rounded-md text-black/45 hover:bg-black/5 disabled:opacity-20 dark:text-white/45 dark:hover:bg-white/10" aria-label={`Move source page ${pageNumber} earlier`}><ArrowDown className="size-3.5 rotate-180" /></button><button type="button" onClick={() => moveExtractPage(pageNumber, 1)} disabled={index === extractSelectedPages.length - 1} className="grid size-7 cursor-pointer place-items-center rounded-md text-black/45 hover:bg-black/5 disabled:opacity-20 dark:text-white/45 dark:hover:bg-white/10" aria-label={`Move source page ${pageNumber} later`}><ArrowDown className="size-3.5" /></button><button type="button" onClick={() => toggleExtractPage(pageNumber)} className="grid size-7 cursor-pointer place-items-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" aria-label={`Remove source page ${pageNumber}`}><X className="size-3.5" /></button></div>)}</div> : <div className="px-4 py-6 text-center"><FileStack className="mx-auto size-5 text-black/20 dark:text-white/20" /><p className="mt-2 text-[10px] leading-4 text-black/40 dark:text-white/40">Add pages from the preview grid. Their order will appear here.</p></div>}
                        </div>
                        <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"><strong className="block">No quality loss</strong><span className="mt-1 block opacity-80">Selected pages keep their original size, text, links, vectors, and image quality.</span></div>
                      </aside>
                    </div>
                  </div>
                ) : null}

                {tool.slug === "add-pdf-watermark" ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 bg-white/65 px-4 py-4 dark:border-white/10 dark:bg-white/[.025] sm:px-5"><div><div className="flex items-center gap-2"><Sparkles className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">Watermark Studio</h3></div><p className="mt-1 text-xs leading-5 text-black/50 dark:text-white/50">Style it once, preview the exact placement, then choose where it appears.</p></div><span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-bold dark:border-white/10 dark:bg-[#202126]">{watermarkSelectedPages.length} of {watermarkTotalPages} pages</span></div>

                    <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                      <div className="min-w-0 space-y-4">
                        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><label className="grid gap-2"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Watermark text</span><input value={watermark} onChange={(event) => { setWatermark(event.target.value); setResult(null); }} maxLength={48} placeholder="Type your watermark" className="h-12 w-full rounded-xl border border-black/15 bg-[#faf9f6] px-4 text-sm font-bold outline-none transition focus:border-black/40 dark:border-white/15 dark:bg-[#24252a] dark:focus:border-white/40" /></label><div className="mt-2.5 flex flex-wrap gap-1.5">{["CONFIDENTIAL", "DRAFT", "SAMPLE", "PAID", "DO NOT COPY"].map((text) => <button key={text} type="button" onClick={() => { setWatermark(text); setResult(null); }} className={`rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${watermark === text ? "border-transparent text-white" : "border-black/10 bg-white text-black/55 hover:border-black/25 dark:border-white/10 dark:bg-[#1c1d21] dark:text-white/55"}`} style={watermark === text ? { background: tool.accent } : undefined}>{text}</button>)}</div></div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Pattern</span><div className="mt-3 grid grid-cols-3 gap-2">{([['diagonal', 'Diagonal'], ['horizontal', 'Straight'], ['tiled', 'Tiled']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => { setWatermarkLayout(value); setResult(null); }} className={`h-10 rounded-lg border text-[10px] font-extrabold transition ${watermarkLayout === value ? "border-transparent text-white shadow-sm" : "border-black/10 bg-[#faf9f6] text-black/55 dark:border-white/10 dark:bg-[#24252a] dark:text-white/55"}`} style={watermarkLayout === value ? { background: tool.accent } : undefined}>{label}</button>)}</div><div className="mt-3 grid grid-cols-2 gap-2">{([['regular', 'Regular'], ['bold', 'Bold']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => { setWatermarkFontStyle(value); setResult(null); }} className={`h-9 rounded-lg border text-[10px] transition ${watermarkFontStyle === value ? "border-black bg-black font-bold text-white dark:border-white dark:bg-white dark:text-black" : "border-black/10 bg-white font-semibold dark:border-white/10 dark:bg-[#24252a]"}`}>{label}</button>)}</div></div>

                          <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Colour</span><div className="mt-3 flex flex-wrap items-center gap-2">{["#d12f45", "#111827", "#2563eb", "#07856f", "#7c3aed"].map((color) => <button key={color} type="button" onClick={() => { setWatermarkColor(color); setResult(null); }} className={`grid size-9 place-items-center rounded-full border-4 transition ${watermarkColor === color ? "border-white ring-2 ring-black/30 dark:ring-white/50" : "border-transparent"}`} style={{ background: color }} aria-label={`Use ${color} watermark colour`}>{watermarkColor === color ? <Check className="size-4 text-white" /> : null}</button>)}<label className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-black/15 bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]" aria-label="Choose custom colour"><input type="color" value={watermarkColor} onChange={(event) => { setWatermarkColor(event.target.value); setResult(null); }} className="absolute inset-0 cursor-pointer opacity-0" /><Plus className="size-4 rounded-full bg-white p-0.5 text-black" /></label></div><p className="mt-3 text-[10px] text-black/40 dark:text-white/40">Choose a colour that remains readable without hiding the document.</p></div>
                        </div>

                        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><div className="grid gap-4 sm:grid-cols-3"><label className="grid gap-2"><span className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-black/45 dark:text-white/45"><span>Size</span><span>{watermarkSize} pt</span></span><input type="range" min="16" max="76" value={watermarkSize} onChange={(event) => { setWatermarkSize(Number(event.target.value)); setResult(null); }} style={{ accentColor: tool.accent }} /></label><label className="grid gap-2"><span className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-black/45 dark:text-white/45"><span>Opacity</span><span>{opacity}%</span></span><input type="range" min="6" max="70" value={opacity} onChange={(event) => { setOpacity(Number(event.target.value)); setResult(null); }} style={{ accentColor: tool.accent }} /></label><label className={`grid gap-2 ${watermarkLayout === "horizontal" ? "opacity-35" : ""}`}><span className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-black/45 dark:text-white/45"><span>Angle</span><span>{watermarkLayout === "horizontal" ? 0 : watermarkAngle}°</span></span><input type="range" min="-60" max="60" value={watermarkAngle} disabled={watermarkLayout === "horizontal"} onChange={(event) => { setWatermarkAngle(Number(event.target.value)); setResult(null); }} style={{ accentColor: tool.accent }} /></label></div></div>

                        {watermarkLayout !== "tiled" ? <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><div className="flex items-center justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Placement</span><p className="mt-1 text-[10px] text-black/40 dark:text-white/40">Choose a safe area on the page.</p></div><div className="grid grid-cols-3 gap-1.5">{([['top-left', '↖'], ['center', '●'], ['top-right', '↗'], ['bottom-left', '↙'], ['bottom-right', '↘']] as const).map(([value, label], index) => <button key={value} type="button" onClick={() => { setWatermarkPosition(value); setResult(null); }} className={`grid size-9 place-items-center rounded-lg border text-xs font-bold ${value === "center" ? "col-start-2 row-start-2" : index > 2 ? "row-start-3" : "row-start-1"} ${watermarkPosition === value ? "border-transparent text-white" : "border-black/10 bg-[#faf9f6] dark:border-white/10 dark:bg-[#24252a]"}`} style={watermarkPosition === value ? { background: tool.accent } : undefined} aria-label={value.replace("-", " ")}>{label}</button>)}</div></div></div> : null}

                        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]"><div className="flex flex-wrap items-end justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Apply to pages</span><p className="mt-1 text-xs font-semibold">Click a page to include or exclude it</p></div><button type="button" onClick={() => selectWatermarkPages("clear")} className="rounded-full border border-black/10 px-3 py-1.5 text-[9px] font-bold hover:border-red-300 hover:text-red-600 dark:border-white/10">Clear</button></div><div className="mt-3 grid grid-cols-5 gap-1.5">{([['all', 'All'], ['odd', 'Odd'], ['even', 'Even'], ['first', 'First'], ['last', 'Last']] as const).map(([kind, label]) => <button key={kind} type="button" onClick={() => selectWatermarkPages(kind)} className="h-9 rounded-lg border border-black/10 bg-[#faf9f6] text-[9px] font-bold hover:border-black/30 dark:border-white/10 dark:bg-[#24252a]">{label}</button>)}</div><div className="mt-3 grid max-h-52 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-6">{watermarkPreview?.pages.map((src, index) => { const pageNumber = index + 1; const selected = watermarkSelectedPages.includes(pageNumber); return <button key={pageNumber} type="button" onClick={() => toggleWatermarkPage(pageNumber)} className={`relative aspect-[.72] overflow-hidden rounded-lg border-2 bg-[#e9e7e1] transition ${selected ? "border-[var(--tool-accent)] ring-2 ring-[color:var(--tool-accent)]/10" : "border-transparent opacity-55"}`} style={{ "--tool-accent": tool.accent } as React.CSSProperties}><Image src={src} alt={`PDF page ${pageNumber}`} fill sizes="100px" unoptimized className="object-contain" /><span className={`absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 text-[8px] font-bold text-white ${selected ? "bg-black" : "bg-red-600"}`}>{selected ? `PAGE ${pageNumber}` : "SKIP"}</span><span className={`absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full text-white ${selected ? "bg-emerald-600" : "bg-black/55"}`}>{selected ? <Check className="size-3" /> : <X className="size-3" />}</span></button>; })}</div></div>
                      </div>

                      <aside className="min-w-0 xl:sticky xl:top-32 xl:self-start"><div className="flex items-end justify-between"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Live page preview</span><strong className="mt-1 block text-sm">Page {watermarkFocusPage}</strong></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${watermarkSelectedPages.includes(watermarkFocusPage) ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300"}`}>{watermarkSelectedPages.includes(watermarkFocusPage) ? "WATERMARKED" : "SKIPPED"}</span></div><div className="mt-2 rounded-xl border border-black/10 bg-[#dcd9d2] p-4 dark:border-white/10 dark:bg-[#24252a]"><div className="relative mx-auto aspect-[.707] w-full overflow-hidden bg-white shadow-[0_16px_40px_rgba(0,0,0,.18)]">{watermarkPreview?.pages[watermarkFocusPage - 1] ? <Image src={watermarkPreview.pages[watermarkFocusPage - 1]} alt={`Watermark preview on page ${watermarkFocusPage}`} fill sizes="320px" unoptimized className="object-contain" /> : <div className="grid size-full place-items-center"><RotateCcw className="size-5 animate-spin text-black/30" /></div>}{watermarkSelectedPages.includes(watermarkFocusPage) && watermark.trim() ? watermarkLayout === "tiled" ? <div className="absolute -inset-12 grid grid-cols-3 content-around gap-y-8 overflow-hidden" style={{ color: watermarkColor, opacity: opacity / 100, transform: `rotate(${watermarkAngle}deg) scale(1.15)` }}>{Array.from({ length: 12 }, (_, index) => <span key={index} className="whitespace-nowrap text-center leading-none" style={{ fontSize: `${Math.max(8, Math.min(17, watermarkSize * .28))}px`, fontWeight: watermarkFontStyle === "bold" ? 800 : 500 }}>{watermark}</span>)}</div> : <span className="absolute max-w-[82%] whitespace-nowrap leading-none" style={{ ...watermarkPositionStyle, color: watermarkColor, opacity: opacity / 100, fontSize: `${Math.max(11, Math.min(29, watermarkSize * .48))}px`, fontWeight: watermarkFontStyle === "bold" ? 800 : 500, ...(watermarkPosition !== "center" ? { transform: `rotate(${watermarkLayout === "horizontal" ? 0 : watermarkAngle}deg)`, transformOrigin: "left top" } : {}) }}>{watermark}</span> : null}<span className="absolute bottom-2 right-2 rounded bg-[#17181b] px-2 py-1 text-[8px] font-bold text-white">PAGE {String(watermarkFocusPage).padStart(2, "0")}</span></div></div><div className="mt-3 grid grid-cols-3 gap-2"><button type="button" onClick={() => setWatermarkFocusPage((page) => Math.max(1, page - 1))} disabled={watermarkFocusPage === 1} className="grid h-10 place-items-center rounded-lg border border-black/10 bg-white disabled:opacity-25 dark:border-white/10 dark:bg-[#1c1d21]"><ArrowLeft className="size-4" /></button><button type="button" onClick={() => toggleWatermarkPage(watermarkFocusPage)} className={`h-10 rounded-lg text-[10px] font-extrabold ${watermarkSelectedPages.includes(watermarkFocusPage) ? "border border-red-500/25 bg-white text-red-600 dark:bg-[#1c1d21]" : "bg-emerald-600 text-white"}`}>{watermarkSelectedPages.includes(watermarkFocusPage) ? "Skip page" : "Add page"}</button><button type="button" onClick={() => setWatermarkFocusPage((page) => Math.min(watermarkTotalPages, page + 1))} disabled={watermarkFocusPage === watermarkTotalPages} className="grid h-10 place-items-center rounded-lg border border-black/10 bg-white disabled:opacity-25 dark:border-white/10 dark:bg-[#1c1d21]"><ArrowRight className="size-4" /></button></div><div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"><strong className="block">Vector watermark, not a screenshot</strong><span className="mt-1 block opacity-80">Your original text, links, images, and page sharpness stay intact.</span></div></aside>
                    </div>
                  </div>
                ) : null}

                {["protect-pdf", "unlock-pdf"].includes(tool.slug) ? (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 bg-[#f7f5f0] dark:border-white/10 dark:bg-[#111215]">
                    <div className="relative overflow-hidden bg-[#17181b] px-5 py-5 text-white"><div className="absolute -right-8 -top-12 size-44 rounded-full opacity-20 blur-2xl" style={{ background: tool.accent }} /><div className="relative flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><LockKeyhole className="size-4" style={{ color: tool.accent }} /><h3 className="font-heading text-lg font-semibold">{tool.slug === "protect-pdf" ? "Security setup" : "Unlock an authorised copy"}</h3></div><p className="mt-1 max-w-xl text-xs leading-5 text-white/60">{tool.slug === "protect-pdf" ? "Set a password once. The protected copy will ask for it before opening." : "Use the current password to create a copy that opens without a password prompt."}</p></div><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.13em]">Local only</span></div></div>
                    <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
                      <div className="min-w-0 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#1c1d21]">
                        <div className="flex items-center justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">{tool.slug === "protect-pdf" ? "Create a password" : "Current PDF password"}</span><p className="mt-1 text-xs font-semibold">{tool.slug === "protect-pdf" ? "Use a password you can share separately." : "We never receive or save this password."}</p></div><button type="button" onClick={() => setPasswordVisible((current) => !current)} className="rounded-full border border-black/10 px-3 py-1.5 text-[9px] font-bold hover:border-black/30 dark:border-white/10">{passwordVisible ? "Hide" : "Show"}</button></div>
                        <label className="mt-4 block"><span className="sr-only">Password</span><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-3.5 size-5 text-black/35 dark:text-white/35" /><input type={passwordVisible ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setResult(null); setError(""); }} minLength={tool.slug === "protect-pdf" ? 4 : undefined} autoComplete={tool.slug === "protect-pdf" ? "new-password" : "current-password"} placeholder={tool.slug === "protect-pdf" ? "Enter a new password" : "Enter the password for this PDF"} className="h-12 w-full rounded-xl border border-black/15 bg-[#faf9f6] pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-black/40 dark:border-white/15 dark:bg-[#24252a] dark:focus:border-white/40" /></div></label>
                        {tool.slug === "protect-pdf" ? <><div className="mt-3 flex items-center gap-2"><div className="grid h-2 flex-1 grid-cols-3 gap-1">{[0, 1, 2].map((part) => <span key={part} className={`rounded-full ${passwordStrength === "empty" || (passwordStrength === "weak" && part > 0) || (passwordStrength === "good" && part > 1) ? "bg-black/10 dark:bg-white/10" : passwordStrength === "strong" ? "bg-emerald-500" : passwordStrength === "good" ? "bg-amber-500" : "bg-red-500"}`} />)}</div><span className="w-12 text-right text-[10px] font-bold uppercase tracking-wide" style={{ color: passwordStrength === "strong" ? "#059669" : passwordStrength === "good" ? "#d97706" : passwordStrength === "weak" ? "#dc2626" : undefined }}>{passwordStrength === "empty" ? "" : passwordStrength}</span></div><p className="mt-2 text-[10px] leading-4 text-black/42 dark:text-white/42">For a strong password, use 14+ characters with uppercase, lowercase, numbers, and a symbol.</p><label className="mt-4 block"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45 dark:text-white/45">Confirm password</span><input type={passwordVisible ? "text" : "password"} value={passwordConfirm} onChange={(event) => { setPasswordConfirm(event.target.value); setResult(null); setError(""); }} autoComplete="new-password" placeholder="Type it once more" className={`mt-2 h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-sm font-semibold outline-none transition dark:bg-[#24252a] ${passwordConfirm && password !== passwordConfirm ? "border-red-400 focus:border-red-500" : "border-black/15 focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"}`} /></label>{passwordConfirm ? <p className={`mt-2 text-[10px] font-semibold ${password === passwordConfirm ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}`}>{password === passwordConfirm ? "Passwords match" : "Passwords do not match yet"}</p> : null}</> : <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-50 p-3 text-xs leading-5 text-blue-800 dark:bg-blue-400/10 dark:text-blue-200"><strong className="block">Only unlock files you are allowed to modify.</strong><span className="mt-1 block opacity-80">This tool verifies the password you provide; it does not guess, bypass, or recover forgotten passwords.</span></div>}
                      </div>
                      <aside className="grid content-start gap-3"><div className="rounded-xl border border-emerald-500/25 bg-emerald-50 p-4 dark:bg-emerald-400/10"><ShieldCheck className="size-6 text-emerald-600" /><strong className="mt-3 block text-sm">Your password stays here.</strong><p className="mt-1 text-xs leading-5 text-black/52 dark:text-white/55">The file and password are handled in this browser tab. No account, upload queue, or recovery copy.</p></div><div className="rounded-xl border border-black/10 bg-white p-4 text-xs leading-5 text-black/55 dark:border-white/10 dark:bg-[#1c1d21] dark:text-white/55"><span className="font-bold text-black dark:text-white">What you receive</span><p className="mt-1">{tool.slug === "protect-pdf" ? "A new AES-256 protected PDF. Your source file remains unprotected and untouched." : "A new copy with the known password removed. Text, forms, page quality, and the original source remain intact."}</p></div></aside>
                    </div>
                  </div>
                ) : null}

                <div className={showsSettings ? "mt-7 grid gap-5 rounded-2xl border border-black/10 p-5 dark:border-white/10" : "hidden"}>
                  {["protect-pdf", "unlock-pdf"].includes(tool.slug) ? <label className="grid gap-2"><span className="text-xs font-bold uppercase tracking-[.14em] text-black/48 dark:text-white/48">{tool.slug === "protect-pdf" ? "New password" : "Current password"}</span><div className="relative"><LockKeyhole className="absolute left-4 top-3.5 size-5 text-black/35 dark:text-white/35" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={4} autoComplete="new-password" className="h-12 w-full rounded-xl border border-black/15 bg-transparent pl-12 pr-4 font-semibold outline-none dark:border-white/15" /></div>{tool.slug === "unlock-pdf" ? <span className="text-xs text-black/38 dark:text-white/38">Removes AES-256 or RC4 protection while preserving original text, forms, and quality.</span> : null}</label> : null}
                </div>

                {error ? <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-200"><X className="mt-0.5 size-4 shrink-0" />{error}</div> : null}

                {result ? (
                  <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-50 p-5 dark:bg-emerald-400/10">
                    <div className="flex flex-wrap items-center gap-4"><span className="grid size-11 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-5" /></span><div className="min-w-0 flex-1"><strong className="block">{tool.slug === "compress-pdf" && compressionReport?.savedPercent === 0 ? "Your PDF was already optimised" : "Your file is ready"}</strong><span className="mt-1 block truncate text-xs text-black/48 dark:text-white/48">{result.name} · {formatBytes(result.size)}{tool.slug === "compress-pdf" && compressionReport ? ` · ${compressionReport.savedPercent > 0 ? `${compressionReport.savedPercent}% smaller` : "original size preserved"}` : ""}</span></div><a href={result.url} download={result.name} className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white"><Download className="size-4" /> Download</a></div>
                    {["merge-pdf", "jpg-to-pdf", "rotate-pdf", "delete-pdf-pages", "extract-pdf-pages", "add-pdf-watermark"].includes(tool.slug) ? (
                      <details open className="mt-5 border-t border-emerald-700/15 pt-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold"><span>{tool.slug === "merge-pdf" ? "Preview final merged PDF" : tool.slug === "rotate-pdf" ? "Check the corrected PDF" : tool.slug === "delete-pdf-pages" ? "Review the cleaned PDF" : tool.slug === "extract-pdf-pages" ? "Review the extracted PDF" : tool.slug === "add-pdf-watermark" ? "Review the watermarked PDF" : "Preview your finished PDF"}</span><span className="text-lg font-normal">−</span></summary>
                        <iframe src={result.url} title={tool.slug === "merge-pdf" ? "Final merged PDF preview" : tool.slug === "rotate-pdf" ? "Corrected rotated PDF preview" : tool.slug === "delete-pdf-pages" ? "Cleaned PDF preview" : tool.slug === "extract-pdf-pages" ? "Extracted PDF preview" : "Finished image PDF preview"} className="mt-4 h-[34rem] w-full rounded-xl border border-black/10 bg-white dark:border-white/10" />
                      </details>
                    ) : null}
                  </div>
                ) : <button type="button" disabled={busy || !mergeReady || !splitReady || !compressionReady || !jpgReady || !rotateReady || !deleteReady || !extractReady || !watermarkReady || !securityReady} onClick={run} className="mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl text-base font-bold text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70" style={{ background: tool.accent, boxShadow: `0 18px 40px ${tool.accent}30` }}>{busy ? <><RotateCcw className="size-5 animate-spin" /> Processing locally…</> : tool.slug === "protect-pdf" && !password ? <><LockKeyhole className="size-5" /> Create a password first</> : tool.slug === "protect-pdf" && password !== passwordConfirm ? <><LockKeyhole className="size-5" /> Passwords must match</> : tool.slug === "unlock-pdf" && !password ? <><LockKeyhole className="size-5" /> Enter the current password</> : tool.slug === "split-pdf" && splitPreview?.status === "ready" && splitMode === "sections" && splitCuts.length === 0 ? <><Scissors className="size-5" /> Add at least one split point</> : tool.slug === "pdf-to-jpg" && jpgPreview?.status === "ready" && !jpgSelectedPages.length ? <><FileImage className="size-5" /> Select at least one page</> : tool.slug === "rotate-pdf" && rotatePreview?.status === "ready" && rotateChangedPages === 0 ? <><RotateCw className="size-5" /> Rotate at least one page</> : tool.slug === "delete-pdf-pages" && deletePreview?.status === "ready" && deleteRemainingPages === 0 ? <><X className="size-5" /> Keep at least one page</> : tool.slug === "delete-pdf-pages" && deletePreview?.status === "ready" && !deleteSelectedPages.length ? <><Trash2 className="size-5" /> Select pages to delete</> : tool.slug === "extract-pdf-pages" && extractPreview?.status === "ready" && !extractSelectedPages.length ? <><FileStack className="size-5" /> Add pages to the new PDF</> : tool.slug === "add-pdf-watermark" && watermarkPreview?.status === "ready" && !watermark.trim() ? <><FileText className="size-5" /> Enter watermark text</> : tool.slug === "add-pdf-watermark" && watermarkPreview?.status === "ready" && !watermarkSelectedPages.length ? <><FileStack className="size-5" /> Select at least one page</> : (tool.slug === "merge-pdf" && !mergeReady) || (tool.slug === "split-pdf" && !splitReady) || (tool.slug === "compress-pdf" && !compressionReady) || (tool.slug === "pdf-to-jpg" && !jpgReady) || (tool.slug === "rotate-pdf" && rotatePreview?.status !== "ready") || (tool.slug === "delete-pdf-pages" && deletePreview?.status !== "ready") || (tool.slug === "extract-pdf-pages" && extractPreview?.status !== "ready") || (tool.slug === "add-pdf-watermark" && watermarkPreview?.status !== "ready") ? <><RotateCcw className="size-5 animate-spin" /> Preparing every page…</> : <>{tool.action}<ArrowRight className="size-5" /></>}</button>}
              </div>
            )}
            <input ref={inputRef} type="file" accept={tool.accept} multiple={tool.multiple} onChange={(event) => event.target.files && addFiles(event.target.files)} className="sr-only" />
          </div>

          <aside className="grid content-start gap-4">
            <div className="rounded-3xl bg-[#181817] p-6 text-white dark:border dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-white/45"><Zap className="size-4" style={{ color: tool.accent }} /> Instant workflow</div>
              <ol className="mt-6 grid gap-5">{[["01", "Choose files", "Your browser reads them locally."], ["02", "Fine-tune", "Set order, pages, or quality."], ["03", "Download", tool.outcome]].map(([number, title, copy]) => <li key={number} className="flex gap-4"><span className="font-mono text-xs text-white/28">{number}</span><div><strong className="text-sm">{title}</strong><p className="mt-1 text-xs leading-5 text-white/46">{copy}</p></div></li>)}</ol>
            </div>
            <div className="rounded-3xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#151619]">
              <ShieldCheck className="size-7" style={{ color: tool.accent }} />
              <h3 className="mt-5 font-heading text-lg font-semibold">Files stay yours.</h3>
              <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/48">Processing happens in this tab. No upload queue, account, watermark, or artificial daily limit.</p>
            </div>
          </aside>
        </div>
      </section>

      {children}

      <section className="border-t border-black/10 bg-white py-16 dark:border-white/10 dark:bg-[#121315]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between gap-5"><div><span className="text-xs font-bold uppercase tracking-[.18em] text-black/38 dark:text-white/38">Keep moving</span><h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">More PDF tools</h2></div><Link href="/pdf-tools" className="hidden items-center gap-2 text-sm font-bold sm:flex">See all <ArrowRight className="size-4" /></Link></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{pdfTools.filter((item) => item.slug !== tool.slug).slice(0, 4).map((item) => <Link key={item.slug} href={`/pdf-tools/${item.slug}`} className="group rounded-2xl border border-black/10 p-5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10"><span className="grid size-10 place-items-center rounded-xl text-white" style={{ background: item.accent }}><FileStack className="size-5" /></span><strong className="mt-5 block">{item.title}</strong><span className="mt-2 flex items-center gap-2 text-xs text-black/42 dark:text-white/42">Open tool <ArrowRight className="size-3 transition group-hover:translate-x-1" /></span></Link>)}</div>
        </div>
      </section>
    </main>
  );
}
