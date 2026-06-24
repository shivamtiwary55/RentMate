import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['plumbing', 'electricity', 'furniture', 'security', 'cleanliness', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'in_progress', 'resolved'],
    default: 'pending'
  },
  landlordResponse: { type: String, default: '' }
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);