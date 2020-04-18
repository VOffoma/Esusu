/* eslint-disable no-console */
import mongoose from 'mongoose';

const connectDb = (databaseURL) => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  mongoose.connect(databaseURL, options)
    .then(() => {
      console.log('connection successfull');
    })
    .catch((error) => console.log(error));
  mongoose.connection.on('error', (error) => console.log(error));
};

const models = [];

export { connectDb };

export default models;
