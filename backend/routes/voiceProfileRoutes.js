const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  generateVoiceProfile,
  saveVoiceProfile,
} = require("../controllers/voiceProfileController");

router.post("/generate", auth, generateVoiceProfile);
router.post("/save", auth, saveVoiceProfile);

module.exports = router;