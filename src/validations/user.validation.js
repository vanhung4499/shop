const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const RoleEnum = require('../common/enums/role.enum');

const userQuery = Joi.object().keys({
  role: Joi.string()
    .valid(...Object.values(RoleEnum))
    .optional(),
  sortBy: Joi.string().optional(),
  limit: Joi.number().integer().optional(),
  page: Joi.number().integer().optional(),
});

const userParam = Joi.object().keys({
  userId: Joi.string().custom(objectId),
});

const userForm = Joi.object().keys({
  email: Joi.string().email(),
  password: Joi.string().custom(password),
  username: Joi.string(),
  role: Joi.string()
    .valid(...Object.values(RoleEnum))
    .default(RoleEnum.CUSTOMER),
});

const getUsers = {
  query: userQuery,
};

const createUser = {
  body: userForm,
};

const getUser = {
  params: userParam,
};

const updateUser = {
  params: userParam,
  body: userForm,
};

const deleteUser = {
  params: userParam,
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
