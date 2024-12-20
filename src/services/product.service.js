const { Product } = require('../models');
const slugify = require('slugify');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  checkInventory,
};
