const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../errors/ApiError");

exports.register = async ({
  fullName,
  email,
  password,
  role,
  phone,
  licenseNumber,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    phone,
    licenseNumber,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    user,
    token,
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    user,
    token,
  };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};
