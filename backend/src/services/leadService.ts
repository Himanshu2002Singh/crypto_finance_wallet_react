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

  return prisma.lead.create({
    data: {
      ...leadData,
      passwordHash
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
