const express = require("express");

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const {
  getTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
} = require("../controller/truck.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createTruckValidation,
  updateTruckValidation,
} = require("../validators/truck.validator");

// ADMIN ONLY
router.get("/", protect, authorizeRoles("admin"), asyncHandler(getTrucks));

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(getTruckById),
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createTruckValidation,
  validate,
  asyncHandler(createTruck),
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateTruckValidation,
  validate,
  asyncHandler(updateTruck),
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(deleteTruck),
);

module.exports = router;
