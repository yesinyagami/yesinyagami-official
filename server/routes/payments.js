/**
 * Payment Routes
 * Handle payment processing and webhook endpoints
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticateToken, asyncHandler(async (req, res) => {
  const { tier, amount, currency = 'USD' } = req.body;

  // Validate tier and amount
  const tierPrices = {
    'moon-shadow': 5,
    'night-god': 15
  };

  if (!tierPrices[tier] || tierPrices[tier] !== amount) {
    return res.status(400).json({ error: 'Invalid tier or amount' });
  }

  // Create payment intent (mock for now)
  const paymentIntent = {
    id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency,
    tier,
    userId: req.user.id,
    status: 'requires_payment_method',
    created: new Date().toISOString()
  };

  res.json(paymentIntent);
}));

// Buy Me a Coffee webhook
router.post('/webhooks/buymeacoffee', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const payload = req.body;
  
  console.log('Buy Me a Coffee webhook received:', payload);
  
  // Process payment and upgrade user to Moon Shadow tier
  // In a real implementation, verify the webhook signature
  
  res.status(200).send('OK');
}));

// iPass Money webhook
router.post('/webhooks/ipass', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const payload = req.body;
  
  console.log('iPass Money webhook received:', payload);
  
  // Process payment and upgrade user to Night God tier
  // In a real implementation, verify the webhook signature
  
  res.status(200).send('OK');
}));

export default router;