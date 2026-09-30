import type { PdfToolSlug } from "@/lib/pdf-tools";

export type PdfToolGuide = {
  eyebrow: string;
  heading: string;
  intro: string[];
  stepsHeading: string;
  steps: Array<{ title: string; body: string }>;
  outputHeading: string;
  outputIntro: string;
  outputPoints: string[];
  note?: string;
  faqs: Array<{ question: string; answer: string }>;
  deepDive?: Array<{ heading: string; paragraphs: string[] }>;
};

export const pdfToolGuides: Record<PdfToolSlug, PdfToolGuide> = {
  "merge-pdf": {
    eyebrow: "Put scattered PDFs in order",
    heading: "One PDF, in exactly the order you want",
    intro: [
      "A proposal in one file, supporting documents in another, and a signed page sitting in your downloads folder - this is the common mess Merge PDF is built for. Add the files, arrange them once, and turn the whole set into a single document.",
      "The merge happens inside your browser. That matters when the files contain invoices, contracts, marksheets, IDs, or internal reports you would rather not send to an unknown processing server.",
    ],
    stepsHeading: "How to merge PDFs without mixing up the pages",
    steps: [
      { title: "Add every PDF", body: "Choose two or more PDF files. You can add another file later without starting the queue again." },
      { title: "Arrange the actual pages", body: "Every page appears as a preview with its source filename and original page number. Drag a preview into place, or use its left and right controls for smaller adjustments." },
      { title: "Merge and download", body: "Select Merge PDFs. The browser copies the pages into one document and prepares a fresh download." },
    ],
    outputHeading: "What you get after merging",
    outputIntro: "The result is one normal PDF named merged-document.pdf. Its pages follow the exact order shown in the preview workspace, and the original files on your device are not changed.",
    outputPoints: ["One PDF containing every selected page", "Original page sizes and orientations are retained", "No KASA watermark is added", "Source files remain untouched"],
    faqs: [
      { question: "Can I change the order before merging?", answer: "Yes. Move individual page previews—not just whole files. The large number on each card is that page’s final position in the merged PDF." },
      { question: "Will different page sizes cause a problem?", answer: "No. A4, Letter, landscape pages, and smaller receipts can live in the same merged PDF. Each page keeps its own dimensions." },
      { question: "Does merging reduce PDF quality?", answer: "No intentional image compression is applied during merging. Existing pages are copied into the new PDF rather than rendered as screenshots." },
      { question: "Can I merge a password-protected PDF?", answer: "Unlock it first with the Unlock PDF tool, then add the unlocked copy to the merge queue." },
    ],
    deepDive: [
      { heading: "When merging PDFs is the cleanest option", paragraphs: ["Merging PDFs is usually better than sending a folder of attachments when the recipient needs to read material in one sitting. Think of a job application with a resume, cover letter, and certificates; a client handover with a proposal and signed pages; or an institute submission with a cover sheet, marksheet, and supporting evidence. One ordered PDF makes the reading path obvious and avoids the common problem of a file being opened in the wrong sequence.", "The useful distinction is between joining files and organising a document. If the first page of one source needs to sit between pages from another source, a file-level queue is not enough. That is why this workspace lets you move individual page previews. Before creating the output, check the final page numbers, source labels, and orientation. A thirty-second review is often what prevents an incomplete application or a confusing client pack."] },
      { heading: "A practical order for professional submissions", paragraphs: ["For most formal packs, start with the page that explains what the reader is seeing: a cover letter, index, or short summary. Put the core document next, then supporting documents in the order they are mentioned. For scanned records, keep both sides of a document next to each other. For invoices or receipts, sort by date and make sure no blank separator page has accidentally slipped into the middle.", "Page size does not need to match. A4 applications, landscape charts, letter-sized documents, and small receipt scans can remain together in a PDF; each keeps its original dimensions. If a file has pages that need removal rather than rearranging, use Delete PDF Pages first. If you only need a few pages from a long document, Extract PDF Pages is the more focused route."] },
      { heading: "Before you share the combined file", paragraphs: ["Open the final preview and scroll through the transition points: where one source ends and the next begins. Check signatures, attachments, and page order rather than only the first page. Give the downloaded file a clear name such as `admission-documents-2026.pdf` or `client-handover-september.pdf`; vague names like `merged-document (4).pdf` cause unnecessary back-and-forth later.", "For sensitive material, merge first and then use Protect PDF to create a password-protected copy. If the file is too large for email, run Compress PDF after the merge and compare the reported result. These small finishing steps turn a loose set of PDFs into a document that is straightforward to send, archive, and reopen months later."] },
    ],
  },
  "split-pdf": {
    eyebrow: "Break a long PDF into useful parts",
    heading: "Split by chapter, section, or individual page",
    intro: [
      "You do not always need all 80 pages of a manual or the entire scanned register. Split PDF shows the real pages first, so you can separate chapters, attachments, certificates, or invoice batches without guessing page ranges.",
      "Choose Every page separately for one PDF per page, or Create sections and place a split directly after the pages where one document should end and the next should begin.",
    ],
    stepsHeading: "Choose sensible split points",
    steps: [
      { title: "Review the source pages", body: "Select one PDF and wait for its page previews. Each card shows the original page number, so a cover, chapter ending, or signed page is easy to recognise." },
      { title: "Choose the split points", body: "For sections, select Split after page wherever a new PDF should begin. Colors and Part labels update immediately to show which pages will stay together." },
      { title: "Download one organised ZIP", body: "The finished PDFs are named part-01, part-02, and so on, then packed into a ZIP so the browser only needs one download." },
    ],
    outputHeading: "What is inside the ZIP",
    outputIntro: "The Download plan shows every PDF before it is created, including its filename, page span, page count, and thumbnails. The same visible plan is used to build the ZIP.",
    outputPoints: ["One PDF per section or page", "Sequential filenames that sort correctly", "A single ZIP download", "No change to the original PDF"],
    faqs: [
      { question: "How do I split every page separately?", answer: "Choose Every page separately. The preview assigns each page its own Part number and the Download plan lists the PDFs you will receive." },
      { question: "How do I keep several pages together?", answer: "Choose Create sections, then add a split after the last page of each section. Pages between two split points remain together in one PDF." },
      { question: "Can I check the result before splitting?", answer: "Yes. Page cards use matching colors and Part labels, while the Download plan lists the exact page span and filename for every output PDF." },
      { question: "Are bookmarks copied into each split file?", answer: "Page content is retained, but document-level navigation such as bookmarks may not carry into newly created parts." },
    ],
    deepDive: [
      { heading: "Choose the split method based on the job", paragraphs: ["Splitting every page is useful for forms, certificates, answer sheets, and scans where each page needs its own destination. Section splitting is better when pages belong together: one chapter, one student's records, one invoice batch, or one signed agreement with its attachments. The point is not to create as many files as possible; it is to give each output a clear reason to exist.", "Look for natural boundaries before setting a break: a cover page, a new heading, a repeated name, a blank separator, or a signature page. The visual preview makes this less error-prone than typing page ranges from memory. If the source contains a mix of portrait and landscape pages, keep them together as they are; a split should change grouping, not the content itself."] },
      { heading: "Naming and handling the results", paragraphs: ["The generated files use sequence names so they sort in the same order as the original. That is especially helpful when you are splitting a long scan for upload to a portal with attachment limits. After downloading the ZIP, rename only the parts that need human-friendly labels, for example `chapter-1-introduction.pdf` or `student-04-record.pdf`. Keep the original source as an archive until you have checked every part.", "If you are preparing pages for a presentation or a messaging app, PDF to JPG may be more appropriate than splitting. If the goal is to keep only selected pages in one new document, use Extract PDF Pages instead. Choosing the right tool saves an extra round of downloading and recombining files later."] },
      { heading: "A quick quality check that catches mistakes", paragraphs: ["Before sharing the ZIP, open the first and last page of every section. Confirm that a section did not start one page too early or cut off a continuation page. This matters most with legal records, bank statements, exam material, and documents with a cover followed by several related pages.", "The split operation copies the page structure rather than taking screenshots, so the visual quality and page dimensions remain consistent. Still, the structure of the document may change: bookmarks and a document-wide table of contents may no longer make sense in a smaller part. If those navigation elements are important, add a clear file name and a short explanatory first page before sending the separated files."] },
    ],
  },
  "compress-pdf": {
    eyebrow: "Make scan-heavy PDFs easier to send",
    heading: "Make a PDF smaller without accidentally making it bigger",
    intro: [
      "Large scanned PDFs are often difficult to email, upload to a portal, or share on a slow connection. But a small text-based PDF may already be efficiently compressed, and blindly converting it into page images can make it much larger.",
      "KASA compares three options in your browser: the original file, a lossless structural optimisation, and a visual compression candidate. The smallest safe result wins, so a 37 KB source is never replaced by a 957 KB 'compressed' copy.",
    ],
    stepsHeading: "Compress without guessing",
    steps: [
      { title: "Review the real pages", body: "Choose one PDF and check its page previews. This catches the wrong upload and helps you judge whether fine print needs a higher-quality preset." },
      { title: "Choose your priority", body: "Use Strong for screen sharing, Balanced for everyday documents, or High quality when small text and diagrams need extra sharpness." },
      { title: "Check the verified result", body: "The result panel shows the exact before and after sizes, the percentage saved, and whether selectable text was preserved." },
    ],
    outputHeading: "What the compressed PDF contains",
    outputIntro: "You receive the smallest candidate that passed the size comparison. Lossless results retain the document structure; image-compressed results retain the visible page layout. If neither candidate is smaller enough, the original PDF is returned unchanged.",
    outputPoints: ["Output never larger than the uploaded PDF", "Same page count and order", "Exact before-and-after size report", "Original file remains unchanged"],
    note: "Image compression can flatten selectable text and form fields. The verified result clearly tells you when that method was selected.",
    faqs: [
      { question: "Can the compressed PDF become larger than my original?", answer: "No. The original file remains one of the candidates. A compressed candidate is selected only when it is genuinely smaller; otherwise the original bytes are kept." },
      { question: "Will the text remain selectable?", answer: "Lossless and already-optimised results keep selectable text. If image compression wins by a meaningful margin, pages are flattened and the result panel tells you before download." },
      { question: "Which preset should I choose?", answer: "Balanced is a sensible default. Choose Strong for scans meant for screens and High quality for diagrams, small type, or pages that may be printed." },
      { question: "Does compression remove pages?", answer: "No. Every candidate keeps the original page count and page order." },
    ],
    deepDive: [
      { heading: "Why some PDFs do not get much smaller", paragraphs: ["A PDF can be large for very different reasons. A 100-page text document may be small because text and vector lines take little space. A two-page scan may be huge because it contains high-resolution photographs of paper. Some PDFs have already been optimised by the software that made them, so another compression pass has little left to remove. That is normal, not a failed result.", "The risky approach is to rebuild every file as a low-quality image. It may reduce a large scan, but it can also make small text fuzzy and remove selectable text. This tool compares candidates and keeps the original when it is already the smallest safe result. That guard is useful for exactly the frustrating case where a 'compressed' download turns out larger than the source."] },
      { heading: "Pick a setting based on where the file is going", paragraphs: ["Use Strong when a scan is headed to a chat app, an email attachment, or a portal with a tight upload limit. Balanced is the sensible middle ground for ordinary reports and class notes. High quality is the better choice for diagrams, stamps, handwriting, architectural drawings, or documents people may print. The page previews help you judge whether a small line of text still needs extra detail.", "For an application, admit card, certificate, or official record, do not choose the smallest file blindly. Read the receiving portal's size limit, then aim comfortably below it while keeping names, numbers, QR codes, and signatures legible. If the result still exceeds the limit, remove unnecessary pages first or split the document into purposeful sections rather than pushing quality too far down."] },
      { heading: "What to check before uploading", paragraphs: ["Use the result panel as evidence, not just decoration. It tells you the original size, final size, percentage saved, and whether the output retained selectable text. Open the final PDF if it contains critical small details. If it looks correct, rename it clearly and upload that copy; keep the original untouched as your high-quality master.", "Compression works well after other document work. Merge relevant files first, then compress the combined result for sharing. If a document needs a watermark or password, usually finish the page edits first and protect the final version last. That workflow avoids compressing several temporary copies and makes it easier to know which file is the one you actually sent."] },
    ],
  },
  "pdf-to-jpg": {
    eyebrow: "Turn PDF pages into shareable images",
    heading: "See the JPG before you export it",
    intro: [
      "A PDF is not always convenient when a form, marketplace, presentation, design tool, or messaging app expects an image. This converter opens every page visually, lets you choose exactly which pages to export, and keeps the original page number in each filename.",
      "Resolution and JPG quality are separate controls. The live preview is a real generated JPG, so its sharpness, pixel dimensions, and estimated page size update before you create the ZIP.",
    ],
    stepsHeading: "From PDF to numbered JPGs",
    steps: [
      { title: "Review and select pages", body: "Every PDF page appears as a numbered preview. Include everything, clear the list, or choose only the pages you actually need." },
      { title: "Tune a real JPG preview", body: "Choose Web, Sharp, or Print resolution and adjust quality. The focused page regenerates automatically with its exact dimensions and estimated size." },
      { title: "Download one organised ZIP", body: "Selected pages are rendered as page-001.jpg, page-002.jpg, and so on. Original page numbers stay intact even when some pages are skipped." },
    ],
    outputHeading: "The JPG package",
    outputIntro: "The ZIP contains exactly the JPG files listed in the workspace. Every image uses the chosen resolution and quality, while zero-padded filenames keep the source document order obvious.",
    outputPoints: ["Only selected pages are exported", "Live JPG preview before conversion", "Original page numbers in filenames", "One convenient ZIP download"],
    faqs: [
      { question: "Can I convert only one page?", answer: "Yes. Clear the selection, include the one page you need, and the ZIP will contain only that page's JPG." },
      { question: "Why are the images delivered as a ZIP?", answer: "Browsers handle one download more reliably than dozens of separate downloads. The ZIP also keeps all pages together." },
      { question: "Will transparent areas stay transparent?", answer: "No. JPG does not support transparency; transparent areas are rendered against the page background." },
      { question: "Is the JPG suitable for printing?", answer: "Choose Print resolution and inspect the live pixel dimensions. Keep quality high when the page contains fine text, line art, or diagrams." },
    ],
  },
  "jpg-to-pdf": {
    eyebrow: "Photos in. Proper document out.",
    heading: "Turn loose photos and scans into one properly laid-out PDF",
    intro: [
      "This is useful when a form asks for one PDF but your documents are still sitting in the gallery as separate photos. Add photographed notes, receipts, certificates, artwork, or phone scans and review the actual page sequence before you save anything.",
      "Every thumbnail is a real PDF page in waiting. Drag it into position, turn a sideways photo, and click any page to inspect how it will sit on paper. The live page on the right changes with your settings, so A4, margins, and cropping never have to be a guess.",
    ],
    stepsHeading: "Build the document while you can still see it",
    steps: [
      { title: "Bring in the whole set", body: "Choose JPG, JPEG, PNG, or WebP images together. Each one appears with a page number, filename, dimensions, and preview." },
      { title: "Put every page right", body: "Drag previews into order, rotate sideways shots, remove mistakes, then choose Auto, A4, or Letter paper with the margin and fit you want." },
      { title: "Check the finished document", body: "Create the PDF, open its final preview on the same screen, and download only when the page flow looks right." },
    ],
    outputHeading: "Exactly what gets downloaded",
    outputIntro: "The download is one image-based file named images-to-pdf.pdf. Auto makes each page follow its image; A4 and Letter make a consistent document for printing or submission. Fit keeps the complete photo visible, while Fill uses the whole page and may trim the edges.",
    outputPoints: ["One numbered PDF page per image", "Drag order preserved exactly", "Per-image rotation applied", "Auto, A4, and Letter page layouts"],
    faqs: [
      { question: "Can I combine PNG, WebP, and JPG files in the same PDF?", answer: "Yes. Mix the supported image types in one workspace, arrange them visually, and they will be written into the same PDF in that exact order." },
      { question: "Will the tool crop my photos?", answer: "Fit never crops the image. Fill covers the available page and can trim an edge when the photo and paper have different shapes; the workspace warns you when Fill is selected." },
      { question: "Can I make an A4 PDF for an application or assignment?", answer: "Yes. Choose A4, then select portrait or landscape, a margin, and Fit. The live page preview shows the layout before the PDF is created." },
      { question: "Does the PDF contain searchable text?", answer: "No. The source is an image, so the PDF is image-based. OCR would be required to create a searchable text layer." },
    ],
  },
  "rotate-pdf": {
    eyebrow: "Fix the page, not the quality",
    heading: "Straighten sideways PDF pages while you can still see them",
    intro: [
      "Scanners and phone cameras often leave one page sideways while the rest of the document is fine. This workspace renders the complete PDF first, so you can spot the problem page and correct only that page instead of rotating everything blindly.",
      "Select several thumbnails for a bulk fix or use the left and right controls on one card. The preview turns immediately and unchanged pages remain untouched, making mixed portrait and landscape documents easy to check before download.",
    ],
    stepsHeading: "Correct orientation without guessing",
    steps: [
      { title: "Review every page", body: "Open the PDF and wait for its numbered page previews. Click a page to inspect the corrected orientation at a larger size." },
      { title: "Select only what is wrong", body: "Choose one page, a group, or the complete document, then rotate left, right, or 180 degrees. Each page can have a different correction." },
      { title: "Check the real output", body: "Create the corrected copy and open its final PDF preview on the same screen before downloading it." },
    ],
    outputHeading: "Only the orientation changes",
    outputIntro: "The result is a separate corrected PDF. KASA updates page rotation instead of rebuilding pages as screenshots, so selectable text, vector graphics, links, and the original page quality are preserved.",
    outputPoints: ["Different rotation for each page", "Unselected pages left unchanged", "Original text and vectors retained", "Final PDF preview before download"],
    faqs: [
      { question: "Can I rotate only one page in a PDF?", answer: "Yes. Use the left or right button on that page's preview. Every other page stays at its original orientation." },
      { question: "Can different pages use different rotations?", answer: "Yes. One page can turn left, another can turn right or 180 degrees, and pages that are already correct can remain unchanged." },
      { question: "Will rotating a PDF make the text blurry?", answer: "No. Rotation changes the PDF page orientation metadata; it does not flatten the document into lower-quality images." },
      { question: "How do I fix an upside-down scanned page?", answer: "Select the page and choose Turn 180°. The live preview will show it upright before you create the corrected PDF." },
    ],
  },
  "delete-pdf-pages": {
    eyebrow: "See it. Mark it. Remove it.",
    heading: "Delete the right PDF pages without guessing page numbers",
    intro: [
      "Blank scans, duplicate sheets, outdated terms, and accidental attachments are easy to miss when a tool only asks for a page-number range. KASA renders the complete document first, so you choose unwanted pages by looking at their actual content.",
      "Red previews are removed and green previews stay. Every kept page also shows its future output number, which makes it clear how the gaps will close before the cleaned PDF is created.",
    ],
    stepsHeading: "Clean the document visually",
    steps: [
      { title: "Review the real pages", body: "Open the PDF and wait for numbered previews of the entire document. Click any card to inspect it at a larger size." },
      { title: "Mark what should leave", body: "Click individual pages or use First, Last, Odd, Even, and Invert shortcuts. Click a red page again whenever you want to restore it." },
      { title: "Check the cleaned result", body: "Create the new PDF, inspect its final preview on the same screen, and download only after the remaining page flow looks right." },
    ],
    outputHeading: "A shorter PDF, with nothing else changed",
    outputIntro: "The result contains only the green pages in their original order. Pages are copied structurally instead of being converted into screenshots, and a safety check prevents an empty PDF from being created.",
    outputPoints: ["Visual keep/remove plan", "Automatic output renumbering", "Original page quality retained", "Final PDF preview before download"],
    faqs: [
      { question: "How do I delete one page from a PDF?", answer: "Open the PDF and click that page's preview. It turns red and is marked for removal; click it again if you change your mind." },
      { question: "Can I delete odd or even PDF pages together?", answer: "Yes. Use the Odd pages or Even pages shortcut, then visually review the red selection before creating the cleaned PDF." },
      { question: "What happens if I select every page?", answer: "The download button stays disabled and asks you to restore at least one page, because a valid PDF cannot contain zero pages." },
      { question: "Will deleting pages reduce PDF quality?", answer: "No. Kept pages are copied directly with their original dimensions, text, vectors, and quality. The original file also remains unchanged." },
    ],
  },
  "extract-pdf-pages": {
    eyebrow: "Pick pages, then shape the result",
    heading: "Extract the PDF pages you need in the order you want",
    intro: [
      "A long manual may contain one useful chapter; a statement may contain only three pages you need to send; a portfolio may need a different page order for one client. KASA renders the whole source first, so selection happens by looking at real page content instead of typing uncertain ranges.",
      "Add individual pages or start with All, Odd, Even, First, or Last. Selected pages enter a separate output list, where they can be dragged into a completely new order before the PDF is created.",
    ],
    stepsHeading: "Build a focused PDF visually",
    steps: [
      { title: "Inspect the source", body: "Open the PDF and review every numbered thumbnail. Click a thumbnail whenever you need a larger page preview." },
      { title: "Add and arrange pages", body: "Use the clear Add to PDF buttons, apply a useful quick selection, then drag selected pages in the output list to set the final order." },
      { title: "Review the actual result", body: "Create the extracted PDF and open its final preview on the same screen before downloading or sharing it." },
    ],
    outputHeading: "One focused PDF in your chosen order",
    outputIntro: "The result contains only the pages listed in the output panel, in exactly that order. Pages are copied structurally, so their dimensions, searchable text, links, vector graphics, and image quality stay intact.",
    outputPoints: ["Visual page selection", "Custom drag-and-drop output order", "Original text and quality retained", "Final PDF preview before download"],
    faqs: [
      { question: "Can I extract only one page from a PDF?", answer: "Yes. Click Add to PDF below that page, then create the extracted document. The output will contain exactly one page." },
      { question: "Can I change the order of extracted pages?", answer: "Yes. Drag pages inside the Output order list or use the up and down controls. The new PDF follows that list exactly." },
      { question: "Can I quickly extract odd or even pages?", answer: "Yes. Odd pages, Even pages, All pages, First page, Last page, and Invert shortcuts are available above the page previews." },
      { question: "Will extraction reduce quality or change my original PDF?", answer: "No. Selected pages are copied directly without rasterisation, and the original PDF remains unchanged on your device." },
    ],
  },
  "add-pdf-watermark": {
    eyebrow: "Mark drafts, samples, and controlled documents",
    heading: "Make the watermark fit the document—not fight it",
    intro: [
      "A good watermark is obvious without making the page difficult to read. Type a status such as DRAFT or CONFIDENTIAL, use a company name, or add a short reference number, then check it directly on a real page before changing the PDF.",
      "Choose one large mark, a straight label in a corner, or a repeated tiled pattern. Colour, weight, size, angle, opacity, placement, and page selection are all under your control—and every change appears in the live preview.",
    ],
    stepsHeading: "Create a watermark you can review before saving",
    steps: [
      { title: "Open the PDF and write the label", body: "Start with your own text or use a quick preset such as DRAFT, SAMPLE, PAID, or DO NOT COPY." },
      { title: "Style it on a real page", body: "Switch between diagonal, straight, and tiled layouts. Adjust colour, font weight, size, transparency, angle, and placement while watching the live preview." },
      { title: "Choose exactly which pages to mark", body: "Apply the watermark everywhere or target odd, even, first, last, or individually selected pages. Skipped pages are clearly labelled before processing." },
      { title: "Review the finished PDF", body: "Create the new copy, open its final PDF preview on the same screen, and download only when the result looks right." },
    ],
    outputHeading: "A marked copy without flattening the original pages",
    outputIntro: "The watermark is added as PDF text on the pages you selected. Existing text, links, images, vectors, and page dimensions remain intact, and the original file on your device is never changed.",
    outputPoints: ["Diagonal, straight, or tiled layouts", "Live page-level preview", "Custom page selection and placement", "Original PDF content and quality retained"],
    note: "A watermark discourages casual reuse, but it is not the same as encryption or digital rights management. Use Protect PDF when the file must require a password to open.",
    faqs: [
      { question: "Can I use my company name as the watermark?", answer: "Yes. Enter any short text up to the field limit, including a company name, status, or reference number." },
      { question: "Can I watermark only certain pages?", answer: "Yes. Apply it to all, odd, even, first, or last pages, or click individual page thumbnails to include or skip them." },
      { question: "Will the watermark cover the document?", answer: "You decide. Lower the opacity, reduce the size, move a single mark to a corner, or use a lighter colour. The live preview shows the balance before the PDF is changed." },
      { question: "Can I repeat the watermark across each page?", answer: "Yes. Choose the Tiled pattern to repeat the text across the page, then adjust its angle, size, colour, and opacity." },
      { question: "Can I add a logo watermark?", answer: "This version supports text watermarks. Logo or image watermarks are not added by this workflow." },
      { question: "Is the watermark removable?", answer: "It is written into the new PDF's page content, but no watermark should be treated as tamper-proof security." },
    ],
  },
  "protect-pdf": {
    eyebrow: "Require a password before a PDF opens",
    heading: "Protect sensitive PDFs with AES-256 encryption",
    intro: [
      "Password protection is useful when a PDF contains a statement, client document, internal report, certificate, or personal record that should not open for anyone who receives the file by mistake.",
      "Protection happens locally with AES-256 encryption. The password is used in your browser to create the encrypted copy; KASA does not receive the document or store the password.",
    ],
    stepsHeading: "Lock the document safely",
    steps: [
      { title: "Choose the PDF", body: "Select the file you want to protect." },
      { title: "Create a strong password", body: "Use a password that is hard to guess and different from your email or account passwords." },
      { title: "Protect and download", body: "The encrypted copy is created locally. Open it once in a PDF reader to confirm the password before sharing it." },
    ],
    outputHeading: "Your protected copy",
    outputIntro: "The downloaded PDF asks for the password before showing its contents in compatible modern readers. The source PDF remains unprotected and unchanged on your device.",
    outputPoints: ["AES-256 encrypted PDF", "Password required to open", "Original PDF kept separately", "No password transmitted to KASA"],
    note: "Keep the password somewhere safe. This tool cannot recover a forgotten password, and sending the password in the same message as the PDF defeats much of the protection.",
    faqs: [
      { question: "What encryption does this tool use?", answer: "It creates an AES-256 protected PDF, a modern encryption option supported by current PDF readers." },
      { question: "Can KASA recover my password?", answer: "No. The password is not sent to KASA, so there is no server-side recovery copy." },
      { question: "How should I share the password?", answer: "Use a different channel from the one used for the PDF - for example, send the file by email and the password by phone or a secure message." },
      { question: "Does the original file become protected too?", answer: "No. A new protected copy is downloaded; your original remains as it was." },
    ],
  },
  "unlock-pdf": {
    eyebrow: "Remove a password you already know",
    heading: "Create a PDF that opens without repeated prompts",
    intro: [
      "Unlock PDF is for documents you are authorised to access and whose password you know. It is useful when a statement, report, or archived document asks for the same password every time you open it or needs to enter a workflow that cannot handle protected files.",
      "The tool supports AES-256 and older RC4-protected PDFs. Decryption takes place in the browser, preserving the original text, forms, and page quality rather than rebuilding pages as screenshots.",
    ],
    stepsHeading: "Remove protection from your copy",
    steps: [
      { title: "Choose the protected PDF", body: "Select a file you own or have permission to unlock." },
      { title: "Enter its current password", body: "The password is used locally to decrypt the document. It is not submitted to a server." },
      { title: "Download the unlocked PDF", body: "A new unprotected copy is created while the original protected file remains unchanged." },
    ],
    outputHeading: "What is preserved",
    outputIntro: "The unlocked copy keeps the document structure, selectable text, page quality, and supported forms. It opens without the previous password prompt.",
    outputPoints: ["Password prompt removed", "Selectable text retained", "Original page quality preserved", "Protected source file left untouched"],
    note: "Only unlock documents you own or are permitted to modify. This tool does not guess passwords or bypass protection when the password is unknown.",
    faqs: [
      { question: "Can this tool find a forgotten PDF password?", answer: "No. You must provide the correct current password. It does not crack, guess, or recover passwords." },
      { question: "Which protected PDFs are supported?", answer: "The local decryptor supports AES-256 and RC4 encryption. Some AES-128 PDFs may not be supported yet." },
      { question: "Will unlocking flatten the PDF?", answer: "No. For supported encryption types, the original text and document structure are preserved." },
      { question: "Is my password uploaded anywhere?", answer: "No. Decryption runs in your browser and the password is not sent to KASA." },
    ],
  },
};

const additionalPdfToolFaqs: Record<PdfToolSlug, PdfToolGuide["faqs"]> = {
  "merge-pdf": [
    { question: "How many PDFs can I merge at once?", answer: "Add as many files as your browser can comfortably handle. For a large batch, work in logical groups and check the page preview before creating the final document." },
    { question: "Can I merge only selected pages from each PDF?", answer: "Yes. The workspace works at page level, so you can arrange only the page previews you want in the final file." },
    { question: "Can I add another PDF after arranging the first ones?", answer: "Yes. Add it to the same workspace, then drag its pages to their intended positions before merging." },
    { question: "Will links and forms survive after merging?", answer: "The tool copies PDF pages structurally, which preserves normal page content. Check the finished file if a specific interactive form or link is important to your workflow." },
    { question: "Can I merge portrait and landscape pages together?", answer: "Yes. Each page keeps its own orientation, so a landscape table can sit naturally between portrait pages." },
    { question: "What should I do if the merged file is too large to email?", answer: "Merge first, review the single document, then use Compress PDF on that final copy. This is usually cleaner than compressing every source separately." },
  ],
  "split-pdf": [
    { question: "Can I split a PDF into two files only?", answer: "Yes. Use Create sections and place one split after the page where the first document should end." },
    { question: "How are split files named?", answer: "They use ordered part names such as part-01 and part-02, so the files stay in the right sequence after you download the ZIP." },
    { question: "Can I split a scanned PDF?", answer: "Yes. The previews make scans especially easy to split because you can identify covers, names, and separator sheets visually." },
    { question: "Does splitting change the original file?", answer: "No. It creates new PDF parts and leaves the source document as it was." },
    { question: "Why does the tool download a ZIP instead of individual PDFs?", answer: "A ZIP keeps all generated parts together and avoids a browser download prompt for every section." },
    { question: "Should I split or extract pages?", answer: "Split when you want every source page distributed into separate files. Extract when you only need selected pages in one new, curated PDF." },
  ],
  "compress-pdf": [
    { question: "What kind of PDF benefits most from compression?", answer: "Photo-heavy scans, image-based certificates, and documents produced by a scanner usually have the most room to shrink. A text-only PDF may already be small." },
    { question: "Can I use Compress PDF for an online application?", answer: "Yes. Check the portal limit first, then inspect names, QR codes, signatures, and fine print in the finished preview before uploading." },
    { question: "Does compression change page dimensions?", answer: "No. The output keeps the original page count and layout. Only the file data is optimised or, when chosen, the page imagery is compressed." },
    { question: "Why did my PDF size stay almost the same?", answer: "The source may already be efficiently encoded. Returning a nearly identical file is safer than creating a blurrier or larger replacement." },
    { question: "Can I compress a password-protected PDF?", answer: "Unlock an authorised copy first, compress that copy, then protect the final version again if it still needs a password." },
    { question: "Is High quality always the best option?", answer: "It is best for small print and detailed visuals, but Balanced is often the better trade-off for ordinary sharing. Choose based on where the document will be read." },
  ],
  "pdf-to-jpg": [
    { question: "Can I choose JPG quality before conversion?", answer: "Yes. Use the quality control together with the resolution preset, then inspect the live JPG preview before exporting." },
    { question: "What is the difference between Web, Sharp, and Print?", answer: "Web prioritises smaller sharing images, Sharp is suited to most documents, and Print gives more pixels for detailed output or physical printing." },
    { question: "Do exported JPG names keep the original PDF page number?", answer: "Yes. If you skip a page, the filename still reflects its source page number so the images remain traceable." },
    { question: "Can I use PDF to JPG for a resume?", answer: "Only if a platform specifically asks for an image. For most job applications, keep a text PDF because ATS software can read it more reliably." },
    { question: "Will text in the JPG be selectable?", answer: "No. A JPG is a flat image, so it does not preserve a selectable text layer from the PDF." },
    { question: "Can I turn the JPGs back into a PDF later?", answer: "Yes, use JPG to PDF to arrange the images into a new document. Keep the original PDF if you need the best text and vector quality." },
  ],
  "jpg-to-pdf": [
    { question: "Can I add photos in a different order from my gallery?", answer: "Yes. Drag the image cards into the exact reading order you need before generating the PDF." },
    { question: "What is the difference between Fit and Fill?", answer: "Fit keeps the entire image inside the page. Fill uses more of the paper but may crop an edge when image and page shapes differ." },
    { question: "Can I mix portrait and landscape images?", answer: "Yes. Use Auto for flexible page sizing, or review each image carefully when choosing a consistent A4 or Letter layout." },
    { question: "Why does my PDF not have searchable text?", answer: "Photos are placed as images, so their visible words do not automatically become a searchable text layer. OCR is needed for that." },
    { question: "Can I make a PDF from receipt photos?", answer: "Yes. Add the images, place them in date or expense order, and choose a layout that keeps every receipt edge visible." },
    { question: "How do I make the image PDF smaller afterward?", answer: "Create and review the PDF first, then use Compress PDF on the completed copy if it is too large for the destination." },
  ],
  "rotate-pdf": [
    { question: "Can I rotate several PDF pages together?", answer: "Yes. Select the pages that need the same correction and apply left, right, or 180-degree rotation to that group." },
    { question: "What is the difference between turning left and turning right?", answer: "Left rotates the selected page 90 degrees counter-clockwise; right rotates it 90 degrees clockwise. The preview makes the result immediately clear." },
    { question: "Can I rotate a landscape page and keep it landscape?", answer: "Yes. Rotate only if it opens the wrong way. A correctly oriented landscape page can remain landscape in the final PDF." },
    { question: "Does rotation affect PDF file size?", answer: "Usually very little. Rotation updates how the page is displayed rather than rebuilding it as a new image." },
    { question: "Can I undo a rotation before download?", answer: "Yes. Use the page controls again until the preview is back at the orientation you want." },
    { question: "Should I rotate before or after compressing a PDF?", answer: "Rotate first so you can inspect a clean, correct master. Compress afterward only if the final file needs to be smaller." },
  ],
  "delete-pdf-pages": [
    { question: "Can I remove a blank page from a PDF?", answer: "Yes. Find the blank page in the visual grid, click it to mark it red, then create the cleaned copy." },
    { question: "Can I restore a page after marking it for deletion?", answer: "Yes. Click the red page again before processing and it returns to the kept set." },
    { question: "Will the remaining PDF pages be renumbered?", answer: "The output page sequence closes the gaps automatically. The original source page labels remain visible in the workspace while you review." },
    { question: "Can I delete duplicate scanned pages?", answer: "Yes. Compare their visible thumbnails, mark the unwanted duplicate, and confirm the kept pages in the final preview." },
    { question: "Can I delete pages from a password-protected PDF?", answer: "Create an authorised unlocked copy first. Once the edits are complete, you can protect the cleaned PDF again." },
    { question: "When should I use Extract PDF Pages instead?", answer: "Use Extract when you want to build a small new document from selected pages or change their order. Delete is better for cleaning an otherwise complete file." },
  ],
  "extract-pdf-pages": [
    { question: "Can I extract several non-consecutive PDF pages?", answer: "Yes. Add any individual pages you need, even if they are far apart in the source, then arrange the output list." },
    { question: "Can I put extracted pages in a new order?", answer: "Yes. Drag the selected pages in the Output order panel or use its move controls before creating the PDF." },
    { question: "What is the difference between extraction and deletion?", answer: "Extraction starts a new PDF with only the pages you choose. Deletion keeps most of the original document and removes a few pages." },
    { question: "Can I extract pages from a scanned document?", answer: "Yes. The full thumbnail view is useful for scans because you select pages by their actual visual content." },
    { question: "Does an extracted PDF keep hyperlinks and selectable text?", answer: "Selected pages are copied structurally, so normal page-level text, links, vectors, and image quality are retained." },
    { question: "Can I extract the first and last page quickly?", answer: "Yes. Use the quick selection controls as a starting point, then adjust the chosen pages if needed." },
  ],
  "add-pdf-watermark": [
    { question: "Can I change the watermark colour?", answer: "Yes. Choose a colour that has enough contrast to be seen without overpowering the document; the live preview shows the result." },
    { question: "Can I change watermark opacity?", answer: "Yes. Reduce opacity for a subtle draft mark or raise it when the label must remain obvious in screenshots and printouts." },
    { question: "Can I put a watermark in a corner?", answer: "Yes. Choose a straight watermark and use the placement control to position it away from the main document content." },
    { question: "Can I use DRAFT, CONFIDENTIAL, or SAMPLE as a preset?", answer: "Yes. The quick presets are editable, so you can start with a common label and change it to suit the document." },
    { question: "Does watermarking change the original PDF?", answer: "No. The tool creates a separate marked copy and leaves your source file unchanged." },
    { question: "Should I watermark before protecting a PDF?", answer: "Usually yes. Finish visible edits such as watermarks first, review the final file, and add password protection as the last step." },
  ],
  "protect-pdf": [
    { question: "Can I protect a PDF with a password for free?", answer: "Yes. This workflow creates a new AES-256 encrypted copy locally in your browser without requiring an account." },
    { question: "Will the protected PDF open on phones?", answer: "Most modern PDF readers on phones and computers support password-protected PDFs. Test the file in the reader your recipient is likely to use." },
    { question: "Can I change the password later?", answer: "Create a new protected copy with the new password. The old protected file retains the password it was created with." },
    { question: "What happens if I forget the password?", answer: "KASA cannot recover it because the password is not stored or uploaded. Keep it in a password manager or another secure record." },
    { question: "Can I add a password after merging or editing a PDF?", answer: "Yes. Complete merge, deletion, extraction, rotation, compression, and watermarking first, then protect the final document." },
    { question: "Is a password-protected PDF the same as a watermark?", answer: "No. A password controls opening access, while a watermark visibly labels the document. They can be used together for different purposes." },
  ],
  "unlock-pdf": [
    { question: "Do I need the current password to unlock a PDF?", answer: "Yes. The correct current password is required to create an authorised unlocked copy." },
    { question: "Can I unlock a PDF I received by email?", answer: "Yes, if you have permission to modify it and know the password supplied by its owner or sender." },
    { question: "Does Unlock PDF change my original protected file?", answer: "No. It creates a separate copy that opens without the existing password; the protected source stays intact." },
    { question: "Can I protect the file again after unlocking it?", answer: "Yes. Use Protect PDF on the edited or unlocked copy and set a password appropriate to its next destination." },
    { question: "Why might an authorised PDF fail to unlock?", answer: "The password may be incorrect, the document may use an unsupported encryption method, or the file may be damaged. Confirm the password in a normal PDF reader first." },
    { question: "When should I keep the original protected copy?", answer: "Keep it whenever it is the official archive or contains sensitive information. Treat the unlocked version as a purpose-specific working copy." },
  ],
};

for (const [slug, faqs] of Object.entries(additionalPdfToolFaqs) as Array<[PdfToolSlug, PdfToolGuide["faqs"]]>) {
  pdfToolGuides[slug].faqs.push(...faqs);
}

export const pdfToolDeepDives: Record<PdfToolSlug, Array<{ heading: string; paragraphs: string[] }>> = {
  "merge-pdf": pdfToolGuides["merge-pdf"].deepDive ?? [],
  "split-pdf": pdfToolGuides["split-pdf"].deepDive ?? [],
  "compress-pdf": pdfToolGuides["compress-pdf"].deepDive ?? [],
  "pdf-to-jpg": [
    { heading: "Choose images, not a pile of exports", paragraphs: ["PDF to JPG is useful when a portal, slide deck, marketplace, or chat needs an image rather than a document. Select only the pages that will be used. A cover, one chart, or a signed page is often all you need, and keeping the original page number in the filename makes the result easy to trace back later.", "Resolution controls pixel detail while JPG quality controls compression. Check a small detail in the live preview - a signature, QR code, or diagram label - before exporting every selected page. Web is usually enough for quick sharing; Sharp suits most work documents; Print is worth choosing when the image will be enlarged or printed."] },
    { heading: "Keep the next step simple", paragraphs: ["The ZIP download keeps numbered images together instead of opening a separate download prompt for every page. Leave the zero-padded names in place if the files must stay in source order. If the pages need to remain a document rather than become images, Extract PDF Pages preserves the PDF structure and is the better choice.", "For a resume or application, avoid converting a text PDF to an image unless the receiving site specifically asks for it. A text PDF remains easier for ATS systems to read. The KASA Resume Builder and ATS Checker are better companions when the goal is a strong application rather than an image attachment."] },
    { heading: "Organise the downloaded ZIP", paragraphs: ["Open the ZIP into a clearly named folder before attaching anything. The exported names retain their source-page numbers, which is especially helpful when a reviewer asks for page 4 or when a diagram has to be placed back into a presentation later. Rename only the final images you intend to send, not every export by habit.", "Keep the PDF alongside the JPGs until the job is finished. The PDF remains the best source if you later need higher detail, selectable text, or an extra page. A clean pair of files is easier to revisit than trying to reconstruct a document from scattered image attachments."] },
  ],
  "jpg-to-pdf": [
    { heading: "Make phone images feel like one document", paragraphs: ["JPG to PDF is for the everyday situation where a form, certificate, receipt, or handwritten assignment exists as separate photos. A single, ordered PDF is simpler to upload and much easier for the recipient to archive. Add the full set first, then organise the real thumbnails instead of trusting the accidental order from a phone gallery.", "Rotate sideways shots before deciding page size. Auto works well when photos have mixed shapes. A4 is the familiar option for job, school, and office submissions. Fit keeps every edge visible; Fill creates a fuller page but can trim an edge, so it is best used only after checking the live preview."] },
    { heading: "Finish it like a formal submission", paragraphs: ["Use a clear filename that describes the contents, not a camera name such as IMG_6284. Keep related pages together and avoid adding a decorative cover unless the recipient needs one. A photo-based PDF is not automatically searchable, so use a text PDF wherever the receiving system needs to read the words inside it.", "If the final photo PDF is too large for a portal, compress it after arranging the pages. For a polished employment document, make the resume in the Resume Builder instead; photographing a printout can introduce shadows, skew, and a less reliable ATS result."] },
    { heading: "Make the file easy to receive", paragraphs: ["Before uploading, open the finished PDF on a normal viewer and check the page count, order, and margins once from beginning to end. This catches a missing reverse side, a duplicate photograph, or an image that looks fine as a thumbnail but is too dark at full size.", "Use a filename a person can understand at a glance, such as `rental-agreement-supporting-pages.pdf` or `semester-notes.pdf`. If a portal has a size limit, run the final copy through Compress PDF after this review rather than trying to shrink each original image separately."] },
  ],
  "rotate-pdf": [
    { heading: "Fix the page that is actually wrong", paragraphs: ["A scanner commonly misreads one sheet while the rest of a PDF is already correct. Rotating the whole document to fix a single mistake simply creates new ones. Review the thumbnails and use page-level rotation for mixed scans, landscape tables, and files that combine portraits with sideways diagrams.", "Check orientation using more than the text direction. A logo, signature, stamp, or table heading quickly shows whether a page is upside down. The tool changes PDF rotation structurally, so it does not blur text or turn a clean document into page screenshots."] },
    { heading: "Check the reading flow after correcting it", paragraphs: ["Scroll through the completed PDF as a recipient would. Portrait pages should read naturally, while a landscape chart can remain landscape as long as it opens right-side up. Use a filename such as `orientation-corrected-report.pdf` so nobody mistakes it for the original scan.", "If the corrected document is intended for an application or a client, keep the original until you open the final copy in a standard PDF reader. Compress the corrected version only afterward if its file size is an issue; that gives you one clean master to review and one smaller copy to share."] },
    { heading: "Avoid repeating the same correction", paragraphs: ["If several scans from the same device arrive sideways, rotate the affected thumbnails together after confirming they share the same orientation. For mixed documents, page-by-page review remains safer than a blanket action. It only takes a moment to spot a landscape table that should not be forced upright.", "Save the repaired copy separately from the scan. That preserves a traceable source if anyone later asks what changed, while giving colleagues and recipients a version that reads comfortably on a phone, laptop, or printed page."] },
  ],
  "delete-pdf-pages": [
    { heading: "Removal is not the same as extraction", paragraphs: ["Delete PDF Pages is best when the document should mostly stay intact but has blanks, duplicates, outdated terms, accidental scans, or an unwanted attachment. The keep/remove view is safer than typing a range because you see exactly what will disappear and how the remaining pages close their numbering gap.", "Do a fast visual scan before marking anything. A page that looks blank may have a signature on the reverse, a faint stamp, or a continuation of a table. The quick Odd, Even, First, and Last controls are useful for common clean-up tasks, but the red preview state gives you a chance to catch an over-broad selection."] },
    { heading: "Keep a traceable clean copy", paragraphs: ["After removal, inspect where the deleted pages used to sit. Check that headings still make sense and that a numbered section has not lost a critical page. The output copies the kept pages directly, preserving their original text, links, vectors, and quality rather than flattening them.", "Name the result for its purpose, such as `proposal-without-appendix.pdf`. If you need only a few pages from a much larger PDF and want to create a new order, use Extract PDF Pages. Deletion keeps the original sequence; extraction gives you a separate, deliberately curated document."] },
    { heading: "Do a final handoff check", paragraphs: ["Open the cleaned PDF as though you had never seen the original. Check page numbering, table of contents references, and attachments mentioned in the text. Removing a cover, terms page, or appendix can make a document more focused, but it should not leave a reader wondering whether something is missing.", "Keep the unedited source until the recipient confirms the file is complete. The original acts as a dependable backup, while the cleaned version stays purpose-built for sharing, uploading, or printing."] },
  ],
  "extract-pdf-pages": [
    { heading: "Build a smaller document with a clear purpose", paragraphs: ["Extract PDF Pages is ideal when only one chapter, a handful of bank-statement pages, selected portfolio samples, or a few records need to be sent. Unlike deletion, extraction starts with a blank output and lets you add only the pages that matter. The output list can also be reordered, which is useful when a new reader needs a different narrative from the source file.", "Use the quick choices to make a starting selection, then review every thumbnail. Page content matters more than page numbers: a signed page, a continuation sheet, or a cover may need to travel with the page you initially selected. The live output plan makes the final order visible before the new PDF is created."] },
    { heading: "Preserve quality while reducing clutter", paragraphs: ["Selected pages are copied as PDF pages, so searchable text, vectors, links, and original dimensions remain intact. This is a better choice than converting pages into images when the recipient needs a proper document. It also creates a focused attachment that is easier to email and less confusing to review.", "For a confidential excerpt, extract first and protect the smaller copy afterward. For a visual asset needed in a slide or upload form, extract the relevant page and then use PDF to JPG. Those workflows keep each file doing one clear job instead of creating a large, messy collection of duplicates."] },
    { heading: "Give the excerpt a useful name", paragraphs: ["An extracted PDF should explain itself before it is opened. Include the topic and, where helpful, the original date or section in the filename: `insurance-policy-claim-pages.pdf` is clearer than `extract-final.pdf`. A one-line message explaining what the recipient will find is just as useful.", "Open the new file once before sending it. Verify that the first page introduces the selection well enough and that no required continuation page was left behind. If the sequence is not telling the right story, drag the output cards into a clearer order and review again."] },
  ],
  "add-pdf-watermark": [
    { heading: "Use a watermark as a signal, not a disguise", paragraphs: ["A watermark is most helpful when it communicates status: DRAFT, CONFIDENTIAL, SAMPLE, PAID, or an organisation name. It should be clear enough to survive a screenshot without making the actual page unpleasant to read. The live preview lets you balance colour, opacity, size, and placement on a real page rather than relying on a generic setting.", "A large diagonal mark works for a simple status label. A small straight mark in a corner suits internal documents that still need to be readable. A tiled pattern is stronger for samples that may be shared widely. Select the exact pages to mark; a cover or an appendix sometimes needs a different treatment from the body of a document."] },
    { heading: "Watermarking is not access control", paragraphs: ["The text watermark is written into the new PDF without flattening the existing page content. Your source file stays unchanged, and text, links, vectors, and images remain in the resulting copy. Review the final PDF before sending it, especially when it contains small text or a busy page design.", "A watermark can discourage casual reuse, but it cannot replace a password or formal rights management. Use Protect PDF when access itself needs to be controlled. For course notes, paid resources, and certificates, link the document workflow back to your course-selling and certificate processes instead of relying on a watermark as the only safeguard."] },
    { heading: "Preview it at the size people will use", paragraphs: ["A watermark that looks subtle on a large monitor can become too strong on a phone or in a printed handout. Check one dense page, one mostly blank page, and any page that includes a signature or chart. Lower opacity before reducing text size if the label needs to remain visible without competing with the document.", "Create a fresh watermarked copy for each purpose instead of trying to reuse one version everywhere. A client preview, an internal draft, and a paid sample often need different wording and placement. Your untouched original then remains ready for the next version."] },
  ],
  "protect-pdf": [
    { heading: "Protect the right copy with the right password", paragraphs: ["Password protection is useful for a statement, internal report, client file, certificate, or document that should not open for anyone who receives it by accident. The best moment to protect a PDF is after its pages, order, and watermark are final. That leaves one original working copy and one controlled sharing copy, rather than several confusing password versions.", "Choose a password that is not reused from email, banking, or another account. The strength indicator is a prompt to use length and variety, not a promise that any short password is safe. Store it in a password manager or another secure place, because KASA does not receive it and cannot retrieve it later."] },
    { heading: "Share the file and password separately", paragraphs: ["Sending the protected PDF and its password in the same email reduces most of the benefit. A more practical approach is to send the document by email and the password through a call, secure message, or a separate agreed channel. Tell the recipient which PDF reader to use if their normal viewer does not support encrypted PDFs.", "The tool creates a new AES-256 protected file locally; the original stays where it was. Before sharing a sensitive copy, open the finished PDF once and verify that the password prompt appears and the password works. If the document needs only a visible status rather than access control, Add Watermark to PDF may be a more appropriate first step."] },
    { heading: "Keep the handoff manageable", paragraphs: ["Tell the recipient what the password protects and how you will send it. That simple context prevents them from assuming the attachment is broken or unsafe. For time-sensitive paperwork, verify that the recipient can open the encrypted file before deleting your working copy or moving on to the next task.", "If access needs to be revoked later, create a new protected copy with a new password rather than assuming an old password can be taken back. Encryption protects the file in front of you; thoughtful sharing protects the workflow around it."] },
  ],
  "unlock-pdf": [
    { heading: "Unlocking is for authorised, known-password work", paragraphs: ["Unlock PDF is useful when you own a protected document, know its current password, and need a copy that can move through a system that does not accept encrypted files. Common examples include uploading an account statement to a portal, adding a known document to a workflow, or saving an archive that no longer needs to ask for the same password every time.", "It is not a password recovery or password-breaking service. The current password is required, and the action should be limited to files you are authorised to modify. This distinction keeps the feature useful for normal document work while respecting privacy, ownership, and the security choices made by the file creator."] },
    { heading: "Check where the unlocked copy will live", paragraphs: ["The unlocked PDF preserves the supported document structure, text, forms, links, and page quality. That makes it practical for legitimate workflows, but it also means the resulting file should be stored and shared carefully. Do not leave an unlocked bank statement or personal record in a shared folder simply because the password prompt is gone.", "Keep the original protected PDF as an archive, and give the unlocked copy a purpose-specific name. If you need to share it again, consider whether it should be protected with a new password or sent through a secure channel. For a page-level edit before sharing, remove or extract pages first, then unlock or protect only the final copy."] },
    { heading: "Close the loop after the task", paragraphs: ["Once the upload, print, or approved workflow is complete, decide whether the unlocked copy still needs to exist. Removing an unneeded copy from a shared workspace is often safer than accumulating sensitive documents that anyone with folder access can open.", "When the document will be reused, keep a clear distinction between the original protected archive and the purpose-specific unlocked version. That habit prevents accidental sharing of the wrong file and makes future document updates far easier to manage."] },
  ],
};
