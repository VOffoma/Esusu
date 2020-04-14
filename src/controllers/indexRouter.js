import { Router } from 'express';
import authRouter from './auth/authRouter';
import groupRouter from './group/groupRouter';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/group', groupRouter);

indexRouter.get('/', (req, res) => {
  res.json({ message: 'V0' });
});

export default indexRouter;
