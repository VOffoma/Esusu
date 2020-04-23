import app from './app';
import config from './config/index';
import { connectDb } from './mongooseSetup';

const port = process.env.PORT || 7076;
const databaseURL = config.get('mongodb:url');

app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log('The server has been started');
  await connectDb(databaseURL);
});
