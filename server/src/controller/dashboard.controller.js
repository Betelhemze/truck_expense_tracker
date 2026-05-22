const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

// DASHBOARD SUMMARY
exports.getDashboardSummary = async (req, res) => {
  try {
    // TOTAL INCOME
    const trips = await Trip.find();

    const totalIncome = trips.reduce((sum, trip) => sum + trip.income, 0);

    // TOTAL EXPENSES
    const expenses = await Expense.find();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    // TOTAL PROFIT
    const totalProfit = totalIncome - totalExpenses;

    // TOTAL TRIPS
    const totalTrips = trips.length;

    // ACTIVE TRIPS
    const activeTrips = trips.filter((trip) => trip.status === "active").length;

    // COMPLETED TRIPS
    const completedTrips = trips.filter(
      (trip) => trip.status === "completed",
    ).length;

    res.status(200).json({
      totalIncome,
      totalExpenses,
      totalProfit,
      totalTrips,
      activeTrips,
      completedTrips,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// EXPENSE BREAKDOWN
exports.getExpenseBreakdown = async (req, res) => {
  try {

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

      breakdown[expense.type] += expense.amount;
    });

    res.status(200).json(breakdown);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// SINGLE TRIP PROFIT
exports.getTripProfit = async (req, res) => {
  try {

    const trip = await Trip.findById(
      req.params.tripId
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const expenses = await Expense.find({
      tripId: trip._id,
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const profit =
      trip.income - totalExpenses;

    res.status(200).json({
      tripIncome: trip.income,
      totalExpenses,
      profit,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// RECENT TRIPS
exports.getRecentTrips = async (req, res) => {
  try {

    const recentTrips = await Trip.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("driverId", "fullName")
      .populate("truckId", "number");

    res.status(200).json(recentTrips);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};