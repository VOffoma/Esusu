import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/index';
import Group from './models/Group';
import Invitation from './models/Invitation';
import { getUsers } from '../../services/aws';

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


const checkInvitationValidity = async (token) => {
  const invitation = await Invitation.findOne({
    invitationToken: token,
    invitationTokenExpires: { $gt: Date.now() },
  });
  if (!invitation) {
    throw createError(401, 'This invitation either does not exist or has expired');
  }
  return invitation;
};


const checkIfReceiverIsRegistered = async (email) => {
  const data = await getUsers(email);
  if (data.Users.length === 0) {
    return null;
  }

  const registeredUser = {
    email: data.Users[0].Attributes[0].Value,
    'cognito:username': data.Users[0].Username,
  };
  return registeredUser;
};


const addUserToGroup = async (joinRequest) => {
  try {
    const { groupId, newGroupUser } = joinRequest;

    const updatedGroup = await Group.findOneAndUpdate({ _id: groupId, public: true, 'members.email': { $ne: newGroupUser.email } }, { $push: { members: newGroupUser } });

    if (updatedGroup) {
      const { name, description, savingsAmount } = updatedGroup;
      const groupInfo = {
        name,
        description,
        savingsAmount,
        latestMember: { email: newGroupUser.email, name: newGroupUser.name },
      };
      return groupInfo;
    }
    return 'Hello, you are already a member of this group.';
  } catch (error) {
    throw createError(400, error);
  }
};


const expireInvitation = async (invitation) => {
  const invitationToExpire = invitation;
  invitationToExpire.invitationToken = undefined;
  invitationToExpire.invitationTokenExpires = undefined;
  invitationToExpire.status = 'Accepted';
  await invitationToExpire.save();
};


const addUserToPrivateGroup = async (invitation) => {
  const registeredUser = await checkIfReceiverIsRegistered(invitation.receiver);
  if (registeredUser == null) {
    const hostURL = config.get('hostURL');
    const link = `${hostURL}/group/signup/${invitation.invitationToken}`;
    return `You are not yet a registered user on this platform. Do use the following link to register: ${link}`
  }
  const { groupId } = invitation;
  const groupInfo = await addUserToGroup({ groupId, newGroupUser: registeredUser });
  await expireInvitation(invitation);
  return groupInfo;
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

const removePriorMembers = async (invitees, groupId) => {
  const queryResult = await Group.findOne({ _id: groupId },
    { members: { $elemMatch: { email: { $in: invitees } } } })
    .select({ _id: 0, members: 1 });

  const priorMembers = queryResult.members;

  if (priorMembers.length !== 0) {
    const prospectiveMembers = invitees.filter((invitee) => {
      const found = priorMembers.find((member) => member.email === invitee);
      if (!found) return invitee;
    });

    return prospectiveMembers;
  }

  return invitees;
};

const createInvitations = async (invitees, groupId) => {
  try {
    const prospectiveMembers = await removePriorMembers(invitees, groupId);
    const invites = prospectiveMembers.map((email) => ({
      receiver: email,
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
  createGroup,
  getGroups,
  addUserToGroup,
  searchGroups,
  createInvitations,
  addUserToPrivateGroup,
  checkInvitationValidity,
};
