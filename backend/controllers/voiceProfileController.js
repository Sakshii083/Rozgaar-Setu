const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ======================================================
// RULE-BASED FALLBACK FOR VOICE PROFILE GENERATION
// ======================================================
const fallbackVoiceProfileExtraction = (text) => {
  const lower = text.toLowerCase();

  const skillsMap = [
    ["plumber", "Plumber", ["piping", "leakage repair", "sanitary fitting", "water motor"]],
    ["प्लम्बर", "Plumber", ["piping", "sanitary fitting"]],
    ["electrician", "Electrician", ["wiring", "switchboard", "circuit breaker", "inverter"]],
    ["इलेक्ट्रीशियन", "Electrician", ["wiring", "bijli fitting"]],
    ["carpenter", "Carpenter", ["furniture", "woodwork", "cabinet making", "door repair"]],
    ["कारपेंटर", "Carpenter", ["furniture", "woodwork"]],
    ["painter", "Painter", ["wall painting", "distemper", "waterproofing", "texture paint"]],
    ["पेंटर", "Painter", ["wall painting", "texture"]],
    ["mason", "Mason", ["brickwork", "plastering", "flooring", "tiling"]],
    ["राजमिस्त्री", "Mason", ["brickwork", "plastering"]],
    ["driver", "Driver", ["commercial driving", "car driving", "route knowledge"]],
    ["ड्राइवर", "Driver", ["driving"]],
    ["tailor", "Tailor", ["stitching", "alterations", "garment making"]],
    ["दर्जी", "Tailor", ["stitching"]],
    ["cook", "Cook", ["home cooking", "catering", "multicuisine"]],
    ["welder", "Welder", ["arc welding", "gas welding", "fabrication"]],
    ["mechanic", "Mechanic", ["two-wheeler", "engine repair", "diagnostics"]],
    ["housekeeper", "Housekeeper", ["residential cleaning", "deep cleaning"]],
  ];

  let primarySkill = "";
  let skills = [];

  for (const [kw, skillName, related] of skillsMap) {
    if (lower.includes(kw)) {
      primarySkill = skillName;
      skills = related.filter((r) => lower.includes(r.toLowerCase()));
      if (skills.length === 0) {
        skills = [skillName];
      }
      break;
    }
  }

  if (!primarySkill) {
    primarySkill = "General Skilled Worker";
    skills = ["General Maintenance"];
  }

  // Extract years of experience
  let experienceYears = null;
  const expMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?|year|साल|वर्ष)/i);
  if (expMatch) {
    const val = parseFloat(expMatch[1]);
    if (!isNaN(val) && val >= 0 && val <= 80) {
      experienceYears = val;
    }
  }

  // Extract City
  const cities = [
    "Pune", "Mumbai", "Bengaluru", "Hyderabad", "Delhi", "Kolkata", "Chennai",
    "Ahmedabad", "Jaipur", "Lucknow", "Nagpur", "Indore", "Nashik", "Belgaum",
    "Mysuru", "Hubballi", "Surat", "Patna", "Bhopal", "Kanpur"
  ];

  let city = "";
  for (const c of cities) {
    if (lower.includes(c.toLowerCase())) {
      city = c;
      break;
    }
  }

  // Extract Service Areas
  const serviceAreas = [];
  if (city) {
    serviceAreas.push(city);
  }

  // Summary
  const expText = experienceYears !== null ? `with ${experienceYears} years of experience` : "with practical experience";
  const cityText = city ? `based in ${city}` : "available for local work";
  const profileSummary = `Dedicated ${primarySkill} ${expText}, ${cityText}. Skilled in ${skills.join(", ")}. Reliable, prompt, and committed to high quality work.`;

  // Missing info to prompt user
  const missingInformation = [];
  if (!experienceYears) missingInformation.push("Years of professional experience");
  if (!city) missingInformation.push("City or primary service location");

  return {
    primarySkill,
    skills,
    experienceYears,
    city,
    serviceAreas,
    profileSummary,
    missingInformation,
  };
};

// ======================================================
// GENERATE VOICE PROFILE
// ======================================================
const generateVoiceProfile = async (req, res) => {
  try {
    const { text, language = "en" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide the transcribed voice or typed text.",
      });
    }

    const supportedLanguages = ["en", "hi", "kn", "ta", "te", "mr"];
    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language.",
      });
    }

    // Try Gemini if configured
    if (genAI && process.env.GEMINI_API_KEY) {
      const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const prompt = `
You are an AI assistant that creates professional profiles for skilled workers (e.g. plumbers, electricians, carpenters, painters, drivers, masons).
The worker described their experience informally:
"${text}"

Language: ${language}

Extract:
- primarySkill: one standard skill (e.g. "Plumber")
- skills: array of specific skills mentioned
- experienceYears: number or null
- city: city explicitly mentioned or empty string
- serviceAreas: array of localities mentioned
- profileSummary: professional concise summary
- missingInformation: array of important missing details

Return ONLY valid JSON:
{
  "primarySkill": "",
  "skills": [],
  "experienceYears": null,
  "city": "",
  "serviceAreas": [],
  "profileSummary": "",
  "missingInformation": []
}
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
          if (typeof profile.primarySkill === "string" && Array.isArray(profile.skills)) {
            return res.status(200).json({
              success: true,
              profile,
              source: "gemini",
            });
          }
        } catch (err) {
          console.warn(`Voice profile Gemini attempt with ${modelName} failed:`, err.message);
        }
      }
    }

    // Fallback extraction
    console.log("Using rule-based profile generator for Vaani AI.");
    const fallbackProfile = fallbackVoiceProfileExtraction(text);

    return res.status(200).json({
      success: true,
      profile: fallbackProfile,
      source: "fallback",
    });

  } catch (error) {
    console.error("Voice profile generation error:", error.message);
    const fallbackProfile = fallbackVoiceProfileExtraction(req.body?.text || "");

    return res.status(200).json({
      success: true,
      profile: fallbackProfile,
      source: "fallback",
    });
  }
};

// ======================================================
// SAVE VOICE PROFILE
// ======================================================
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
    if (preferredLanguage && !validLanguages.includes(preferredLanguage)) {
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

    // Save fields
    user.skill = primarySkill.trim();
    user.skills = skills
      .filter((s) => typeof s === "string")
      .map((s) => s.trim())
      .filter(Boolean);

    if (experienceYears !== null && experienceYears !== undefined) {
      user.experience = experienceYears;
    }

    if (typeof city === "string" && city.trim()) {
      user.city = city.trim();
    }

    user.serviceAreas = serviceAreas
      .filter((a) => typeof a === "string")
      .map((a) => a.trim())
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
