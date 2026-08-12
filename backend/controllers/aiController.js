const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// ======================================================
// FALLBACK EXTRACTION
// ======================================================

const fallbackExtraction = (text) => {
  const lowerText = text.toLowerCase();

  let skill = "";
  let city = "";
  let experience = "";
  let wage = "";
  let intent = "unknown";

  // -----------------------------
  // Intent
  // -----------------------------

  const employerWords = [
    "hire",
    "hiring",
    "need a worker",
    "need someone",
    "worker required",
    "employee required",
    "chahiye worker",
    "aadmi chahiye",
    "कामगार चाहिए",
    "कर्मचारी चाहिए",
  ];

  const workerWords = [
    "looking for work",
    "need work",
    "want a job",
    "find a job",
    "job chahiye",
    "kaam chahiye",
    "काम चाहिए",
    "नौकरी चाहिए",
  ];

  if (employerWords.some((word) => lowerText.includes(word))) {
    intent = "employer";
  } else if (
    workerWords.some((word) => lowerText.includes(word))
  ) {
    intent = "job_seeker";
  }

  // -----------------------------
  // Skills
  // -----------------------------

  const skills = [
    ["electrician", "Electrician"],
    ["इलेक्ट्रीशियन", "Electrician"],
    ["plumber", "Plumber"],
    ["प्लम्बर", "Plumber"],
    ["plumbing", "Plumber"],
    ["carpenter", "Carpenter"],
    ["कारपेंटर", "Carpenter"],
    ["painter", "Painter"],
    ["पेंटर", "Painter"],
    ["mason", "Mason"],
    ["राजमिस्त्री", "Mason"],
    ["driver", "Driver"],
    ["ड्राइवर", "Driver"],
    ["tailor", "Tailor"],
    ["दर्जी", "Tailor"],
    ["cook", "Cook"],
    ["कुक", "Cook"],
    ["welder", "Welder"],
    ["वेल्डर", "Welder"],
    ["mechanic", "Mechanic"],
    ["मैकेनिक", "Mechanic"],
  ];

  for (const [keyword, value] of skills) {
    if (lowerText.includes(keyword)) {
      skill = value;
      break;
    }
  }

  // -----------------------------
  // Experience
  // -----------------------------

  const experienceMatch = lowerText.match(
    /(\d+(?:\.\d+)?)\s*(?:years?|yrs?|year|साल|वर्ष)/
  );

  if (experienceMatch) {
    experience = `${experienceMatch[1]} years`;
  }

  // -----------------------------
  // Wage
  // -----------------------------

  const rupeeMatch = lowerText.match(
    /(?:₹|rs\.?|rupees?|रुपये?|रुपए?)\s*(\d+(?:,\d+)?)/i
  );

  if (rupeeMatch) {
    wage = `₹${rupeeMatch[1]}`;
  } else {
    const dailyMatch = lowerText.match(
      /(?:daily|per day|रोज|रोजाना)\D{0,20}(\d{3,6})/
    );

    if (dailyMatch) {
      wage = `₹${dailyMatch[1]}/day`;
    }
  }

  // -----------------------------
  // Cities
  // -----------------------------

  const cities = [
    ["pune", "Pune"],
    ["पुणे", "Pune"],
    ["mumbai", "Mumbai"],
    ["मुंबई", "Mumbai"],
    ["delhi", "Delhi"],
    ["दिल्ली", "Delhi"],
    ["bengaluru", "Bengaluru"],
    ["bangalore", "Bengaluru"],
    ["hyderabad", "Hyderabad"],
    ["chennai", "Chennai"],
    ["kolkata", "Kolkata"],
    ["ahmedabad", "Ahmedabad"],
    ["jaipur", "Jaipur"],
    ["lucknow", "Lucknow"],
    ["nagpur", "Nagpur"],
    ["नागपुर", "Nagpur"],
    ["indore", "Indore"],
    ["इंदौर", "Indore"],
    ["nashik", "Nashik"],
    ["नाशिक", "Nashik"],
  ];

  for (const [keyword, value] of cities) {
    if (lowerText.includes(keyword)) {
      city = value;
      break;
    }
  }

  return {
    intent,
    skill,
    experience,
    city,
    area: "",
    wage,
    jobType: "",
    availability: "",
    description: text,
  };
};

// ======================================================
// AI CONTROLLER
// ======================================================

const parseJobProfile = async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: "Text is required",
    });
  }

  // ====================================================
  // Try Gemini
  // ====================================================

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash"
    });

    const prompt = `
You are Rozgaar Saathi, an AI employment assistant.

Understand this employment-related statement.

The user may speak English, Hindi or Hinglish.

Extract:

- intent
- skill
- experience
- city
- area
- wage
- jobType
- availability
- description

Return ONLY valid JSON.

Use exactly:

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

Do not invent information.

User:
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

    const parsedData = JSON.parse(cleanedText);

    return res.status(200).json({
      success: true,
      source: "gemini",
      data: parsedData,
    });

  } catch (error) {

    console.error(
      "Gemini request failed:",
      error?.status,
      error?.statusText,
      error?.message
    );

    // ==================================================
    // QUOTA / RATE LIMIT
    // ==================================================

    const isQuotaError =
      error?.status === 429 ||
      error?.statusText === "Too Many Requests" ||
      String(error?.message || "")
        .toLowerCase()
        .includes("quota") ||
      String(error?.message || "")
        .includes("429");

    if (isQuotaError) {

      console.log(
        "Gemini quota exceeded. Using fallback extraction."
      );

      const fallbackData = fallbackExtraction(text);

      return res.status(200).json({
        success: true,
        source: "fallback",
        message:
          "Gemini quota temporarily unavailable. Backup extraction used.",
        data: fallbackData,
      });
    }

    // ==================================================
    // Other AI errors
    // ==================================================

    return res.status(500).json({
      success: false,
      message: "AI processing failed",
    });
  }
};

module.exports = {
  parseJobProfile,
};