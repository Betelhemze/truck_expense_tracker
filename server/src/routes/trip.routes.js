const express = require("express");

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require("../controller/trip.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createTripValidation,
  updateTripValidation,
} = require("../validators/trip.validator");

// ALL authenticated users
router.get("/", protect, asyncHandler(getTrips));

router.get("/:id", protect, asyncHandler(getTripById));

// ADMIN only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTripValidation,
  validate,
  asyncHandler(createTrip),
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(deleteTrip),
);

// ADMIN + DRIVER
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "driver"),
  updateTripValidation,
  validate,
  asyncHandler(updateTrip),
);

module.exports = router;
