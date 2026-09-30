import { createHash, randomUUID } from "crypto";
import { prisma } from "@/lib/admin/prisma";
import { encryptPrivateValue } from "@/lib/admin/crypto";

export const atsVisitorCookieName = "kasa_ats_visitor";
export const atsCheckStatuses = ["COMPLETED", "UNREADABLE", "INVALID_INPUT", "FAILED"] as const;
export type AtsCheckStatus = (typeof atsCheckStatuses)[number];

type AtsAnalyticsInput = {
  visitorKey: string;
  status: AtsCheckStatus;
  resumeText?: string;
  fileData?: string;
  fileName?: string;
  fileSizeBytes?: number;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  targetRole?: string;
  roleFamily?: string;
  experienceLevel?: string;
  hasJobDescription?: boolean;
  atsScore?: number | null;
  jobMatchScore?: number | null;
  errorCode?: string;
};

export function getAtsVisitorIdentity(rawValue?: string) {
  const visitorKey = rawValue && /^[a-zA-Z0-9_-]{20,160}$/.test(rawValue)
    ? rawValue
    : randomUUID();
  return { visitorKey, isNew: visitorKey !== rawValue };
}

function fileExtension(fileName?: string) {
  const extension = String(fileName || "").split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]{1,8}$/.test(extension) ? extension : null;
}

function resumeFingerprint(input: AtsAnalyticsInput) {
  const source = input.fileData || input.resumeText;
  return source ? createHash("sha256").update(source).digest("hex") : null;
}

function extractContactDetails(input: AtsAnalyticsInput) {
  const text = `${input.candidateName || ""}\n${input.resumeText || ""}`.slice(0, 30_000);
  const suppliedEmail = input.candidateEmail?.trim().toLowerCase().slice(0, 160);
  const email = (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(suppliedEmail || "") ? suppliedEmail : undefined)
    || text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0]?.toLowerCase();
  const suppliedPhone = input.candidatePhone?.replace(/\s+/g, " ").trim().slice(0, 40);
  const phoneMatch = (suppliedPhone && suppliedPhone.replace(/\D/g, "").length >= 8 ? suppliedPhone : undefined)
    || text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0];
  const phone = phoneMatch?.replace(/\s+/g, " ").trim().slice(0, 40);
  const suppliedName = input.candidateName?.replace(/\s+/g, " ").trim().slice(0, 100);
  const candidateName = suppliedName && !["candidate", "improved resume"].includes(suppliedName.toLowerCase())
    ? suppliedName
    : inferCandidateName(input.resumeText);
  return { candidateName, email, phone };
}

function inferCandidateName(resumeText?: string) {
  const ignored = /^(professional\s+(summary|experience)|summary|experience|education|skills|projects|contact|curriculum vitae|resume)$/i;
  const lines = String(resumeText || "").split(/\r?\n/).slice(0, 12);

  for (const rawLine of lines) {
    const value = rawLine.replace(/\s+/g, " ").trim();
    const words = value.split(" ");
    if (
      words.length < 2 || words.length > 4 || value.length > 70 || ignored.test(value)
      || /[@|]|\d{3,}/.test(value) || !/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ.'-]*(?:\s+[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ.'-]*){1,3}$/.test(value)
    ) continue;

    return value;
  }

  return undefined;
}

/**
 * Store product analytics only. The source resume and job description never
 * enter the database: the document fingerprint is a one-way SHA-256 hash.
 */
export async function recordAtsCheck(input: AtsAnalyticsInput) {
  try {
    const fingerprint = resumeFingerprint(input);
    const extension = fileExtension(input.fileName);
    const hasFailed = input.status !== "COMPLETED";
    const contact = extractContactDetails(input);
    const candidateNameEncrypted = encryptPrivateValue(contact.candidateName);
    const emailEncrypted = encryptPrivateValue(contact.email);
    const phoneEncrypted = encryptPrivateValue(contact.phone);

    await prisma.$transaction(async (tx) => {
      const visitor = await tx.atsResumeVisitor.upsert({
        where: { visitorKey: input.visitorKey },
        create: {
          visitorKey: input.visitorKey,
          totalChecks: 1,
          completedChecks: input.status === "COMPLETED" ? 1 : 0,
          failedChecks: hasFailed ? 1 : 0,
          candidateNameEncrypted,
          emailEncrypted,
          phoneEncrypted,
        },
        update: {
          lastSeenAt: new Date(),
          totalChecks: { increment: 1 },
          completedChecks: input.status === "COMPLETED" ? { increment: 1 } : undefined,
          failedChecks: hasFailed ? { increment: 1 } : undefined,
          ...(candidateNameEncrypted ? { candidateNameEncrypted } : {}),
          ...(emailEncrypted ? { emailEncrypted } : {}),
          ...(phoneEncrypted ? { phoneEncrypted } : {}),
        },
      });

      const document = fingerprint
        ? await tx.atsResumeDocument.upsert({
          where: { visitorId_fingerprint: { visitorId: visitor.id, fingerprint } },
          create: {
            visitorId: visitor.id,
            fingerprint,
            sourceType: input.fileData ? "upload" : "pasted-text",
            fileExtension: extension,
            fileSizeBytes: input.fileSizeBytes,
          },
          update: {
            lastSeenAt: new Date(),
            sourceType: input.fileData ? "upload" : "pasted-text",
            fileExtension: extension,
            fileSizeBytes: input.fileSizeBytes,
          },
        })
        : null;

      await tx.atsResumeCheck.create({
        data: {
          visitorId: visitor.id,
          documentId: document?.id,
          status: input.status,
          atsScore: input.atsScore == null ? null : Math.round(input.atsScore),
          jobMatchScore: input.jobMatchScore == null ? null : Math.round(input.jobMatchScore),
          targetRole: input.targetRole?.slice(0, 80),
          roleFamily: input.roleFamily?.slice(0, 80),
          experienceLevel: input.experienceLevel?.slice(0, 60),
          hasJobDescription: Boolean(input.hasJobDescription),
          fileExtension: extension,
          errorCode: input.errorCode?.slice(0, 80),
        },
      });
    });
  } catch (error) {
    // Analytics must never prevent a job seeker from receiving a resume report.
    console.error("ATS analytics recording failed", error);
  }
}
