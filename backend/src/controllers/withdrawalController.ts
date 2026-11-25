import type { Response } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../types/express.js";
import {
  createUserWithdrawal,
  getUserWithdrawals,
  getAdminWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} from "../services/withdrawalService.js";

const createWithdrawalSchema = z.object({
  amount: z.coerce.number().positive("Withdrawal amount must be greater than zero"),
  walletAddress: z.string().min(8, "Valid crypto wallet address is required"),
  network: z.string().optional().default("USDT (TRC20)"),
  password: z.string().min(1, "Password is required to authorize withdrawal")
});

const approveWithdrawalSchema = z.object({
  txHash: z.string().optional(),
  note: z.string().optional()
});

const rejectWithdrawalSchema = z.object({
  note: z.string().optional()
});

export async function createWithdrawalController(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = createWithdrawalSchema.parse(req.body);
    const withdrawal = await createUserWithdrawal({
      userId,
      amount: payload.amount,
      walletAddress: payload.walletAddress,
      network: payload.network,
      password: payload.password
    });

    return res.status(201).json({
      message: "Withdrawal request authorized and submitted successfully.",
      withdrawal
    });
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Failed to submit withdrawal request." });
  }
}

export async function listUserWithdrawalsController(req: AuthedRequest, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const withdrawals = await getUserWithdrawals(userId);
    return res.json({ withdrawals });
  } catch (err: any) {
    console.warn("listUserWithdrawalsController error:", err?.message);
    return res.json({ withdrawals: [] });
  }
}

export async function adminListWithdrawalsController(req: AuthedRequest, res: Response) {
  try {
    const status = req.query.status as string | undefined;
    const withdrawals = await getAdminWithdrawals(status);
    return res.json({ withdrawals });
  } catch (err: any) {
    console.warn("adminListWithdrawalsController error:", err?.message);
    return res.json({ withdrawals: [] });
  }
}

export async function adminApproveWithdrawalController(req: AuthedRequest, res: Response) {
  const adminId = req.adminId;
  if (!adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = approveWithdrawalSchema.parse(req.body);
    const withdrawal = await approveWithdrawal({
      withdrawalId: req.params.id,
      adminId,
      txHash: payload.txHash,
      note: payload.note
    });

    return res.json({
      message: "Withdrawal request approved and marked settled.",
      withdrawal
    });
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Failed to approve withdrawal." });
  }
}

export async function adminRejectWithdrawalController(req: AuthedRequest, res: Response) {
  const adminId = req.adminId;
  if (!adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = rejectWithdrawalSchema.parse(req.body);
    const withdrawal = await rejectWithdrawal({
      withdrawalId: req.params.id,
      adminId,
      note: payload.note
    });

    return res.json({
      message: "Withdrawal request rejected.",
      withdrawal
    });
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Failed to reject withdrawal." });
  }
}

