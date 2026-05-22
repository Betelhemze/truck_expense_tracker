const truckService = require("../services/truck.service");

exports.getTrucks = async (req, res) => {
  const { trucks, total, page, limit } = await truckService.getTrucks(
    req.query,
  );

  res.status(200).json({
    success: true,
    data: trucks,
    meta: { total, page, limit },
  });
};

exports.getTruckById = async (req, res) => {
  const truck = await truckService.getTruckById(req.params.id);

  res.status(200).json({
    success: true,
    data: truck,
  });
};

exports.createTruck = async (req, res) => {
  const truck = await truckService.createTruck(req.body);

  res.status(201).json({
    success: true,
    message: "Truck created successfully",
    data: truck,
  });
};

exports.updateTruck = async (req, res) => {
  const truck = await truckService.updateTruck(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Truck updated successfully",
    data: truck,
  });
};

exports.deleteTruck = async (req, res) => {
  await truckService.deleteTruck(req.params.id);

  res.status(200).json({
    success: true,
    message: "Truck deleted successfully",
  });
};
