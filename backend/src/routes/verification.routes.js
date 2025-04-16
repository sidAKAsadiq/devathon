import express from "express";
import { verifySkill } from "../controllers/verification.controller.js";

const router = express.Router();
router.post("/verify", verifySkill);

export default router;
