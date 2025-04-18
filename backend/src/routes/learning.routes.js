import express from "express";
import { recommendLearningPath } from "../controllers/learning.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/recommend",protect, recommendLearningPath);

export default router;
