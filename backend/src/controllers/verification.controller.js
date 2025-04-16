import User from "../models/user.models.js";
import { quizBank } from "../ai/quizBank.js";
import {async_handler} from "../utils/async_handler.js";
import {api_error} from "../utils/api_error.js";
import {api_response} from "../utils/api_response.js";

export const verifySkill = async_handler(async (req, res) => {
  const { email, skill, answers } = req.body;

  if (!email || !skill || !Array.isArray(answers)) {
    throw new api_error(400, "Missing required fields: email, skill, answers[]");
  }

  const quiz = quizBank[skill];
  if (!quiz) {
    throw new api_error(404, `No quiz found for skill: ${skill}`);
  }

  const correctAnswers = quiz.questions.map(q => q.correctIndex);
  let score = 0;
  answers.forEach((a, i) => {
    if (a === correctAnswers[i]) score++;
  });

  const passed = score >= quiz.passThreshold;

  if (passed) {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $addToSet: { verifiedSkills: skill } },
      { new: true }
    );

    if (!updatedUser) throw new api_error(500, "User not found or update failed");

    return res.status(200).json(
      new api_response(200, {
        status: "passed",
        score,
        badge: {
          skill,
          issuedAt: new Date().toISOString()
        }
      }, "Skill verified successfully")
    );
  } else {
    return res.status(200).json(
      new api_response(200, {
        status: "failed",
        score,
        required: quiz.passThreshold
      }, "Verification failed. Try again later.")
    );
  }
});
