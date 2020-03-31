import express from 'express';
import bodyParser from 'body-parser';
import indexRouter from './controllers/indexRouter';


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/v0', indexRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the default endpoint' });
});

export default app;
