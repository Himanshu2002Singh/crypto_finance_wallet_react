import { z } from "zod";
import { createLead } from "../services/leadService.js";
import { uploadImage } from "../services/uploadService.js";
const leadSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    country: z.string().min(2),
    password: z.string().min(8),
    message: z.string().optional(),
    referralCode: z.string().optional(),
    idProofUrl: z.string().optional(),
    photoUrl: z.string().optional()
});
async function processFile(file, folder) {
    try {
        return await uploadImage(file, folder);
    }
    catch (err) {
        console.warn("Cloudinary upload fallback to base64 for file:", file.originalname, err);
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    }
}
export async function submitLead(req, res) {
    try {
        const payload = leadSchema.parse(req.body);
        const files = req.files;
        let idProofUrl = payload.idProofUrl;
        let photoUrl = payload.photoUrl;
        let frontUrl = undefined;
        let backUrl = undefined;
        if (files?.idProof?.[0]) {
            frontUrl = await processFile(files.idProof[0], "invest-pro/id-proofs");
        }
        if (files?.idProofBack?.[0]) {
            backUrl = await processFile(files.idProofBack[0], "invest-pro/id-proofs");
        }
        if (frontUrl && backUrl) {
            idProofUrl = JSON.stringify({ front: frontUrl, back: backUrl });
        }
        else if (frontUrl) {
            idProofUrl = JSON.stringify({ front: frontUrl, back: null });
        }
        else if (backUrl) {
            idProofUrl = JSON.stringify({ front: null, back: backUrl });
        }
        if (files?.photo?.[0]) {
            photoUrl = await processFile(files.photo[0], "invest-pro/photos");
        }
        const lead = await createLead({
            ...payload,
            idProofUrl,
            photoUrl
        });
        return res.status(201).json({
            lead,
            message: "Registration completed successfully. You can now log in."
        });
    }
    catch (err) {
        console.error("submitLead error:", err);
        if (err?.code === "P2002") {
            return res.status(400).json({
                message: "An account with this phone number or email is already registered. Please log in directly."
            });
        }
        return res.status(400).json({
            message: err?.message || "Failed to process registration"
        });
    }
}
