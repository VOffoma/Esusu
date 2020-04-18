import createError from 'http-errors';
import Group from './models/Group';

const createGroup = async (groupDetails) => {
  const group = await (new Group(groupDetails)).save();
  return group;
};

const getGroups = async () => {
  const groups = await Group.findSearchableGroups();
  return groups;
};


const joinGroup = async (joinRequest) => {
  // implement check to see if the group is a private group or not
  try {
    const { groupId, user } = joinRequest;
    const newMember = await Group.findOneAndUpdate({ _id: groupId, 'members.email': { $ne: user.email } }, { $push: { members: user } });
    return newMember;
  } catch (error) {
    throw createError(400, error);
  }
};

export default { createGroup, getGroups, joinGroup };
