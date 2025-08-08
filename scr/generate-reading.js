// api/generate-reading.js
import { kv } from '@vercel/kv';

// (這裡可以放入您完整的 callGeminiAPI, callPerplexityAPI 等函式)
async function callGeminiAPI(card, question, language, isReversed) {
    // ... (如我們之前版本所示，呼叫 Gemini API 的完整邏輯) ...
    // ... 回傳一個包含 spiritualInsight, poeticInterpretation, practicalAdvice 的物件 ...
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { question, language } = req.body;

  try {
    const cardIds = await kv.get('card_ids');
    if (!cardIds || cardIds.length === 0) throw new Error('Card data not found in DB.');
    
    const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];
    const isReversed = Math.random() > 0.5;
    const cardData = await kv.get(`card:${randomId}`);
    
    // 指揮家開始工作
    const geminiReading = await callGeminiAPI(cardData, question, language, isReversed);
    // const perplexityData = await callPerplexityAPI(cardData.name[language]); // 未來擴充

    return res.status(200).json({ 
      success: true, 
      card: { ...cardData, isReversed }, 
      reading: geminiReading,
      // context: perplexityData, // 未來擴充
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}