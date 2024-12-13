const catchAsync = require("../utils/catch-async");

const getAdminLoginPage = catchAsync(async (req, res) => {
  res.render("admin/login");
});

const getAdminDashboardPage = catchAsync(async (req, res) => {
  res.render("admin/dashboard");
});

const getProductListPage = catchAsync(async (req, res) => {
  res.render("admin/product-list");
});

const getProductAddPage = catchAsync(async (req, res) => {
  res.render("admin/product-add");
});

const getProductEditPage = catchAsync(async (req, res) => {
  res.render("admin/product-edit");
});

const getCategoryListPage = catchAsync(async (req, res) => {
  res.render("admin/category-list");
});

const getCategoryAddPage = catchAsync(async (req, res) => {
  res.render("admin/category-add");
});

const getCategoryEditPage = catchAsync(async (req, res) => {
  res.render("admin/category-edit");
});

module.exports = {
  getAdminLoginPage,
  getAdminDashboardPage,
  getProductListPage,
  getProductAddPage,
  getProductEditPage,
  getCategoryListPage,
  getCategoryAddPage,
  getCategoryEditPage,
};