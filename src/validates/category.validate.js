import joi from 'joi'

export const categoryValidate = joi.object({
  name: joi.string().required(),
  productId: joi.array().items(joi.string()),
})
