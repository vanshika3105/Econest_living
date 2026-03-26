import mongoose from 'mongoose';

const rentalHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationMonths: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'renewed', 'completed'], 
    default: 'active' 
  },
  renewalCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('RentalHistory', rentalHistorySchema);
