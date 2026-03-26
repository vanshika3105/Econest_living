import RentalHistory from '../models/RentalHistory.js';
import { User } from '../models/User.js';
import Product from '../models/Product.js';
import UserActivity from '../models/UserActivity.js';

export const getUserRentals = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const rentals = await RentalHistory.find({ userId: user._id }).populate('productId');
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
};

export const renewRental = async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalMonths } = req.body;

    const rental = await RentalHistory.findById(id);
    if (!rental) return res.status(404).json({ error: 'Rental not found' });

    rental.durationMonths += additionalMonths;
    const newEndDate = new Date(rental.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + additionalMonths);
    rental.endDate = newEndDate;
    rental.renewalCount += 1;
    rental.status = 'renewed';

    await rental.save();
    
    // In real app, we would charge the user here

    res.status(200).json({ message: 'Rental renewed successfully', rental });
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew rental' });
  }
};

export const endRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await RentalHistory.findById(id);
    
    if (!rental) return res.status(404).json({ error: 'Rental not found' });

    rental.status = 'completed';
    await rental.save();

    res.status(200).json({ message: 'Rental ended', rental });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end rental' });
  }
};

export const createRental = async (req, res) => {
  try {
    const { productId, durationMonths, startDate } = req.body;
    
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + (durationMonths || 1));

    const rental = await RentalHistory.create({
      userId: user._id,
      productId,
      startDate: start,
      endDate: end,
      durationMonths: durationMonths || 1,
      status: 'active',
      monthlyRate: product.rentPricePerMonth || Math.round(product.price * 0.1),
      renewalCount: 0
    });

    // Track CRM activity
    await UserActivity.create({
      userId: user._id,
      actionType: 'rent',
      productId,
      metadata: { durationMonths: durationMonths || 1 }
    }).catch(err => console.error('CRM tracking error:', err));

    res.status(201).json(rental);
  } catch (error) {
    console.error('Create rental error:', error);
    res.status(500).json({ error: 'Failed to create rental' });
  }
};
