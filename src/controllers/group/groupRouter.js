import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import groupService from './groupService';
import validationRules from './validationRules';


const groupRouter = Router();

groupRouter.get('/', (req, res) => {
  res.status(200).send({ message: 'this route work' });
});

groupRouter.post('/',
  validate(validationRules.groupCreation, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const groupDetails = req.body;
    const newGroup = await groupService.createGroup(groupDetails);
    return res.status(201).send(newGroup);
  }));

export default groupRouter;
