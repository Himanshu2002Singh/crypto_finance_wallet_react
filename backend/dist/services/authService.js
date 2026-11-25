import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
export async function activateAccount(token, password) {
    const activation = await prisma.activationToken.findUnique({ where: { token } });
    if (!activation) {
        console.warn("Activation token not found", { token });
        throw new Error("Invalid activation token");
    }
    if (activation.usedAt) {
        console.warn("Activation token already used", { token });
        throw new Error("Activation token already used");
    }
    if (activation.expiresAt < new Date()) {
        console.warn("Activation token expired", { token });
        throw new Error("Activation token expired");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
        where: { id: activation.userId },
        data: {
            passwordHash,
            status: "ACTIVE",
            activatedAt: new Date()
        }
    });
    await prisma.activationToken.update({
        where: { id: activation.id },
        data: { usedAt: new Date() }
    });
    console.info("Account activated", { userId: user.id });
    return user;
}
export async function loginUser(identifier, password) {
    const cleanId = identifier.trim();
    let user = null;
    if (cleanId.includes("@")) {
        user = await prisma.user.findFirst({
            where: { email: cleanId.toLowerCase() }
        });
    }
    else {
        // Allows logging in by User ID (e.g. KRTIMPEX)
        user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: { startsWith: `${cleanId.toLowerCase()}@` } },
                    { email: cleanId.toLowerCase() }
                ]
            }
        });
    }
    if (!user || !user.passwordHash) {
        return null;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return null;
    }
    return user;
}
