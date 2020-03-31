import { Router } from 'express';
import authService from './authService';

const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  const signUpInfo = req.body;
  const newUser = await authService.register(signUpInfo);
  res.json({ newUser });
});

authRouter.get('/signin', (req, res) => {
  res.json({ message: 'signin route' });
});

export default authRouter;
