import { Review } from '../models/Review.js';
import { User } from '../models/User.js';

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const review = await Review.create({
      userId: user._id,
      userName: user.name,
      productId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Failed to create review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all reviews' });
  }
};
