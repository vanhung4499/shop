const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const AppError = require("../utils/app-error");
const {User} = require("../models");

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

    const user = User.findById(payload.sub);
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    return payload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
}

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = (user) => {
  const accessTokenExpiresIn = moment().add(config.jwt.accessTokenExpiresIn, 'seconds');
  const accessToken = generateToken(user.id, accessTokenExpiresIn, user.role);

  const refreshTokenExpiresIn = moment().add(config.jwt.refreshTokenExpiresIn, 'seconds');
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
};