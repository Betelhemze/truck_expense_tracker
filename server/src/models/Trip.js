const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    loadType: {
      type: String,
      required: true,
    },

    income: {
      type: Number,
      required: true,
    },

    departureDate: {
      type: Date,
      required: true,
    },

    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],

    status: {
      type: String,
      enum: ["active", "completed", "finished"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Trip", tripSchema);
