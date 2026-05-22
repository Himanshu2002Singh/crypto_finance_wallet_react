import type { Express } from "express";
import { uploadBuffer } from "../utils/cloudinary.js";

const allowedMime = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: Express.Multer.File) {
  if (!allowedMime.includes(file.mimetype)) {
    throw new Error("Invalid file type. Only jpg, png, webp allowed.");
  }
}

export async function uploadImage(file: Express.Multer.File, folder: string) {
  validateImageFile(file);
  const result = await uploadBuffer(file.buffer, folder, file.originalname);
  return result.url;
}
