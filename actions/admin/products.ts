"use server";

import { KasaEdition, PlanType, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/auth";
import {
  enforcePlanHierarchy,
  KASA_MODULES,
  normalizeFeatures,
  normalizeRules,
} from "@/lib/admin/kasa-modules";
import { prisma } from "@/lib/admin/prisma";
import {
  deleteProductPriceSchema,
  deleteProductSchema,
  productPriceSchema,
  productPriceStatusSchema,
  productSchema,
  updateProductPriceSchema,
  updateProductSchema,
} from "@/schemas/admin/products";
import { formObject, revalidateAdminLicensePaths } from "@/actions/admin/action-utils";

export type PricingActionResult = { success: boolean; message: string };

function revalidateProductPaths() {
  revalidateAdminLicensePaths();
  revalidatePath("/");
  revalidatePath("/pricing");
}

function optionalLimit(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getProductPriceEntitlementData(parsed: {
  edition: KasaEdition | string;
  features?: string[];
  certificateRule: "lecture_completion" | "exam_pass";
  allowedCourseModes?: string[];
}) {
  const edition = parsed.edition as KasaEdition;
  const defaults = enforcePlanHierarchy(
    (["STARTER", "PLUS", "ENTERPRISE"] as const).map((item) => ({
      edition: item,
      features: normalizeFeatures(undefined, item),
      rules: normalizeRules(undefined, item),
    })),
  );
  const fallback =
    defaults.find((item) => item.edition === edition) ??
    ({
      edition,
      features: normalizeFeatures(undefined, edition),
      rules: normalizeRules(undefined, edition),
    } as const);
  const selectedFeatures = new Set(parsed.features || []);
  const features = normalizeFeatures(
    Object.fromEntries(
      KASA_MODULES.map((module) => [
        module.key,
        Array.isArray(parsed.features)
          ? selectedFeatures.has(module.key)
          : fallback.features[module.key],
      ]),
    ),
    edition,
  );
  const rules = normalizeRules(
    {
      certificateRule: parsed.certificateRule,
      allowedCourseModes: parsed.allowedCourseModes?.length
        ? parsed.allowedCourseModes
        : fallback.rules.allowedCourseModes,
    },
    edition,
  );

  return {
    features: features as unknown as Prisma.InputJsonValue,
    rules: rules as unknown as Prisma.InputJsonValue,
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse(formObject(formData));

  await prisma.product.create({
    data: {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description || null,
      status: ProductStatus.ACTIVE,
    },
  });

  revalidateProductPaths();
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = updateProductSchema.parse(formObject(formData));

  const duplicate = await prisma.product.findUnique({
    where: { slug: parsed.slug },
    select: { id: true },
  });

  if (duplicate && duplicate.id !== parsed.productId) return;

  await prisma.product.update({
    where: { id: parsed.productId },
    data: {
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description || null,
    },
  });

  revalidateProductPaths();
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const parsed = deleteProductSchema.parse(formObject(formData));
  const product = await prisma.product.findUnique({
    where: { id: parsed.productId },
    include: { _count: { select: { licenses: true } } },
  });

  if (!product || product._count.licenses > 0) return;

  await prisma.product.delete({ where: { id: product.id } });
  revalidateProductPaths();
}

export async function toggleProductStatusAction(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") || "");
  const status = String(formData.get("status") || "") as ProductStatus;
  if (!productId || !["ACTIVE", "ARCHIVED"].includes(status)) return;

  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });

  revalidateProductPaths();
}

export async function createProductPriceAction(formData: FormData): Promise<PricingActionResult> {
  await requireAdmin();
  const validation = productPriceSchema.safeParse({
    ...formObject(formData),
    features: formData.getAll("features"),
    allowedCourseModes: formData.getAll("allowedCourseModes"),
  });

  if (!validation.success) {
    return { success: false, message: validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  }
  const parsed = validation.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsed.productId },
      select: { id: true },
    });
    if (!product) return { success: false, message: "Product not found. Refresh and try again." };
    const entitlementData = getProductPriceEntitlementData(parsed);

    await prisma.productPrice.upsert({
      where: {
        productId_edition_plan_currency: {
          productId: parsed.productId,
          edition: parsed.edition as KasaEdition,
          plan: parsed.plan as PlanType,
          currency: parsed.currency.toUpperCase(),
        },
      },
      update: {
        amount: parsed.amount,
        maxActivations: parsed.maxActivations,
        userLimit: optionalLimit(parsed.userLimit),
        courseLimit: optionalLimit(parsed.courseLimit),
        facultyLimit: optionalLimit(parsed.facultyLimit),
        features: entitlementData.features,
        rules: entitlementData.rules,
        envatoItemId: parsed.envatoItemId?.trim() || null,
        isActive: true,
      },
      create: {
        productId: parsed.productId,
        edition: parsed.edition as KasaEdition,
        plan: parsed.plan as PlanType,
        currency: parsed.currency.toUpperCase(),
        amount: parsed.amount,
        maxActivations: parsed.maxActivations,
        userLimit: optionalLimit(parsed.userLimit),
        courseLimit: optionalLimit(parsed.courseLimit),
        facultyLimit: optionalLimit(parsed.facultyLimit),
        features: entitlementData.features,
        rules: entitlementData.rules,
        envatoItemId: parsed.envatoItemId?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Unable to save product pricing", error);
    return { success: false, message: "Pricing could not be saved. Please try again." };
  }
  revalidateProductPaths();
  return { success: true, message: "Pricing saved. Active prices are updated on the website." };
}

export async function updateProductPriceAction(formData: FormData): Promise<PricingActionResult> {
  await requireAdmin();
  const validation = updateProductPriceSchema.safeParse({
    ...formObject(formData),
    features: formData.getAll("features"),
    allowedCourseModes: formData.getAll("allowedCourseModes"),
  });

  if (!validation.success) {
    return { success: false, message: validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  }
  const parsed = validation.data;

  try {
    const existing = await prisma.productPrice.findUnique({
      where: { id: parsed.productPriceId },
      select: { id: true },
    });
    if (!existing) return { success: false, message: "Pricing row not found. Refresh and try again." };

    const duplicate = await prisma.productPrice.findFirst({
      where: {
        id: { not: parsed.productPriceId },
        productId: parsed.productId,
        edition: parsed.edition as KasaEdition,
        plan: parsed.plan as PlanType,
        currency: parsed.currency.toUpperCase(),
      },
      select: { id: true },
    });
    if (duplicate) return { success: false, message: "This product already has pricing for that edition, billing term, and currency. Edit the existing row instead." };

    const entitlementData = getProductPriceEntitlementData(parsed);

    await prisma.productPrice.update({
      where: { id: parsed.productPriceId },
      data: {
        productId: parsed.productId,
        edition: parsed.edition as KasaEdition,
        plan: parsed.plan as PlanType,
        currency: parsed.currency.toUpperCase(),
        amount: parsed.amount,
        maxActivations: parsed.maxActivations,
        userLimit: optionalLimit(parsed.userLimit),
        courseLimit: optionalLimit(parsed.courseLimit),
        facultyLimit: optionalLimit(parsed.facultyLimit),
        features: entitlementData.features,
        rules: entitlementData.rules,
        envatoItemId: parsed.envatoItemId?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Unable to save product pricing", error);
    return { success: false, message: "Pricing could not be saved. Please try again." };
  }
  revalidateProductPaths();
  return { success: true, message: "Pricing saved. Active prices are updated on the website." };
}

export async function deleteProductPriceAction(formData: FormData) {
  await requireAdmin();
  const parsed = deleteProductPriceSchema.parse(formObject(formData));
  const usedLicenses = await prisma.license.count({
    where: { productPriceId: parsed.productPriceId },
  });
  if (usedLicenses > 0) return;

  await prisma.productPrice.delete({
    where: { id: parsed.productPriceId },
  });

  revalidateProductPaths();
}

export async function toggleProductPriceStatusAction(formData: FormData) {
  await requireAdmin();
  const parsed = productPriceStatusSchema.parse(formObject(formData));

  await prisma.productPrice.update({
    where: { id: parsed.productPriceId },
    data: { isActive: parsed.isActive === "true" },
  });

  revalidateProductPaths();
}
