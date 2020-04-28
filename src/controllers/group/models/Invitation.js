import mongoose from 'mongoose';


const invitationSchema = new mongoose.Schema({
  receiver: {
    type: String,
    trim: true,
    required: 'Please provide invitee\'s email',
  },
  invitationToken: {
    type: String,
    trim: true,
  },
  invitationTokenExpires: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Expired'], // remember to add more status options
    default: 'Pending',
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model('Invitation', invitationSchema);
