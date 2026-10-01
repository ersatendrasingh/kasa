import { z } from "zod";

export const demoOperationsSchema = z.object({
  demoToursEnabled: z.coerce.boolean().default(true),
  demoResetOnExpiry: z.coerce.boolean().default(true),
});

export const aiProviderSchema = z.object({
  provider: z.enum(["gemini", "openai"]),
});

export const mediaStorageProviderSchema = z.object({
  provider: z.enum(["cloudinary", "s3"]),
});
