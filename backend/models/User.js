const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic account information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["worker", "employer", "professional", "admin"],
      default: "worker",
    },

    // Existing worker profile fields
    city: {
      type: String,
      default: "",
    },

    skill: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    dailyWage: {
      type: Number,
      default: 0,
    },

    about: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // New AI-generated profile fields
    skills: {
      type: [String],
      default: [],
    },

    serviceAreas: {
      type: [String],
      default: [],
    },

    preferredLanguage: {
      type: String,
      enum: ["en", "hi", "kn", "ta", "te", "mr", "es"],
      default: "en",
    },

    profileSummary: {
      type: String,
      default: "",
    },

    profileGeneratedByAI: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);