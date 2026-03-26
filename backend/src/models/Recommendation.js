import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    reason: { type: String }, // e.g., 'Based on your browsing', 'Similar to what you rented'
    score: { type: Number }
  }],
}, { timestamps: true });

export default mongoose.model('Recommendation', recommendationSchema);
