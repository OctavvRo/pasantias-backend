import Joi from 'joi';
import { objectId } from '../validate/custom.validation';

export const getByAuction = {
  params: Joi.object().keys({
    auctionId: Joi.string().required().custom(objectId),
  }),
};

export const placeBid = {
  body: Joi.object().keys({
    auctionId: Joi.string().required(),
    userId: Joi.string().required(),
    amount: Joi.number().greater(0).required(),
  }),
};
