/**
 * Authentication Middleware
 * JWT token validation and user authentication
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return 'night-god-tarot-dev-secret-key-2024';
})();

// Verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // Allow anonymous access for basic features
    req.user = { id: 'anonymous', tier: 'free' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
}

// Require authentication
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
}

// Check membership tier
export function requireTier(minTier) {
  const tierLevels = {
    'free': 0,
    'moon-shadow': 1,
    'night-god': 2
  };

  return (req, res, next) => {
    const userTier = req.user?.tier || 'free';
    const userLevel = tierLevels[userTier];
    const requiredLevel = tierLevels[minTier];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: 'Insufficient membership tier',
        required: minTier,
        current: userTier
      });
    }

    next();
  };
}

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      tier: user.tier || 'free',
      name: user.name,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: '7d',
      issuer: 'night-god-tarot',
      audience: 'night-god-tarot-users'
    }
  );
}

// Blacklist for revoked tokens (in production, use Redis)
const tokenBlacklist = new Set();

// Revoke token
export function revokeToken(token) {
  tokenBlacklist.add(token);
}

// Check if token is blacklisted
export function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

// Enhanced token verification with blacklist check
export function verifyTokenWithBlacklist(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = { id: 'anonymous', tier: 'free' };
    return next();
  }

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    req.token = token;
    next();
  });
}