const { Category } = require('../models');
const AppError = require('../common/errors/app-error');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

/**
 * Get all categories
 * @returns {Promise<void>}
 */
const getCategories = async () => {
  return Category.find();
};

/**
 * Get category by id
 * @param categoryId
 * @returns {Promise<void>}
 */
const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new BizError(ResultCode.CATEGORY_NOT_FOUND);
  }
  return category;
};

/**
 * Create a new category
 * @param categoryForm
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryForm) => {
  // Check if category already exists
  const existCategory = await Category.findOne({ name: categoryForm.name });
  if (existCategory) {
    throw new BizError(ResultCode.CATEGORY_EXISTS);
  }
  // Create a new category
  return Category.create(categoryForm);
};

/**
 * Update a category
 * @param categoryId
 * @param categoryForm
 * @returns {Promise<void>}
 */
const updateCategoryById = async (categoryId, categoryForm) => {
  const category = await getCategoryById(categoryId);

  Object.assign(category, categoryForm);
  await category.save();
  return category;
};

/**
 * Delete a category
 * @param categoryId
 * @returns {Promise<void>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  await category.deleteOne();
  return category;
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
