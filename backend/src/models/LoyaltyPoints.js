import mongoose from 'mongoose';

const loyaltyPointsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  transactionType: { 
    type: String, 
    enum: ['earned_purchase', 'earned_rental', 'redeemed', 'bonus_eco'], 
    required: true 
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('LoyaltyPoints', loyaltyPointsSchema);
