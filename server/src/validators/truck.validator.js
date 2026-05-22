const { body } = require("express-validator");

exports.createTruckValidation = [
  body("number").notEmpty().withMessage("Truck number is required"),
  body("model").notEmpty().withMessage("Truck model is required"),
  body("licensePlate").notEmpty().withMessage("License plate is required"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
  body("driverId")
    .optional()
    .isMongoId()
    .withMessage("driverId must be a valid MongoDB id"),
];

exports.updateTruckValidation = [
  body("number")
    .optional()
    .notEmpty()
    .withMessage("Truck number cannot be empty"),
  body("model")
    .optional()
    .notEmpty()
    .withMessage("Truck model cannot be empty"),
  body("licensePlate")
    .optional()
    .notEmpty()
    .withMessage("License plate cannot be empty"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
  body("driverId")
    .optional()
    .isMongoId()
    .withMessage("driverId must be a valid MongoDB id"),
];
