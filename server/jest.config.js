module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  // Increase timeout to allow MongoDB binary download / startup
  testTimeout: 120000,
};
