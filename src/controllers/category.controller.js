const {categoryService} = require("../services");
const catchAsync = require("../utils/catch-async");
const httpStatus = require("http-status");

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.send(categories);
})

const getCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryService.getCategoryById(categoryId);
  res.send(category);
})

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
})

const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const category = await categoryService.updateCategoryById(categoryId, req.body);
  res.send(category);
})

const deleteCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  await categoryService.deleteCategoryById(categoryId);
  res.status(httpStatus.NO_CONTENT).send();
})

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}


