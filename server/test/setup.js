const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
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
