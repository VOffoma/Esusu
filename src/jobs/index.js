import sendInvitationMails from './sendInvitationMails';

const testJob = (agenda) => {
  agenda.define('test', () => {
    const date = new Date().toString();
    console.log(date);
  });
  agenda.start();
};

const sendInvitationMailsJob = (agenda) => {
  agenda.define('send-invitation-mails',
    { priority: 'high', concurrency: 10 },
    sendInvitationMails);
};
export default [testJob, sendInvitationMailsJob];
