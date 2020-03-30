import express from 'express';
import indexRouter from './controllers/indexRouter';

const app = express();

app.use('/api/v0', indexRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the default endpoint' });
});

export default app;
