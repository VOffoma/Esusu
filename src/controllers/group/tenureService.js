import createError from 'http-errors';
import moment from 'moment';
import Tenure from './models/Tenure';
import Group from './models/Group';


const shuffleMembers = (members) => {
  const membersArray = members;

  let membersCount = membersArray.length;
  let randomPosition;
  let lastMember;

  while (membersCount) {
    // Pick a random member
    randomPosition = Math.floor(Math.random() * membersCount);
    membersCount -= 1;

    // And swap it with the current last member.
    lastMember = members[membersCount];
    membersArray[membersCount] = membersArray[randomPosition];
    membersArray[randomPosition] = lastMember;
  }
  return membersArray;
};

const checkIfPaymentIsDue = async (startDate, cadance) => {
  const cadanceInfo = cadance.split(' ');
  const [, frequency, duration] = cadanceInfo;

  const currentDate = moment();
  const initialDate = moment(startDate);

  const difference = currentDate.diff(initialDate, duration, true);

  // If modulus division of difference and frequence returns a value,
  // then it means we do not a payment date yet
  // e.g if difference is 1.75 meaning 1 month and some days
  // and frequeny is a month;
  // the modulus division will give us 0.75
  // Which means its not exactly time to pay any one.
  if (difference % frequency === 0) {
    return Math.floor(difference / frequency);
  }
  return false;
};

const generateDistributionTable = async (tenureInfo) => {
  const { groupId } = tenureInfo;
  const group = await Group.findById(groupId, 'members', { lean: true });
  const groupMembers = group.members;
  const shuffledMembers = shuffleMembers(groupMembers);
  // const distributionTable = [];
  return shuffledMembers;
};

const checkForOngoingTenure = async (groupId) => {
  const ongoingTenure = await Tenure.findOne({ groupId, status: 'On-going' });
  return !!ongoingTenure;
};

const startTenure = async (tenureInfo) => {
  const tenure = tenureInfo;
  const ongoingTenure = checkForOngoingTenure(tenure.groupId);
  if (!ongoingTenure) {
    throw createError(400, 'You can not start a savings tenure when the existing tenure is not over');
  }
  tenure.distributionTable = await generateDistributionTable(tenureInfo);
  const newTenure = await (new Tenure(tenureInfo)).save();
  return newTenure;
};

const addNewMemberToOngoingTenure = async (groupId, newMember) => {
  const ongoingTenure = checkForOngoingTenure(groupId);
  if (ongoingTenure) {
    await Tenure.findOneAndUpdate({ groupId }, { $push: { distributionTable: newMember } });
  }
};

export default {
  startTenure, checkIfPaymentIsDue, addNewMemberToOngoingTenure,
};
