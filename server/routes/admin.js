/**
 * Admin Routes
 * Administrative endpoints and dashboard data
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get system statistics
router.get('/stats', asyncHandler(async (req, res) => {
  // Mock statistics (replace with real data from database)
  const stats = {
    users: {
      total: 1250,
      free: 1000,
      moonShadow: 200,
      nightGod: 50,
      newToday: 25
    },
    readings: {
      total: 15650,
      today: 127,
      thisWeek: 890,
      thisMonth: 3456
    },
    revenue: {
      total: 3750,
      thisMonth: 450,
      thisWeek: 125
    },
    ai: {
      monicaRequests: 8950,
      successRate: 98.5,
      averageResponseTime: 1.2
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version
    }
  };

  res.json(stats);
}));

// Get recent activity
router.get('/activity', asyncHandler(async (req, res) => {
  const activities = [
    { type: 'user_registration', message: 'New user registered: StarSeeker', timestamp: new Date() },
    { type: 'payment', message: 'Payment received: $15 Night God upgrade', timestamp: new Date(Date.now() - 3600000) },
    { type: 'reading', message: '127 readings performed today', timestamp: new Date(Date.now() - 7200000) }
  ];

  res.json(activities);
}));

export default router;