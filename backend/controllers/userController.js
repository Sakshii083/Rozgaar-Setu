const User = require("../models/User");

// Get Logged-in User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Worker / User Profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      city,
      skill,
      experience,
      dailyWage,
      about,
      available,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        city,
        skill,
        experience,
        dailyWage,
        about,
        available,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Employers
const getEmployers = async (req, res) => {
  try {
    const { city, search } = req.query;

    const query = {
      role: "employer",
    };

    if (city && city.trim()) {
      query.city = {
        $regex: city.trim(),
        $options: "i",
      };
    }

    if (search && search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          about: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const employers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: employers.length,
      employers,
    });
  } catch (error) {
    console.error("Employer Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employers",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getEmployers,
};