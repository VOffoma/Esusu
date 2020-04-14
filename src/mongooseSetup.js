/* eslint-disable no-console */
import mongoose from 'mongoose';

const connectDb = (databaseURL) => {
  mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true, createIndexes: true })
    .then(() => {
      console.log('connection successfull');
    })
    .catch((error) => console.log(error));
  mongoose.connection.on('error', (error) => console.log(error));
};

const models = [];

export { connectDb };

export default models;
