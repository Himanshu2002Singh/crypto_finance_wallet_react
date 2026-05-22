import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();
async function main() {
    const plans = [
        { name: "Bronze", price: "10000" },
        { name: "Silver", price: "25000" },
        { name: "Gold", price: "50000" }
    ];
    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { name: plan.name },
            update: { price: plan.price },
            create: { name: plan.name, price: plan.price }
        });
    }
    const adminName = process.env.ADMIN_SEED_NAME;
    const adminEmail = process.env.ADMIN_SEED_EMAIL;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    if (adminName && adminEmail && adminPassword) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await prisma.admin.upsert({
            where: { email: adminEmail },
            update: { name: adminName, passwordHash },
            create: { name: adminName, email: adminEmail, passwordHash }
        });
    }
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
