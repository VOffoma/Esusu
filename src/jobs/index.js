import sendInvitationMails from './sendInvitationMails';

const sendInvitationMailsJob = (agenda) => {
  agenda.define('send-invitation-mails',
    { priority: 'high', concurrency: 10 },
    sendInvitationMails);
};
export default [sendInvitationMailsJob];
