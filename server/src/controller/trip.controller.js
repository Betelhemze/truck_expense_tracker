const tripService = require("../services/trip.service");

exports.getTrips = async (req, res) => {
  const { trips, total, page, limit } = await tripService.getTrips(
    req.user,
    req.query,
  );

  res.status(200).json({
    success: true,
    data: trips,
    meta: { total, page, limit },
  });
};

exports.getTripById = async (req, res) => {
  const trip = await tripService.getTripById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    data: trip,
  });
};

exports.createTrip = async (req, res) => {
  const trip = await tripService.createTrip(req.body);

  res.status(201).json({
    success: true,
    message: "Trip created successfully",
    data: trip,
  });
};

exports.updateTrip = async (req, res) => {
  const trip = await tripService.updateTrip(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message:
      req.user.role === "driver"
        ? "Trip marked as completed"
        : "Trip updated successfully",
    data: trip,
  });
};

exports.deleteTrip = async (req, res) => {
  await tripService.deleteTrip(req.params.id);

  res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
};
