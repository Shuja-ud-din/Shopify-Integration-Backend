import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  JWT_SECRET: Joi.string().required(),

  // Redis
  REDIS_URL: Joi.string().required(),
});
