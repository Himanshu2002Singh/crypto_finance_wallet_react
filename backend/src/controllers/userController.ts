import type { Request, Response } from "express";
import { z } from "zod";
import {
  changeUserPassword,
  choosePlan,
  getUserDashboard,
  updateUserProfile,
  uploadUserDocuments
} from "../services/userService.js";

const choosePlanSchema = z.object({
  planId: z.string().min(1)
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7)
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
});

export async function dashboardController(req: Request, res: Response) {
  const userId = req.userId as string;
  const dashboard = await getUserDashboard(userId);
  return res.json(dashboard);
}

export async function choosePlanController(req: Request, res: Response) {
  const userId = req.userId as string;
  const payload = choosePlanSchema.parse(req.body);
  const plan = await choosePlan(userId, payload.planId);
  return res.status(201).json({ plan });
}

export async function uploadDocumentsController(req: Request, res: Response) {
  const userId = req.userId as string;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const user = await uploadUserDocuments({
    userId,
    idProofFile: files?.idProof?.[0],
    photoFile: files?.photo?.[0]
  });

  return res.json({ user });
}

export async function updateProfileController(req: Request, res: Response) {
  const userId = req.userId as string;
  const payload = updateProfileSchema.parse(req.body);
  const user = await updateUserProfile({
    userId,
    fullName: payload.fullName,
    phone: payload.phone
  });

  return res.json({ user });
}

export async function changePasswordController(req: Request, res: Response) {
  const userId = req.userId as string;
  const payload = changePasswordSchema.parse(req.body);
  const result = await changeUserPassword({
    userId,
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword
  });

  return res.json(result);
}
