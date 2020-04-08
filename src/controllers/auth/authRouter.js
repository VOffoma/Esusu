import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import authService from './authService';

// import authService from './authService';


const authRouter = Router();

authRouter.post('/signup', asyncHandler(async (req, res) => {
  const signUpInfo = req.body;
  const newUser = await authService.register(signUpInfo);
  res.status(201).send(newUser);
}));

authRouter.post('/signin', asyncHandler(async (req, res) => {
  const loginCredentials = req.body;
  const authInfo = await authService.login(loginCredentials);
  res.status(200).send(authInfo);
}));

// Remember to turn this into a middleware
authRouter.get('/validate', asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  const response = await authService.validateToken(token);
  res.status(200).send(response);
}));

export default authRouter;
