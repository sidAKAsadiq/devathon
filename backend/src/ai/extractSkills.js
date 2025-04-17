import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA0fos5ZRhEQLPXwfyK7HCzeO2eDN0_-z4" );

export const extractSkillsFromPDF = async (pdfBase64) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Extract relevant skills from this resume as a JSON array.",
          },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
        ],
      },
    ],
  });

  const response = await result.response;
  return response.text().trim();
};

export const extractSkillsFromText = async (text, type = "resume") => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Extract a JSON array of relevant skills from this ${type} text:\n"""${text}"""`,
          },
        ],
      },
    ],
  });

  const response = await result.response;
  return response.text().trim();
};


export const generateQuizFromSkill = async (skill) => {
  const prompt = `
Generate a JSON array of 3 beginner-level multiple choice questions to test the skill "${skill}".

Each object must have:
- "question": the question string
- "options": array of 3 strings
- "correctIndex": 0, 1, or 2 (index of the correct answer)

Only return the raw JSON array, no explanation.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  const jsonMatch = rawText.match(/\[.*\]/s);
  if (!jsonMatch) throw new Error("Gemini response parsing failed");

  return JSON.parse(jsonMatch[0]);
};