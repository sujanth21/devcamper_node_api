const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};

//  @desc    Update user
//  @route   PUT /api/v1/users/:id
//  @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

//  @desc    Delete a user
//  @route   DELETE /api/v1/users/:id
//  @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};
