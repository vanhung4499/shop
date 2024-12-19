const { authService, tokenService, userService } = require('../services');
const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send(result.success(user));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginWithCredentials(email, password);
  const tokens = tokenService.generateAuthTokens(user);
  res.send(result.success(tokens));
});

const logout = catchAsync(async (req, res) => {
  await authService.logout();
  res.redirect('/login');
});

const getMe = catchAsync(async (req, res) => {
  res.send(result.success(req.user));
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
