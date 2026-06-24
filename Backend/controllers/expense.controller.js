import { Expense } from '../models/expense.model.js';

// Create expense & auto split equally
export const createExpense = async (req, res) => {
  try {
    const { title, totalAmount, listing, memberIds, category } = req.body;

    // memberIds = array of all flatmate userIds including yourself
    const allMembers = [...new Set([...memberIds, req.user.userId])];
    const perPerson = parseFloat((totalAmount / allMembers.length).toFixed(2));

    const splits = allMembers.map(userId => ({
      user: userId,
      amount: perPerson,
      // Person who paid is already settled
      paid: userId === req.user.userId
    }));

    const expense = await Expense.create({
      title,
      totalAmount: Number(totalAmount),
      paidBy: req.user.userId,
      listing,
      splits,
      category: category || 'other'
    });

    const populated = await expense.populate([
      { path: 'paidBy', select: 'name email' },
      { path: 'splits.user', select: 'name email' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create expense error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all expenses for a listing
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ listing: req.params.listingId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark your split as paid
export const markAsPaid = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const split = expense.splits.find(
      s => s.user.toString() === req.user.userId
    );

    if (!split) return res.status(404).json({ message: 'You are not part of this expense' });

    split.paid = true;
    await expense.save();

    res.status(200).json({ message: 'Marked as paid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get balance summary — who owes what
export const getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find({ listing: req.params.listingId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email');

    // Build balance map
    const balances = {};

    expenses.forEach(exp => {
      exp.splits.forEach(split => {
        if (!split.paid && split.user._id.toString() !== exp.paidBy._id.toString()) {
          const key = split.user._id.toString();
          if (!balances[key]) {
            balances[key] = {
              user: split.user,
              owes: 0,
              to: exp.paidBy.name
            };
          }
          balances[key].owes += split.amount;
        }
      });
    });

    res.status(200).json(Object.values(balances));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};