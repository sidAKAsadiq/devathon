import express from "express";
import { verifySkill } from "../controllers/verification.controller.js";
import { getDynamicQuiz } from "../controllers/verification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();
router.post("/verify",protect, verifySkill);
router.get("/quiz",protect, getDynamicQuiz);

export default router;