import mongoose from 'mongoose';

const CustomizationRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  roomImageUrl: {
    type: String,
    required: true,
  },
  userPrompt: {
    type: String,
    default: '',
  },
  aiGeneratedImageUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'Draft', 'Submitted', 'VendorReviewed', 'InProduction', 'proposal_sent', 'ordered'],
    default: 'pending',
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
  },
  customOptions: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('CustomizationRequest', CustomizationRequestSchema);
