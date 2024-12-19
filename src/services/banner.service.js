const { Banner } = require('../models');
const { BizError } = require('../common/errors');
const ResultCode = require('../common/enums/result-code');

/**
 * Get banners with pagination
 * @param filter
 * @param options
 * @returns {Promise<void|*>}
 */
const getBanners = async (filter, options) => {
  return Banner.paginate(filter, options);
};

/**
 * Create a banner
 * @param {Object} bannerForm
 * @returns {Promise<Banner>}
 */
const createBanner = async (bannerForm) => {
  return Banner.create(bannerForm);
};

/**
 * Get banner by id
 * @param {ObjectId} id
 * @returns {Promise<Banner>}
 */
const getBannerById = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new BizError(ResultCode.BANNER_NOT_FOUND);
  }
  return Banner.findById(id);
};

/**
 * Update banner by id
 * @param {ObjectId} bannerId
 * @param {Object} updateBody
 * @returns {Promise<Banner>}
 */
const updateBannerById = async (bannerId, updateBody) => {
  const banner = await getBannerById(bannerId);
  Object.assign(banner, updateBody);
  await banner.save();
  return banner;
};

/**
 * Delete banner by id
 * @param {ObjectId} bannerId
 * @returns {Promise<Banner>}
 */
const deleteBannerById = async (bannerId) => {
  const banner = await getBannerById(bannerId);
  await banner.remove();
  return banner;
};

module.exports = {
  getBanners,
  createBanner,
  getBannerById,
  updateBannerById,
  deleteBannerById,
};
