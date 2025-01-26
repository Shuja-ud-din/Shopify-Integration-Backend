import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  // App
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  GLOBAL_PREFIX: Joi.string().default('api'),
  CORS_ENABLED: Joi.boolean().default(false),

  // Mongo
  MONGO_URI: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  // Redis
  REDIS_URL: Joi.string().required().default('redis://localhost:6379'),

  // Shopify
  SHOPIFY_ACCESS_TOKEN: Joi.string().required(),
  SHOPIFY_STORE: Joi.string().required(),
});
