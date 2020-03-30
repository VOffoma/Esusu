import app from './app';

const port = process.env.PORT || 7076;


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('The server has been started');
});
