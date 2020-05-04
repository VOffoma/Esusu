import mongoose from 'mongoose';


const tenureSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  startedDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['On-going', 'Ended'], // remember to add more status options
    default: 'On-going',
  },
  cadance: {
    type: String,
    trim: true,
    required: 'Please enter a cadance',
  },
  distributionTable: [{}],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model('Tenure', tenureSchema);
