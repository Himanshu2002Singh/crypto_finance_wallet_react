import type { Request, Response } from "express";
import { listPlans } from "../services/planService.js";

export async function listPlansController(_req: Request, res: Response) {
  const plans = await listPlans();
  return res.json({ plans });
}
