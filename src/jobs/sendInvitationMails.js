import Invitation from '../controllers/group/models/Invitation';
import mailService from '../services/mailer';
import config from '../config/index';

const getPendingInvitations = async (groupId) => {
  const pendingInvitations = await Invitation.find({ groupId, status: 'Pending' });
  return pendingInvitations;
};

// const updateInvitationStatus = async (invitationId, status) => {
//   await Invitation.findByIdAndUpdate({ _id: invitationId }, { status });
// };

const generateMailOptions = (invitation) => {
  const sender = config.get('mail:sender');
  const subject = 'Esusu Invitation';
  const hostURL = config.get('hostURL');
  const link = `${hostURL}/join/${invitation.invitationToken}`;
  console.log(link);
  return {
    from: sender,
    to: invitation.receiver,
    subject,
    text: link,
  };
};

const sendInvitationMails = async (job, done) => {
  const { groupId } = job.attrs.data;
  const pendingInvitations = await getPendingInvitations(groupId);
  await Promise.all(
    pendingInvitations.map((invitation) => {
      const mailOptions = generateMailOptions(invitation);
      return mailService.sendEmail(mailOptions);
    }),
  );
  done();
};


export default sendInvitationMails;
