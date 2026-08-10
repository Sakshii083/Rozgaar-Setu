const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// JWT SECRET
// =====================================================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "rozgaarsetu_secret_key";

// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // -----------------------------
    // Check Existing User
    // -----------------------------

    const existingUser =
      await User.findOne({
        $or: [
          { email },
          { phone },
        ],
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // -----------------------------
    // Hash Password
    // -----------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -----------------------------
    // Create User
    // -----------------------------

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // -----------------------------
    // Remove Password
    // -----------------------------

    const {
      password: _,
      ...userData
    } = user.toObject();

    return res.status(201).json({
      success: true,
      message:
        "User Registered Successfully",
      user: userData,
    });

  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // -----------------------------
    // Find User
    // -----------------------------

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // Check Password
    // -----------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // -----------------------------
    // Generate JWT
    // -----------------------------

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -----------------------------
    // Remove Password
    // -----------------------------

    const {
      password: _,
      ...userData
    } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,
  login,
};