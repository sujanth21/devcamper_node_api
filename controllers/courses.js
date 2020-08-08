const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc   Get courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = async (req, res, next) => {
  try {
    if (req.params.bootcampId) {
      const courses = await Course.find({ bootcamp: req.params.bootcampId });

      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
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

// @desc   Get a single course
// @route  GET /api/v1/courses/:id
// @access Public
exports.getCourse = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const course = await Course.findById(_id).populate({
      path: "bootcamp",
      select: "name description",
    });

    if (!course) {
      return next(new ErrorResponse(`No course with id ${_id} exist`, 404));
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Add a course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  try {
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with id of ${req.params.bootcampId} exist`,
          404
        )
      );
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
  const _id = req.params.id;

  try {
    let course = await Course.findById(_id);

    if (!course) {
      return next(
        new ErrorResponse(`No course exist with the id of ${_id}`, 404)
      );
    }

    course = await Course.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const course = await Course.findById(_id);

    if (!course) {
      return next(
        new ErrorResponse(`No course exist with the id of ${_id}`, 404)
      );
    }

    await course.remove();

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
