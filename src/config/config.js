const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(3000),
    MONGO_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().default(604800), // 7 days
    JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().default(2592000), // 30 days
    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
  })
  .unknown();

const {value: env, error} = envSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongoose: {
    url: env.MONGO_URL,
    options: {},
  },
  jwt: {
    secret: env.JWT_SECRET,
    accessTokenExpiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
};