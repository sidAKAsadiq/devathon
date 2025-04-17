import User from "../models/user.models.js";
import { quizBank } from "../ai/quizBank.js";
import {async_handler} from "../utils/async_handler.js";
import {api_error} from "../utils/api_error.js";
import {api_response} from "../utils/api_response.js";
import { generateQuizFromSkill } from "../ai/extractSkills.js";

export const verifySkill = async_handler(async (req, res) => {
  const { email, skill, answers, quiz } = req.body;

  if (!email || !skill || !Array.isArray(answers)) {
    throw new api_error(400, "Missing required fields: email, skill, answers[]");
  }

  // Determine quiz source: static or dynamic
  const effectiveQuiz = quizBank[skill]
    ? { questions: quizBank[skill].questions, passThreshold: quizBank[skill].passThreshold }
    : quiz
    ? { questions: quiz, passThreshold: 2 } // you can make threshold dynamic later
    : null;

  if (!effectiveQuiz) {
    throw new api_error(404, `No quiz found or provided for skill: ${skill}`);
  }

  const correctAnswers = effectiveQuiz.questions.map(q => q.correctIndex);
  let score = 0;
  answers.forEach((a, i) => {
    if (a === correctAnswers[i]) score++;
  });

  const passed = score >= effectiveQuiz.passThreshold;

  if (passed) {
    const badge = {
      skill,
      issuedAt: new Date(),
      method: quiz ? "AI Quiz (Gemini)" : "Static Quiz",
      badgeId: `${skill.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
    };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $addToSet: { verifiedSkills: badge } },
      { new: true }
    );

    return res.status(200).json(
      new api_response(200, {
        status: "passed",
        score,
        badge
      }, "Skill verified successfully")
    );
  } else {
    return res.status(200).json(
      new api_response(200, {
        status: "failed",
        score,
        required: effectiveQuiz.passThreshold
      }, "Verification failed. Try again later.")
    );
  }
});


export const getDynamicQuiz = async_handler(async (req, res) => {
  const { skill } = req.query;
  if (!skill) throw new api_error(400, "Skill is required");

  try {
    const quiz = await generateQuizFromSkill(skill);
    return res.status(200).json(new api_response(200, quiz, "Dynamic quiz generated"));
  } catch (err) {
    console.error("❌ Gemini quiz generation failed:", err.message);
    throw new api_error(500, "Could not generate quiz dynamically");
  }
});