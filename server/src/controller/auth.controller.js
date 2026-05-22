const authService = require("../services/auth.service");

const getSafeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  licenseNumber: user.licenseNumber,
});

exports.register = async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user: getSafeUser(user),
      token,
    },
  });
};

exports.login = async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: getSafeUser(user),
      token,
    },
  });
};

exports.getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};
