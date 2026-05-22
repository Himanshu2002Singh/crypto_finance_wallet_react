import type { Request, Response } from "express";
import { listReferrals } from "../services/referralService.js";

export async function listReferralsController(req: Request, res: Response) {
  const userId = req.userId as string;
  const referrals = await listReferrals(userId);
  return res.json({ referrals });
}
