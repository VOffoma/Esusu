import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a group name',
  },
  description: {
    type: String,
    trim: true,
  },
  maxCapacity: {
    type: Number,
    required: 'Please enter the maximum number of group members',
  },
  isSearchable: {
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
});

export default mongoose.model('Group', groupSchema);
