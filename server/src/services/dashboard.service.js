const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const Truck = require("../models/Truck");
const User = require("../models/User");

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

exports.getDashboardSummary = async (user) => {
  if (user && user.role === "driver") {
    const truck = await Truck.findOne({ driverId: user.id || user._id });
    const trips = await Trip.find({ driverId: user.id || user._id })
      .populate("truckId", "number model licensePlate")
      .sort({ departureDate: -1 });

    const tripIds = trips.map((t) => t._id);
    const expenses = await Expense.find({ tripId: { $in: tripIds } });

    const totalTrips = trips.length;
    const activeTripsCount = trips.filter((t) => t.status === "active").length;
    const completedTripsCount = trips.filter((t) => t.status === "completed" || t.status === "finished").length;
    const totalIncome = trips.reduce((sum, t) => sum + t.income, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const recentTrips = trips.slice(0, 5).map((trip) => {
      const tripExpenses = expenses
        .filter((e) => e.tripId.toString() === trip._id.toString())
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        _id: trip._id,
        source: trip.source,
        destination: trip.destination,
        loadType: trip.loadType,
        departureDate: trip.departureDate,
        income: trip.income,
        expenses: tripExpenses,
        profit: trip.income - tripExpenses,
        status: trip.status,
      };
    });

    return {
      driver: { name: user.fullName },
      truck: truck ? { model: truck.model, licensePlate: truck.licensePlate, number: truck.number } : null,
      totalTrips,
      activeTrips: activeTripsCount,
      completedTrips: completedTripsCount,
      totalIncome,
      netProfit,
      recentTrips,
    };
  }

  const [trips, expenses, allTrucks, drivers] = await Promise.all([
    Trip.find()
      .populate("truckId", "number model")
      .populate("driverId", "fullName"),
    Expense.find(),
    Truck.find(),
    User.find({ role: "driver" }),
  ]);

  const totalIncome = trips.reduce((sum, trip) => sum + trip.income, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const totalProfit = totalIncome - totalExpenses;

  const expenseTotalsByType = expenses.reduce(
    (totals, expense) => {
      totals[expense.type] = (totals[expense.type] || 0) + expense.amount;
      return totals;
    },
    {
      fuel: 0,
      maintenance: 0,
      food: 0,
      toll: 0,
      other: 0,
      driver_payment: 0,
    },
  );

  const expensesByTripId = expenses.reduce((map, expense) => {
    const key = expense.tripId.toString();
    map[key] = (map[key] || 0) + expense.amount;
    return map;
  }, {});

  const now = new Date();
  const monthlyLabels = [];
  const monthlyRevenue = [];
  const monthlyProfit = [];
  const monthlyMap = new Map();

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthlyLabels.push(label);
    monthlyMap.set(label, { revenue: 0, profit: 0 });
  }

  const truckData = new Map();
  const driverData = new Map();
  const routeData = new Map();

  trips.forEach((trip) => {
    const tripExpenses = expensesByTripId[trip._id.toString()] || 0;
    const profit = trip.income - tripExpenses;
    const departureDate = trip.departureDate || trip.createdAt;
    const monthLabel = departureDate
      ? `${monthNames[new Date(departureDate).getMonth()]} ${new Date(
          departureDate,
        ).getFullYear()}`
      : monthlyLabels[monthlyLabels.length - 1];

    if (monthlyMap.has(monthLabel)) {
      const monthly = monthlyMap.get(monthLabel);
      monthly.revenue += trip.income;
      monthly.profit += profit;
    }

    const truckKey = trip.truckId?._id?.toString() || trip.truckId;
    const truckLabel = trip.truckId?.number || "Unassigned truck";
    if (!truckData.has(truckKey)) {
      truckData.set(truckKey, {
        truck: truckLabel,
        trips: 0,
        revenue: 0,
        expenses: 0,
        profit: 0,
      });
    }
    const truckRecord = truckData.get(truckKey);
    truckRecord.trips += 1;
    truckRecord.revenue += trip.income;
    truckRecord.expenses += tripExpenses;
    truckRecord.profit += profit;

    const driverKey = trip.driverId?._id?.toString() || trip.driverId;
    const driverLabel = trip.driverId?.fullName || "Unassigned driver";
    if (!driverData.has(driverKey)) {
      driverData.set(driverKey, {
        driver: driverLabel,
        trips: 0,
        revenue: 0,
        expenses: 0,
        profit: 0,
      });
    }
    const driverRecord = driverData.get(driverKey);
    driverRecord.trips += 1;
    driverRecord.revenue += trip.income;
    driverRecord.expenses += tripExpenses;
    driverRecord.profit += profit;

    const routeKey = `${trip.source} → ${trip.destination}`;
    if (!routeData.has(routeKey)) {
      routeData.set(routeKey, {
        route: routeKey,
        trips: 0,
        revenue: 0,
        profit: 0,
      });
    }
    const routeRecord = routeData.get(routeKey);
    routeRecord.trips += 1;
    routeRecord.revenue += trip.income;
    routeRecord.profit += profit;
  });

  monthlyMap.forEach((value) => {
    monthlyRevenue.push(value.revenue);
    monthlyProfit.push(value.profit);
  });

  const truckProfits = Array.from(truckData.values());
  const driverPerformance = Array.from(driverData.values());
  const driverProfits = driverPerformance.map((d) => ({
    ...d,
  }));
  const routeProfits = Array.from(routeData.values());

  const totalFuel = expenseTotalsByType.fuel;
  const avgFuelPerTrip = trips.length ? totalFuel / trips.length : 0;
  const expensesBreakdown = Object.fromEntries(
    Object.entries(expenseTotalsByType).map(([type, amount]) => [
      type,
      {
        amount,
        percent: totalExpenses
          ? Number(((amount / totalExpenses) * 100).toFixed(1))
          : 0,
      },
    ]),
  );

  return {
    totalIncome,
    totalRevenue: totalIncome,
    totalExpenses,
    totalExpense: totalExpenses,
    netProfit: totalProfit,
    totalProfit,
    totalTrips: trips.length,
    activeTrips: trips.filter((trip) => trip.status === "active").length,
    completedTrips: trips.filter((trip) => trip.status === "completed").length,
    totalDrivers: drivers.length,
    activeTrucks: allTrucks.filter((truck) => truck.status === "active").length,
    monthly: {
      labels: monthlyLabels,
      revenue: monthlyRevenue,
      profit: monthlyProfit,
    },
    expensesBreakdown,
    truckProfits,
    driverPerformance,
    driverProfits,
    routeProfits,
    avgFuelPerTrip: Number(avgFuelPerTrip.toFixed(2)),
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
