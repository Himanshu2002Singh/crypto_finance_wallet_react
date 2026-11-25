import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
import { sendAccountApprovedEmail } from "../utils/mailer.js";
export async function adminLogin(email, password) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
        return null;
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
        return null;
    }
    return admin;
}
export async function getAdminDashboard() {
    let pendingWithdrawals = 0;
    if (prisma.withdrawal) {
        try {
            pendingWithdrawals = await prisma.withdrawal.count({ where: { status: "PENDING" } });
        }
        catch {
            // fallback if table being created
        }
    }
    const [totalLeads, pendingLeads, approvedUsers, activeUsers] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: "PENDING" } }),
        prisma.user.count({ where: { status: "PENDING" } }),
        prisma.user.count({ where: { status: "ACTIVE" } })
    ]);
    return { totalLeads, pendingLeads, approvedUsers, activeUsers, pendingWithdrawals };
}
function getReferralCodeFromEmail(email) {
    return email.split("@")[0]?.trim().toLowerCase() ?? "";
}
function normalizeReferralCode(code) {
    return code.trim().toLowerCase().split("@")[0] ?? "";
}
export async function approveLead(input) {
    console.info("Approving lead", { leadId: input.leadId, adminId: input.adminId });
    const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
    if (!lead) {
        throw new Error("Lead not found");
    }
    if (lead.status !== "PENDING") {
        throw new Error("Lead already reviewed");
    }
    if (!lead.passwordHash) {
        throw new Error("Lead password is missing. Ask the user to submit the updated signup form.");
    }
    let user = await prisma.user.findFirst({
        where: {
            OR: [
                { leadId: lead.id },
                { email: lead.email },
                { phone: lead.phone }
            ]
        }
    });
    if (user) {
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                bronzeReturnRate: input.bronzeReturnRate,
                silverReturnRate: input.silverReturnRate,
                goldReturnRate: input.goldReturnRate,
                referralRate: input.bronzeReferralRate,
                bronzeReferralRate: input.bronzeReferralRate,
                silverReferralRate: input.silverReferralRate,
                goldReferralRate: input.goldReferralRate,
                status: "ACTIVE"
            }
        });
    }
    else {
        user = await prisma.user.create({
            data: {
                fullName: lead.fullName,
                email: lead.email,
                phone: lead.phone,
                country: lead.country,
                idProofUrl: lead.idProofUrl,
                photoUrl: lead.photoUrl,
                bronzeReturnRate: input.bronzeReturnRate,
                silverReturnRate: input.silverReturnRate,
                goldReturnRate: input.goldReturnRate,
                referralRate: input.bronzeReferralRate,
                bronzeReferralRate: input.bronzeReferralRate,
                silverReferralRate: input.silverReferralRate,
                goldReferralRate: input.goldReferralRate,
                status: "ACTIVE",
                passwordHash: lead.passwordHash,
                activatedAt: new Date(),
                lead: { connect: { id: lead.id } }
            }
        });
    }
    await prisma.lead.update({
        where: { id: lead.id },
        data: {
            status: "APPROVED",
            assignedBronzeReturn: input.bronzeReturnRate,
            assignedSilverReturn: input.silverReturnRate,
            assignedGoldReturn: input.goldReturnRate,
            assignedReferralRate: input.bronzeReferralRate,
            assignedBronzeReferral: input.bronzeReferralRate,
            assignedSilverReferral: input.silverReferralRate,
            assignedGoldReferral: input.goldReferralRate,
            reviewedById: input.adminId,
            reviewedAt: new Date()
        }
    });
    console.info("Lead approved", { leadId: lead.id, userId: user.id });
    if (lead.referralCode) {
        const referralCode = normalizeReferralCode(lead.referralCode);
        const possibleReferrers = await prisma.user.findMany({
            where: {
                id: { not: user.id },
                status: "ACTIVE"
            },
            select: {
                id: true,
                email: true
            }
        });
        const referrer = possibleReferrers.find((possibleReferrer) => getReferralCodeFromEmail(possibleReferrer.email) === referralCode);
        if (referrer) {
            await prisma.referralRelation.create({
                data: {
                    referrerUserId: referrer.id,
                    referredUserId: user.id,
                    status: "PENDING"
                }
            });
        }
    }
    let emailSent = false;
    try {
        await sendAccountApprovedEmail(user.email);
        console.info("Account approval email sent", { userId: user.id, email: user.email });
        emailSent = true;
    }
    catch (error) {
        console.warn("Account approval email failed (SMTP credentials issue), but lead was approved successfully:", { userId: user.id, error });
    }
    return { user, emailSent };
}
export async function rejectLead(input) {
    const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
    if (!lead) {
        throw new Error("Lead not found");
    }
    if (lead.status !== "PENDING") {
        throw new Error("Lead already reviewed");
    }
    await prisma.lead.update({
        where: { id: lead.id },
        data: {
            status: "REJECTED",
            reviewedById: input.adminId,
            reviewedAt: new Date()
        }
    });
}
export async function updateLeadRates(input) {
    const lead = await prisma.lead.findUnique({
        where: { id: input.leadId },
        include: { user: true }
    });
    if (!lead) {
        throw new Error("Lead not found");
    }
    const updatedLead = await prisma.lead.update({
        where: { id: input.leadId },
        data: {
            assignedBronzeReturn: input.bronzeReturnRate,
            assignedSilverReturn: input.silverReturnRate,
            assignedGoldReturn: input.goldReturnRate,
            assignedReferralRate: input.bronzeReferralRate,
            assignedBronzeReferral: input.bronzeReferralRate,
            assignedSilverReferral: input.silverReferralRate,
            assignedGoldReferral: input.goldReferralRate,
        }
    });
    if (lead.user) {
        await prisma.user.update({
            where: { id: lead.user.id },
            data: {
                bronzeReturnRate: input.bronzeReturnRate,
                silverReturnRate: input.silverReturnRate,
                goldReturnRate: input.goldReturnRate,
                referralRate: input.bronzeReferralRate,
                bronzeReferralRate: input.bronzeReferralRate,
                silverReferralRate: input.silverReferralRate,
                goldReferralRate: input.goldReferralRate,
            }
        });
    }
    return updatedLead;
}
export async function requestReupload(input) {
    const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
    if (!lead) {
        throw new Error("Lead not found");
    }
    const note = input.reason || "Image is not clear. Please re-upload clear ID proof and photograph.";
    const updatedMessage = lead.message ? `${lead.message} | [NOTICE: ${note}]` : `[NOTICE: ${note}]`;
    return prisma.lead.update({
        where: { id: input.leadId },
        data: {
            message: updatedMessage
        }
    });
}
