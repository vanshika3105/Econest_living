import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  isRentable: {
    type: Boolean,
    default: false,
  },
  rentPricePerMonth: {
    type: Number,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Beds', 'Desks', 'Storage', 'Sofas', 'Tables', 'Wardrobes', 'Chairs', 'Other'],
  },
  desc: {
    type: String,
    default: '',
    trim: true,
  },
  image: {
    type: String,
    default: '',
    trim: true,
  },
  material: {
    type: String,
    default: '',
    trim: true,
  },
  ecoScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 75,
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  tag: {
    type: String,
    default: '',
    trim: true,
  },
  certifications: {
    type: [String],
    default: [],
  },
  carbonFootprint: {
    type: String,
    default: 'Low',
  },
  dimensions: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  // Vendor (supplier) info
  vendorId: {
    type: String,
    required: [true, 'Vendor ID is required'],
  },
  vendorName: {
    type: String,
    default: '',
  },
  // Listing status
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected'],
    default: 'active',
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
