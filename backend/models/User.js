const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);