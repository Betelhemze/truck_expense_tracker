const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { buildListQuery } = require("./query.service");
const { BadRequestError, NotFoundError } = require("../errors/ApiError");

exports.getDrivers = async (query) => {
  const { page, limit, skip, sort, filter } = buildListQuery(query, ["status"]);
  const where = { role: "driver", ...filter };
  const [drivers, total] = await Promise.all([
    User.find(where).select("-password").sort(sort).skip(skip).limit(limit),
    User.countDocuments(where),
  ]);

  return { drivers, total, page, limit };
};

exports.getDriverById = async (id) => {
  const driver = await User.findOne({ _id: id, role: "driver" }).select(
    "-password",
  );

  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  return driver;
};

exports.createDriver = async ({
  fullName,
  email,
  password,
  phone,
  licenseNumber,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Driver already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const driver = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: "driver",
    phone,
    licenseNumber,
  });

  return driver;
};

exports.updateDriver = async (id, payload) => {
  const updatePayload = { ...payload };
  if (updatePayload.password) {
    updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
  }

  const driver = await User.findOneAndUpdate(
    { _id: id, role: "driver" },
    updatePayload,
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  return driver;
};

exports.deleteDriver = async (id) => {
  const driver = await User.findOneAndDelete({ _id: id, role: "driver" });

  if (!driver) {
    throw new NotFoundError("Driver not found");
  }

  return driver;
};
