const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Truck", truckSchema);
