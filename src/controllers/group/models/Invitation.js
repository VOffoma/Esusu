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
    required: 'Please provide invitation token',
  },
  invitationTokenExpires: {
    type: Date,
    required: 'Please provide token expiry date',
  },
  status: {
    type: String,
    enum: ['Pending', 'Sent'], // remember to add more status options
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
