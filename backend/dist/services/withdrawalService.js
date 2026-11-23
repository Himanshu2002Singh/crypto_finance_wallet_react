import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
export async function createUserWithdrawal(input) {
    const user = await prisma.user.findUnique({
        where: { id: input.userId }
    });
    if (!user) {
        throw new Error("User account not found.");
    }
    if (user.status !== "ACTIVE") {
        throw new Error("Only active and approved accounts can request withdrawals.");
    }
    if (!user.passwordHash) {
        throw new Error("Password authentication is required to authorize withdrawal.");
    }
    // Mandatory Authentication Check
    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
        throw new Error("Authentication failed. Incorrect account password.");
    }
    if (!input.walletAddress || input.walletAddress.trim().length < 8) {
        throw new Error("Please provide a valid crypto wallet address.");
    }
    if (input.amount <= 0) {
        throw new Error("Withdrawal amount must be greater than zero.");
    }
    const network = input.network?.trim() || "USDT (TRC20)";
    const withdrawal = await prisma.withdrawal.create({
        data: {
            userId: user.id,
            amount: input.amount,
            walletAddress: input.walletAddress.trim(),
            network,
            phone: user.phone,
            status: "PENDING"
        }
    });
    return withdrawal;
}
export async function getUserWithdrawals(userId) {
    return prisma.withdrawal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });
}
export async function getAdminWithdrawals(status) {
    return prisma.withdrawal.findMany({
        where: status && status !== "ALL" ? { status: status } : undefined,
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    country: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}
export async function approveWithdrawal(input) {
    const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: input.withdrawalId }
    });
    if (!withdrawal) {
        throw new Error("Withdrawal request not found.");
    }
    if (withdrawal.status !== "PENDING") {
        throw new Error(`Withdrawal request has already been ${withdrawal.status.toLowerCase()}.`);
    }
    return prisma.withdrawal.update({
        where: { id: input.withdrawalId },
        data: {
            status: "APPROVED",
            txHash: input.txHash?.trim() || null,
            adminNote: input.note?.trim() || "Approved and disbursed.",
            reviewedById: input.adminId,
            reviewedAt: new Date()
        }
    });
}
export async function rejectWithdrawal(input) {
    const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: input.withdrawalId }
    });
    if (!withdrawal) {
        throw new Error("Withdrawal request not found.");
    }
    if (withdrawal.status !== "PENDING") {
        throw new Error(`Withdrawal request has already been ${withdrawal.status.toLowerCase()}.`);
    }
    return prisma.withdrawal.update({
        where: { id: input.withdrawalId },
        data: {
            status: "REJECTED",
            adminNote: input.note?.trim() || "Request rejected by compliance.",
            reviewedById: input.adminId,
            reviewedAt: new Date()
        }
    });
}
