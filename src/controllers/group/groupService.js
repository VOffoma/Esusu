import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import Group from './models/Group';
import Invitation from './models/Invitation';

const createGroup = async (groupDetails) => {
  const { group, user } = groupDetails;
  group.admin = user;
  group.members = [user];
  const newGroup = await (new Group(group)).save();
  return newGroup;
};

const getGroups = async () => {
  const groups = await Group.findPublicGroups();
  return groups;
};


const addUserToGroup = async (joinRequest) => {
  try {
    const { groupId, user } = joinRequest;

    const updatedGroup = await Group.findOneAndUpdate({ _id: groupId, public: true, 'members.email': { $ne: user.email } }, { $push: { members: user } });

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

const searchGroups = async (searchString) => {
  const searchResult = await Group.find({
    public: true,
    $text: { $search: searchString },
  }, {
    score: { $meta: 'textScore' },
  })
    .select({
      _id: 0, name: 1, description: 1, savingsAmount: 1,
    })
    .sort({
      score: { $meta: 'textScore' },
    })
    .limit(5);

  return (searchResult.length ? searchResult : 'Sorry, we could not find what you were looking for');
};

const createInvitations = async (invitees, groupId) => {
  try {
    const invites = invitees.map((invitee) => ({
      receiver: invitee,
      invitationToken: uuidv4(),
      invitationTokenExpires: Date.now() + (7 * 24 * 60 * 60 * 1000),
      groupId,
    }));

    await Invitation.insertMany(invites);
    return 'Invitations have been created successfully and will be sent out in a bit.';
  } catch (error) {
    throw createError(400, error);
  }
};

export default {
  createGroup, getGroups, addUserToGroup, searchGroups, createInvitations,
};
