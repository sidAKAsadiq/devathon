import express from "express";
import { verifySkill } from "../controllers/verification.controller.js";
import { getDynamicQuiz } from "../controllers/verification.controller.js";
//import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();
router.post("/verify", verifySkill);
router.get("/quiz", getDynamicQuiz);

export default router;