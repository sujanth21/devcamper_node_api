const express = require("express");
const router = express.Router();

//Getting all bootcamps
router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

//Getting a specific bootcamp
router.get("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
});

//Creating a new bootcamp
router.post("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Create a new bootcamp" });
});

//Update a specific bootcamp
router.put("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
});

//Delete a specific bootcamp
router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
});

module.exports = router;
