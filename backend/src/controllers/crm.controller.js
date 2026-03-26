import UserActivity from '../models/UserActivity.js';
import { User } from '../models/User.js';

export const trackActivity = async (req, res) => {
  try {
    const { actionType, productId, metadata } = req.body;
    let userId = null;

    // Support tracking even when user is not fully authenticated via middleware context yet if needed, but assuming user from token here
    if (req.user && req.user.firebaseUid) {
        // We need the mongo _id for user, so let's fetch it
        const user = await User.findOne({ email: req.user.email }) || req.user.mongoId;
        if (user) userId = user._id;
    }

    if (!userId && req.body.userId) {
       userId = req.body.userId;
    }

    if (userId) {
      await UserActivity.create({
        userId,
        actionType,
        productId,
        metadata,
      });
    }

    res.status(200).json({ message: 'Activity tracked' });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      ecoScore: user.ecoScore,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyTier: user.loyaltyTier,
      totalCarbonSaved: user.totalCarbonSaved,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Funnel Stage 2: Engagement (Users who have ANY activity)
    const engagedUserIds = await UserActivity.distinct('userId');
    const engagementCount = engagedUserIds.length;

    // Funnel Stage 3: Conversion (Users who have ANY order)
    const convertedUserIds = await UserActivity.distinct('userId', { actionType: { $in: ['purchase', 'rent', 'order_success'] } });
    const conversionCount = convertedUserIds.length;

    // Funnel Stage 4: Retention (Users with >1 purchase or a renewal)
    const retentionUsers = await UserActivity.aggregate([
      { $match: { actionType: { $in: ['purchase', 'rent', 'order_success', 'rent_renewal'] } } },
      { $group: { 
          _id: '$userId', 
          count: { $sum: 1 }, 
          hasRenewal: { $max: { $cond: [{ $eq: ['$actionType', 'rent_renewal'] }, 1, 0] } } 
        } 
      },
      { $match: { $or: [{ count: { $gt: 1 } }, { hasRenewal: 1 }] } }
    ]);
    const retentionCount = retentionUsers.length;

    // Funnel Stage 5: Loyalty (Tiered users)
    const loyaltyCount = await User.countDocuments({ loyaltyTier: { $ne: 'Basic' } });

    const actions = await UserActivity.aggregate([
      { $group: { _id: '$actionType', count: { $sum: 1 } } }
    ]);

    const stats = {
      totalUsers,
      funnel: {
        acquisition: totalUsers,
        engagement: engagementCount,
        conversion: conversionCount,
        retention: retentionCount,
        loyalty: loyaltyCount
      },
      leaderboard: await User.find({ 
        $or: [
          { loyaltyTier: { $ne: 'Basic' } },
          { loyaltyPoints: { $gt: 500 } }
        ] 
      }).limit(10).sort({ loyaltyPoints: -1 }).then(users => 
        users.map(u => ({ name: u.name, points: u.loyaltyPoints, tier: u.loyaltyTier, email: u.email }))
      ),
      actions: actions.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('CRM Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};
