require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// 1. Create the Express app BEFORE using app.use()
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Validate environment variables
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === 'REPLACE_WITH_A_LONG_RANDOM_SECRET' ||
  process.env.JWT_SECRET.length < 32
) {
  throw new Error('Please configure a strong JWT_SECRET in the backend .env file.');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is missing from the .env file.');
}

// 3. Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Test routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CraftLanka API',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CraftLanka API is running.',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

// 5. API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 6. Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// 7. Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected server error occurred.',
  });
});

// 8. Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`CraftLanka API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });