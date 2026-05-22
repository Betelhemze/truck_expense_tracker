const truckService = require("../src/services/truck.service");
const driverService = require("../src/services/driver.service");

describe("truck.service", () => {
  test("create, list, get, update, delete truck", async () => {
    const driverPayload = {
      fullName: "Driver T1",
      email: "driver.t1@example.com",
      password: "pass1234",
      phone: "1112223333",
      licenseNumber: "DL-100",
    };

    const driver = await driverService.createDriver(driverPayload);

    const payload = {
      number: "T-100",
      model: "Volvo",
      licensePlate: "PLT-100",
      driverId: driver._id,
    };

    const truck = await truckService.createTruck(payload);
    expect(truck.licensePlate).toBe(payload.licensePlate);

    const list = await truckService.getTrucks({ page: 1, limit: 10 });
    expect(list.total).toBeGreaterThanOrEqual(1);

    const found = await truckService.getTruckById(truck._id);
    expect(found.licensePlate).toBe(payload.licensePlate);

    const updated = await truckService.updateTruck(truck._id, {
      model: "Scania",
    });
    expect(updated.model).toBe("Scania");

    await truckService.deleteTruck(truck._id);
    await expect(truckService.getTruckById(truck._id)).rejects.toThrow();
  });
});
