const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    //else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    if (!token) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (e) {
    res.status(500).json({
      success: false,
      error: e,
    });
  }
};
