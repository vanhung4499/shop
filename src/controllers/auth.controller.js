const { authService, userService } = require('../services');
const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send(result.success(user));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const tokens = await authService.loginWithCredentials(email, password);
  res.send(result.success(tokens));
});

const logout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.logout(userId);
  res.send(result.success());
});

const getMe = catchAsync(async (req, res) => {
  res.send(result.success(req.user));
});

const refreshAuth = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  res.send(result.success(tokens));
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshAuth,
};
