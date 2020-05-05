import createError from 'http-errors';
import Group from '../controllers/group/models/Group';

const checkIfCurrentUserIsGroupAdmin = async (groupId, currentUser) => {
  const group = await Group.findById(groupId, 'admin', { lean: true });
  console.log(group);
  const groupAdmin = group.admin;
  if (groupAdmin.email !== currentUser.email) {
    const message = 'You need to be the admin of this group to perform this action';
    throw createError(400, message);
  }
  return true;
};

export default {
  checkIfCurrentUserIsGroupAdmin,
};
