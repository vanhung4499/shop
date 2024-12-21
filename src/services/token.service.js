const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { User } = require('../models');
const logger = require('../config/logger');
const { BizError } = require('../common/errors');
const { ResultCode } = require('../common/constants');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, role, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    role,
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify token
 * @param token
 * @returns {Promise<void>}
 */
const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new BizError(ResultCode.USER_NOT_FOUND);
    }

    return payload;
  } catch (error) {
    logger.error(error);
    throw new BizError(ResultCode.TOKEN_INVALID);
  }
};

/**
 * Generate access token
 * @param user
 * @returns {Object}
 */
const generateAccessToken = (user) => {
  const accessTokenExpiresIn = moment().add(
    config.jwt.accessTokenExpiresIn,
    'seconds',
  );
  const accessToken = generateToken(user.id, accessTokenExpiresIn, user.role);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpiresIn.toDate(),
    },
  };
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = (user) => {
  const accessTokenExpiresIn = moment().add(
    config.jwt.accessTokenExpiresIn,
    'seconds',
  );
  const accessToken = generateToken(user.id, accessTokenExpiresIn, user.role);

  const refreshTokenExpiresIn = moment().add(
    config.jwt.refreshTokenExpiresIn,
    'seconds',
  );
  const refreshToken = generateToken(user.id, refreshTokenExpiresIn, user.role);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpiresIn.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpiresIn.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
  generateAccessToken,
};
