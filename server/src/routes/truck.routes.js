const express = require("express");

const router = express.Router();

const {
  getTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
} = require("../controller/truck.controller");

const { protect } = require("../middleware/auth.middleware");

const { authorizeRoles } = require("../middleware/role.middleware");

// ADMIN ONLY

router.get("/", protect, authorizeRoles("admin"), getTrucks);

router.get("/:id", protect, authorizeRoles("admin"), getTruckById);

router.post("/", protect, authorizeRoles("admin"), createTruck);

router.put("/:id", protect, authorizeRoles("admin"), updateTruck);

router.delete("/:id", protect, authorizeRoles("admin"), deleteTruck);

module.exports = router;
