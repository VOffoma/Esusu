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

const groupId = {
  params: Joi.object({
    groupId: Joi.string().trim().required(),
  }),
};

// change groupcreation to a better name
export default { groupCreation, groupId };
