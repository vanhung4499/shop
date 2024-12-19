const Joi = require('joi');
const { objectId } = require('./custom.validation');

const categoryParam = Joi.object().keys({
  categoryId: Joi.string().custom(objectId),
});

const categoryForm = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

const createCategory = {
  body: categoryForm,
};

const getCategory = {
  params: categoryParam,
};

const updateCategory = {
  params: categoryParam,
  body: categoryForm,
};

const deleteCategory = {
  params: categoryParam,
};

const getCategories = {
  query: categoryParam,
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
