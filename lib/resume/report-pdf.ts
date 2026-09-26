import { reportSections, type ResumeAnalysis } from "./analysis";

export type ReportInput = { analysis: ResumeAnalysis; candidateName: string; targetRole: string; roleFamily: string; yearsExperience: number; targetPackage: number };

export function normalizePdfText(text: string) {
  return text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[•·]/g, "-").replace(/\u00a0/g, " ");
}

export function needsUnicodePrint(text: string) {
  return /[^\x00-\x7f]/.test(normalizePdfText(text));
}

// The native print path handles non-Latin scripts with the browser's font shaping.
// This lightweight download path paginates every report section without clipping.
export function createResumeAtsPdf({ analysis, candidateName, targetRole }: ReportInput) {
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = 740;
  const safe = (value: string) => normalizePdfText(value).replace(/[^\x20-\x7e]/g, " ").replace(/[\\()]/g, "\\$&");
  const draw = (value: string, x: number, at: number, size = 10, bold = false, color = "0.2 0.25 0.33") => {
    commands.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg ${x} ${at} Td (${safe(value)}) Tj ET`);
  };
  const newPage = () => {
    commands = [];
    pages.push(commands);
    draw("KASA / RESUME REVIEW", 42, 798, 12, true, "0.08 0.24 0.56");
    draw(`Page ${pages.length}`, 502, 798, 9);
    commands.push("0.85 0.9 0.95 RG 42 782 m 553 782 l S");
    draw("getkasa.in/tools/resume-ats-checker", 42, 30, 9);
    y = 756;
  };
  const line = (value: string, bold = false, size = 10) => {
    if (y < 64) newPage();
    draw(value, 42, y, size, bold);
    y -= size + 6;
  };
  const paragraph = (value: string, bold = false, size = 10) => {
    // A conservative character limit also accommodates wide letters in Helvetica.
    const width = size > 12 ? 44 : 78;
    for (const paragraph of normalizePdfText(value).split(/\n/)) {
      const words = paragraph.match(new RegExp(`\\S{1,${width}}`, "g")) || [""];
      let current = "";
      for (const word of words) {
        if ((current + " " + word).trim().length > width) { line(current, bold, size); current = word; }
        else current = `${current} ${word}`.trim();
      }
      if (current) line(current, bold, size);
    }
  };
  newPage();
  paragraph(`${candidateName} - Resume report`, true, 18);
  paragraph(targetRole);
  paragraph(`ATS readiness: ${analysis.atsScore}/100`, true, 14);
  if (analysis.jobMatchScore != null) paragraph(`Job description match: ${analysis.jobMatchScore}/100`, true);
  y -= 10;
  for (const [title, items] of reportSections(analysis)) {
    if (y < 130) newPage();
    paragraph(title, true, 13);
    for (const item of items.length ? items : ["No specific findings in this review."]) {
      paragraph(item);
      y -= 5;
    }
    y -= 10;
  }
  const objects: string[] = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  const kids: string[] = [];
  for (const page of pages) {
    const id = objects.length + 1;
    kids.push(`${id} 0 R`);
    const stream = page.join("\n");
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${id + 1} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  }
  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
