import * as Joi from 'joi';

export const EnvValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('develop', 'production')
    .default('develop'),

  PORT: Joi.number().default(3001),

  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
