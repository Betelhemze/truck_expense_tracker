const express = require("express");
const router = express.Router();
const { exportToExcel } = require("../controller/report.controller");
const { protect } = require("../middleware/auth.middleware");

// Using protect middleware to ensure only authenticated users can export
router.get("/export", protect, exportToExcel);

module.exports = router;
