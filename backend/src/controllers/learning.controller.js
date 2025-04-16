import User from "../models/user.models.js";
import {async_handler} from "../utils/async_handler.js";
import {api_response} from "../utils/api_response.js";
import {api_error} from "../utils/api_error.js";
import { courseList } from "../ai/courseData.js";
import { fetchCoursesFromAPI } from "../utils/fetchCourses.js";

export const recommendLearningPath = async_handler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new api_error(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new api_error(404, "User not found");

  const { missingSkills } = user;
  if (!missingSkills || missingSkills.length === 0) {
    return res.status(200).json(new api_response(200, [], "No missing skills. No recommendations needed."));
  }

  let recommendedCourses = [];

  for (const skill of missingSkills) {
    const liveCourses = await fetchCoursesFromAPI(skill);
    if (liveCourses) {
      recommendedCourses.push(...liveCourses);
    } else {
      const fallback = courseList.filter(c => c.skillCovered === skill);
      recommendedCourses.push(...fallback);
    }
  }
  
  

  return res.status(200).json(
    new api_response(200, { recommendedCourses }, "Recommended learning path generated")
  );
});
