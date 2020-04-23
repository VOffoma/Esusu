import { Joi } from 'express-validation';

const groupCreation = {
  body: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim(),
    maxCapacity: Joi.number().required().min(2).max(50),
    savingsAmount: Joi.number().required(),
    public: Joi.boolean().optional(),
  }),
};

const groupId = {
  params: Joi.object({
    groupId: Joi.string().trim().required(),
  }),
};

const searchTerm = {
  query: Joi.object({
    searchTerm: Joi.string().trim().required(),
  }),
};

const groupInvitation = {
  params: Joi.object({
    groupId: Joi.string().trim().required(),
  }),
  body: Joi.object({
    invitees: Joi.array().min(1).required().items(Joi.string().email({ tlds: { allow: false } })),
  }),
};
// change groupcreation to a better name
export default {
  groupCreation, groupId, searchTerm, groupInvitation,
};
