import CustomizationRequest from '../models/CustomizationRequest.js';
import UserActivity from '../models/UserActivity.js';
import { User } from '../models/User.js';

export const createCustomizationRequest = async (req, res) => {
  try {
    const { productId, roomImageUrl, dimensions } = req.body;
    
    // Find mongo user _id from firebase email/auth
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const request = await CustomizationRequest.create({
      userId: user._id,
      productId,
      roomImageUrl,
      dimensions,
      status: 'pending'
    });

    // Track CRM activity
    await UserActivity.create({
      userId: user._id,
      actionType: 'custom_scan_start',
      productId,
      metadata: { dimensions }
    }).catch(err => console.error('CRM tracking error:', err));

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating customization request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

export const getMyCustomizations = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const requests = await CustomizationRequest.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customizations' });
  }
};

export const analyzeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await CustomizationRequest.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Mock AI Analysis Logic: 
    const { length, width, height } = request.dimensions;
    let recommendation = "Standard Eco-Fit";
    let adjustments = "Optimized for material efficiency.";
    let vibe = "Minimalist Modern";

    // Logic based on dimensions
    if (length < 200 || width < 200) {
      recommendation = "Compact Zen Custom";
      adjustments = "Frame slimmed by 12% to preserve circulation space in smaller rooms.";
    } else if (length > 400 || width > 400) {
      recommendation = "Grand Sustainable Suite";
      adjustments = "Reinforced joints and expanded surface for large-scale occupancy.";
    }

    // Add height-based logic
    if (height > 300) {
      adjustments += " Vertical storage modules suggested for high ceilings.";
    }

    // Simulated "Vision" analysis from roomImageUrl
    if (request.roomImageUrl.includes("unsplash")) {
      vibe = "Nature-Inspired Airy";
      adjustments += ` Detected soft natural lighting; recommending Light Bamboo finish to match the ${vibe} vibe.`;
    }

    request.status = 'analyzed';
    const customOptions = { 
      proposal: recommendation, 
      technicalNotes: adjustments,
      vibeMatch: vibe
    };
    request.customOptions = customOptions;
    await request.save();

    // Track CRM activity
    await UserActivity.create({
      userId: request.userId,
      actionType: 'analyzed',
      productId: request.productId,
      metadata: { vibeMatch: customOptions.vibeMatch }
    }).catch(err => console.error('CRM tracking error:', err));

    res.status(200).json({ 
      message: 'Analysis complete', 
      customOptions 
    });
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
};
export const customizeProduct = async (req, res) => {
  try {
    const { productId, baseImage, userPrompt, specifications } = req.body;
    const user = req.mongoUser; // Set by middleware

    // Simulate AI Image Generation
    // In real app, call DALL-E or Stable Diffusion here
    const aiGeneratedImageUrl = baseImage ? `${baseImage}&sepia=1&blur=2` : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600";
    
    const request = await CustomizationRequest.create({
      userId: user._id,
      productId,
      roomImageUrl: baseImage || "placeholder",
      userPrompt,
      aiGeneratedImageUrl,
      specifications,
      status: 'Draft'
    });

    // Update user count
    user.customizationCount += 1;
    await user.save();

    // Track CRM activity
    await UserActivity.create({
      userId: user._id,
      actionType: 'analyzed',
      productId: productId.toString(),
      metadata: { prompt: userPrompt, type: 'ai_image_gen' }
    }).catch(err => console.error('CRM tracking error:', err));

    res.status(201).json(request);
  } catch (error) {
    console.error('AI Customization Error:', error);
    res.status(500).json({ error: 'AI Customization failed' });
  }
};

export const getAdminCustomizations = async (req, res) => {
  try {
    const requests = await CustomizationRequest.find()
      .populate('userId', 'name email isSubscriber customizationCount')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all customizations' });
  }
};
