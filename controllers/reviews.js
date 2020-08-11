const ErrorResponse = require("../utils/errorResponse");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all review
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bnootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  const bootcampId = req.params.bootcampId;

  try {
    if (bootcampId) {
      const reviews = await Review.find({ bootcamp: bootcampId });

      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Get a single review
// @route   GET /api/v1/reviews/:id
// @access  Private
exports.getReview = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const review = await Review.findById(_id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (e) {
    res.status(500).json({
      success: true,
      error: e,
    });
  }
};

// @desc    Add a review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(new ErrorResponse("No bootcamp found", 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  const _id = req.params.id;

  try {
    let review = await Review.findById(_id);

    if (!review) {
      return next(new ErrorResponse(`No review exist with id ${_id}`, 404));
    }

    //Make sure review belongs to the user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(`Not authorized to update the review`, 401)
      );
    }

    review = await Review.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  const _id = req.params.id;

  try {
    let review = await Review.findById(_id);

    if (!review) {
      return next(new ErrorResponse(`No review exist with the id ${_id}`, 404));
    }

    //Make sure review belongs to the user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(`Not authorized to update the review`, 401)
      );
    }

    await review.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};
