import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { items } = req.body;
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items });
    } else {
      cart.items = items;
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};
