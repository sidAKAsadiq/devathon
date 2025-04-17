import User from "../models/user.models.js";
import { async_handler } from "../utils/async_handler.js";
import { api_error } from "../utils/api_error.js";
import { api_response } from "../utils/api_response.js";

export const getUserProfile = async_handler(async (req, res) => {
  const { email } = req.params;

  if (!email) throw new api_error(400, "Email is required");

  const user = await User.findOne({ email });

  if (!user) throw new api_error(404, "User not found");

  const {
    name,
    careerGoal,
    resumeSkills,
    missingSkills,
    transferableSkills,
    verifiedSkills,
    recommendedJobs,
    recommendedCourses
  } = user;

  return res.status(200).json(
    new api_response(200, {
      name,
      email,
      careerGoal,
      resumeSkills,
      missingSkills,
      transferableSkills,
      verifiedSkills,
      recommendedJobs,
      recommendedCourses
    }, "User profile loaded")
  );
});
