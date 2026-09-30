export const PDF_TOOL_SLUGS = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "pdf-to-jpg",
  "jpg-to-pdf",
  "rotate-pdf",
  "delete-pdf-pages",
  "extract-pdf-pages",
  "add-pdf-watermark",
  "protect-pdf",
  "unlock-pdf",
] as const;

export type PdfToolSlug = (typeof PDF_TOOL_SLUGS)[number];

export type PdfToolDefinition = {
  slug: PdfToolSlug;
  title: string;
  shortTitle: string;
  description: string;
  action: string;
  accept: string;
  multiple: boolean;
  accent: string;
  outcome: string;
};

export const pdfTools: PdfToolDefinition[] = [
  { slug: "merge-pdf", title: "Merge PDF", shortTitle: "Merge", description: "Combine PDF files online, put every page in the order that makes sense, and download one polished document when the flow looks right.", action: "Merge PDFs", accept: "application/pdf,.pdf", multiple: true, accent: "#ff5a5f", outcome: "One ordered PDF" },
  { slug: "split-pdf", title: "Split PDF", shortTitle: "Split", description: "Split a PDF online by page or by meaningful sections. See every break before you download a neatly organised ZIP.", action: "Split PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#7c5cff", outcome: "PDFs packed in ZIP" },
  { slug: "compress-pdf", title: "Compress PDF", shortTitle: "Compress", description: "Reduce PDF file size online without a nasty surprise: compare real results and keep the original when it is already the smallest safe copy.", action: "Compress PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#10a37f", outcome: "Smaller PDF" },
  { slug: "pdf-to-jpg", title: "PDF to JPG", shortTitle: "PDF to JPG", description: "Convert PDF pages to JPG online, choose the exact pages, and inspect a real image before exporting a clean numbered ZIP.", action: "Convert to JPG", accept: "application/pdf,.pdf", multiple: false, accent: "#ff9f1c", outcome: "JPGs packed in ZIP" },
  { slug: "jpg-to-pdf", title: "JPG to PDF", shortTitle: "JPG to PDF", description: "Turn JPG, PNG, or WebP photos into one ready-to-send PDF. Arrange, rotate, and preview the actual A4, Letter, or auto layout first.", action: "Create PDF", accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp", multiple: true, accent: "#008cff", outcome: "One ready-to-share PDF" },
  { slug: "rotate-pdf", title: "Rotate PDF", shortTitle: "Rotate", description: "Rotate PDF pages online to fix sideways scans, upside-down pages, and mixed orientations—without turning a clean document into screenshots.", action: "Create corrected PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#e0529c", outcome: "Corrected PDF" },
  { slug: "delete-pdf-pages", title: "Delete PDF Pages", shortTitle: "Delete pages", description: "Remove PDF pages online by looking at the actual document. Mark blanks, duplicates, or mistakes and review the clean final flow first.", action: "Create cleaned PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#e23d3d", outcome: "Cleaned PDF" },
  { slug: "extract-pdf-pages", title: "Extract PDF Pages", shortTitle: "Extract pages", description: "Extract PDF pages online, choose only what matters, and place them in a new order before saving one focused PDF.", action: "Create extracted PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#00a6a6", outcome: "Selected pages PDF" },
  { slug: "add-pdf-watermark", title: "Add Watermark to PDF", shortTitle: "Watermark", description: "Add a text watermark to PDF pages online. Style the words, placement, opacity, colour, and pattern on a real page before saving.", action: "Create watermarked PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#a855f7", outcome: "Watermarked PDF" },
  { slug: "protect-pdf", title: "Protect PDF", shortTitle: "Protect", description: "Password protect a PDF online with AES-256 encryption, confirm the result locally, and share the copy with more confidence.", action: "Protect PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#0f766e", outcome: "Encrypted PDF" },
  { slug: "unlock-pdf", title: "Unlock PDF", shortTitle: "Unlock", description: "Unlock a PDF online when you know the password and are authorised to use it—while keeping the supported document structure intact.", action: "Unlock PDF", accept: "application/pdf,.pdf", multiple: false, accent: "#2563eb", outcome: "Unlocked PDF" },
];

export function getPdfTool(slug: string) {
  return pdfTools.find((tool) => tool.slug === slug);
}
