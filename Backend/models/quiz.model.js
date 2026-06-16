import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // one quiz per user
  },
  sleepSchedule: {
    type: String,
    enum: ['early_bird', 'night_owl', 'flexible'],
    required: true
  },
  cleanliness: {
    type: String,
    enum: ['very_clean', 'moderate', 'relaxed'],
    required: true
  },
  noiseLevel: {
    type: String,
    enum: ['quiet', 'moderate', 'loud'],
    required: true
  },
  smoking: {
    type: Boolean,
    default: false
  },
  pets: {
    type: Boolean,
    default: false
  },
  studyHabits: {
    type: String,
    enum: ['home_studier', 'library', 'flexible'],
    required: true
  },
  college: {
    type: String,
    default: ''
  },
  budget: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);