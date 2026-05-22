const express = require("express");

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controller/driver.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  createDriverValidation,
  updateDriverValidation,
} = require("../validators/driver.validator");

// private routes for admin only
router.get("/", protect, authorizeRoles("admin"), asyncHandler(getDrivers));

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(getDriverById),
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createDriverValidation,
  validate,
  asyncHandler(createDriver),
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateDriverValidation,
  validate,
  asyncHandler(updateDriver),
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(deleteDriver),
);

module.exports = router;
