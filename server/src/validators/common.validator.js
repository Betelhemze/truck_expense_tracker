const { param, query } = require("express-validator");

exports.idParamValidation = [
  param("id").isMongoId().withMessage("Invalid resource id"),
];

exports.tripIdParamValidation = [
  param("tripId").isMongoId().withMessage("Invalid trip id"),
];

exports.paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sort").optional().isString().withMessage("Sort must be a string"),
];
