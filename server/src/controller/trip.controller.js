const Trip = require("../models/Trip");

// GET ALL TRIPS
exports.getTrips = async (req, res) => {
  try {
    let trips;

    // DRIVER -> only own trips
    if (req.user.role === "driver") {
      trips = await Trip.find({
        driverId: req.user.id,
      })
        .populate("truckId", "number model")
        .populate("driverId", "fullName email");
    } else {
      // ADMIN -> all trips
      trips = await Trip.find()
        .populate("truckId", "number model")
        .populate("driverId", "fullName email");
    }

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE TRIP
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("truckId", "number model")
      .populate("driverId", "fullName email");

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // DRIVER can only view own trip
    if (
      req.user.role === "driver" &&
      trip.driverId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TRIP
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TRIP
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // DRIVER restrictions
    if (req.user.role === "driver") {
      // only own trips
      if (trip.driverId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      // drivers only complete trip
      trip.status = "completed";

      await trip.save();

      return res.status(200).json({
        message: "Trip marked as completed",
        trip,
      });
    }

    // ADMIN full update
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Trip updated successfully",
      updatedTrip,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TRIP
exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);

    if (!deletedTrip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
