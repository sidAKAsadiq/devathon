import express from "express";
import { recommendLearningPath } from "../controllers/learning.controller.js";

const router = express.Router();
router.post("/recommend", recommendLearningPath);

export default router;
