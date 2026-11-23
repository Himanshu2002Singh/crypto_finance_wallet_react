import { z } from "zod";
import { activateAccount, loginUser } from "../services/authService.js";
import { signUserToken } from "../utils/jwt.js";
import { prisma } from "../utils/prisma.js";
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
const activateSchema = z.object({
    token: z.string().min(10),
    password: z.string().min(8)
});
export async function activateAccountController(req, res) {
    try {
        const payload = activateSchema.parse(req.body);
        const user = await activateAccount(payload.token, payload.password);
        return res.json({ user: { id: user.id, email: user.email } });
    }
    catch (error) {
        console.error("Activation error", { message: error?.message });
        return res.status(400).json({ message: error?.message || "Activation failed" });
    }
}
export async function loginController(req, res) {
    const payload = loginSchema.parse(req.body);
    const user = await loginUser(payload.email, payload.password);
    if (!user) {
        console.warn("Login failed", { email: payload.email });
        return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.status !== "ACTIVE") {
        console.warn("Login blocked for inactive user", { userId: user.id });
        return res.status(403).json({ message: "Account not active" });
    }
    const token = signUserToken({ userId: user.id });
    return res.json({
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email }
    });
}
export async function meController(req, res) {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            country: true,
            idProofUrl: true,
            photoUrl: true,
            bronzeReturnRate: true,
            silverReturnRate: true,
            goldReturnRate: true,
            referralRate: true,
            bronzeReferralRate: true,
            silverReferralRate: true,
            goldReferralRate: true,
            status: true
        }
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
}
