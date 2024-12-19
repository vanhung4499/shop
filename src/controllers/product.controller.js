const productService = require('../services/product.service');
const catchAsync = require('../utils/catch-async');
const pick = require('../utils/pick');
const result = require('../utils/result');

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const products = await productService.getProducts(filter, options);
  res.send(result.success(products));
});

const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);
  res.send(result.success(product));
});

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.send(result.success(product));
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.updateProductById(productId, req.body);
  res.send(result.success(product));
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  await productService.deleteProductById(productId);
  res.send(result.success());
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
