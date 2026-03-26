// Simple representation of cron job logic for Rental reminders
// In a real app install 'node-cron' or use Agenda
import RentalHistory from '../models/RentalHistory.js';
import { User } from '../models/User.js';

export const checkExpiringRentals = async () => {
    try {
        console.log('Checking for expiring rentals...');
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const expiringRentals = await RentalHistory.find({
            status: 'active',
            endDate: {
                $lte: threeDaysFromNow,
                $gt: new Date()
            }
        }).populate('userId');

        for (let rental of expiringRentals) {
            // Trigger email/notification reminder
            console.log(`Reminder: Rental ${rental._id} for user ${rental.userId.email} expires soon on ${rental.endDate}`);
            // e.g. sendEmail(rental.userId.email, 'Your rental is expiring soon', 'Please renew or return your item.');
        }

    } catch (error) {
        console.error('Cron job error:', error);
    }
};

// Run this periodically, e.g., setInterval or cron.schedule
// setInterval(checkExpiringRentals, 1000 * 60 * 60 * 24); // daily
