import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const listUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/econest-living';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email role createdAt');
    console.log('Total Users:', users.length);
    console.log(JSON.stringify(users, null, 2));

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

listUsers();
