import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Ensure user is authenticated
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in HTTP-only cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization header Bearer token
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (exclude password) and attach to request object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// Restrict to specific roles (e.g., 'Admin', 'HOD', 'Faculty')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User role '${req.user?.role || 'Guest'}' is not authorized to access this route` 
      });
    }
    next();
  };
};
