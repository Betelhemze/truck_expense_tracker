const tripService = require("../src/services/trip.service");
const expenseService = require("../src/services/expense.service");
const dashboardService = require("../src/services/dashboard.service");
const driverService = require("../src/services/driver.service");
const Truck = require("../src/models/Truck");

describe("trip, expense, dashboard services", () => {
  test("create trip and add expense, dashboard reflects totals", async () => {
    // create driver
    const driver = await driverService.createDriver({
      fullName: "Trip Driver",
      email: "tripdriver@example.com",
      password: "pass1234",
      phone: "1112223333",
      licenseNumber: "LIC999",
    });

    // create truck directly
    const truck = await Truck.create({
      number: "TRK-1",
      model: "ModelX",
      licensePlate: "LP-123",
      capacity: 1000,
    });

    const trip = await tripService.createTrip({
      truckId: truck._id,
      driverId: driver._id,
      source: "A",
      destination: "B",
      loadType: "general",
      income: 1000,
      departureDate: new Date(),
      status: "active",
    });

    expect(trip.income).toBe(1000);

    const expense = await expenseService.addExpense(
      {
        tripId: trip._id,
        type: "fuel",
        amount: 200,
        date: new Date(),
        paidBy: "admin",
      },
      { id: driver._id, role: "admin" },
    );

    expect(expense.amount).toBe(200);

    const summary = await dashboardService.getDashboardSummary();
    expect(summary.totalIncome).toBeGreaterThanOrEqual(1000);
    expect(summary.totalExpenses).toBeGreaterThanOrEqual(200);
  });
});
