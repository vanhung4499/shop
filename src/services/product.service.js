const { Product } = require('../models');
const slugify = require('slugify');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/constants/result-code');
const logger = require('../config/logger');

const getProducts = async (filter, options) => {
  return Product.paginate(filter, options);
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  return product;
};

const createProduct = async (productForm) => {
  // Check if product with same name already exists
  const product = await Product.findOne({ name: productForm.name });
  if (product) {
    throw new BizError(ResultCode.PRODUCT_EXISTS);
  }

  const slug = slugify(productForm.name, { lower: true });
  productForm.slug = slug;

  const newProduct = await Product.create(productForm);

  // TODO: Add image upload logic here

  await newProduct.save();
  return newProduct;
};

const updateProductById = async (productId, productForm) => {
  const product = await getProductById(productId);

  Object.assign(product, productForm);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);

  await product.deleteOne();
};

const checkInventory = async (items) => {
  // Get all products in the order
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  // Check if all products are found
  if (products.length !== productIds.length) {
    throw new BizError(ResultCode.PRODUCT_NOT_FOUND);
  }

  // Check if all products have enough quantity
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product.quantity < item.quantity) {
      return false;
    }
  }

  return true;
};

// Lock stock of products in an order
const lockStock = async (items) => {
  for (const item of items) {
    // Get product
    const product = await getProductById(item.productId);

    // Check if product has enough available stock
    const availableStock = product.stock - product.lockedStock;
    if (availableStock < item.quantity) {
      return false;
    }

    // Lock stock
    product.lockedStock += item.quantity;

    await product.save();

    logger.info(`Locked ${item.quantity} stock of product ${product.id}`);
  }

  return true;
};

// Unlock stock of products in an order, when order is cancelled or expired
const unlockStock = async (items) => {
  for (const item of items) {
    // Get product
    const product = await getProductById(item.productId);

    // Unlock stock
    product.lockedStock -= item.quantity;
    await product.save();

    logger.info(`Unlocked ${item.quantity} stock of product ${product.id}`);
  }
};

// Deduct stock of products in an order, when order is paid
const deductStock = async (items) => {
  for (const item of items) {
    // Get product
    const product = await getProductById(item.productId);

    // Deduct stock
    product.stock -= item.quantity;
    await product.save();

    logger.info(`Deducted ${item.quantity} stock of product ${product.id}`);
  }
};

// refund stock of products in an order, when order is cancelled
const refundStock = async (items) => {
  for (const item of items) {
    // Get product
    const product = await getProductById(item.productId);

    // Refund stock
    product.stock += item.quantity;
    await product.save();

    logger.info(`Refunded ${item.quantity} stock of product ${product.id}`);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  checkInventory,
  lockStock,
  unlockStock,
  deductStock,
  refundStock,
};
