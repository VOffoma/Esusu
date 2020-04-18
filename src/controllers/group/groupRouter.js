import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import groupService from './groupService';
import validationRules from './validationRules';
import authService from '../auth/authService';

const groupRouter = Router();

groupRouter.get('/', asyncHandler(async (req, res) => {
  const groups = await groupService.getGroups();
  res.status(200).send(groups);
}));

groupRouter.use(asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  const payload = await authService.verifyLogin(token);
  req.user = {
    name: payload.name,
    email: payload.email,
    'cognito:username': payload['cognito:username'],
  };
  next();
}));


groupRouter.post('/',
  validate(validationRules.groupCreation, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const groupDetails = req.body;
    groupDetails.admin = req.user;
    const newGroup = await groupService.createGroup(groupDetails);
    return res.status(201).send(newGroup);
  }));

groupRouter.post('/:groupId/join',
  validate(validationRules.groupId, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { user } = req;
    const groupInfo = await groupService.addUserToGroup({ groupId, user });
    return res.status(201).send(groupInfo);
  }));

export default groupRouter;
