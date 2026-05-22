const express = require("express");

const router = express.Router();

const {
  getDashboardSummary,
  getExpenseBreakdown,
  getTripProfit,
  getRecentTrips,
} = require("../controller/dashboard.controller");

const { protect } = require("../middleware/auth.middleware");

const { authorizeRoles } = require("../middleware/role.middleware");

// ADMIN ONLY
router.get("/summary", protect, authorizeRoles("admin"), getDashboardSummary);

router.get(
  "/expense-breakdown",
  protect,
  authorizeRoles("admin"),
  getExpenseBreakdown,
);

router.get(
  "/trip-profit/:tripId",
  protect,
  authorizeRoles("admin"),
  getTripProfit,
);

router.get("/recent-trips", protect, authorizeRoles("admin"), getRecentTrips);

module.exports = router;
