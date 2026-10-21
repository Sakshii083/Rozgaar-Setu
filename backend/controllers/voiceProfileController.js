const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate a structured worker profile from spoken text
const generateVoiceProfile = async (req, res) => {
  try {
    const { text, language = "en" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide the transcribed voice text.",
      });
    }

    const supportedLanguages = ["en", "hi", "kn", "ta", "te", "mr"];

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
    });

    const prompt = `
You are an AI assistant that creates professional profiles for skilled workers.

The worker may describe their experience informally or in a regional language.
Understand the statement and return a structured JSON profile.

Extract:
- primarySkill: one standard job skill, or empty string
- skills: an array of specialised skills explicitly mentioned or clearly supported
- experienceYears: a number, or null if not stated
- city: a city explicitly mentioned, or empty string
- serviceAreas: an array of explicitly mentioned localities or service areas
- profileSummary: a concise professional summary based only on the provided information
- missingInformation: an array containing important missing details to ask the worker about

Rules:
- Do not invent a name, city, skill, experience, qualification, or certification.
- Do not treat a guessed location as a verified service area.
- Standardise informal skill names into clear professional terminology.
- Preserve the meaning of the worker's statement.
- Return only valid JSON without Markdown.

Return this exact structure:
{
  "primarySkill": "",
  "skills": [],
  "experienceYears": null,
  "city": "",
  "serviceAreas": [],
  "profileSummary": "",
  "missingInformation": []
}

Worker's preferred language: ${language}

Worker's statement:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    const cleanedText = rawText
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    const profile = JSON.parse(cleanedText);

    if (
      typeof profile.primarySkill !== "string" ||
      !Array.isArray(profile.skills) ||
      !Array.isArray(profile.serviceAreas) ||
      !Array.isArray(profile.missingInformation)
    ) {
      throw new Error("Invalid AI profile format.");
    }

    return res.status(200).json({
      success: true,
      profile,
      source: "gemini",
    });
  } catch (error) {
    console.error("Voice profile generation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate the profile. Please try again.",
    });
  }
};

// Save a worker-confirmed profile to the authenticated user's account
const saveVoiceProfile = async (req, res) => {
  try {
    const {
      primarySkill,
      skills,
      experienceYears,
      city,
      serviceAreas,
      profileSummary,
      preferredLanguage,
    } = req.body;

    if (
      typeof primarySkill !== "string" ||
      !Array.isArray(skills) ||
      !Array.isArray(serviceAreas) ||
      typeof profileSummary !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data.",
      });
    }

    const validLanguages = ["en", "hi", "kn", "ta", "te", "mr"];

    if (
      preferredLanguage &&
      !validLanguages.includes(preferredLanguage)
    ) {
      return res.status(400).json({
        success: false,
        message: "Unsupported preferred language.",
      });
    }

    if (
      experienceYears !== null &&
      experienceYears !== undefined &&
      (!Number.isFinite(experienceYears) ||
        experienceYears < 0 ||
        experienceYears > 80)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience value.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role !== "worker" && user.role !== "professional") {
      return res.status(403).json({
        success: false,
        message: "Only worker accounts can save worker profiles.",
      });
    }

    // Save only fields belonging to the worker profile.
    user.skill = primarySkill.trim();
    user.skills = skills
      .filter((skill) => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (experienceYears !== null && experienceYears !== undefined) {
      user.experience = experienceYears;
    }

    if (typeof city === "string" && city.trim()) {
      user.city = city.trim();
    }

    user.serviceAreas = serviceAreas
      .filter((area) => typeof area === "string")
      .map((area) => area.trim())
      .filter(Boolean);

    user.about = profileSummary.trim();
    user.profileSummary = profileSummary.trim();
    user.profileGeneratedByAI = true;

    if (preferredLanguage) {
      user.preferredLanguage = preferredLanguage;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your AI-generated profile has been saved.",
      profile: {
        primarySkill: user.skill,
        skills: user.skills,
        experienceYears: user.experience,
        city: user.city,
        serviceAreas: user.serviceAreas,
        profileSummary: user.profileSummary,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    console.error("Saving voice profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save your profile.",
    });
  }
};

module.exports = {
  generateVoiceProfile,
  saveVoiceProfile,
};