const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// ======================================================
// ENHANCED FALLBACK NLP EXTRACTION
// ======================================================

const fallbackExtraction = (text) => {
  const lowerText = text.toLowerCase();

  let skill = "";
  let city = "";
  let experience = "";
  let wage = "";
  let intent = "unknown";

  // -----------------------------
  // Intent Detection
  // -----------------------------
  const employerWords = [
    "hire",
    "hiring",
    "need a worker",
    "need a",
    "need someone",
    "worker required",
    "employee required",
    "chahiye worker",
    "aadmi chahiye",
    "kaamgar chahiye",
    "kamgar chahiye",
    "labour chahiye",
    "labourer",
    "कामगार चाहिए",
    "कर्मचारी चाहिए",
    "मजदूर चाहिए",
    "काम करने वाला",
  ];

  const workerWords = [
    "looking for work",
    "need work",
    "want a job",
    "find a job",
    "job chahiye",
    "kaam chahiye",
    "kam chahiye",
    "mai plumber hoon",
    "i am a",
    "i'm a",
    "i work as",
    "experienced",
    "काम चाहिए",
    "नौकरी चाहिए",
    "मुझे काम",
  ];

  if (employerWords.some((word) => lowerText.includes(word))) {
    intent = "employer";
  } else if (workerWords.some((word) => lowerText.includes(word))) {
    intent = "job_seeker";
  }

  // -----------------------------
  // Skills Recognition
  // -----------------------------
  const skills = [
    ["electrician", "Electrician"],
    ["इलेक्ट्रीशियन", "Electrician"],
    ["bijli", "Electrician"],
    ["wiring", "Electrician"],
    ["plumber", "Plumber"],
    ["प्लम्बर", "Plumber"],
    ["plumbing", "Plumber"],
    ["nal", "Plumber"],
    ["fitter", "Plumber"],
    ["carpenter", "Carpenter"],
    ["कारपेंटर", "Carpenter"],
    ["badhai", "Carpenter"],
    ["woodwork", "Carpenter"],
    ["painter", "Painter"],
    ["पेंटर", "Painter"],
    ["rangari", "Painter"],
    ["mason", "Mason"],
    ["राजमिस्त्री", "Mason"],
    ["mistri", "Mason"],
    ["construction", "Mason"],
    ["driver", "Driver"],
    ["ड्राइवर", "Driver"],
    ["driving", "Driver"],
    ["tailor", "Tailor"],
    ["दर्जी", "Tailor"],
    ["darzi", "Tailor"],
    ["sewing", "Tailor"],
    ["cook", "Cook"],
    ["कुक", "Cook"],
    ["rasoiya", "Cook"],
    ["chef", "Cook"],
    ["welder", "Welder"],
    ["वेल्डर", "Welder"],
    ["welding", "Welder"],
    ["mechanic", "Mechanic"],
    ["मैकेनिक", "Mechanic"],
    ["repair", "Mechanic"],
    ["housekeeper", "Housekeeper"],
    ["cleaning", "Housekeeper"],
    ["safai", "Housekeeper"],
    ["gardener", "Gardener"],
    ["mali", "Gardener"],
    ["security", "Security Guard"],
    ["guard", "Security Guard"],
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
    /(\d+(?:\.\d+)?)\s*(?:years?|yrs?|year|साल|वर्ष)/i
  );

  if (experienceMatch) {
    experience = `${experienceMatch[1]} years`;
  }

  // -----------------------------
  // Wage / Budget
  // -----------------------------
  const rupeeMatch = lowerText.match(
    /(?:₹|rs\.?|rupees?|रुपये?|रुपए?|budget|rate)\s*[:=]?\s*(\d+(?:,\d+)?)/i
  );

  if (rupeeMatch) {
    wage = `₹${rupeeMatch[1]}`;
  } else {
    const dailyMatch = lowerText.match(
      /(?:daily|per day|रोज|रोजाना|daily wage)\D{0,20}(\d{3,6})/i
    );

    if (dailyMatch) {
      wage = `₹${dailyMatch[1]}/day`;
    }
  }

  // -----------------------------
  // Cities Recognition
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
    ["बेंगलुरु", "Bengaluru"],
    ["hyderabad", "Hyderabad"],
    ["हैदराबाद", "Hyderabad"],
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
    ["belgaum", "Belgaum"],
    ["belagavi", "Belgaum"],
    ["mysuru", "Mysuru"],
    ["mysore", "Mysuru"],
    ["hubballi", "Hubballi"],
    ["hubli", "Hubballi"],
    ["surat", "Surat"],
    ["patna", "Patna"],
    ["bhopal", "Bhopal"],
    ["kanpur", "Kanpur"],
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

  // If Gemini is not initialized or key is absent, use fallback parser immediately
  if (!genAI || !process.env.GEMINI_API_KEY) {
    const fallbackData = fallbackExtraction(text);
    return res.status(200).json({
      success: true,
      source: "fallback",
      message: "Fallback parser used.",
      data: fallbackData,
    });
  }

  // Try Gemini with supported models & retry mechanism
  const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
  let geminiSuccess = false;
  let parsedData = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
You are Rozgaar Saathi, an AI employment assistant for local workers and employers in India.
Understand this employment-related statement. The user may speak English, Hindi, or Hinglish.

Extract the following information:
- intent: ("job_seeker" | "employer" | "unknown")
- skill: standard skill name (e.g. "Plumber", "Electrician", "Painter", "Carpenter", "Mason", "Driver", "Tailor", "Cook")
- experience: string describing experience (e.g. "4 years") or empty
- city: city name or empty
- area: locality or area or empty
- wage: wage or budget (e.g. "₹800/day") or empty
- jobType: ("Daily Wage" | "Part Time" | "Full Time" | "Contract") or empty
- availability: availability description or empty
- description: concise summary

Return ONLY valid JSON with this exact schema:
{
  "intent": "job_seeker",
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

User statement:
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

      parsedData = JSON.parse(cleanedText);
      geminiSuccess = true;
      break;
    } catch (err) {
      // If quota or rate limited or model not found, try next or fallback
      console.warn(`Gemini attempt with ${modelName} encountered: ${err.message || err.status}`);
      if (err?.status === 429) {
        // Wait 500ms before trying next
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  if (geminiSuccess && parsedData) {
    return res.status(200).json({
      success: true,
      source: "gemini",
      data: parsedData,
    });
  }

  // Graceful Fallback if Gemini is unreachable or rate-limited
  console.log("Gemini unavailable. Applying intelligent fallback parser for Rozgaar Saathi.");
  const fallbackData = fallbackExtraction(text);

  return res.status(200).json({
    success: true,
    source: "fallback",
    message: "Rozgaar Saathi extracted criteria via intelligent fallback.",
    data: fallbackData,
  });
};

module.exports = {
  parseJobProfile,
  fallbackExtraction,
};
