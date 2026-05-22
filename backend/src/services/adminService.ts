import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
import { sendAccountApprovedEmail } from "../utils/mailer.js";

export async function adminLogin(email: string, password: string) {
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
  const [totalLeads, pendingLeads, approvedUsers, activeUsers] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { status: "ACTIVE" } })
  ]);

  return { totalLeads, pendingLeads, approvedUsers, activeUsers };
}

function getReferralCodeFromEmail(email: string) {
  return email.split("@")[0]?.trim().toLowerCase() ?? "";
}

function normalizeReferralCode(code: string) {
  return code.trim().toLowerCase().split("@")[0] ?? "";
}

export async function approveLead(input: {
  leadId: string;
  adminId: string;
  bronzeReturnRate: number;
  silverReturnRate: number;
  goldReturnRate: number;
  bronzeReferralRate: number;
  silverReferralRate: number;
  goldReferralRate: number;
}) {
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

  const user = await prisma.user.create({
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
    const referrer = possibleReferrers.find(
      (possibleReferrer) => getReferralCodeFromEmail(possibleReferrer.email) === referralCode
    );

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

  try {
    await sendAccountApprovedEmail(user.email);
    console.info("Account approval email sent", { userId: user.id, email: user.email });
  } catch (error) {
    console.error("Account approval email failed", { userId: user.id, error });
    throw new Error("Account approval email failed");
  }

  return user;
}

export async function rejectLead(input: { leadId: string; adminId: string }) {
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
