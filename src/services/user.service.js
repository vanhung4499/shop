const httpStatus = require('http-status');
const { User } = require('../models');
const AppError = require('../common/errors/app-error');
const passwordEncoder = require('../utils/password-encoder');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

const getUsers = async (filter, options) => {
  return User.paginate(filter, options);
};

/**
 * Create a user
 * @param userForm userForm
 * @returns User
 */
const createUser = async (userForm) => {
  const { username, email, password } = userForm;
  // Check email available
  let user = await User.findOne({ email });
  if (user) {
    throw new BizError(ResultCode.USER_EMAIL_EXISTS);
  }
  // Check username available
  user = await User.findOne({ username });
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Username already exists');
  }

  // Hash password before save
  userForm.password = await passwordEncoder.hashPassword(password);

  // Save
  user = await User.create(userForm);
  return user;
};

const getUserById = async (userId) => {
  let user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const getUserByEmail = async (email) => {
  let user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateUserById = async (userId, updateUserForm) => {
  let user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Check username
  if (
    updateUserForm.username &&
    updateUserForm.username !== user.username &&
    User.existsByEmail(user.email)
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  // Update and save
  Object.assign(user, updateUserForm);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  let user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
