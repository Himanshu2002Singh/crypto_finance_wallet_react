import { Router } from "express";
import { activateAccountController, loginController, meController } from "../controllers/authController.js";
import { requireUser } from "../middlewares/auth.js";
const router = Router();
router.post("/activate", activateAccountController);
router.post("/login", loginController);
router.get("/me", requireUser, meController);
export default router;
