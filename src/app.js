import express from 'express';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import { ValidationError } from 'express-validation';
import indexRouter from './controllers/indexRouter';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v0', indexRouter);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the default endpoint' });
});

app.use((req, res, next) => {
  next(createError(404, `Sorry, the route ${req.url} does not exist`));
});

app.use((error, req, res, next) => {
  let validationErrorMessage;
  if (error instanceof ValidationError) {
    const validationErrorDetails = error.details[0];
    const validationErrorKey = Object.keys(validationErrorDetails)[0];
    validationErrorMessage = validationErrorDetails[validationErrorKey];
  }

  res.status(error.status || error.statusCode || 500);
  res.json({
    message: validationErrorMessage || error.message,
    stack: error.stack,
  });
});

export default app;
