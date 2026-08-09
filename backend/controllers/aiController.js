const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseJobProfile = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are Rozgaar Saathi, an AI assistant for an employment platform in India.

Analyze the user's spoken statement and extract employment-related information.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Use exactly this structure:

{
  "intent": "job_seeker | employer | unknown",
  "skill": "",
  "experience": "",
  "city": "",
  "area": "",
  "wage": "",
  "jobType": "",
  "availability": "",
  "description": ""
}

Rules:
- Do not invent information.
- If information is missing, return an empty string.
- Convert spoken information into concise structured values.
- Keep the original meaning.
- If the person is looking for work, use "job_seeker".
- If the person wants to hire someone, use "employer".

User statement:
${text}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const rawText = response.text().trim();

    let parsedData;

    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", rawText);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response",
      });
    }

    return res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("AI Processing Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI processing failed",
    });
  }
};

module.exports = {
  parseJobProfile,
};