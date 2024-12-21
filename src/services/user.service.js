const httpStatus = require('http-status');
const { User } = require('../models');
const AppError = require('../common/errors/app-error');
const passwordEncoder = require('../utils/password-encoder');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/constants/result-code');
const RedisKeyConstants = require('../common/constants/redis-key.constant');
const redisClient = require('../config/redis');
const { userConverter } = require('../converters');

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
    throw new BizError(ResultCode.EMAIL_EXISTS);
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
    throw new BizError(ResultCode.USER_NOT_FOUND);
  }
  return user;
};

const getUserByEmail = async (email) => {
  let user = await User.findOne({ email });

  if (!user) {
    throw new BizError(ResultCode.USER_NOT_FOUND);
  }

  return user;
};

const updateUserById = async (userId, updateUserForm) => {
  let user = await getUserById(userId);

  // Check username
  if (
    updateUserForm.username &&
    updateUserForm.username !== user.username &&
    User.existsByEmail(user.email)
  ) {
    throw new BizError(ResultCode.USERNAME_EXISTS);
  }
  // Update and save
  Object.assign(user, updateUserForm);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  let user = await getUserById(userId);

  await user.remove();
  return user;
};

const getSimpleUserById = async (userId) => {
  // Get user from redis first
  const cacheKey = RedisKeyConstants.USER_PREFIX + userId;
  let user = await redisClient.get(cacheKey);

  if (user) {
    return JSON.parse(user);
  }

  // Otherwise, get user from database
  user = await getUserById(userId);

  // Convert to simple user
  const simpleUser = userConverter.toSimpleUser(user);
  // Cache simple user to redis in 1 hour
  await redisClient.set(cacheKey, JSON.stringify(simpleUser), 'EX', 3600);

  return simpleUser;
};

const refreshToken = async (refreshToken) => {};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getSimpleUserById,
};
