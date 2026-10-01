import { createHash, createHmac, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/admin/prisma";
import {
  getMediaStorageEnvironmentStatus,
  getMediaStorageSettings,
  type MediaStorageProvider,
} from "@/lib/admin/media-storage-settings";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 4 * 1024 * 1024;
const db = prisma;

export const runtime = "nodejs";

function extensionForType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for article media uploads.`);
  return value;
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function sha256(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

function encodeKey(value: string) {
  return value.split("/").map(encodeURIComponent).join("/");
}

async function uploadToS3({
  body,
  contentType,
  key,
}: {
  body: Buffer;
  contentType: string;
  key: string;
}) {
  const bucket = requiredEnv("ARTICLE_MEDIA_S3_BUCKET");
  const region = process.env.ARTICLE_MEDIA_S3_REGION || process.env.AWS_REGION || "ap-south-1";
  const accessKeyId = process.env.ARTICLE_MEDIA_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.ARTICLE_MEDIA_S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("S3 access key and secret are required for article media uploads.");
  }

  const endpoint = process.env.ARTICLE_MEDIA_S3_ENDPOINT;
  const forcePathStyle = process.env.ARTICLE_MEDIA_S3_FORCE_PATH_STYLE === "true" || Boolean(endpoint);
  const baseUrl = endpoint
    ? new URL(endpoint)
    : new URL(`https://${bucket}.s3.${region}.amazonaws.com`);
  const encodedKey = encodeKey(key);
  const url = forcePathStyle
    ? new URL(`/${bucket}/${encodedKey}`, baseUrl)
    : new URL(`/${encodedKey}`, baseUrl);
  const host = url.host;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256(body);
  const canonicalUri = url.pathname;
  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join("\n") + "\n";
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const scope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256(canonicalRequest),
  ].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateStamp), region), "s3"), "aws4_request");
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const uploadBody = new ArrayBuffer(body.byteLength);
  new Uint8Array(uploadBody).set(body);

  const response = await fetch(url, {
    method: "PUT",
    body: uploadBody,
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`S3 upload failed: ${response.status} ${errorText.slice(0, 240)}`);
  }

  const publicBase = process.env.ARTICLE_MEDIA_PUBLIC_BASE_URL;
  return publicBase
    ? `${publicBase.replace(/\/$/, "")}/${encodedKey}`
    : url.toString();
}

async function uploadToCloudinary({
  body,
  contentType,
  fileName,
}: {
  body: Buffer;
  contentType: string;
  fileName: string;
}) {
  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requiredEnv("CLOUDINARY_API_KEY");
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const folder = process.env.CLOUDINARY_ARTICLE_MEDIA_FOLDER?.trim() || "kasa/articles";
  const publicId = fileName.replace(/\.[^.]+$/, "");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureSource = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureSource).digest("hex");
  const formData = new FormData();

  formData.set("file", new Blob([new Uint8Array(body)], { type: contentType }), fileName);
  formData.set("api_key", apiKey);
  formData.set("timestamp", timestamp);
  formData.set("folder", folder);
  formData.set("public_id", publicId);
  formData.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const payload = await response.json().catch(() => null) as { secure_url?: string; error?: { message?: string } } | null;

  if (!response.ok || !payload?.secure_url) {
    throw new Error(`Cloudinary upload failed: ${payload?.error?.message || response.statusText || response.status}`);
  }

  return payload.secure_url;
}

async function uploadLocally(body: Buffer, fileName: string) {
  const uploadDirectory = join(process.cwd(), "public", "uploads", "articles");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(join(uploadDirectory, fileName), body);
  return `/uploads/articles/${fileName}`;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    const articleId = String(formData.get("articleId") || "").trim();
    const coverImageAlt = String(formData.get("coverImageAlt") || "").trim().slice(0, 180);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Upload JPG, PNG, WEBP, or GIF images only." }, { status: 400 });
    }

    if (file.size > maxBytes) {
      return NextResponse.json({ error: "Image must be smaller than 4 MB." }, { status: 400 });
    }

    const fileName = `${Date.now().toString(36)}-${randomUUID()}.${extensionForType(file.type)}`;
    const key = `articles/${fileName}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const settings = await getMediaStorageSettings();
    const status = getMediaStorageEnvironmentStatus();
    let url: string;
    let provider: MediaStorageProvider | "local" = settings.provider;
    let fallbackUsed = false;

    if (settings.provider === "cloudinary") {
      try {
        if (!status.cloudinary) throw new Error("Cloudinary server credentials are not configured.");
        url = await uploadToCloudinary({ body: bytes, contentType: file.type, fileName });
      } catch (cloudinaryError) {
        if (!status.s3) throw cloudinaryError;
        url = await uploadToS3({ body: bytes, contentType: file.type, key });
        provider = "s3";
        fallbackUsed = true;
      }
    } else if (status.s3) {
      url = await uploadToS3({ body: bytes, contentType: file.type, key });
    } else {
      url = await uploadLocally(bytes, fileName);
      provider = "local";
    }

    if (articleId) {
      await db.article.update({
        where: { id: articleId },
        data: { coverImage: url, coverImageAlt: coverImageAlt || null },
      });
    }

    return NextResponse.json({
      url,
      size: file.size,
      provider,
      fallbackUsed,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 500 },
    );
  }
}
