import { Router } from "express";
import leadRoutes from "./leads.js";
import adminRoutes from "./admin.js";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import planRoutes from "./plans.js";
import referralRoutes from "./referrals.js";

const router = Router();

router.use("/leads", leadRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/plans", planRoutes);
router.use("/referrals", referralRoutes);

export default router;
