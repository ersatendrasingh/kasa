import { prisma } from "@/lib/admin/prisma";

const MEDIA_STORAGE_SETTING_KEY = "article_media_storage";

export const mediaStorageProviders = ["cloudinary", "s3"] as const;
export type MediaStorageProvider = (typeof mediaStorageProviders)[number];

export type MediaStorageSettings = {
  provider: MediaStorageProvider;
};

export const defaultMediaStorageSettings: MediaStorageSettings = {
  provider: "cloudinary",
};

function normalizeProvider(value: unknown): MediaStorageProvider {
  return mediaStorageProviders.includes(value as MediaStorageProvider)
    ? (value as MediaStorageProvider)
    : defaultMediaStorageSettings.provider;
}

function normalizeSettings(value: unknown): MediaStorageSettings {
  if (!value || typeof value !== "object") return defaultMediaStorageSettings;
  return { provider: normalizeProvider((value as { provider?: unknown }).provider) };
}

export async function getMediaStorageSettings(): Promise<MediaStorageSettings> {
  try {
    const setting = await prisma.adminSetting.findUnique({
      where: { key: MEDIA_STORAGE_SETTING_KEY },
    });
    return normalizeSettings(setting?.value);
  } catch {
    return defaultMediaStorageSettings;
  }
}

export async function saveMediaStorageSettings(settings: MediaStorageSettings) {
  const normalized = normalizeSettings(settings);
  return prisma.adminSetting.upsert({
    where: { key: MEDIA_STORAGE_SETTING_KEY },
    update: { value: normalized },
    create: { key: MEDIA_STORAGE_SETTING_KEY, value: normalized },
  });
}

export function getMediaStorageEnvironmentStatus() {
  return {
    cloudinary: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
        process.env.CLOUDINARY_API_KEY?.trim() &&
        process.env.CLOUDINARY_API_SECRET?.trim(),
    ),
    s3: Boolean(
      process.env.ARTICLE_MEDIA_S3_BUCKET?.trim() &&
        (process.env.ARTICLE_MEDIA_S3_ACCESS_KEY_ID?.trim() || process.env.AWS_ACCESS_KEY_ID?.trim()) &&
        (process.env.ARTICLE_MEDIA_S3_SECRET_ACCESS_KEY?.trim() || process.env.AWS_SECRET_ACCESS_KEY?.trim()),
    ),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() || null,
  };
}
