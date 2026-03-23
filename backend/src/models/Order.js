import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true }
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
  status: { type: String, enum: ['Ordered', 'Packed', 'Shipped', 'Delivered'], default: 'Ordered' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
