const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    let removedFields = ["select", "sort", "page", "limit"];

    removedFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => {
      return `$${match}`;
    });

    query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const bootcamps = await query;

    let pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
  } catch (e) {
    next(e);
  }
};

// @desc     Get a single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findById(_id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${_id} not found in the DB`),
        404
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    next(e);
  }
};

// @desc     Create a new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    next(e);
  }
};

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${_id} not found in the DB`),
        404
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    next(e);
  }
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findById(_id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${_id} not found in the DB`),
        404
      );
    }

    bootcamp.remove();

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(e);
  }
};

// @desc    Get bootcamps in radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  try {
    //Get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calculate radius using radians
    //Divide distance by radius of earth
    //Earth radius = 3,963 miles or 6,378 km
    const EARTH_RADIUS = 6378;
    const radius = distance / EARTH_RADIUS;

    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};
