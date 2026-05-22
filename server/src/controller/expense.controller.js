const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    let expenses;

    // DRIVER -> only own trip expenses
    if (req.user.role === "driver") {
      const trips = await Trip.find({
        driverId: req.user.id,
      });

      const tripIds = trips.map((trip) => trip._id);

      expenses = await Expense.find({
        tripId: { $in: tripIds },
      })
        .populate("tripId")
        .populate("createdBy", "fullName");
    } else {
      // ADMIN -> all expenses
      expenses = await Expense.find()
        .populate("tripId")
        .populate("createdBy", "fullName");
    }

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { tripId, type, amount, description, date, paidBy } = req.body;

    // check trip
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // DRIVER restrictions
    if (req.user.role === "driver") {
      // only own trip
      if (trip.driverId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      // cannot add driver_payment
      if (type === "driver_payment") {
        return res.status(403).json({
          message: "Drivers cannot add driver payments",
        });
      }
    }

    // create expense
    const expense = await Expense.create({
      tripId,
      type,
      amount,
      description,
      date,
      paidBy,
      createdBy: req.user.id,
    });

    // add expense to trip
    trip.expenses.push(expense._id);

    await trip.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET EXPENSES FOR ONE TRIP
exports.getTripExpenses = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // DRIVER ownership check
    if (
      req.user.role === "driver" &&
      trip.driverId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const expenses = await Expense.find({
      tripId: req.params.tripId,
    }).populate("createdBy", "fullName");

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
