const { body, param } = require("express-validator");

exports.addExpenseValidation = [
  body("tripId").isMongoId().withMessage("tripId must be a valid id"),
  body("type")
    .isIn(["fuel", "maintenance", "food", "toll", "other", "driver_payment"])
    .withMessage(
      "Type must be one of fuel, maintenance, food, toll, other, or driver_payment",
    ),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("description").optional().isString(),
  body("date").isISO8601().toDate().withMessage("Date is required"),
  body("paidBy")
    .isIn(["admin", "driver"])
    .withMessage("paidBy must be either admin or driver"),
];

exports.getTripExpensesValidation = [
  param("tripId").isMongoId().withMessage("tripId must be a valid id"),
];
