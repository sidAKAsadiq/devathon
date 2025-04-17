import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { analyzeSkillGapFromPDF } from '../controllers/skillGap.controller.js';
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Route: POST /api/skill-gap/analyze/pdf
router.post('/analyze/pdf', upload.single('resume'), protect ,analyzeSkillGapFromPDF);

export default router;
