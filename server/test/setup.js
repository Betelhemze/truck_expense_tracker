const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Ensure `crypto` global exists for environments where it's not set (CI/node variants)
if (typeof globalThis.crypto === "undefined") {
  try {
    // Node's crypto provides required functions; assign to globalThis for libraries expecting web crypto
    // Fallback to the crypto module itself which exposes randomUUID and randomBytes
    // eslint-disable-next-line global-require
    globalThis.crypto = require("crypto");
  } catch (e) {
    // ignore — tests will fail later if crypto truly unavailable
  }
}

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

  const mongoUrl = process.env.MONGO_URL || process.env.CI_MONGO_URL;

  try {
    if (mongoUrl) {
      await mongoose.connect(mongoUrl);
    } else {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
    }
  } catch (err) {
    // log and rethrow so Jest reports the cause
    // eslint-disable-next-line no-console
    console.error(
      "MongoMemoryServer start failed:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
  } catch (e) {
    // ignore disconnect errors
  }

  if (mongoServer && typeof mongoServer.stop === "function") {
    try {
      await mongoServer.stop();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        "Failed to stop MongoMemoryServer:",
        e && e.message ? e.message : e,
      );
    }
  }
});

afterEach(async () => {
  if (!mongoose.connection || !mongoose.connection.db) return;

  const collections = await mongoose.connection.db.collections();
  for (let c of collections) {
    try {
      await c.deleteMany({});
    } catch (e) {
      // ignore per-collection cleanup errors
    }
  }
});
