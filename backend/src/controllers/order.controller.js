import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    const orderId = `ECN-${Date.now().toString().slice(-6)}`;
    
    const newOrder = await Order.create({
      orderId,
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Ordered'
    });
    
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
