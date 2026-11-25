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
  const cleanEmail = data.email.toLowerCase().trim();
  const cleanPhone = data.phone.trim();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const { password, ...leadData } = data;

  // 1. Look for existing lead by email or phone
  let lead: any = await prisma.lead.findFirst({
    where: {
      OR: [
        { email: cleanEmail },
        { phone: cleanPhone }
      ]
    }
  });

  if (lead) {
    // Update existing lead record with fresh credentials & info
    lead = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        fullName: data.fullName,
        country: data.country,
        message: data.message || lead.message,
        referralCode: data.referralCode || lead.referralCode,
        idProofUrl: data.idProofUrl || lead.idProofUrl,
        photoUrl: data.photoUrl || lead.photoUrl,
        passwordHash,
        status: "APPROVED"
      }
    });
  } else {
    // Create new lead record with safe fallback
    try {
      lead = await prisma.lead.create({
        data: {
          ...leadData,
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash,
          status: "APPROVED"
        }
      });
    } catch (createErr: any) {
      if (createErr?.code === "P2002") {
        lead = await prisma.lead.findFirst({
          where: {
            OR: [
              { email: cleanEmail },
              { phone: cleanPhone }
            ]
          }
        });
      }
      if (!lead) {
        throw createErr;
      }
    }
  }

  if (!lead) {
    throw new Error("Unable to create or locate lead record.");
  }

  // Provision / update active User account immediately so investor can login right away without KYC
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: cleanEmail },
        { phone: cleanPhone },
        { leadId: lead.id }
      ]
    }
  });

  let user = existingUser;
  if (existingUser) {
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        fullName: data.fullName,
        country: data.country,
        passwordHash,
        status: "ACTIVE",
        idProofUrl: data.idProofUrl || existingUser.idProofUrl,
        photoUrl: data.photoUrl || existingUser.photoUrl
      }
    });
  } else {
    try {
      user = await prisma.user.create({
        data: {
          fullName: data.fullName,
          email: cleanEmail,
          phone: cleanPhone,
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
        if (referrer && referrer.id !== user.id) {
          try {
            await prisma.referralRelation.create({
              data: {
                referrerUserId: referrer.id,
                referredUserId: user.id,
                status: "ACTIVE"
              }
            });
          } catch (e) {
            console.warn("Referral relation creation skipped:", e);
          }
        }
      }
    } catch (userErr: any) {
      console.warn("User provisioning notice:", userErr?.message);
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
