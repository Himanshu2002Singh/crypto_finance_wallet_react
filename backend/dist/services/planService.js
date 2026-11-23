import { prisma } from "../utils/prisma.js";
export async function listPlans() {
    return prisma.plan.findMany({ orderBy: { price: "asc" } });
}
