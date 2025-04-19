import User from "../models/user.models.js";
import { async_handler } from "../utils/async_handler.js";
import { api_response } from "../utils/api_response.js";
import { api_error } from "../utils/api_error.js";
import { fetchJobsFromAPI } from "../utils/fetchJobs.js";
import { extractSkillsFromText } from "../ai/extractSkills.js";

const escapeRegex = (text) => {
  return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const matchJobs = async_handler(async (req, res) => {
  const { email, goal, location } = req.body;
  if (!email) throw new api_error(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new api_error(404, "User not found");

  const userSkills = user.skills || [];
  const jobList = await fetchJobsFromAPI(goal, location);
  console.log(jobList, "✅ Fetched Job List");

  const matchedJobs = await Promise.all(jobList?.map(async (job) => {
    const description = job.details?.description || job.job_description || "";

    let extracted = await extractSkillsFromText(description, "job description");
    console.log("🔍 Raw extracted skills:", extracted);

    const requiredSkills = Array.isArray(extracted)
      ? extracted
      : typeof extracted === "string"
        ? extracted.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    console.log(`📝 Required Skills for ${job.job_title}:`, requiredSkills);

    const matchedSkills = userSkills.filter(skill => {
      const safeSkill = escapeRegex(skill);
      const regex = new RegExp(`\\b${safeSkill}\\b`, 'i');
      return requiredSkills.some(req => regex.test(req));
    });
    console.log(matchedSkills , "matched")

    const missingSkills = requiredSkills.filter(reqSkill => {
      const safeSkill = escapeRegex(reqSkill);
      const regex = new RegExp(`\\b${safeSkill}\\b`, 'i');
      return !userSkills.some(userSkill => regex.test(userSkill));
    });
    console.log(missingSkills, "missing")
    const matchScore = requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100);
     console.log(matchScore , "score")
    return {
      ...job,
      requiredSkills,
      matchedSkills,
      missingSkills,
      matchScore
    };
  }));

  const topMatches = matchedJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
    console.log(topMatches , "top")
  return res.status(200).json(
    new api_response(200, { recommendedJobs: topMatches }, "✅ Top job matches generated")
  );
});
