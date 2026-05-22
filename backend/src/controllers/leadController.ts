import { z } from "zod";
import type { Request, Response } from "express";
import { createLead } from "../services/leadService.js";

const leadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  country: z.string().min(2),
  password: z.string().min(8),
  message: z.string().optional(),
  referralCode: z.string().optional()
});

export async function submitLead(req: Request, res: Response) {
  const payload = leadSchema.parse(req.body);
  const lead = await createLead(payload);

  return res.status(201).json({ lead });
}
