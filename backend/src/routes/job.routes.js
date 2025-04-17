import express from "express";
import { matchJobs } from "../controllers/job.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();
router.post("/match",protect, matchJobs);

export default router;
