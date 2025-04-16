import User from "../models/user.models.js";
import {
  extractSkillsFromPDF,
  extractSkillsFromText,
} from "../ai/extractSkills.js";
import { api_error } from "../utils/api_error.js";
import { api_response } from "../utils/api_response.js";
import { async_handler } from "../utils/async_handler.js";

export const analyzeSkillGapFromPDF = async_handler(async (req, res) => {
  const { name, email, careerGoal, jobDescription } = req.body;

  if (!req.file || !email || !jobDescription) {
    throw new api_error(
      400,
      "Missing required fields: resume, email, or job description"
    );
  }

  const pdfUrl = req.file.path;



  // Fetch PDF from Cloudinary and convert to base64
  const pdfResp = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfBase64 = Buffer.from(pdfResp).toString("base64");

  // Extract resume skills using Gemini
  const resumeSkillsRaw = await extractSkillsFromPDF(pdfBase64);
  console.log(resumeSkillsRaw);
  


  let resumeSkills;
  try {

    try {
      resumeSkills = JSON.parse(resumeSkillsRaw);
    } catch (e) {
      const jsonMatch = resumeSkillsRaw.match(/\[.*\]/s); // match array-like structure
      if (jsonMatch) {
        try {
          resumeSkills = JSON.parse(jsonMatch[0]);
        } catch (inner) {
          console.error("❌ Still failed to parse JSON array:", jsonMatch[0]);
          throw new api_error(
            500,
            "Gemini returned unstructured output. Try again."
          );
        }
      } else {
        console.error(
          "❌ No JSON array found in Gemini response:",
          resumeSkillsRaw
        );
        throw new api_error(500, "Failed to parse skills from resume");
      }
    }
  } catch (e) {
    console.error("❌ Failed to parse resume skills:", resumeSkillsRaw);
    throw new api_error(500, "Failed to parse skills from resume");
  }

  // Extract job skills using Gemini
  const jobSkillsRaw = await extractSkillsFromText(
    jobDescription,
    "job description"
  );

  console.log(jobSkillsRaw);
  

  let jobSkills;
  try {

    try {
      jobSkills = JSON.parse(jobSkillsRaw);
    } catch (e) {
      const jsonMatch = jobSkillsRaw.match(/\[.*\]/s); // find array in response
      if (jsonMatch) {
        try {
          jobSkills = JSON.parse(jsonMatch[0]);
        } catch (inner) {
          console.error(
            "❌ Failed to parse JSON inside matched string:",
            jsonMatch[0]
          );
          throw new api_error(
            500,
            "Failed to parse skills from job description (inner)"
          );
        }
      } else {
        console.error(
          "❌ No skill list found in Gemini job description output:",
          jobSkillsRaw
        );
        throw new api_error(500, "Failed to parse skills from job description");
      }
    }
  } catch (e) {
    console.error("❌ Failed to parse job skills:", jobSkillsRaw);
    throw new api_error(500, "Failed to parse skills from job description");
  }

  console.log(resumeSkills);
  console.log(jobSkills)
  
  const missingSkills = jobSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );
  const transferableSkills = resumeSkills.filter(
    (skill) => !jobSkills.includes(skill)
  );

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      resumeText: pdfUrl,
      careerGoal,
      skills: resumeSkills,
      missingSkills,
      transferableSkills,
    },
    { upsert: true, new: true }
  );

  if (!updatedUser) {
    throw new api_error(500, "Failed to store user data");
  }

  return res.status(200).json(
    new api_response(
      200,
      {
        userId: updatedUser._id,
        resumeSkills,
        jobSkills,
        missingSkills,
        transferableSkills,
      },
      "Skill gap analysis completed"
    )
  );
});
