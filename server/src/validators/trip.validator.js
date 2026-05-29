const { body } = require("express-validator");

exports.createTripValidation = [
  body("truckId").isMongoId().withMessage("truckId must be a valid id"),
  body("driverId").isMongoId().withMessage("driverId must be a valid id"),
  body("source").notEmpty().withMessage("Source is required"),
  body("destination").notEmpty().withMessage("Destination is required"),
  body("loadType").notEmpty().withMessage("Load type is required"),
  body("income").isNumeric().withMessage("Income must be a number"),
  body("departureDate")
    .isISO8601()
    .toDate()
    .withMessage("Departure date is required"),
  body("status")
    .optional()
    .isIn(["active", "completed", "finished"])
    .withMessage("Status must be active, completed, or finished"),
  body("paymentReceived")
    .optional()
    .isNumeric()
    .withMessage("paymentReceived must be a number"),
];

exports.updateTripValidation = [
  body("truckId")
    .optional()
    .isMongoId()
    .withMessage("truckId must be a valid id"),
  body("driverId")
    .optional()
    .isMongoId()
    .withMessage("driverId must be a valid id"),
  body("source").optional().notEmpty().withMessage("Source cannot be empty"),
  body("destination")
    .optional()
    .notEmpty()
    .withMessage("Destination cannot be empty"),
  body("loadType")
    .optional()
    .notEmpty()
    .withMessage("Load type cannot be empty"),
  body("income").optional().isNumeric().withMessage("Income must be a number"),
  body("departureDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Departure date must be a valid date"),
  body("status")
    .optional()
    .isIn(["active", "completed", "finished"])
    .withMessage("Status must be active, completed, or finished"),
  body("paymentReceived")
    .optional()
    .isNumeric()
    .withMessage("paymentReceived must be a number"),
];
