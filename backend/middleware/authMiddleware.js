const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No Token",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Token",
      });
    }

    // IMPORTANT:
    // Use the same secret that was used when creating the token.
    const secret =
      process.env.JWT_SECRET ||
      "rozgaarsetu_secret_key";

    const decoded = jwt.verify(
      token,
      secret
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = auth;