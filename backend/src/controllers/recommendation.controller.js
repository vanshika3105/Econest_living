import Recommendation from '../models/Recommendation.js';
import UserActivity from '../models/UserActivity.js';
import Product from '../models/Product.js';
import { User } from '../models/User.js';

export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    let recommendations = [];

    if (user) {
      // 1. Check if we have cached recommendations
      const cached = await Recommendation.findOne({ userId: user._id });
      if (cached && cached.recommendedProducts.length > 0) {
          // Populate product details
          await cached.populate('recommendedProducts.productId');
          return res.status(200).json(cached.recommendedProducts.map(rp => ({...rp.productId.toObject(), reason: rp.reason})));
      }

      // 2. Simple logic: Get categories user viewed recently
      const recentViews = await UserActivity.find({ userId: user._id, actionType: 'view', productId: { $exists: true } })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('productId');

      const categories = [...new Set(recentViews.filter(v => v.productId).map(v => v.productId.category))];

      if (categories.length > 0) {
        recommendations = await Product.find({ category: { $in: categories } }).limit(5);
      }
    }

    // Fallback or empty logic
    if (recommendations.length === 0) {
      recommendations = await Product.find({ rating: { $gte: 4 } }).limit(5);
    }

    res.status(200).json(recommendations.map(p => ({...p.toObject(), reason: 'Recommended based on trends'})));
  } catch (error) {
    console.error('Error in recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};
