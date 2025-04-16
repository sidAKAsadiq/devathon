import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { analyzeSkillGapFromPDF } from '../controllers/skillGap.controller.js';

const router = express.Router();

// Route: POST /api/skill-gap/analyze/pdf
router.post('/analyze/pdf', upload.single('resume'), analyzeSkillGapFromPDF);

export default router;
