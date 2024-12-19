const Joi = require('joi');

const productQuery = Joi.object().keys({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  sortBy: Joi.string().optional(),
  limit: Joi.number().integer().optional(),
  page: Joi.number().integer().optional(),
  populate: Joi.string().optional(),
});

const productParam = Joi.object().keys({
  productId: Joi.string().required(),
});

const productForm = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  originalPrice: Joi.number().optional(),
  stock: Joi.number().required(),
  category: Joi.string().required(),
  brand: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
});

const createProduct = {
  body: productForm,
};

const updateProduct = {
  params: productParam,
  body: productForm,
};

const getProduct = {
  params: productParam,
};

const deleteProduct = {
  params: productParam,
};

const getProducts = {
  query: productQuery,
};

module.exports = {
  createProduct,
  updateProduct,
  getProduct,
  deleteProduct,
  getProducts,
};
