import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
import { uploadImage } from "./uploadService.js";

function getReferralRateForPlan(user: {
  referralRate: unknown;
  bronzeReferralRate: unknown;
  silverReferralRate: unknown;
  goldReferralRate: unknown;
}, planName: string) {
  const fallbackRate = Number(user.referralRate);
  const normalizedPlan = planName.toLowerCase();

  if (normalizedPlan === "bronze") {
    return Number(user.bronzeReferralRate) || fallbackRate;
  }
  if (normalizedPlan === "silver") {
    return Number(user.silverReferralRate) || fallbackRate;
  }
  if (normalizedPlan === "gold") {
    return Number(user.goldReferralRate) || fallbackRate;
  }

  return fallbackRate;
}

export async function getUserDashboard(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plans: { include: { plan: true } },
      referralsMade: {
        include: {
          referred: {
            include: { plans: { include: { plan: true } } }
          }
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const activePlan = user.plans.find((plan) => plan.status === "ACTIVE");

  let referralEarnings = 0;
  for (const referral of user.referralsMade) {
    const referredActivePlan = referral.referred.plans.find((plan) => plan.status === "ACTIVE");
    if (referredActivePlan) {
      const referralRate = getReferralRateForPlan(user, referredActivePlan.plan.name);
      referralEarnings +=
        Number(referredActivePlan.plan.price) * (referralRate / 100);
    }
  }

  return {
    bronzeReturnRate: user.bronzeReturnRate,
    silverReturnRate: user.silverReturnRate,
    goldReturnRate: user.goldReturnRate,
    referralRate: user.referralRate,
    bronzeReferralRate: user.bronzeReferralRate,
    silverReferralRate: user.silverReferralRate,
    goldReferralRate: user.goldReferralRate,
    activePlan: activePlan?.plan ?? null,
    referralEarnings
  };
}

export async function choosePlan(userId: string, planId: string) {
  const existingActive = await prisma.userPlan.findFirst({
    where: { userId, status: "ACTIVE" }
  });

  if (existingActive) {
    throw new Error("Active plan already exists");
  }

  return prisma.userPlan.create({
    data: {
      userId,
      planId,
      status: "PENDING"
    },
    include: { plan: true }
  });
}

export async function uploadUserDocuments(input: {
  userId: string;
  idProofFile?: Express.Multer.File;
  photoFile?: Express.Multer.File;
}) {
  if (!input.idProofFile && !input.photoFile) {
    throw new Error("Please upload an ID proof or photograph");
  }

  const data: { idProofUrl?: string; photoUrl?: string } = {};

  if (input.idProofFile) {
    data.idProofUrl = await uploadImage(input.idProofFile, "invest-pro/id-proofs");
  }

  if (input.photoFile) {
    data.photoUrl = await uploadImage(input.photoFile, "invest-pro/photos");
  }

  return prisma.user.update({
    where: { id: input.userId },
    data,
    select: {
      id: true,
      idProofUrl: true,
      photoUrl: true
    }
  });
}

export async function updateUserProfile(input: {
  userId: string;
  fullName: string;
  phone: string;
}) {
  return prisma.user.update({
    where: { id: input.userId },
    data: {
      fullName: input.fullName,
      phone: input.phone
    },
    select: {
      id: true,
      fullName: true,
      phone: true
    }
  });
}

export async function changeUserPassword(input: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      id: true,
      passwordHash: true
    }
  });

  if (!user?.passwordHash) {
    throw new Error("Password reset is not available for this account");
  }

  const isCurrentPasswordValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 10);

  await prisma.user.update({
    where: { id: input.userId },
    data: { passwordHash }
  });

  return { success: true };
}
