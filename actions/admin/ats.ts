"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";

export async function deleteAtsCandidateAction(formData: FormData) {
  await requireAdmin();
  const visitorId = String(formData.get("visitorId") || "");

  if (!visitorId) return { ok: false, message: "Candidate could not be identified." };

  try {
    // The schema cascades this deletion to the candidate's documents and check history.
    await prisma.atsResumeVisitor.delete({ where: { id: visitorId } });
    revalidatePath("/admin");
    revalidatePath("/admin/ats-checker");
    return { ok: true };
  } catch {
    return { ok: false, message: "The candidate could not be deleted. Please try again." };
  }
}
