const Bootcamp = require("../models/Bootcamp");

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

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

// @desc     Get a single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findById(_id);

    if (!bootcamp) {
      return res
        .status(404)
        .json({ success: false, error: "Bootcamp not found in the DB" });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
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
    res.status(400).json({
      success: false,
      error: e,
    });
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
      return res
        .status(404)
        .json({ success: true, error: "Bootcamp not found in the DB" });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(_id);

    if (!bootcamp) {
      return res.status(404).json({
        success: false,
        error: "Bootcamp not found in DB",
      });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(500).json({ success: false, error: e });
  }
};
