import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("1d"),
  ADMIN_JWT_SECRET: z.string().min(1),
  ADMIN_JWT_EXPIRES_IN: z.string().default("1d"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  MAIL_FROM: z.string().min(1),
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().int().positive(),
  MAIL_USER: z.string().min(1),
  MAIL_PASS: z.string().min(1),
  APP_BASE_URL: z.string().min(1)
});

export const env = envSchema.parse(process.env);
