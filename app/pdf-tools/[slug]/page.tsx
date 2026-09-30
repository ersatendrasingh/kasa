import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PdfWorkbench } from "@/components/pdf/pdf-workbench";
import { PdfToolGuide } from "@/components/pdf/pdf-tool-guide";
import { PDF_TOOL_SLUGS, getPdfTool } from "@/lib/pdf-tools";

type Props = { params: Promise<{ slug: string }> };

const seoByTool = {
  "merge-pdf": { title: "Merge PDF Files Online — Free, Private & Easy to Reorder", description: "Merge PDF files online for free, then drag every page into the exact order you want. Create one clean PDF privately in your browser—no signup and no watermark.", keywords: ["merge pdf", "merge pdf files online", "merge pdf online free", "combine pdf files", "reorder pdf pages", "join pdf files", "merge multiple pdfs", "pdf merger without signup"] },
  "split-pdf": { title: "Split PDF Online — Free Page & Section Splitter", description: "Split a PDF online for free, one page at a time or at custom section breaks. See every planned part before downloading a neatly named ZIP.", keywords: ["split pdf", "split pdf online", "split pdf online free", "separate pdf pages", "split pdf into pages", "split pdf by pages", "divide pdf", "split pdf into multiple files"] },
  "compress-pdf": { title: "Compress PDF Online — Free, Smaller-Only Compression", description: "Compress PDF online for free with a real before-and-after size check. Keep selectable text when possible and never replace your file with a bigger download.", keywords: ["compress pdf", "compress pdf online", "compress pdf online free", "reduce pdf size", "pdf compressor online free", "shrink pdf", "compress scanned pdf", "make pdf smaller"] },
  "pdf-to-jpg": { title: "PDF to JPG Converter — Free Online, Sharp Image Export", description: "Convert PDF to JPG online for free. Select the pages you need, tune JPG quality and resolution on a live preview, then download clear numbered images.", keywords: ["pdf to jpg", "pdf to jpg converter", "convert pdf to jpg", "pdf to jpg online free", "pdf to jpeg online free", "pdf page to image", "export pdf pages as jpg", "convert pdf pages to images"] },
  "jpg-to-pdf": { title: "JPG to PDF Converter — Free Online Photo-to-PDF Maker", description: "Convert JPG to PDF online for free. Put photos in the right order, rotate them, choose A4 or Letter, and preview the final layout before saving.", keywords: ["jpg to pdf", "jpg to pdf converter", "jpg to pdf online free", "convert jpg to pdf free", "image to pdf", "photos to pdf", "png to pdf", "webp to pdf", "a4 image to pdf"] },
  "rotate-pdf": { title: "Rotate PDF Online — Free Fix for Sideways Pages", description: "Rotate PDF pages online for free. Fix a sideways, upside-down, or mixed scan page by page while keeping the document’s text and quality intact.", keywords: ["rotate pdf", "rotate pdf online", "rotate pdf online free", "rotate pdf pages", "rotate one page in pdf", "turn pdf page", "fix sideways pdf", "rotate scanned pdf"] },
  "delete-pdf-pages": { title: "Delete PDF Pages Online — Free Visual Page Remover", description: "Delete pages from a PDF online by looking at real page previews. Remove blank, duplicate, or unwanted pages and check the cleaned PDF before you download.", keywords: ["delete pdf pages", "delete pages from pdf", "remove pages from pdf", "delete pdf pages online", "delete one page from pdf", "pdf page remover", "remove blank pages from pdf", "delete odd pages pdf"] },
  "extract-pdf-pages": { title: "Extract PDF Pages Online — Free, Reorder Before Saving", description: "Extract pages from a PDF online for free. Pick only the pages that matter, drag them into a new order, and save a focused PDF at original quality.", keywords: ["extract pdf pages", "extract pages from pdf", "extract pdf pages online", "save selected pdf pages", "extract one page from pdf", "pdf page extractor", "reorder extracted pdf pages", "separate pdf pages"] },
  "add-pdf-watermark": { title: "Add Watermark to PDF — Free Online Text Watermark Maker", description: "Add a watermark to PDF pages online for free. Preview the text, colour, opacity, angle, placement, style, and selected pages before saving your marked copy.", keywords: ["add watermark to pdf", "add watermark to pdf online", "watermark pdf online free", "add text watermark to pdf", "confidential watermark pdf", "draft watermark pdf", "watermark selected pdf pages", "tiled pdf watermark"] },
  "protect-pdf": { title: "Protect PDF with Password — Free AES-256 Encryption", description: "Password protect a PDF online for free with AES-256 encryption. Set and confirm a strong password locally, then download a secure copy ready to share.", keywords: ["protect pdf", "password protect pdf", "password protect pdf online", "encrypt pdf online free", "lock pdf with password", "aes 256 pdf encryption", "secure pdf online", "add password to pdf"] },
  "unlock-pdf": { title: "Unlock PDF Online — Free Known-Password PDF Unlocker", description: "Unlock a PDF online for free when you know the password and are authorised to use it. Remove the prompt while preserving supported text, forms, links, and quality.", keywords: ["unlock pdf", "unlock pdf online", "remove pdf password", "decrypt pdf online free", "unlock password protected pdf", "remove known pdf password", "unprotect pdf", "pdf password remover"] },
} as const;

export function generateStaticParams() {
  return PDF_TOOL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getPdfTool(slug);
  if (!tool) return {};
  const seo = seoByTool[tool.slug];
  return {
    title: seo.title,
    description: seo.description,
    keywords: [...seo.keywords],
    alternates: { canonical: `/pdf-tools/${tool.slug}` },
    openGraph: { title: seo.title, description: seo.description, url: `/pdf-tools/${tool.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function PdfToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getPdfTool(slug);
  if (!tool) notFound();
  return <PdfWorkbench tool={tool}><PdfToolGuide tool={tool} /></PdfWorkbench>;
}
