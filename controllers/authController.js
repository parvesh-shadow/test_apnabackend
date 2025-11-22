const adminModel = require("../model/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Check admin exists
    const adminExist = await adminModel.findOne({ email });
    if (!adminExist) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, adminExist.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Create token
    const token = generateToken(adminExist._id);

    // Remove password before sending data
    const { password: _, ...adminData } = adminExist._doc;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      admin: adminData,
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

// exports.logout = (req, res) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       path: "/",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Logout successful",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Logout failed",
//       error: error.message,
//     });
//   }
// };

exports.checkAuth = (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};
