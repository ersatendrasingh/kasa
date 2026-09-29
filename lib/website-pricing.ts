import { connection } from "next/server";
import { KasaEdition, PlanType } from "@prisma/client";
import { prisma } from "@/lib/admin/prisma";
import { normalizeFeatures, normalizeRules } from "@/lib/admin/kasa-modules";
import { pricing as fallbackPricing } from "@/lib/landing";

export type WebsitePricingPlan = {
  name: string;
  eyebrow: string;
  price: string;
  note: string;
  features: string[];
  highlighted?: boolean;
  bestFor: string;
};

const editionNames: Record<KasaEdition, string> = {
  STARTER: "Starter",
  PLUS: "Plus",
  ENTERPRISE: "Enterprise",
};

const editionNotes: Record<KasaEdition, string> = {
  STARTER:
    "For new academies launching a branded course website with self-paced learning.",
  PLUS:
    "For institutes that need live classes, faculty workflows, tests, and growth operations.",
  ENTERPRISE:
    "For larger teams that need every module, advanced controls, and rollout support.",
};

const editionBestFor: Record<KasaEdition, string> = {
  STARTER: "Best for solo trainers and small teams starting their first academy.",
  PLUS: "Best for institutes already selling, teaching, and managing active cohorts.",
  ENTERPRISE: "Best for multi-team institutes that need deeper operations control.",
};

const editionOrder: Record<KasaEdition, number> = {
  STARTER: 1,
  PLUS: 2,
  ENTERPRISE: 3,
};

function formatCurrency(currency: string, amount: number) {
  if (amount <= 0) return "Custom";

  const symbol = currency.toUpperCase() === "INR" ? "₹" : "$";
  return `${symbol}${amount.toLocaleString("en-IN", {
    maximumFractionDigits: amount % 1 ? 2 : 0,
  })}`;
}

function formatPlanType(plan: PlanType) {
  const labels: Record<PlanType, string> = {
    LIFETIME: "Lifetime",
    SIX_MONTHS: "6 months",
    TWELVE_MONTHS: "12 months",
    CUSTOM: "Custom",
  };

  return labels[plan];
}

function formatLimit(label: string, value: number | null) {
  return `${value ?? "Unlimited"} ${label}`;
}

function uniqueFeatures(features: Array<string | null | undefined>) {
  return [...new Set(features.filter(Boolean) as string[])].slice(0, 9);
}

function formatCertificateRule(rule: ReturnType<typeof normalizeRules>["certificateRule"]) {
  return rule === "exam_pass"
    ? "Certificate after exam pass"
    : "Certificate after lecture completion";
}

function publicPlanFeatures(
  edition: KasaEdition,
  row: {
    userLimit: number | null;
    courseLimit: number | null;
    facultyLimit: number | null;
    maxActivations: number;
  },
  features: ReturnType<typeof normalizeFeatures>,
  rules: ReturnType<typeof normalizeRules>,
) {
  const limits = [
    formatLimit("users", row.userLimit),
    formatLimit("courses", row.courseLimit),
    formatLimit("faculty", row.facultyLimit),
    `${row.maxActivations} installation${row.maxActivations === 1 ? "" : "s"}`,
    formatCertificateRule(rules.certificateRule),
  ];

  if (edition === "STARTER") {
    return uniqueFeatures([
      features.courses ? "Branded academy website and course storefront" : null,
      "Self-paced course delivery and learner progress",
      features.certificates ? "Certificates based on lecture completion" : null,
      ...limits,
    ]);
  }

  if (edition === "PLUS") {
    return uniqueFeatures([
      "Everything in Starter",
      features.faculty || features.liveClasses
        ? "Faculty workspace, live classes, and batches"
        : null,
      features.exams || features.assignments || features.coupons || features.refunds || features.emailTemplates
        ? "Exams, assignments, coupons, refunds, and email templates"
        : null,
      ...limits,
    ]);
  }

  return uniqueFeatures([
    "Everything in Plus",
    Object.values(features).every(Boolean) ? "All KASA modules enabled" : "Advanced KASA modules enabled",
    features.prioritySupport || features.advancedSettings || features.branding
      ? "Priority support, advanced settings, and complete branding control"
      : null,
    ...limits,
  ]);
}

function fallbackPlans(): WebsitePricingPlan[] {
  return fallbackPricing.map((plan) => ({
    ...plan,
    eyebrow: `${plan.name} plan`,
    bestFor: plan.highlighted
      ? editionBestFor.PLUS
      : plan.name === "Starter"
        ? editionBestFor.STARTER
        : editionBestFor.ENTERPRISE,
  }));
}

export async function getWebsitePricingPlans(): Promise<WebsitePricingPlan[]> {
  // Pricing must reflect admin edits and migrations, not a build-time snapshot.
  await connection();
  const rows = await prisma.productPrice.findMany({
    where: {
      isActive: true,
      product: { status: "ACTIVE" },
    },
    include: { product: true },
    orderBy: [{ edition: "asc" }, { amount: "asc" }],
  });

  if (!rows.length) return fallbackPlans();

  const bestByEdition = new Map<KasaEdition, (typeof rows)[number]>();
  for (const row of rows) {
    const existing = bestByEdition.get(row.edition);
    if (!existing) {
      bestByEdition.set(row.edition, row);
      continue;
    }

    // Prefer the INR website price before comparing billing terms or amounts.
    if (existing.currency !== row.currency) {
      if (row.currency === "INR") bestByEdition.set(row.edition, row);
      if (existing.currency === "INR" || row.currency === "INR") continue;
    }

    if (existing.plan !== "LIFETIME" && row.plan === "LIFETIME") {
      bestByEdition.set(row.edition, row);
      continue;
    }

    if (existing.plan !== "LIFETIME" && Number(row.amount) < Number(existing.amount)) {
      bestByEdition.set(row.edition, row);
    }
  }

  return [...bestByEdition.values()]
    .sort((a, b) => editionOrder[a.edition] - editionOrder[b.edition])
    .map((row) => {
      const name = editionNames[row.edition];
      const price = formatCurrency(row.currency, Number(row.amount));
      const features = normalizeFeatures(row.features, row.edition);
      const rules = normalizeRules(row.rules, row.edition);

      return {
        name,
        eyebrow: `${name} ${formatPlanType(row.plan)}`,
        price:
          row.edition === "ENTERPRISE" || price === "Custom"
            ? "Custom pricing"
            : row.plan === "LIFETIME"
              ? `${price} lifetime`
              : `${price} / ${formatPlanType(row.plan)}`,
        note: row.product.description || editionNotes[row.edition],
        features: publicPlanFeatures(row.edition, row, features, rules),
        highlighted: row.edition === "PLUS",
        bestFor: editionBestFor[row.edition],
      };
    });
}
