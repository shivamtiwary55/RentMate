import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false }
});

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  splits: [splitSchema],
  category: {
    type: String,
    enum: ['rent', 'electricity', 'wifi', 'grocery', 'water', 'other'],
    default: 'other'
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);