const driverService = require("../src/services/driver.service");

describe("driver.service", () => {
  test("create, list, get, update, delete driver", async () => {
    const payload = {
      fullName: "Driver One",
      email: "driver1@example.com",
      password: "pass1234",
      phone: "1234567890",
      licenseNumber: "LIC123",
    };

    const driver = await driverService.createDriver(payload);
    expect(driver.email).toBe(payload.email);

    const list = await driverService.getDrivers({ page: 1, limit: 10 });
    expect(list.total).toBeGreaterThanOrEqual(1);

    const found = await driverService.getDriverById(driver._id);
    expect(found.email).toBe(payload.email);

    const updated = await driverService.updateDriver(driver._id, {
      fullName: "Driver One Updated",
    });
    expect(updated.fullName).toBe("Driver One Updated");

    await driverService.deleteDriver(driver._id);
    await expect(driverService.getDriverById(driver._id)).rejects.toThrow();
  });
});
