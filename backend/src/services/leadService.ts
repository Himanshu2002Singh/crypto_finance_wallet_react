import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";

export async function createLead(data: {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  message?: string;
  referralCode?: string;
  idProofUrl?: string;
  photoUrl?: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const { password, ...leadData } = data;

  // Create lead record
  const lead = await prisma.lead.create({
    data: {
      ...leadData,
      passwordHash,
      status: "APPROVED"
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      country: true,
      message: true,
      referralCode: true,
      idProofUrl: true,
      photoUrl: true,
      status: true,
      createdAt: true
    }
  });

  // Provision active User account immediately so investor can login right away without KYC
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email.toLowerCase().trim() },
        { phone: data.phone.trim() }
      ]
    }
  });

  if (!existingUser) {
    const newUser = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        country: data.country,
        idProofUrl: data.idProofUrl || null,
        photoUrl: data.photoUrl || null,
        bronzeReturnRate: 1.5,
        silverReturnRate: 2.0,
        goldReturnRate: 2.5,
        referralRate: 2.0,
        bronzeReferralRate: 2.0,
        silverReferralRate: 2.5,
        goldReferralRate: 3.0,
        status: "ACTIVE",
        passwordHash,
        activatedAt: new Date(),
        lead: { connect: { id: lead.id } }
      }
    });

    if (data.referralCode) {
      const cleanRef = data.referralCode.trim().toLowerCase().split("@")[0];
      const referrer = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { startsWith: `${cleanRef}@` } },
            { email: cleanRef }
          ]
        }
      });
      if (referrer && referrer.id !== newUser.id) {
        try {
          await prisma.referralRelation.create({
            data: {
              referrerUserId: referrer.id,
              referredUserId: newUser.id,
              status: "ACTIVE"
            }
          });
        } catch (e) {
          console.warn("Referral relation creation skipped:", e);
        }
      }
    }
  }

  return lead;
}

export async function listLeads(status?: string) {
  return prisma.lead.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" }
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({ where: { id } });
}
