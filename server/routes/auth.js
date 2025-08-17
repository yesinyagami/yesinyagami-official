/**
 * Authentication Routes
 * User registration, login, and profile management
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory user store (replace with database in production)
const users = new Map();

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = {
    id: `user-${Date.now()}`,
    email,
    name,
    password: hashedPassword,
    tier: 'free',
    createdAt: new Date(),
    readingCount: 0,
    lastReading: null
  };

  users.set(email, user);

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier
    },
    token
  });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  const user = users.get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken(user);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier
    },
    token
  });
}));

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.id === 'anonymous') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = Array.from(users.values()).find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier,
    readingCount: user.readingCount,
    lastReading: user.lastReading,
    createdAt: user.createdAt
  });
}));

// Update user profile
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.id === 'anonymous') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { name } = req.body;
  
  const user = Array.from(users.values()).find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) user.name = name;

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier
    }
  });
}));

// Upgrade membership
router.post('/upgrade', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.id === 'anonymous') {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { tier, paymentToken } = req.body;

  // Validate tier
  if (!['moon-shadow', 'night-god'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier' });
  }

  const user = Array.from(users.values()).find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // In a real implementation, process payment here
  // For now, just upgrade the user
  user.tier = tier;
  user.upgradedAt = new Date();

  res.json({
    message: 'Membership upgraded successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier
    }
  });
}));

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;