import joi from 'joi';

export const productValidate = joi.object({
  title: joi.string().required(),
  description: joi.string(),
  price: joi.number().required(),
  sale: joi.number(),
  category: joi.string().required(),
  quantity: joi.number().required(),
  thumbnail: joi.string().required(),
  size: joi
    .array()
    .items(joi.object({ name: joi.string().required(), price: joi.number().required() }))
    .required(),
});
