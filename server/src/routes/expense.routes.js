const express = require("express");

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const {
  getExpenses,
  addExpense,
  getTripExpenses,
} = require("../controller/expense.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  addExpenseValidation,
  getTripExpensesValidation,
} = require("../validators/expense.validator");

// authenticated users
router.get("/", protect, asyncHandler(getExpenses));

router.post(
  "/",
  protect,
  addExpenseValidation,
  validate,
  asyncHandler(addExpense),
);

router.get(
  "/trip/:tripId",
  protect,
  getTripExpensesValidation,
  validate,
  asyncHandler(getTripExpenses),
);

module.exports = router;
