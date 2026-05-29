const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    type: {
      type: String,
      enum: ["fuel", "maintenance", "food", "toll", "other", "driver_payment"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    paidBy: {
      type: String,
      enum: ["admin", "driver"],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiptUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Expense", expenseSchema);
