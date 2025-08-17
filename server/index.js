#!/usr/bin/env node

/**
 * Night God Tarot API Server
 * Express server for backend API endpoints and services
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import cardsRoutes from './routes/cards.js';
import readingsRoutes from './routes/readings.js';
import paymentsRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';
import { logRequest } from './middleware/logging.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://openapi.monica.im"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logRequest);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Monica AI specific rate limiter
const monicaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Monica allows 60 requests per minute
  message: 'Monica API rate limit exceeded. Please wait a moment.',
});

app.use('/api/ai', monicaLimiter);

// Static files
app.use('/uploads', express.static(join(__dirname, '../uploads')));
app.use('/assets', express.static(join(__dirname, '../public/assets')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Monica AI proxy endpoint
app.post('/api/ai/chat', authenticateToken, async (req, res, next) => {
  try {
    const { messages, model = 'claude-3-5-sonnet-20241022' } = req.body;
    
    const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`Monica API Error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Tarot reading endpoint
app.post('/api/readings/perform', async (req, res, next) => {
  try {
    const { cards, question, userId, preferences } = req.body;
    
    // Validate input
    if (!cards || cards.length === 0) {
      return res.status(400).json({ error: 'No cards selected' });
    }

    // Create reading record
    const reading = {
      id: `reading-${Date.now()}`,
      userId: userId || 'anonymous',
      cards,
      question,
      preferences,
      timestamp: new Date(),
    };

    // Generate AI reading
    const prompt = `
      Perform a mystical tarot reading:
      Cards: ${cards.map(c => c.name).join(', ')}
      Question: ${question || 'General guidance'}
      
      Provide deep insights in these areas:
      1. Collective Wisdom
      2. Personal Analysis
      3. Integration
      4. Poetic Expression
    `;

    // Call Monica AI
    const aiResponse = await fetch('https://openapi.monica.im/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MONICA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'system',
            content: 'You are a mystical tarot reader providing deep, insightful guidance.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      // Fallback to mock response
      return res.json({
        ...reading,
        interpretation: 'The cards reveal a journey of transformation and growth. Trust in the divine timing of your path.',
        collectiveWisdom: 'The universe speaks of new beginnings and infinite possibilities.',
        personalAnalysis: 'Your inner strength guides you toward your highest potential.',
        wisdomIntegration: 'By embracing both light and shadow, you find balance.',
        poeticSublimation: 'Like stars dancing in the cosmic void, your soul journey unfolds with grace.',
      });
    }

    const aiData = await aiResponse.json();
    const interpretation = aiData.choices[0].message.content;

    res.json({
      ...reading,
      interpretation,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

// Payment webhook endpoints
app.post('/api/webhooks/buymeacoffee', express.raw({ type: 'application/json' }), (req, res) => {
  // Handle Buy Me a Coffee webhook
  console.log('Buy Me a Coffee webhook received');
  res.status(200).send('OK');
});

app.post('/api/webhooks/ipass', express.raw({ type: 'application/json' }), (req, res) => {
  // Handle iPass Money webhook
  console.log('iPass Money webhook received');
  res.status(200).send('OK');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║     🌙 Night God Tarot API Server 🌙        ║
╠══════════════════════════════════════════════╣
║  Server running on port ${PORT}                 ║
║  Environment: ${process.env.NODE_ENV || 'development'}                  ║
║  Monica AI: ${process.env.MONICA_API_KEY ? 'Connected' : 'Not configured'}                    ║
║  URL: http://localhost:${PORT}                  ║
╚══════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;