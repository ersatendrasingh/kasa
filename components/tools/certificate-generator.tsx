"use client";

import { useMemo, useState } from "react";
import { Award, CheckCircle2, Copy, Download, ImagePlus, Printer, RotateCcw, X } from "lucide-react";

const certificateTypes = [
  "Course Completion",
  "Participation",
  "Achievement",
  "Workshop Completion",
  "Training Completion",
] as const;

const templates = [
  { key: "classic", label: "Classic Blue", accent: "#163d8f", soft: "#eef7ff", gold: "#d9a441" },
  { key: "emerald", label: "Emerald Gold", accent: "#138a5b", soft: "#effaf4", gold: "#d6a23a" },
  { key: "royal", label: "Royal Purple", accent: "#5b3fb8", soft: "#f5f1ff", gold: "#c99a2e" },
] as const;

const backgroundPatterns = [
  { key: "ornamental", label: "Ornamental" },
  { key: "ribbon", label: "Ribbon" },
  { key: "minimal", label: "Minimal" },
  { key: "crest", label: "Crest" },
] as const;

const borderStyles = [
  { key: "double", label: "Double border" },
  { key: "gold", label: "Gold frame" },
  { key: "modern", label: "Modern lines" },
] as const;

const optionalDetails = [
  { key: "grade", label: "Grade / score" },
  { key: "duration", label: "Course duration" },
  { key: "certificateId", label: "Certificate ID" },
  { key: "verification", label: "Verification note" },
] as const;

const formatDisplayDate = (value: string) => {
  if (!value) return "Select date";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapWords(value: string, maxLength: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function asciiBytes(value: string) {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function concatBytes(chunks: Uint8Array[]) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

function jpegDataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function buildPdfFromJpeg(imageBytes: Uint8Array, imageWidth: number, imageHeight: number) {
  const pageWidth = 842;
  const pageHeight = 595;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length 40 >>\nstream\nq ${pageWidth} 0 0 ${pageHeight} 0 0 cm /Im0 Do Q\nendstream`,
  ];
  const chunks: Uint8Array[] = [asciiBytes("%PDF-1.3\n")];
  const offsets: number[] = [0];
  let cursor = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(cursor);
    const chunk = asciiBytes(`${index + 1} 0 obj\n${object}\nendobj\n`);
    chunks.push(chunk);
    cursor += chunk.length;
  });

  offsets.push(cursor);
  const imageHeader = asciiBytes(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`);
  const imageFooter = asciiBytes("\nendstream\nendobj\n");
  chunks.push(imageHeader, imageBytes, imageFooter);
  cursor += imageHeader.length + imageBytes.length + imageFooter.length;

  const xrefStart = cursor;
  const xrefRows = offsets.map((offset, index) => (index === 0 ? "0000000000 65535 f " : `${String(offset).padStart(10, "0")} 00000 n `));
  const trailer = asciiBytes(`xref\n0 6\n${xrefRows.join("\n")}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
  chunks.push(trailer);
  return new Blob([concatBytes(chunks)], { type: "application/pdf" });
}

function patternBackground(pattern: string, accent: string, soft: string, gold: string) {
  if (pattern === "ribbon") {
    return `linear-gradient(135deg, ${soft} 0 18%, transparent 18% 82%, ${soft} 82% 100%), radial-gradient(circle at 18% 20%, ${accent}16, transparent 18rem), radial-gradient(circle at 84% 76%, ${gold}26, transparent 16rem), #ffffff`;
  }
  if (pattern === "minimal") {
    return `linear-gradient(180deg, #ffffff 0%, ${soft} 100%)`;
  }
  if (pattern === "crest") {
    return `radial-gradient(circle at 50% 42%, ${accent}12 0 12rem, transparent 12.2rem), radial-gradient(circle at 8% 10%, ${gold}22, transparent 10rem), radial-gradient(circle at 92% 90%, ${accent}18, transparent 11rem), #ffffff`;
  }
  return `radial-gradient(circle at 0% 0%, ${accent}18, transparent 14rem), radial-gradient(circle at 100% 100%, ${gold}24, transparent 14rem), linear-gradient(135deg, #ffffff 0%, ${soft} 48%, #ffffff 100%)`;
}

function frameClasses(style: string) {
  if (style === "gold") return "border-[0.42rem] shadow-[inset_0_0_0_0.45rem_rgba(255,255,255,0.9),inset_0_0_0_0.58rem_rgba(217,164,65,0.65)]";
  if (style === "modern") return "border-[0.18rem] shadow-[inset_0_0_0_0.75rem_rgba(255,255,255,0.9),inset_0_0_0_0.9rem_rgba(15,23,42,0.08)]";
  return "border-[0.35rem] border-double";
}

export function CertificateGenerator() {
  const [academyName, setAcademyName] = useState("KASA Academy");
  const [studentName, setStudentName] = useState("Shivaan Gangwar");
  const [courseName, setCourseName] = useState("Digital Marketing Masterclass");
  const [certificateType, setCertificateType] = useState<(typeof certificateTypes)[number]>("Course Completion");
  const [template, setTemplate] = useState<(typeof templates)[number]["key"]>("classic");
  const [customColor, setCustomColor] = useState("#163d8f");
  const [backgroundPattern, setBackgroundPattern] = useState<(typeof backgroundPatterns)[number]["key"]>("ornamental");
  const [borderStyle, setBorderStyle] = useState<(typeof borderStyles)[number]["key"]>("double");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [pendingLogoDataUrl, setPendingLogoDataUrl] = useState("");
  const [isLogoEditorOpen, setIsLogoEditorOpen] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const [logoScale, setLogoScale] = useState(100);
  const [logoPositionX, setLogoPositionX] = useState(50);
  const [logoPositionY, setLogoPositionY] = useState(50);
  const [draftLogoScale, setDraftLogoScale] = useState(100);
  const [draftLogoPositionX, setDraftLogoPositionX] = useState(50);
  const [draftLogoPositionY, setDraftLogoPositionY] = useState(50);
  const [issueDate, setIssueDate] = useState("2026-05-22");
  const [certificateId, setCertificateId] = useState("KASA-CERT-1001");
  const [grade, setGrade] = useState("A");
  const [duration, setDuration] = useState("6 weeks");
  const [signatory, setSignatory] = useState("Academy Director");
  const [verificationNote, setVerificationNote] = useState("This certificate can be verified with the issuing academy.");
  const [selectedDetails, setSelectedDetails] = useState<string[]>(["grade", "duration", "certificateId", "verification"]);
  const [actionMessage, setActionMessage] = useState("Ready to copy, download, or print this certificate.");

  const activeTemplate = useMemo(
    () => templates.find((item) => item.key === template) || templates[0],
    [template],
  );
  const accentColor = customColor || activeTemplate.accent;
  const certificateBackground = patternBackground(backgroundPattern, accentColor, activeTemplate.soft, activeTemplate.gold);

  const certificateTitle =
    certificateType === "Course Completion"
      ? "Certificate of Completion"
      : certificateType === "Workshop Completion"
        ? "Certificate of Workshop Completion"
        : certificateType === "Training Completion"
          ? "Certificate of Training Completion"
          : `Certificate of ${certificateType}`;

  const statement =
    certificateType === "Participation"
      ? "has actively participated in"
      : certificateType === "Achievement"
        ? "has demonstrated excellent achievement in"
        : "has successfully completed";

  const toggleDetail = (key: string) => {
    setSelectedDetails((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  };

  const reset = () => {
    setAcademyName("KASA Academy");
    setStudentName("Shivaan Gangwar");
    setCourseName("Digital Marketing Masterclass");
    setCertificateType("Course Completion");
    setTemplate("classic");
    setCustomColor("#163d8f");
    setBackgroundPattern("ornamental");
    setBorderStyle("double");
    setLogoDataUrl("");
    setPendingLogoDataUrl("");
    setIsLogoEditorOpen(false);
    setIsLogoUploading(false);
    setLogoUploadProgress(0);
    setLogoScale(100);
    setLogoPositionX(50);
    setLogoPositionY(50);
    setDraftLogoScale(100);
    setDraftLogoPositionX(50);
    setDraftLogoPositionY(50);
    setIssueDate("2026-05-22");
    setCertificateId("KASA-CERT-1001");
    setGrade("A");
    setDuration("6 weeks");
    setSignatory("Academy Director");
    setVerificationNote("This certificate can be verified with the issuing academy.");
    setSelectedDetails(["grade", "duration", "certificateId", "verification"]);
    setActionMessage("Ready to copy, download, or print this certificate.");
  };

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setActionMessage("Please upload an image file for the logo.");
      return;
    }
    setIsLogoUploading(true);
    setLogoUploadProgress(8);
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setLogoUploadProgress(Math.max(8, Math.min(90, Math.round((event.loaded / event.total) * 90))));
      }
    };
    reader.onload = () => {
      const nextLogo = typeof reader.result === "string" ? reader.result : "";
      setPendingLogoDataUrl(nextLogo);
      setLogoUploadProgress(100);
      setDraftLogoScale(100);
      setDraftLogoPositionX(50);
      setDraftLogoPositionY(50);
      setActionMessage("Logo uploaded. Adjust crop and use it on the certificate.");
      window.setTimeout(() => {
        setIsLogoUploading(false);
        setLogoUploadProgress(0);
        setIsLogoEditorOpen(Boolean(nextLogo));
      }, 500);
    };
    reader.onerror = () => {
      setIsLogoUploading(false);
      setLogoUploadProgress(0);
      setActionMessage("Logo upload failed. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  const openLogoEditor = () => {
    if (!logoDataUrl) return;
    setPendingLogoDataUrl(logoDataUrl);
    setDraftLogoScale(logoScale);
    setDraftLogoPositionX(logoPositionX);
    setDraftLogoPositionY(logoPositionY);
    setIsLogoEditorOpen(true);
  };

  const applyLogoCrop = () => {
    if (!pendingLogoDataUrl) return;
    setLogoDataUrl(pendingLogoDataUrl);
    setLogoScale(draftLogoScale);
    setLogoPositionX(draftLogoPositionX);
    setLogoPositionY(draftLogoPositionY);
    setIsLogoEditorOpen(false);
    setActionMessage("Logo crop applied to the certificate.");
  };

  const removeLogo = () => {
    setLogoDataUrl("");
    setPendingLogoDataUrl("");
    setIsLogoEditorOpen(false);
    setLogoScale(100);
    setLogoPositionX(50);
    setLogoPositionY(50);
    setDraftLogoScale(100);
    setDraftLogoPositionX(50);
    setDraftLogoPositionY(50);
    setActionMessage("Logo removed. The certificate now uses the default academy seal.");
  };

  const certificateText = [
    `${academyName} - ${certificateTitle}`,
    `This certifies that ${studentName} ${statement} ${courseName}.`,
    `Issue date: ${formatDisplayDate(issueDate)}`,
    selectedDetails.includes("duration") ? `Duration: ${duration}` : null,
    selectedDetails.includes("grade") ? `Grade/score: ${grade}` : null,
    selectedDetails.includes("certificateId") ? `Certificate ID: ${certificateId}` : null,
    `Signatory: ${signatory}`,
    selectedDetails.includes("verification") ? verificationNote : null,
    "",
    "Generated with KASA Certificate Generator",
  ].filter(Boolean).join("\n");

  const certificateSvg = () => {
    const width = 1100;
    const height = 778;
    const frameColor = borderStyle === "gold" ? activeTemplate.gold : accentColor;
    const logoBox = { x: 504, y: 58, width: 92, height: 72 };
    const logoWidth = logoBox.width * (logoScale / 100);
    const logoHeight = logoBox.height * (logoScale / 100);
    const logoX = logoBox.x + (logoBox.width - logoWidth) * (logoPositionX / 100);
    const logoY = logoBox.y + (logoBox.height - logoHeight) * (logoPositionY / 100);
    const statementLines = wrapWords(`${statement} ${courseName}.`, 64);
    const verifyLines = selectedDetails.includes("verification") ? wrapWords(verificationNote, 48).slice(0, 3) : [];
    const detailPills = [
      `Issued: ${formatDisplayDate(issueDate)}`,
      selectedDetails.includes("duration") ? `Duration: ${duration}` : "",
      selectedDetails.includes("grade") ? `Grade: ${grade}` : "",
      selectedDetails.includes("certificateId") ? `ID: ${certificateId}` : "",
    ].filter(Boolean);
    const pillStart = 550 - detailPills.length * 72;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="certificateBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.48" stop-color="${escapeXml(activeTemplate.soft)}"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <clipPath id="logoClip"><rect x="${logoBox.x}" y="${logoBox.y}" width="${logoBox.width}" height="${logoBox.height}" rx="4"/></clipPath>
  </defs>
  <rect width="${width}" height="${height}" fill="#f8fbff"/>
  <rect x="26" y="26" width="1048" height="726" rx="18" fill="#ffffff" stroke="#dbe5f0"/>
  <rect x="52" y="52" width="996" height="674" rx="6" fill="url(#certificateBg)" stroke="${escapeXml(frameColor)}" stroke-width="${borderStyle === "modern" ? 4 : 8}"/>
  ${borderStyle === "double" ? `<rect x="64" y="64" width="972" height="650" rx="4" fill="none" stroke="${escapeXml(accentColor)}" stroke-width="3"/>` : ""}
  ${borderStyle === "modern" ? `<rect x="78" y="78" width="944" height="622" rx="4" fill="none" stroke="${escapeXml(accentColor)}" stroke-opacity="0.22" stroke-width="4"/>` : ""}
  ${borderStyle === "gold" ? `<rect x="68" y="68" width="964" height="642" rx="4" fill="none" stroke="${escapeXml(accentColor)}" stroke-opacity="0.25" stroke-width="5"/>` : ""}
  ${
    logoDataUrl
      ? `<image href="${escapeXml(logoDataUrl)}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" clip-path="url(#logoClip)"/>`
      : `<circle cx="550" cy="96" r="43" fill="${escapeXml(accentColor)}"/><text x="550" y="108" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="900">${escapeXml((academyName || "A").slice(0, 1).toUpperCase())}</text>`
  }
  <text x="550" y="152" text-anchor="middle" fill="${escapeXml(accentColor)}" font-family="Arial, sans-serif" font-size="17" font-weight="800" letter-spacing="5">${escapeXml((academyName || "Academy Name").toUpperCase())}</text>
  <text x="550" y="222" text-anchor="middle" fill="#0f172a" font-family="Georgia, serif" font-size="48" font-weight="700">${escapeXml(certificateTitle)}</text>
  <rect x="470" y="250" width="160" height="5" rx="3" fill="${escapeXml(accentColor)}"/>
  <text x="550" y="304" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="5">THIS CERTIFICATE IS PROUDLY PRESENTED TO</text>
  <text x="550" y="380" text-anchor="middle" fill="${escapeXml(accentColor)}" font-family="Georgia, serif" font-size="54" font-weight="700">${escapeXml(studentName || "Student Name")}</text>
  ${statementLines.map((line, index) => `<text x="550" y="${430 + index * 31}" text-anchor="middle" fill="#334155" font-family="Arial, sans-serif" font-size="23">${escapeXml(line)}</text>`).join("")}
  ${detailPills.map((pill, index) => `<rect x="${pillStart + index * 144}" y="510" width="132" height="32" rx="16" fill="#f8fbff" stroke="#dbe5f0"/><text x="${pillStart + index * 144 + 66}" y="531" text-anchor="middle" fill="#475569" font-family="Arial, sans-serif" font-size="13" font-weight="700">${escapeXml(pill)}</text>`).join("")}
  ${verifyLines.map((line, index) => `<text x="92" y="${663 + index * 21}" fill="#64748b" font-family="Arial, sans-serif" font-size="13">${escapeXml(line)}</text>`).join("")}
  <line x1="830" y1="652" x2="1010" y2="652" stroke="#64748b" stroke-width="1.5"/>
  <text x="920" y="684" text-anchor="middle" fill="#334155" font-family="Arial, sans-serif" font-size="14" font-weight="800">${escapeXml(signatory || "Signatory")}</text>
</svg>`;
  };

  const copyCertificate = async () => {
    try {
      await navigator.clipboard.writeText(certificateText);
      setActionMessage("Certificate details copied.");
    } catch {
      setActionMessage("Copy was blocked. Use download instead.");
    }
  };

  const renderCertificateJpeg = async () => {
    const svg = certificateSvg();
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    try {
      const image = new Image();
      image.decoding = "async";
      const loaded = new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Certificate image could not be prepared."));
      });
      image.src = svgUrl;
      await loaded;
      const canvas = document.createElement("canvas");
      canvas.width = 2200;
      canvas.height = 1556;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not available.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return {
        dataUrl: canvas.toDataURL("image/jpeg", 0.96),
        width: canvas.width,
        height: canvas.height,
      };
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  const downloadCertificate = async () => {
    try {
      setActionMessage("Preparing PDF certificate...");
      const jpeg = await renderCertificateJpeg();
      const pdfBlob = buildPdfFromJpeg(jpegDataUrlToBytes(jpeg.dataUrl), jpeg.width, jpeg.height);
      downloadBlob(pdfBlob, `${certificateId || "certificate"}.pdf`);
      setActionMessage("PDF certificate downloaded.");
    } catch {
      downloadBlob(new Blob([certificateSvg()], { type: "image/svg+xml;charset=utf-8" }), `${certificateId || "certificate"}.svg`);
      setActionMessage("PDF could not be prepared, so the certificate was downloaded as SVG.");
    }
  };

  const printCertificate = () => {
    const svgUrl = URL.createObjectURL(new Blob([certificateSvg()], { type: "image/svg+xml;charset=utf-8" }));
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);
    const doc = frame.contentWindow?.document;
    if (!doc) {
      URL.revokeObjectURL(svgUrl);
      frame.remove();
      setActionMessage("Print could not start. Use download instead.");
      return;
    }
    doc.open();
    doc.write(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(studentName)} certificate</title>
          <style>
            @page { size: A4 landscape; margin: 0; }
            * { box-sizing: border-box; }
            html, body { width: 100%; height: 100%; margin: 0; background: #fff; }
            body { display: grid; place-items: center; }
            img { display: block; width: 100vw; height: 70.7vw; max-height: 100vh; object-fit: contain; }
            @media print { img { width: 100vw; height: 100vh; object-fit: contain; } }
          </style>
        </head>
        <body>
          <img src="${svgUrl}" alt="Certificate" />
        </body>
      </html>`);
    doc.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      frame.remove();
      URL.revokeObjectURL(svgUrl);
    }, 300);
    setActionMessage("Print opened for certificate only.");
  };

  return (
    <>
    <section className="relative px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[108rem] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/92 p-5 shadow-xl shadow-blue-950/8 backdrop-blur dark:border-white/10 dark:bg-surface/90 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">Certificate setup</p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-slate-950 dark:text-white">Create a certificate</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Add student, course, certificate type, issue date, signatory, and optional verification details.
              </p>
            </div>
            <button type="button" onClick={reset} className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-700 shadow-sm transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-white" aria-label="Reset certificate">
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Academy name" value={academyName} onChange={setAcademyName} />
              <TextField label="Student name" value={studentName} onChange={setStudentName} />
              <TextField label="Course or program" value={courseName} onChange={setCourseName} />
              <TextField label="Certificate ID" value={certificateId} onChange={setCertificateId} />
              <TextField label="Grade or score" value={grade} onChange={setGrade} />
              <TextField label="Course duration" value={duration} onChange={setDuration} />
              <TextField label="Signatory name" value={signatory} onChange={setSignatory} />
              <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Issue date</span>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  className="mt-3 h-12 w-full cursor-pointer rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                />
              </label>
            </div>

            <ChoiceGrid label="Certificate type" value={certificateType} options={certificateTypes} onChange={setCertificateType} />
            <ChoiceGrid
              label="Template"
              value={template}
              options={templates.map((item) => item.key)}
              onChange={(value) => {
                setTemplate(value);
                setCustomColor(templates.find((item) => item.key === value)?.accent || "#163d8f");
              }}
              getLabel={(value) => templates.find((item) => item.key === value)?.label || value}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Brand color</span>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(event) => setCustomColor(event.target.value)}
                    className="h-12 w-16 cursor-pointer rounded-xl border border-blue-950/10 bg-white p-1 dark:border-white/10 dark:bg-white/[0.06]"
                    aria-label="Certificate brand color"
                  />
                  <input
                    value={customColor}
                    onChange={(event) => setCustomColor(event.target.value)}
                    className="h-12 min-w-0 flex-1 rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                  />
                </div>
              </label>

              <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Academy logo</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-slate-200">
                    <ImagePlus className="size-4" aria-hidden="true" />
                    Upload logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        handleLogoUpload(event.target.files?.[0]);
                        event.currentTarget.value = "";
                      }}
                      className="sr-only"
                    />
                  </label>
                  {logoDataUrl ? (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"
                    >
                      <X className="size-4" aria-hidden="true" />
                      Remove
                    </button>
                  ) : null}
                  {logoDataUrl ? (
                    <button
                      type="button"
                      onClick={openLogoEditor}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/7 dark:text-slate-200"
                    >
                      Edit crop
                    </button>
                  ) : null}
                </div>
                {isLogoUploading ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      <span>Uploading logo</span>
                      <span>{logoUploadProgress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 shadow-inner dark:bg-white/12">
                      <div className="h-full rounded-full bg-[image:var(--button-solid)] transition-[width] duration-300" style={{ width: `${logoUploadProgress}%` }} />
                    </div>
                  </div>
                ) : null}
                {logoDataUrl ? (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 dark:border-emerald-300/25 dark:bg-emerald-400/10 dark:text-emerald-100">
                    Logo is applied. Use Edit crop to adjust it with preview.
                  </div>
                ) : null}
              </div>
            </div>
            <ChoiceGrid label="Background design" value={backgroundPattern} options={backgroundPatterns.map((item) => item.key)} onChange={setBackgroundPattern} getLabel={(value) => backgroundPatterns.find((item) => item.key === value)?.label || value} />
            <ChoiceGrid label="Border style" value={borderStyle} options={borderStyles.map((item) => item.key)} onChange={setBorderStyle} getLabel={(value) => borderStyles.find((item) => item.key === value)?.label || value} />

            <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Verification note</span>
              <textarea
                value={verificationNote}
                onChange={(event) => setVerificationNote(event.target.value)}
                rows={3}
                className="mt-3 w-full resize-none rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
              />
            </label>

            <ToggleGroup title="Show on certificate" items={optionalDetails.map((item) => ({ key: item.key, label: item.label }))} selected={selectedDetails} onToggle={toggleDetail} />
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-blue-950/10 bg-white/94 p-5 shadow-2xl shadow-blue-950/12 backdrop-blur dark:border-white/10 dark:bg-surface/92 sm:p-7">
          <div className="rounded-[1.1rem] border border-blue-950/10 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/30">
            <div className="aspect-[1.414/1] overflow-hidden rounded-[1rem] border bg-white p-3 shadow-sm shadow-blue-950/5" style={{ borderColor: accentColor }}>
              <div
                className={`relative grid h-full place-items-center overflow-hidden p-5 text-center ${frameClasses(borderStyle)}`}
                style={{ borderColor: borderStyle === "gold" ? activeTemplate.gold : accentColor, background: certificateBackground }}
              >
                <div className="relative z-10 flex h-full w-full flex-col items-center">
                  {logoDataUrl ? (
                    <div
                      className="mb-2 h-14 w-20 bg-no-repeat"
                      style={{
                        backgroundImage: `url(${logoDataUrl})`,
                        backgroundPosition: `${logoPositionX}% ${logoPositionY}%`,
                        backgroundSize: `${logoScale}% auto`,
                      }}
                      aria-label="Academy logo preview"
                    />
                  ) : (
                    <div className="mb-2 grid size-14 place-items-center rounded-full text-xl font-black !text-white shadow-lg" style={{ backgroundColor: accentColor, color: "#fff" }}>
                      {(academyName || "A").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>{academyName || "Academy Name"}</div>
                  <h3 className="mt-4 font-heading text-3xl font-semibold text-slate-950">{certificateTitle}</h3>
                  <div className="mt-3 h-1 w-24 rounded-full" style={{ backgroundColor: accentColor }} />
                  <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">This certificate is proudly presented to</p>
                  <div className="mt-3 break-words font-heading text-4xl font-semibold" style={{ color: accentColor }}>{studentName || "Student Name"}</div>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                    {statement} <span className="font-semibold text-slate-950">{courseName || "Course Name"}</span>.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <CertificatePill label={`Issued: ${formatDisplayDate(issueDate)}`} />
                    {selectedDetails.includes("duration") ? <CertificatePill label={`Duration: ${duration}`} /> : null}
                    {selectedDetails.includes("grade") ? <CertificatePill label={`Grade: ${grade}`} /> : null}
                    {selectedDetails.includes("certificateId") ? <CertificatePill label={`ID: ${certificateId}`} /> : null}
                  </div>
                  <div className="mt-auto grid w-full grid-cols-[1fr_auto] items-end gap-4 pt-5">
                    <p className="text-left text-xs leading-5 text-slate-500">
                      {selectedDetails.includes("verification") ? verificationNote : ""}
                    </p>
                    <div className="min-w-40 border-t border-slate-400 pt-2 text-xs font-semibold text-slate-700">{signatory}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Type" value={certificateType} />
            <SummaryCard label="Template" value={activeTemplate.label} />
            <SummaryCard label="Design" value={backgroundPatterns.find((item) => item.key === backgroundPattern)?.label || backgroundPattern} />
          </div>

          <div className="mt-5 rounded-[1.1rem] border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/25 dark:bg-emerald-400/10">
            <div className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <Award className="mt-1 size-4 shrink-0 text-primary dark:text-emerald-300" aria-hidden="true" />
              <span>This certificate is ready for print or download. Use a landscape page setting for best output.</span>
            </div>
          </div>

          <div className="mt-6 rounded-[1.1rem] border border-blue-950/10 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{actionMessage}</p>
              <div className="flex flex-wrap gap-2">
                <ActionButton label="Copy" icon={Copy} onClick={copyCertificate} />
                <ActionButton label="Print" icon={Printer} onClick={printCertificate} />
                <ActionButton label="Download PDF" icon={Download} onClick={downloadCertificate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {isLogoEditorOpen ? (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/58 px-4 py-6 backdrop-blur-sm">
        <div className="w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-white/20 bg-white shadow-2xl shadow-slate-950/30 dark:border-white/10 dark:bg-surface">
          <div className="flex items-start justify-between gap-4 border-b border-blue-950/10 p-5 dark:border-white/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-emerald-200">Logo editor</p>
              <h3 className="mt-1 font-heading text-2xl font-semibold text-slate-950 dark:text-white">Crop and position your logo</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Adjust the logo here first. It will be added to the certificate only after you apply it.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsLogoEditorOpen(false)}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-blue-950/10 bg-white text-slate-700 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/7 dark:text-white"
              aria-label="Close logo editor"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1rem] border border-blue-950/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="grid min-h-72 place-items-center rounded-[0.85rem] border border-dashed border-blue-950/20 bg-white p-6 dark:border-white/15 dark:bg-slate-950/30">
                <div
                  className="h-36 w-52 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${pendingLogoDataUrl})`,
                    backgroundPosition: `${draftLogoPositionX}% ${draftLogoPositionY}%`,
                    backgroundSize: `${draftLogoScale}% auto`,
                  }}
                  aria-label="Logo crop preview"
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                This preview shows how the logo will sit on the certificate without any extra box.
              </p>
            </div>
            <div className="grid content-start gap-4">
              <LogoControl label="Logo zoom" value={draftLogoScale} onChange={setDraftLogoScale} min={60} max={220} suffix="%" />
              <LogoControl label="Move left/right" value={draftLogoPositionX} onChange={setDraftLogoPositionX} min={0} max={100} suffix="%" />
              <LogoControl label="Move up/down" value={draftLogoPositionY} onChange={setDraftLogoPositionY} min={0} max={100} suffix="%" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraftLogoScale(100);
                    setDraftLogoPositionX(50);
                    setDraftLogoPositionY(50);
                  }}
                  className="h-11 cursor-pointer rounded-full border border-blue-950/10 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"
                >
                  Reset crop
                </button>
                <button
                  type="button"
                  onClick={applyLogoCrop}
                  className="h-11 cursor-pointer rounded-full bg-[image:var(--button-solid)] px-4 text-sm font-semibold !text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
                >
                  Use logo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full rounded-xl border border-blue-950/10 bg-blue-50/60 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary/50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
      />
    </label>
  );
}

function ChoiceGrid<T extends string>({ label, value, options, onChange, getLabel }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void; getLabel?: (value: T) => string }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${value === option ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
            {getLabel ? getLabel(option) : option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleGroup({ title, items, selected, onToggle }: { title: string; items: { key: string; label: string }[]; selected: string[]; onToggle: (key: string) => void }) {
  return (
    <div className="rounded-[1.1rem] border border-blue-950/10 bg-white/82 p-4 shadow-sm shadow-blue-950/5 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item.key);
          return (
            <button key={item.key} type="button" onClick={() => onToggle(item.key)} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${active ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-300 dark:bg-emerald-300 dark:text-slate-950" : "border-blue-950/10 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"}`}>
              <CheckCircle2 className={`size-3.5 ${active ? "" : "opacity-35"}`} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LogoControl({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; suffix: string }) {
  const percent = ((value - min) / Math.max(1, max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-2 w-full cursor-pointer accent-[#22b573] dark:accent-[#58c98a]"
        style={{ background: `linear-gradient(90deg,#22b573 ${percent}%,#d8e4ef ${percent}%)` }}
      />
    </div>
  );
}

function CertificatePill({ label }: { label: string }) {
  return <span className="rounded-full border border-blue-950/10 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{label}</span>;
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-blue-950/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.05]">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 break-words font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick }: { label: string; icon: typeof Copy; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-950/10 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm shadow-blue-950/5 transition hover:border-primary/35 hover:text-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:text-white">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
