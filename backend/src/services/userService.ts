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
  // Resolve plan by ID or by name
  let targetPlan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!targetPlan) {
    targetPlan = await prisma.plan.findFirst({
      where: { name: { equals: planId } }
    });
  }

  if (!targetPlan) {
    throw new Error("Target plan not found");
  }

  // Deactivate any previous plans for this user so the new plan is instantly active
  await prisma.userPlan.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "CANCELLED" }
  });

  return prisma.userPlan.create({
    data: {
      userId,
      planId: targetPlan.id,
      status: "ACTIVE"
    },
    include: { plan: true }
  });
}

async function processFile(file: Express.Multer.File, folder: string): Promise<string> {
  try {
    return await uploadImage(file, folder);
  } catch (err) {
    console.warn("Cloudinary upload fallback to base64 for file:", file.originalname, err);
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  }
}

export async function uploadUserDocuments(input: {
  userId: string;
  idProofFile?: Express.Multer.File;
  idProofBackFile?: Express.Multer.File;
  photoFile?: Express.Multer.File;
}) {
  if (!input.idProofFile && !input.idProofBackFile && !input.photoFile) {
    throw new Error("Please upload an ID proof or photograph");
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { idProofUrl: true, photoUrl: true }
  });

  let existingFront: string | null = null;
  let existingBack: string | null = null;
  if (existingUser?.idProofUrl) {
    try {
      const parsed = JSON.parse(existingUser.idProofUrl);
      existingFront = parsed.front || null;
      existingBack = parsed.back || null;
    } catch {
      existingFront = existingUser.idProofUrl;
    }
  }

  const data: { idProofUrl?: string; photoUrl?: string } = {};

  let frontUrl = existingFront;
  let backUrl = existingBack;

  if (input.idProofFile) {
    frontUrl = await processFile(input.idProofFile, "invest-pro/id-proofs");
  }
  if (input.idProofBackFile) {
    backUrl = await processFile(input.idProofBackFile, "invest-pro/id-proofs");
  }

  if (frontUrl || backUrl) {
    data.idProofUrl = JSON.stringify({ front: frontUrl || null, back: backUrl || null });
  }

  if (input.photoFile) {
    data.photoUrl = await processFile(input.photoFile, "invest-pro/photos");
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
