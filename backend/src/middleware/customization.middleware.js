import { User } from '../models/User.js';

export const checkCustomizationAccess = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.customizationCount >= 2 && !user.isSubscriber) {
      return res.status(403).json({ 
        error: 'Subscription Required', 
        message: 'You have reached the free limit of 2 customizations. Please subscribe for unlimited access.' 
      });
    }

    // Attach user to req for later use to avoid redundant DB calls
    req.mongoUser = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Access check failed' });
  }
};
