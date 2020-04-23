import Agenda from 'agenda';
import config from '../config/index';
import jobs from './index';

const databaseURL = config.get('mongodb:url');
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const agenda = new Agenda({
  db: { address: databaseURL, collection: 'jobs', options },
  maxConcurrency: 5,
});

jobs.forEach((job) => job(agenda));

(async () => { // IIFE to give access to async/await
  await new Promise((resolve) => agenda.once('ready', resolve));
})();


export default agenda;
