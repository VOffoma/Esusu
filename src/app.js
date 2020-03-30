import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the default endpoint' });
});

export default app;
