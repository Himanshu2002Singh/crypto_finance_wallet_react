import { z } from "zod";
import { createUserWithdrawal, getUserWithdrawals, getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from "../services/withdrawalService.js";
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
export async function createWithdrawalController(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
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
}
export async function listUserWithdrawalsController(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const withdrawals = await getUserWithdrawals(userId);
    return res.json({ withdrawals });
}
export async function adminListWithdrawalsController(req, res) {
    const status = req.query.status;
    const withdrawals = await getAdminWithdrawals(status);
    return res.json({ withdrawals });
}
export async function adminApproveWithdrawalController(req, res) {
    const adminId = req.adminId;
    if (!adminId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
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
}
export async function adminRejectWithdrawalController(req, res) {
    const adminId = req.adminId;
    if (!adminId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
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
}
