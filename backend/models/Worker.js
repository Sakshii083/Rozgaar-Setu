const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    availability: {
      type: String,
      required: true,
    },

    wage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", workerSchema);