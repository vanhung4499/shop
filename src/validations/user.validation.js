const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const RoleEnum = require("../common/enums/role.enum");

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        username: Joi.string().required(),
        role: Joi.string().required().valid(...Object.values(RoleEnum)),
    }),
}

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
}

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        username: Joi.string(),
        role: Joi.string().valid(...Object.values(RoleEnum)),
    }),
}

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
}