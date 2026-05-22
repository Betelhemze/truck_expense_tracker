const express = require("express");

const router = express.Router();

const {
  getExpenses,
  addExpense,
  getTripExpenses,
} = require("../controller/expense.controller");

const { protect } = require("../middleware/auth.middleware");

// authenticated users
router.get("/", protect, getExpenses);

router.post("/", protect, addExpense);

router.get("/trip/:tripId", protect, getTripExpenses);

module.exports = router;
