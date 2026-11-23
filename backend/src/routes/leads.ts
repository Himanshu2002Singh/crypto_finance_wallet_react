import { Router } from "express";
import { submitLead } from "../controllers/leadController.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "idProofBack", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]),
  submitLead
);

export default router;
