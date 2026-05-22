const Truck = require("../models/Truck");
const { buildListQuery } = require("./query.service");
const { NotFoundError } = require("../errors/ApiError");

exports.getTrucks = async (query) => {
  const { page, limit, skip, sort, filter } = buildListQuery(query, [
    "status",
    "driverId",
  ]);
  const [trucks, total] = await Promise.all([
    Truck.find(filter)
      .populate("driverId", "fullName email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Truck.countDocuments(filter),
  ]);

  return { trucks, total, page, limit };
};

exports.getTruckById = async (id) => {
  const truck = await Truck.findById(id).populate("driverId", "fullName email");

  if (!truck) {
    throw new NotFoundError("Truck not found");
  }

  return truck;
};

exports.createTruck = async (payload) => {
  const truck = await Truck.create(payload);
  return truck;
};

exports.updateTruck = async (id, payload) => {
  const truck = await Truck.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!truck) {
    throw new NotFoundError("Truck not found");
  }

  return truck;
};

exports.deleteTruck = async (id) => {
  const truck = await Truck.findByIdAndDelete(id);

  if (!truck) {
    throw new NotFoundError("Truck not found");
  }

  return truck;
};
