import { Router } from 'express';
import authRouter from './auth/authRouter';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);

indexRouter.get('/', (req, res) => {
  res.json({ message: 'V0' });
});

export default indexRouter;
