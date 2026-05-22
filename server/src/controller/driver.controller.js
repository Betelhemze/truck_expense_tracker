const driverService = require("../services/driver.service");

exports.getDrivers = async (req, res) => {
  const { drivers, total, page, limit } = await driverService.getDrivers(
    req.query,
  );

  res.status(200).json({
    success: true,
    data: drivers,
    meta: { total, page, limit },
  });
};

exports.getDriverById = async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id);

  res.status(200).json({
    success: true,
    data: driver,
  });
};

exports.createDriver = async (req, res) => {
  const driver = await driverService.createDriver(req.body);

  res.status(201).json({
    success: true,
    message: "Driver created successfully",
    data: {
      _id: driver._id,
      fullName: driver.fullName,
      email: driver.email,
      role: driver.role,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
    },
  });
};

exports.updateDriver = async (req, res) => {
  const driver = await driverService.updateDriver(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Driver updated successfully",
    data: driver,
  });
};

exports.deleteDriver = async (req, res) => {
  await driverService.deleteDriver(req.params.id);

  res.status(200).json({
    success: true,
    message: "Driver deleted successfully",
  });
};
