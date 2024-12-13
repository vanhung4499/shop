const Joi = require('joi');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
}

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
}

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
  }),
}

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string
  }),
}

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
}