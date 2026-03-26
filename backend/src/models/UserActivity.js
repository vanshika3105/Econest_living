import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { 
    type: String, 
    enum: ['view', 'add_cart', 'remove_cart', 'purchase', 'rent', 'rent_start', 'rent_renew', 'order_success', 'custom_scan_start', 'analyzed'], 
    required: true 
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  metadata: { type: mongoose.Schema.Types.Mixed }, // Device info, browser, category viewed
}, { timestamps: true });

export default mongoose.model('UserActivity', userActivitySchema);
