import { User } from '../models/user.model.js';
import { Listing } from '../models/listing.model.js';
import { Complaint } from '../models/complaint.model.js';
import { Review } from '../models/review.model.js';
import { Expense } from '../models/expense.model.js';

// Platform analytics
export const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalLandlords,
      totalListings,
      availableListings,
      totalComplaints,
      resolvedComplaints,
      totalReviews
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'landlord' }),
      Listing.countDocuments(),
      Listing.countDocuments({ isAvailable: true }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'resolved' }),
      Review.countDocuments()
    ]);

    // Monthly user signups for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Complaint status breakdown for pie chart
    const complaintStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalLandlords,
      totalListings,
      availableListings,
      totalComplaints,
      resolvedComplaints,
      totalReviews,
      monthlySignups,
      complaintStats
    });
  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Ban / unban a user
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban admin' });

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      message: user.isVerified ? 'User unbanned' : 'User banned',
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('landlord', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete any listing
export const adminDeleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('student', 'name email')
      .populate('landlord', 'name email')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};