import { Router } from "express";
import { listReferralsController } from "../controllers/referralController.js";
import { requireUser } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireUser, listReferralsController);

export default router;
