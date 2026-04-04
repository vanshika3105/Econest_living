import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve('backend/.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const checkUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/econest-living';
    console.log(`Connecting to: ${mongoUri}`);
    await mongoose.connect(mongoUri);
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
