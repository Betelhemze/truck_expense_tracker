const express = require("express");

const router = express.Router();

const{
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
} = require("../controller/driver.controller");

const {protect} = require("../middleware/auth.middleware");
const {authorizeRoles} = require("../middleware/role.middleware");

//private routes for admin only
router.get("/",protect,authorizeRoles("admin"),getDrivers);

router.get("/:id",protect,authorizeRoles("admin"),getDriverById);

router.post("/",protect,authorizeRoles("admin"),createDriver);

router.put("/:id",protect,authorizeRoles("admin"),updateDriver);

router.delete("/:id",protect,authorizeRoles("admin"),deleteDriver);

module.exports = router;