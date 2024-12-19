const { categoryService } = require('../services');
const catchAsync = require('../utils/catch-async');
const result = require('../utils/result');

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.send(result.success(categories));
});

const getCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryService.getCategoryById(categoryId);
  res.send(result.success(category));
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.send(result.success(category));
});

const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryService.updateCategoryById(
    categoryId,
    req.body,
  );
  res.send(result.success(category));
});

const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  await categoryService.deleteCategoryById(categoryId);
  res.send(result.success());
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
