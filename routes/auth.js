const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);
router.route("/updatedetails").put(protect, updateDetails);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);

module.exports = router;
