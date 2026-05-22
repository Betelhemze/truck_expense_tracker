const authService = require("../src/services/auth.service");
const User = require("../src/models/User");

describe("auth.service", () => {
  test("register then login and getMe", async () => {
    const payload = {
      fullName: "Test User",
      email: "test@example.com",
      password: "secret123",
      role: "driver",
    };

    const { user, token } = await authService.register(payload);
    expect(user.email).toBe(payload.email);
    expect(token).toBeDefined();

    const login = await authService.login({
      email: payload.email,
      password: payload.password,
    });
    expect(login.token).toBeDefined();
    expect(login.user.email).toBe(payload.email);

    const me = await authService.getMe(user._id);
    expect(me.email).toBe(payload.email);
  });
});
