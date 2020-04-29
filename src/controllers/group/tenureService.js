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

const generateDistributionTable = async (tenureInfo) => {
  const { groupId } = tenureInfo;
  const group = await Group.findById(groupId, 'members', { lean: true });
  const groupMembers = group.members;
  const shuffledMembers = shuffleMembers(groupMembers);
  // const distributionTable = [];
  return shuffledMembers;
};

const startTenure = async (tenureInfo) => {
  const tenure = tenureInfo;
  tenure.distributionTable = await generateDistributionTable(tenureInfo);
  const newTenure = await (new Tenure(tenureInfo)).save();
  return newTenure;
};


export default {
  startTenure,
};
