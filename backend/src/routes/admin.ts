import { Router } from "express";
import {
  adminApproveLeadController,
  adminDashboardController,
  adminGetLeadController,
  adminListLeadsController,
  adminLoginController,
  adminRejectLeadController,
  adminUpdateLeadRatesController,
  adminRequestReuploadController
} from "../controllers/adminController.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/login", adminLoginController);
router.get("/dashboard", requireAdmin, adminDashboardController);
router.get("/leads", requireAdmin, adminListLeadsController);
router.get("/leads/:id", requireAdmin, adminGetLeadController);
router.post("/leads/:id/approve", requireAdmin, adminApproveLeadController);
router.post("/leads/:id/reject", requireAdmin, adminRejectLeadController);
router.put("/leads/:id/rates", requireAdmin, adminUpdateLeadRatesController);
router.post("/leads/:id/request-reupload", requireAdmin, adminRequestReuploadController);

export default router;
