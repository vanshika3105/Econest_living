import mongoose from 'mongoose';
import { User } from './backend/src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('backend/.env') });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/econest-living');
    console.log('Connected to MongoDB');

    const email = '2023.tisha.premchandani@ves.ac.in';
    const user = await User.findOne({ email });

    if (user) {
      console.log('User found in MongoDB:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('User NOT found in MongoDB');
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkUser();
