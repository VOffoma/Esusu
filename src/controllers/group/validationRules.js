import { Joi } from 'express-validation';

const groupCreation = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
    maxCapacity: Joi.number().required().min(2).max(50),
    savingsAmount: Joi.number().required(),
    isSearchable: Joi.boolean().optional(),
  }),
};

export default { groupCreation };
