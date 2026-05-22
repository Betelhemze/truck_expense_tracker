const express = require("express");

const router = express.Router();

const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require("../controller/trip.controller");

const { protect } = require("../middleware/auth.middleware");

const { authorizeRoles } = require("../middleware/role.middleware");

// ALL authenticated users
router.get("/", protect, getTrips);

router.get("/:id", protect, getTripById);

// ADMIN only
router.post("/", protect, authorizeRoles("admin"), createTrip);

router.delete("/:id", protect, authorizeRoles("admin"), deleteTrip);

// ADMIN + DRIVER
router.put("/:id", protect, authorizeRoles("admin", "driver"), updateTrip);

module.exports = router;
