const { User } = require('../models');
const passwordEncoder = require('../utils/password-encoder');
const { RedisKeyConstants, ResultCode } = require('../common/constants');
const redisClient = require('../config/redis');
const { BizError } = require('../common/errors');
const tokenService = require('./token.service');
const config = require('../config/config');
const userService = require('./user.service');
const { userConverter } = require('../converters');

/**
 * Login with email and password
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
const loginWithCredentials = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new BizError(ResultCode.USER_NOT_FOUND);
  }

  // Check password
  if (!(await passwordEncoder.comparePassword(password, user.password))) {
    throw new BizError(ResultCode.PASSWORD_NOT_MATCH);
  }

  // Generate tokens
  const tokens = tokenService.generateAuthTokens(user);

  // Cache user in 1 hour
  const cacheKey = RedisKeyConstants.USER_PREFIX + user.id;
  const simpleUser = userConverter.toSimpleUser(user);
  await redisClient.set(cacheKey, JSON.stringify(simpleUser), 'EX', 3600);

  // Cache refresh token to redis
  const refreshTokenKey = RedisKeyConstants.REFRESH_TOKEN_PREFIX + user.id;
  const refreshTokenExpiresIn = config.jwt.refreshTokenExpiresIn;
  await redisClient.set(
    refreshTokenKey,
    tokens.refresh.token,
    'EX',
    refreshTokenExpiresIn,
  );

  return tokens;
};

const logout = async (userId) => {
  // Remove user cache
  const cacheKey = RedisKeyConstants.USER_PREFIX + userId;
  await redisClient.del(cacheKey);
};

const refreshAuth = async (refreshToken) => {
  // Verify refresh token
  const payload = await tokenService.verifyToken(refreshToken);

  // Get refresh token from redis
  const cacheKey = RedisKeyConstants.REFRESH_TOKEN_PREFIX + payload.sub;
  const cachedRefreshToken = await redisClient.get(cacheKey);

  if (!cachedRefreshToken || refreshToken !== cachedRefreshToken) {
    throw new BizError(ResultCode.TOKEN_INVALID);
  }

  // Find user by id
  const user = await userService.getSimpleUserById(payload.sub);

  // Generate new tokens
  return tokenService.generateAccessToken(user);
};

module.exports = {
  loginWithCredentials,
  logout,
  refreshAuth,
};
