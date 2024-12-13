const httpStatus = require('http-status');
const {
  authService,
  tokenService,
  userService
} = require('../services');
const catchAsync = require("../utils/catch-async");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send();
})

const login = catchAsync(async (req, res) => {
  const {email, password} = req.body;
  const user = await authService.loginWithCredentials(email, password);
  const tokens = tokenService.generateAuthTokens(user);
  res.send({tokens});
})

const logout = catchAsync(async (req, res) => {
  await authService.logout();
  res.redirect('/login');
})

module.exports = {
  register, login, logout,
}