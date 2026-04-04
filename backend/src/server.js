import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'mongo-sanitize';
import { connectDB } from './config/db.js';
import './config/firebase-admin.js';

import authRoutes from './routes/auth.routes.js';
import firebaseAuthRoutes from './routes/firebase-auth.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import crmRoutes from './routes/crm.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import reviewRoutes from './routes/review.routes.js';
import securityRoutes from './routes/security.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate Limiting setup: Apply globally
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, 
  message: { error: 'Too many authentication attempts, please try again later' }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "base-uri": ["'self'"],
            "font-src": ["'self'", "https:", "data:"],
            "frame-ancestors": ["'self'"],
            "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://picsum.photos"],
            "object-src": ["'none'"],
            "script-src": ["'self'"],
            "script-src-attr": ["'none'"],
            "style-src": ["'self'", "https:", "'unsafe-inline'"],
            "upgrade-insecure-requests": []
        }
    }
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS via large JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// NoSQL Injection protection
app.use((req, res, next) => {
    req.body = mongoSanitize(req.body);
    req.query = mongoSanitize(req.query);
    req.params = mongoSanitize(req.params);
    next();
});

// HTTP Parameter Pollution protection
app.use(hpp());

// Global Rate Limiter
app.use('/api/', limiter);


// Apply auth-specific limiter
app.use('/api/auth/', authLimiter);
app.use('/api/firebase/auth/', authLimiter);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/firebase/auth', firebaseAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/security', securityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
