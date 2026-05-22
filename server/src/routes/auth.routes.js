const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../controller/auth.controller");

const {protect} = require ("../middleware/auth.middleware");

//public routes
router.post("/register", register);
router.post("/login", login);

//private routes 
router.get("/me",protect, getMe);



module.exports = router;