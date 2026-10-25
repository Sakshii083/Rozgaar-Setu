const mongoose = require("mongoose");
const dns = require("dns");

// Use a public resolver when the default system DNS refuses SRV queries.
// This is a common workaround for Windows / corporate DNS environments.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if unsupported in environment
}

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!rawUri) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }
    const cleanUri = rawUri.replace(/["';]+$/, "").trim();

    await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.error(
        "Hint: MongoDB Atlas SRV DNS lookup failed. Check your network/DNS or use a direct mongodb:// URI instead of mongodb+srv://."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
