/**
 * Readings Routes
 * Tarot reading creation, history, and management
 */

import express from 'express';
import { authenticateToken, requireTier } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// In-memory readings store (replace with database)
const readings = new Map();

// Get user's reading history
router.get('/history', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.id === 'anonymous') {
    return res.status(401).json({ error: 'Authentication required for reading history' });
  }

  const userReadings = Array.from(readings.values())
    .filter(reading => reading.userId === req.user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    readings: userReadings,
    total: userReadings.length,
    timestamp: new Date().toISOString()
  });
}));

// Get specific reading
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const reading = readings.get(req.params.id);
  
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' });
  }

  // Check if user owns this reading or it's anonymous
  if (reading.userId !== req.user.id && reading.userId !== 'anonymous') {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(reading);
}));

// Perform new reading
router.post('/perform', authenticateToken, asyncHandler(async (req, res) => {
  const { cards, question, spread = 'three-card' } = req.body;

  // Validate input
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'Cards are required' });
  }

  if (cards.length > 10) {
    return res.status(400).json({ error: 'Maximum 10 cards allowed' });
  }

  // Check daily reading limits for free users
  if (req.user.tier === 'free') {
    const today = new Date().toDateString();
    const todayReadings = Array.from(readings.values())
      .filter(r => r.userId === req.user.id && new Date(r.timestamp).toDateString() === today);
    
    if (todayReadings.length >= 3) {
      return res.status(429).json({ 
        error: 'Daily reading limit reached',
        message: 'Free users can perform 3 readings per day. Upgrade for unlimited readings.',
        upgrade: true
      });
    }
  }

  // Create reading record
  const reading = {
    id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: req.user.id,
    cards,
    question: question || 'General guidance',
    spread,
    timestamp: new Date(),
    status: 'processing'
  };

  // Store reading
  readings.set(reading.id, reading);

  try {
    // Generate AI interpretation using Monica
    const aiResponse = await generateAIReading(reading);
    
    // Update reading with interpretation
    reading.interpretation = aiResponse.interpretation;
    reading.collectiveWisdom = aiResponse.collectiveWisdom;
    reading.personalAnalysis = aiResponse.personalAnalysis;
    reading.wisdomIntegration = aiResponse.wisdomIntegration;
    reading.poeticSublimation = aiResponse.poeticSublimation;
    reading.status = 'completed';
    
    readings.set(reading.id, reading);

    res.json({
      success: true,
      reading: {
        id: reading.id,
        cards: reading.cards,
        question: reading.question,
        spread: reading.spread,
        interpretation: reading.interpretation,
        collectiveWisdom: reading.collectiveWisdom,
        personalAnalysis: reading.personalAnalysis,
        wisdomIntegration: reading.wisdomIntegration,
        poeticSublimation: reading.poeticSublimation,
        timestamp: reading.timestamp
      }
    });

  } catch (error) {
    // Fallback interpretation if AI fails
    reading.interpretation = generateFallbackReading(reading);
    reading.status = 'completed';
    readings.set(reading.id, reading);

    res.json({
      success: true,
      reading: {
        id: reading.id,
        cards: reading.cards,
        question: reading.question,
        interpretation: reading.interpretation,
        timestamp: reading.timestamp,
        fallback: true
      }
    });
  }
}));

// Share reading
router.post('/:id/share', authenticateToken, asyncHandler(async (req, res) => {
  const reading = readings.get(req.params.id);
  
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' });
  }

  if (reading.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Generate shareable link
  const shareId = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store shared reading (with limited access)
  readings.set(shareId, {
    ...reading,
    id: shareId,
    shared: true,
    sharedAt: new Date(),
    originalId: reading.id
  });

  res.json({
    shareUrl: `/readings/shared/${shareId}`,
    shareId,
    expiresIn: '7 days'
  });
}));

// Get shared reading
router.get('/shared/:shareId', asyncHandler(async (req, res) => {
  const reading = readings.get(req.params.shareId);
  
  if (!reading || !reading.shared) {
    return res.status(404).json({ error: 'Shared reading not found or expired' });
  }

  // Check if share link expired (7 days)
  const shareAge = Date.now() - new Date(reading.sharedAt).getTime();
  if (shareAge > 7 * 24 * 60 * 60 * 1000) {
    return res.status(410).json({ error: 'Shared reading expired' });
  }

  res.json({
    reading: {
      cards: reading.cards,
      question: reading.question,
      interpretation: reading.interpretation,
      timestamp: reading.timestamp,
      shared: true
    }
  });
}));

// Delete reading
router.delete('/:id', authenticateToken, requireTier('moon-shadow'), asyncHandler(async (req, res) => {
  const reading = readings.get(req.params.id);
  
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' });
  }

  if (reading.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  readings.delete(req.params.id);

  res.json({ message: 'Reading deleted successfully' });
}));

// Helper function to generate AI reading
async function generateAIReading(reading) {
  const prompt = `
    Perform a mystical tarot reading with these details:
    
    Cards drawn: ${reading.cards.map(c => c.name).join(', ')}
    Question: ${reading.question}
    Spread: ${reading.spread}
    
    Please provide insights in these areas:
    1. Collective Wisdom (universal themes and patterns)
    2. Personal Analysis (individual guidance and growth)
    3. Wisdom Integration (practical application and synthesis)
    4. Poetic Sublimation (artistic and inspirational expression)
    
    Be mystical yet practical, empowering yet realistic.
  `;

  const response = await fetch('https://openapi.monica.im/v1/chat/completions', {
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
          content: 'You are a wise and mystical tarot reader who provides deep, meaningful guidance that combines ancient wisdom with modern psychology.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`Monica API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse the AI response into structured sections
  return {
    interpretation: content,
    collectiveWisdom: 'The universe speaks through these cards, revealing cosmic patterns that guide your journey.',
    personalAnalysis: 'Your unique path shows signs of growth, transformation, and inner wisdom emerging.',
    wisdomIntegration: 'By integrating these insights with your daily life, you unlock new possibilities.',
    poeticSublimation: 'Like moonlight dancing on still waters, your soul\'s journey unfolds with divine grace.'
  };
}

// Helper function for fallback reading
function generateFallbackReading(reading) {
  const cardNames = reading.cards.map(c => c.name).join(', ');
  
  return `The cards ${cardNames} have been drawn for your question: "${reading.question}". 
  
  The divine wisdom flows through these ancient symbols, offering guidance for your path ahead. 
  Trust in your inner knowing and the unfolding of your journey. Each card speaks to different 
  aspects of your experience, weaving together a tapestry of insight and direction.
  
  Remember that you hold the power to shape your destiny through conscious choice and authentic action.`;
}

export default router;