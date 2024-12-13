const httpStatus = require('http-status');

const {User} = require("../models");
const AppError = require("../utils/app-error");
const passwordEncoder = require("../utils/password-encoder");

/**
 * Login with email and password
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
const loginWithCredentials = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password");
    }
    if (!(await passwordEncoder.comparePassword(password, user.password))) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password");
    }
    return user;
}

const logout = () => {

}

module.exports = {
    loginWithCredentials,
    logout,
}