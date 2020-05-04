import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import groupService from './groupService';
import tenureService from './tenureService';
import validationRules from './validationRules';
import authService from '../auth/authService';
import agenda from '../../jobs/agenda';


const groupRouter = Router();

groupRouter.get('/', asyncHandler(async (req, res) => {
  const groups = await groupService.getGroups();
  agenda.schedule('in 1 minute', 'test');
  res.status(200).send(groups);
}));

groupRouter.get('/search',
  validate(validationRules.searchTerm, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const searchResult = await groupService.searchGroups(req.query.searchTerm);
    res.status(200).send(searchResult);
  }));

groupRouter.post('/signup/:token',
  validate(validationRules.invitationToken, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const validInvitation = await groupService.checkInvitationValidity(token);
    req.invitation = validInvitation;
    next();
  }),
  asyncHandler(async (req, res, next) => {
    const signUpInfo = req.body;
    await authService.register(signUpInfo);
    next();
  }),
  asyncHandler(async (req, res) => {
    const { invitation } = req;
    const groupInfo = await groupService.addUserToPrivateGroup(invitation);
    return res.status(201).send(`You have been successfully registered and added to group ${groupInfo.name}`);
  }));


groupRouter.post('/join/:token',
  validate(validationRules.invitationToken, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const validInvitation = await groupService.checkInvitationValidity(token);
    req.invitation = validInvitation;
    next();
  }),
  asyncHandler(async (req, res) => {
    const { invitation } = req;
    const groupInfo = await groupService.addUserToPrivateGroup(invitation);
    return res.status(200).send(groupInfo);
  }));


groupRouter.use(asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  const payload = await authService.verifyLogin(token);
  req.user = {
    email: payload.email,
    'cognito:username': payload['cognito:username'],
  };
  next();
}));


groupRouter.post('/',
  validate(validationRules.groupCreation, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const group = req.body;
    const { user } = req;
    const newGroup = await groupService.createGroup({ group, user });
    return res.status(201).send(newGroup);
  }));


groupRouter.post('/:groupId/invite',
  validate(validationRules.groupInvitation, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const { invitees } = req.body;
    const { groupId } = req.params;
    const message = await groupService.createInvitations(invitees, groupId);
    agenda.schedule('in 2 minutes', 'send-invitation-mails', { groupId });
    res.status(200).send(message);
  }));


groupRouter.post('/:groupId/join',
  validate(validationRules.groupId, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { user } = req;
    const groupInfo = await groupService.addUserToGroup({ groupId, newGroupUser: user });
    return res.status(200).send(groupInfo);
  }));

groupRouter.post('/:groupId/tenure',
  validate(validationRules.groupId, { statusCode: 422, keyByField: true }, {}),
  asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { cadance } = req.body;
    const groupInfo = await tenureService.startTenure({ groupId, cadance });
    return res.status(200).send(groupInfo);
  }));

export default groupRouter;
