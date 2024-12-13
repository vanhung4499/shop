const {Category} = require("../models");
const AppError = require("../utils/app-error");
const httpStatus = require("http-status");

/**
 * Get all categories
 * @returns {Promise<void>}
 */
const getCategories = async () => {
  return Category.find();
}

/**
 * Get category by id
 * @param categoryId
 * @returns {Promise<void>}
 */
const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
}

/**
 * Create a new category
 * @param categoryForm
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryForm) => {
  // Check if category already exists
  const existCategory = await Category.findOne({ name: categoryForm.name });
  if (existCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category already exists');
  }
  // Create a new category
  return Category.create(categoryForm);
}

/**
 * Update a category
 * @param categoryId
 * @param categoryForm
 * @returns {Promise<void>}
 */
const updateCategoryById = async (categoryId, categoryForm) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  Object.assign(category, categoryForm);
  await category.save();
  return category;
}

/**
 * Delete a category
 * @param categoryId
 * @returns {Promise<void>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
}