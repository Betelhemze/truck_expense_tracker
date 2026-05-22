const express = require("express");

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const {
  getDashboardSummary,
  getExpenseBreakdown,
  getTripProfit,
  getRecentTrips,
} = require("../controller/dashboard.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// ADMIN ONLY
router.get(
  "/summary",
  protect,
  authorizeRoles("admin"),
  asyncHandler(getDashboardSummary),
);

router.get(
  "/expense-breakdown",
  protect,
  authorizeRoles("admin"),
  asyncHandler(getExpenseBreakdown),
);

router.get(
  "/trip-profit/:tripId",
  protect,
  authorizeRoles("admin"),
  asyncHandler(getTripProfit),
);

router.get(
  "/recent-trips",
  protect,
  authorizeRoles("admin"),
  asyncHandler(getRecentTrips),
);

module.exports = router;
