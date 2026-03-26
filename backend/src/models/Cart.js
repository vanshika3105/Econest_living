import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  isRental: { type: Boolean, default: false },
  rentalDuration: { type: Number, default: 0 } // in months
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Firebase UID
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
