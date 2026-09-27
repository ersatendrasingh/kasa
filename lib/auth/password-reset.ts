import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/admin/prisma";

const resetLifetimeMs = 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function applicationUrl() {
  const configured = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export async function createPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, select: { id: true, name: true, email: true } });
  if (!user?.email) return { delivered: false, exists: false };

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + resetLifetimeMs);
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id, OR: [{ usedAt: { not: null } }, { expiresAt: { lt: new Date() } }] } }),
    prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
  ]);

  const resetUrl = `${applicationUrl()}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.AUTH_FROM_EMAIL?.trim() || process.env.LEADS_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") console.info(`[password-reset] Local reset link for ${user.email}: ${resetUrl}`);
    return { delivered: false, exists: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: user.email,
      subject: "Reset your KASA password",
      text: `Use this one-time link to reset your KASA password. It expires in 1 hour: ${resetUrl}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2>Reset your KASA password</h2><p>Hello ${escapeHtml(user.name || "there")},</p><p>Use the button below to set a new password. This link expires in one hour and can only be used once.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#1247a6;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Reset password</a></p><p>If you did not request this, you can safely ignore this email.</p></div>`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn("[password-reset] delivery failed", response.status);
    return { delivered: false, exists: true };
  }
  return { delivered: true, exists: true };
}

export async function resetPassword(token: string, passwordHash: string) {
  const storedToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!storedToken || storedToken.usedAt || storedToken.expiresAt <= new Date()) return false;

  await prisma.$transaction([
    prisma.user.update({ where: { id: storedToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: storedToken.id }, data: { usedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: storedToken.userId } }),
  ]);
  return true;
}
