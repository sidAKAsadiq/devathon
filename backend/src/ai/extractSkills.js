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
