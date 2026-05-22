import { Router } from "express";
import {
  changePasswordController,
  choosePlanController,
  dashboardController,
  updateProfileController,
  uploadDocumentsController
} from "../controllers/userController.js";
import { requireUser } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get("/dashboard", requireUser, dashboardController);
router.patch("/profile", requireUser, updateProfileController);
router.patch("/password", requireUser, changePasswordController);
router.post("/plans", requireUser, choosePlanController);
router.post(
  "/documents",
  requireUser,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  uploadDocumentsController
);

export default router;
