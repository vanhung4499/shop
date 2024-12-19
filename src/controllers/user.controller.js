const catchAsync = require('../utils/catch-async');
const { userService } = require('../services');
const pick = require('../utils/pick');
const result = require('../utils/result');

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['username', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const users = await userService.getUsers(filter, options);
  res.send(result.success(users));
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send(result.success(user));
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.send(result.success(user));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(result.success(user));
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.send(result.success());
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
