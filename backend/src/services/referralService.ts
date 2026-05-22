import { prisma } from "../utils/prisma.js";

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

export async function listReferrals(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
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

  return user.referralsMade.map((referral) => {
    const activePlan = referral.referred.plans.find((plan) => plan.status === "ACTIVE");
    const referralRate = activePlan ? getReferralRateForPlan(user, activePlan.plan.name) : 0;
    const bonus = activePlan
      ? Number(activePlan.plan.price) * (referralRate / 100)
      : 0;

    return {
      referredUser: referral.referred.fullName,
      selectedPlan: activePlan?.plan ?? null,
      referralRate,
      referralBonus: bonus,
      status: referral.status
    };
  });
}
