import User from "../models/user.models.js";
import { jobList } from "../ai/jobData.js";
import {async_handler} from "../utils/async_handler.js";
import {api_response} from "../utils/api_response.js";
import {api_error} from "../utils/api_error.js";

export const matchJobs = async_handler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new api_error(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new api_error(404, "User not found");

  const userSkills = user.skills || [];

  const matchedJobs = jobList.map((job) => {
    const matchedSkills = job.requiredSkills.filter(skill =>
      userSkills.includes(skill)
    );
    const missingSkills = job.requiredSkills.filter(skill =>
      !userSkills.includes(skill)
    );
    const matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);

    return {
      ...job,
      matchedSkills,
      missingSkills,
      matchScore
    };
  });

  const topMatches = matchedJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return res.status(200).json(
    new api_response(200, { recommendedJobs: topMatches }, "Top job matches generated")
  );
});
