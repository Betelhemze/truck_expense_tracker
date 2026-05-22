const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

exports.getDashboardSummary = async () => {
  const trips = await Trip.find();
  const totalIncome = trips.reduce((sum, trip) => sum + trip.income, 0);
  const totalExpenses = (await Expense.find()).reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return {
    totalIncome,
    totalExpenses,
    totalProfit: totalIncome - totalExpenses,
    totalTrips: trips.length,
    activeTrips: trips.filter((trip) => trip.status === "active").length,
    completedTrips: trips.filter((trip) => trip.status === "completed").length,
  };
};

exports.getExpenseBreakdown = async () => {
  const expenses = await Expense.find();
  const breakdown = {
    fuel: 0,
    maintenance: 0,
    food: 0,
    toll: 0,
    other: 0,
    driver_payment: 0,
  };

  expenses.forEach((expense) => {
    if (breakdown.hasOwnProperty(expense.type)) {
      breakdown[expense.type] += expense.amount;
    } else {
      breakdown.other += expense.amount;
    }
  });

  return breakdown;
};

exports.getTripProfit = async (tripId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const expenses = await Expense.find({ tripId });
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return {
    tripIncome: trip.income,
    totalExpenses,
    profit: trip.income - totalExpenses,
  };
};

exports.getRecentTrips = async () => {
  const recentTrips = await Trip.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("driverId", "fullName")
    .populate("truckId", "number");

  return recentTrips;
};
