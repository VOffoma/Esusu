import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a group name',
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  maxCapacity: {
    type: Number,
    required: 'Please enter the maximum number of group members',
  },
  isSearchable: { // change this to public or private
    type: Boolean,
    default: true,
  },
  savingsAmount: {
    type: Number,
    required: 'Please enter the period amount to be saved by each member',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Object,
    required: 'Please enter admin id',
  },
  members: [{}],
});

groupSchema.statics.findSearchableGroups = async function () {
  const searchableGroups = await this.find({ isSearchable: true });
  return searchableGroups;
};
export default mongoose.model('Group', groupSchema);
