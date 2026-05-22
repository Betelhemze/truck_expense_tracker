const Trip = require("../models/Trip");
const { buildListQuery } = require("./query.service");
const { NotFoundError, ForbiddenError } = require("../errors/ApiError");

exports.getTrips = async (user, query) => {
  const allowedFilters = ["status", "truckId", "driverId"];
  const { page, limit, skip, sort, filter } = buildListQuery(
    query,
    allowedFilters,
  );

  if (user.role === "driver") {
    filter.driverId = user.id;
  }

  const [trips, total] = await Promise.all([
    Trip.find(filter)
      .populate("truckId", "number model")
      .populate("driverId", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Trip.countDocuments(filter),
  ]);

  return { trips, total, page, limit };
};

exports.getTripById = async (id, user) => {
  const trip = await Trip.findById(id)
    .populate("truckId", "number model")
    .populate("driverId", "fullName email");

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (user.role === "driver" && trip.driverId._id.toString() !== user.id) {
    throw new ForbiddenError("Access denied");
  }

  return trip;
};

exports.createTrip = async (payload) => {
  const trip = await Trip.create(payload);
  return trip;
};

exports.updateTrip = async (id, payload, user) => {
  const trip = await Trip.findById(id);

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (user.role === "driver") {
    if (trip.driverId.toString() !== user.id) {
      throw new ForbiddenError("Access denied");
    }

    trip.status = "completed";
    await trip.save();
    return trip;
  }

  const updatedTrip = await Trip.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTrip;
};

exports.deleteTrip = async (id) => {
  const trip = await Trip.findByIdAndDelete(id);

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  return trip;
};
