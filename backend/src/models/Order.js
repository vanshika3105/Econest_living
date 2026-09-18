import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true },
  isRental: { type: Boolean, default: false },
  rentalDuration: { type: Number, default: 0 } // in months
});

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  updatedBy: { type: String, default: 'system' }, // admin userId or 'system'
  location: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true }, // Firebase UID
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: String, email: String, phone: String,
    address: String, city: String, state: String, pincode: String
  },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Ordered' 
  },
  // Live Tracking fields
  trackingHistory: [trackingEventSchema],
  carrier: { type: String, default: '' },
  trackingNumber: { type: String, default: '' },
  estimatedDelivery: { type: Date },
  adminNotes: { type: String, default: '' },
  cancelledAt: { type: Date },
  cancelReason: { type: String, default: '' },
}, { timestamps: true });

// Auto-add initial tracking event on creation
orderSchema.pre('save', function(next) {
  if (this.isNew && this.trackingHistory.length === 0) {
    this.trackingHistory.push({
      status: 'Ordered',
      timestamp: new Date(),
      note: 'Order placed successfully',
      updatedBy: 'system'
    });
  }
  next();
});

export default mongoose.model('Order', orderSchema);
