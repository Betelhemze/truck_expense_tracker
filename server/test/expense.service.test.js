const expenseService = require("../src/services/expense.service");
const driverService = require("../src/services/driver.service");
const authService = require("../src/services/auth.service");
const tripService = require("../src/services/trip.service");
const truckService = require("../src/services/truck.service");
const Trip = require("../src/models/Trip");

describe("expense.service", () => {
  test("admin/driver expense rules, trip.expenses update, access control", async () => {
    // create admin and driver
    const { user: admin } = await authService.register({
      fullName: "Admin User",
      email: "admin.test@example.com",
      password: "adminpass",
      role: "admin",
    });

    const driver = await driverService.createDriver({
      fullName: "Driver E1",
      email: "driver.e1@example.com",
      password: "pass1234",
      phone: "2223334444",
      licenseNumber: "DL-200",
    });

    const truck = await truckService.createTruck({
      number: "T-200",
      model: "DAF",
      licensePlate: "PLT-200",
      driverId: driver._id,
    });

    const trip = await tripService.createTrip({
      truckId: truck._id,
      driverId: driver._id,
      source: "A",
      destination: "B",
      loadType: "general",
      income: 1000,
      departureDate: new Date(),
    });

    // admin can add driver_payment
    const expensePayload = {
      tripId: trip._id,
      type: "driver_payment",
      amount: 150,
      date: new Date(),
      paidBy: "admin",
    };

    const exp = await expenseService.addExpense(expensePayload, {
      id: admin._id,
      role: admin.role,
    });

    expect(exp.type).toBe("driver_payment");

    // trip should reference the expense
    const tripFetched = await Trip.findById(trip._id);
    expect(tripFetched.expenses.map(String)).toContain(String(exp._id));

    // driver cannot add driver_payment
    await expect(
      expenseService.addExpense(
        { ...expensePayload, amount: 200 },
        { id: driver._id, role: "driver" },
      ),
    ).rejects.toThrow();

    // driver listing should return expenses only for their trips
    const listForDriver = await expenseService.getExpenses(
      { id: driver._id, role: "driver" },
      { page: 1, limit: 10 },
    );
    expect(listForDriver.total).toBeGreaterThanOrEqual(1);

    // create another driver and trip
    const otherDriver = await driverService.createDriver({
      fullName: "Driver E2",
      email: "driver.e2@example.com",
      password: "pass1234",
      phone: "3334445555",
      licenseNumber: "DL-300",
    });

    const otherTruck = await truckService.createTruck({
      number: "T-300",
      model: "MAN",
      licensePlate: "PLT-300",
      driverId: otherDriver._id,
    });

    const otherTrip = await tripService.createTrip({
      truckId: otherTruck._id,
      driverId: otherDriver._id,
      source: "C",
      destination: "D",
      loadType: "bulk",
      income: 500,
      departureDate: new Date(),
    });

    // admin adds expense to other trip
    await expenseService.addExpense(
      {
        tripId: otherTrip._id,
        type: "fuel",
        amount: 25,
        date: new Date(),
        paidBy: "admin",
      },
      { id: admin._id, role: admin.role },
    );

    // original driver should not be allowed to fetch otherTrip expenses
    await expect(
      expenseService.getTripExpenses(otherTrip._id, {
        id: driver._id,
        role: "driver",
      }),
    ).rejects.toThrow();
  });
});
