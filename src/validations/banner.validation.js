const Joi = require('joi');
const { objectId } = require('./custom.validation');

const bannerQuery = Joi.object().keys({
  name: Joi.string(),
  status: Joi.string(),
  sortBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
});

const bannerParam = Joi.object().keys({
  bannerId: Joi.string().custom(objectId),
});

const bannerForm = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().uri().required(),
});

const createBanner = {
  body: bannerForm,
};

const getBanner = {
  params: bannerParam,
};

const updateBanner = {
  params: bannerParam,
  body: bannerForm,
};

const deleteBanner = {
  params: bannerParam,
};

const getBanners = {
  query: bannerQuery,
};

module.exports = {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
  getBanners,
};
