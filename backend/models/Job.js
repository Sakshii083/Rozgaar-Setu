const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    jobType: {
      type: String,
      enum: [
        "Daily Wage",
        "Part Time",
        "Full Time",
        "Contract",
      ],
      default: "Daily Wage",
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);