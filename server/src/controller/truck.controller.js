const Truck = require("../models/Truck");

// GET ALL TRUCKS
exports.getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("driverId", "fullName email");

    res.status(200).json(trucks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE TRUCK
exports.getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate(
      "driverId",
      "fullName email",
    );

    if (!truck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    res.status(200).json(truck);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TRUCK
exports.createTruck = async (req, res) => {
  try {
    const truck = await Truck.create(req.body);

    res.status(201).json({
      message: "Truck created successfully",
      truck,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TRUCK
exports.updateTruck = async (req, res) => {
  try {
    const updatedTruck = await Truck.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!updatedTruck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    res.status(200).json({
      message: "Truck updated successfully",
      updatedTruck,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TRUCK
exports.deleteTruck = async (req, res) => {
  try {
    const deletedTruck = await Truck.findByIdAndDelete(req.params.id);

    if (!deletedTruck) {
      return res.status(404).json({
        message: "Truck not found",
      });
    }

    res.status(200).json({
      message: "Truck deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
