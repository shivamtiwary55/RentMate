import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: {
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
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  // Verified — only tenants with a complaint on this listing can review
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// One review per student per listing
reviewSchema.index({ reviewer: 1, listing: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);