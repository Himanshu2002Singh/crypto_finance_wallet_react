import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const optionalString = (fallback = "") => z.preprocess((val) => (typeof val === "string" && val.trim() === "" ? undefined : val), z.string().default(fallback));
const envSchema = z.object({
    PORT: optionalString("4000"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: optionalString("invest-pro-jwt-default-secret-key-2026"),
    JWT_EXPIRES_IN: optionalString("1d"),
    ADMIN_JWT_SECRET: optionalString("invest-pro-admin-jwt-default-secret-2026"),
    ADMIN_JWT_EXPIRES_IN: optionalString("1d"),
    CLOUDINARY_CLOUD_NAME: optionalString(""),
    CLOUDINARY_API_KEY: optionalString(""),
    CLOUDINARY_API_SECRET: optionalString(""),
    MAIL_FROM: optionalString("noreply@investpro.com"),
    MAIL_HOST: optionalString("smtp.gmail.com"),
    MAIL_PORT: z.preprocess((val) => (val && String(val).trim() ? Number(val) : 587), z.number().default(587)),
    MAIL_USER: optionalString(""),
    MAIL_PASS: optionalString(""),
    APP_BASE_URL: optionalString("https://www.investzora.com")
});
export const env = envSchema.parse(process.env);
