import { Router } from "express";
import { listPlansController } from "../controllers/planController.js";

const router = Router();

router.get("/", listPlansController);

export default router;
