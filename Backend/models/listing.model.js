import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },
  roomType: {
    type: String,
    enum: ['single', 'shared', 'flat', 'pg'],
    required: true
  },
  amenities: [{
    type: String // wifi, ac, parking, laundry, gym
  }],
  images: [{
    type: String // cloudinary URLs
  }],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  // Geospatial field — this is what powers the map
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preferredTenants: {
    type: String,
    enum: ['students', 'working professionals', 'any'],
    default: 'any'
  }
}, { timestamps: true });

// This index enables $near geospatial queries
listingSchema.index({ location: '2dsphere' });

export const Listing = mongoose.model('Listing', listingSchema);