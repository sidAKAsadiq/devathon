import express from "express";
import { matchJobs } from "../controllers/job.controller.js";

const router = express.Router();
router.post("/match", matchJobs);

export default router;
