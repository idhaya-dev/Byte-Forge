import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: Generate Access & Refresh JWT tokens and set in cookies
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token expires in 15 mins
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkeyforacademicappraisal360degree',
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  const refreshCookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
      },
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Or Admin only in production)
export const registerUser = async (req, res) => {
  const { name, email, password, role, department, designation } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      designation,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Get user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log user out / clear cookies
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh session tokens
// @route   POST /api/auth/refresh
// @access  Public
export const refreshSession = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || refreshToken === 'none') {
    return res.status(401).json({ message: 'Session refresh token missing' });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkeyforacademicappraisal360degree'
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Session user profile not found' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('JWT Session Refresh Error:', error.message);
    res.status(401).json({ message: 'Session expired, please sign in again' });
  }
};

// @desc    Register a new student
// @route   POST /api/auth/register/student
// @access  Public
export const registerStudent = async (req, res) => {
  const { name, email, password, registerNumber, department, year } = req.body;

  try {
    // 1. Verify required inputs
    if (!name || !email || !password || !registerNumber || !department || !year) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. Validate email duplicate
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 3. Validate registerNumber duplicate
    const regNumExists = await User.findOne({ registerNumber });
    if (regNumExists) {
      return res.status(400).json({ message: 'Register number already registered' });
    }

    // 4. Create User with Student role
    const user = await User.create({
      name,
      email,
      password,
      role: 'Student',
      department,
      year,
      registerNumber,
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        registerNumber: user.registerNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
