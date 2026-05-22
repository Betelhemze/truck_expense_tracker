const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const { buildListQuery } = require("./query.service");
const { NotFoundError, ForbiddenError } = require("../errors/ApiError");

exports.getExpenses = async (user, query) => {
  const allowedFilters = ["type", "paidBy", "tripId"];
  const { page, limit, skip, sort, filter } = buildListQuery(
    query,
    allowedFilters,
  );

  if (user.role === "driver") {
    const driverTrips = await Trip.find({ driverId: user.id }).select("_id");
    filter.tripId = { $in: driverTrips.map((trip) => trip._id) };
  }

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate("tripId")
      .populate("createdBy", "fullName")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Expense.countDocuments(filter),
  ]);

  return { expenses, total, page, limit };
};

exports.addExpense = async (payload, user) => {
  const { tripId, type } = payload;
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (user.role === "driver") {
    if (trip.driverId.toString() !== user.id) {
      throw new ForbiddenError("Access denied");
    }

    if (type === "driver_payment") {
      throw new ForbiddenError("Drivers cannot add driver payments");
    }
  }

  const expense = await Expense.create({ ...payload, createdBy: user.id });
  trip.expenses.push(expense._id);
  await trip.save();

  return expense;
};

exports.getTripExpenses = async (tripId, user) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  if (user.role === "driver" && trip.driverId.toString() !== user.id) {
    throw new ForbiddenError("Access denied");
  }

  const expenses = await Expense.find({ tripId }).populate(
    "createdBy",
    "fullName",
  );

  return expenses;
};
