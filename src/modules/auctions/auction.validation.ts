import Joi from 'joi';

export const createAuction = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    startingPrice: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};
