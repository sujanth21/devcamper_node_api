const path = require("path");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
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
    //Add user to req.body
    req.body.user = req.user.id;

    //Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    //Check whether the user role is not admin and already published a bootcamp by the user
    if (publishedBootcamp && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a bootcamp`,
          400
        )
      );
    }

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
    let bootcamp = await Bootcamp.findById(_id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${_id} not found in the DB`),
        404
      );
    }

    //Make sure the user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${_id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

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

    //Make sure the user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${_id} is not authorized to update this bootcamp`,
          401
        )
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

// @desc    Upload bootcamp photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const bootcamp = await Bootcamp.findById(_id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`No bootcamp exist with the id of ${_id}`, 404)
      );
    }

    //Make sure the user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${_id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    if (!req.files) {
      return next(new ErrorResponse("Please upload a file", 400));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse("Please upload an image file", 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    //Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        return next(new ErrorResponse(`Problem with photo upload`, 500));
      }

      await Bootcamp.findByIdAndUpdate(_id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};
