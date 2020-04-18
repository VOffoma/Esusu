import createError from 'http-errors';
import Group from './models/Group';

const createGroup = async (groupDetails) => {
  const { group, user } = groupDetails;
  group.admin = user;
  group.members = [user];
  const newGroup = await (new Group(group)).save();
  return newGroup;
};

const getGroups = async () => {
  const groups = await Group.findSearchableGroups();
  return groups;
};


const addUserToGroup = async (joinRequest) => {
  // implement check to see if the group is a private group or not
  try {
    const { groupId, user } = joinRequest;

    const updatedGroup = await Group.findOneAndUpdate({ _id: groupId, 'members.email': { $ne: user.email } }, { $push: { members: user } });

    if (updatedGroup) {
      const { name, description, savingsAmount } = updatedGroup;
      const groupInfo = {
        name,
        description,
        savingsAmount,
        latestMember: { email: user.email, name: user.name },
      };
      return groupInfo;
    }
    return 'Hello, you are already a member of this group.';
  } catch (error) {
    throw createError(400, error);
  }
};

export default { createGroup, getGroups, addUserToGroup };
