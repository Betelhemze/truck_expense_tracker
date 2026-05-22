const express = require("express");

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const { register, login, getMe } = require("../controller/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

// public routes
router.post("/register", registerValidation, validate, asyncHandler(register));
router.post("/login", loginValidation, validate, asyncHandler(login));

// private routes
router.get("/me", protect, asyncHandler(getMe));

module.exports = router;
