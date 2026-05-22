import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

export async function uploadBuffer(buffer: Buffer, folder: string, filename: string) {
  return await new Promise<{ url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url });
      }
    );

    stream.end(buffer);
  });
}
