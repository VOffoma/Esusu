// import createError from 'http-errors';
import Group from './models/Group';

const createGroup = async (groupDetails) => {
  const group = await (new Group(groupDetails)).save();
  return group;
};

const getGroups = async () => {
  const groups = await Group.findSearchableGroups();
  return groups;
};

export default { createGroup, getGroups };
