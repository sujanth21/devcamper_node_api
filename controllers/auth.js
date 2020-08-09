const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Register a new user
// @route   /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};
