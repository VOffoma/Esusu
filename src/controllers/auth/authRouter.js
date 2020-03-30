import { Router } from 'express';

const authRouter = Router();

authRouter.get('/signup', (req, res) => {
  res.json({ message: 'signup route' });
});

authRouter.get('/signin', (req, res) => {
  res.json({ message: 'signin route' });
});

export default authRouter;
