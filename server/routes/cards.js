/**
 * Cards Routes
 * Tarot card data and information endpoints
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Tarot card data (in a real app, this would come from a database)
const tarotCards = [
  // Major Arcana
  { id: 1, name: 'The Fool', arcana: 'major', number: 0, keywords: ['new beginnings', 'innocence', 'spontaneity'], meaning: 'New beginnings and unlimited potential' },
  { id: 2, name: 'The Magician', arcana: 'major', number: 1, keywords: ['manifestation', 'resourcefulness', 'power'], meaning: 'Manifestation and personal power' },
  { id: 3, name: 'The High Priestess', arcana: 'major', number: 2, keywords: ['intuition', 'sacred knowledge', 'divine feminine'], meaning: 'Intuition and inner wisdom' },
  // Add more cards...
];

// Get all cards
router.get('/', asyncHandler(async (req, res) => {
  const { arcana, limit } = req.query;
  
  let cards = tarotCards;
  
  // Filter by arcana if specified
  if (arcana) {
    cards = cards.filter(card => card.arcana === arcana);
  }
  
  // Limit results if specified
  if (limit) {
    cards = cards.slice(0, parseInt(limit));
  }
  
  res.json({
    cards,
    total: cards.length,
    timestamp: new Date().toISOString()
  });
}));

// Get single card by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = tarotCards.find(c => c.id === cardId);
  
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }
  
  res.json(card);
}));

// Get random cards
router.get('/random/:count', asyncHandler(async (req, res) => {
  const count = Math.min(parseInt(req.params.count) || 1, 10); // Max 10 cards
  
  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  const randomCards = shuffled.slice(0, count);
  
  res.json({
    cards: randomCards,
    count: randomCards.length,
    timestamp: new Date().toISOString()
  });
}));

// Search cards
router.get('/search/:query', asyncHandler(async (req, res) => {
  const query = req.params.query.toLowerCase();
  
  const matchingCards = tarotCards.filter(card => 
    card.name.toLowerCase().includes(query) ||
    card.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
    card.meaning.toLowerCase().includes(query)
  );
  
  res.json({
    cards: matchingCards,
    query,
    total: matchingCards.length,
    timestamp: new Date().toISOString()
  });
}));

export default router;