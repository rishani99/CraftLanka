const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const token = req.cookies?.craftlanka_token;

    if (!token) {
      return res.status(401).json({
        message: 'Please log in to continue.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      'name email role'
    );

    if (!user) {
      res.clearCookie('craftlanka_token', cookieOptions());

      return res.status(401).json({
        message: 'Account not found. Please log in again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('craftlanka_token', cookieOptions());

    return res.status(401).json({
      message: 'Your session is invalid or expired. Please log in again.',
    });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You are not allowed to access this resource.',
      });
    }

    next();
  };
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  };
}

module.exports = {
  protect,
  authorize,
  cookieOptions,
};