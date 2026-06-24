import { Review } from '../models/review.model.js';
import { Complaint } from '../models/complaint.model.js';

// Submit a review — verified check
export const createReview = async (req, res) => {
  try {
    const { landlordId, listingId, rating, comment } = req.body;

    // Verified check — has this student ever raised a complaint on this listing?
    const hasComplaint = await Complaint.findOne({
      student: req.user.userId,
      listing: listingId
    });

    const review = await Review.create({
      reviewer: req.user.userId,
      landlord: landlordId,
      listing: listingId,
      rating: Number(rating),
      comment,
      isVerified: !!hasComplaint // true if they have a complaint history
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this listing' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reviews for a landlord
export const getLandlordReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ landlord: req.params.landlordId })
      .populate('reviewer', 'name')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ reviews, avgRating, total: reviews.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};