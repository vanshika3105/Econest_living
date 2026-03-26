import Order from '../models/Order.js';
import { User } from '../models/User.js';
import RentalHistory from '../models/RentalHistory.js';
import LoyaltyPoints from '../models/LoyaltyPoints.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    const orderId = `ECN-${Date.now().toString().slice(-6)}`;
    
    const newOrder = await Order.create({
      orderId,
      userId, // Firebase UID
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Ordered'
    });

    // CRM Logic: points & rentals
    if (req.user && req.user.email) {
       const user = await User.findOne({ email: req.user.email });
       if (user) {
          let earnedPoints = Math.floor(totalAmount * 0.1); // 10% points
          user.loyaltyPoints += earnedPoints;
          await user.save();

          await LoyaltyPoints.create({
            userId: user._id,
            points: earnedPoints,
            transactionType: 'earned_purchase',
            orderId: newOrder._id,
            description: `Earned from Order ${orderId}`
          });
          
          for (let item of items) {
             if (item.isRental) {
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + (item.rentalDuration || 1));
                
                // Assuming item.productId is Mongo ObjectId string
                await RentalHistory.create({
                   userId: user._id,
                   productId: item.productId,
                   orderId: newOrder._id,
                   startDate,
                   endDate,
                   durationMonths: item.rentalDuration || 1,
                   status: 'active'
                });
             }
          }
       }
    }
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.uid;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};
