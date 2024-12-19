const catchAsync = require('../utils/catch-async');
const { bannerService } = require('../services');
const pick = require('../utils/pick');
const result = require('../utils/result');

/**
 * Get banners with pagination
 */
const getBanners = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const banners = await bannerService.getBanners(filter, options);
  res.send(result.success(banners));
});

/**
 * Create a new banner
 */
const createBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.createBanner(req.body);
  res.send(result.success(banner));
});

/**
 * Get a banner by id
 */
const getBanner = catchAsync(async (req, res) => {
  const { bannerId } = req.params;
  const banner = await bannerService.getBannerById(bannerId);
  res.send(result.success(banner));
});

/**
 * Update a banner by id
 */
const updateBanner = catchAsync(async (req, res) => {
  const { bannerId } = req.params;
  const banner = await bannerService.updateBannerById(bannerId, req.body);
  res.send(result.success(banner));
});

/**
 * Delete a banner by id
 */
const deleteBanner = catchAsync(async (req, res) => {
  const { bannerId } = req.params;
  await bannerService.deleteBannerById(bannerId);
  res.send(result.success());
});

module.exports = {
  getBanners,
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
};
