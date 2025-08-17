# 🌙 Night God Tarot API Documentation

## 🔗 Base URL
- **Development:** `http://localhost:3001`
- **Production:** `https://api.nightgodtarot.com`

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Membership Tiers
- **Free Spirit:** 3 readings per day, basic features
- **Moon Shadow:** Unlimited readings, advanced interpretations
- **Night God:** Premium features, novel content integration

---

## 📚 Endpoints

### 🔑 Authentication

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "free"
  },
  "token": "jwt-token-here"
}
```

#### `POST /api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### `GET /api/auth/profile`
Get current user profile (requires authentication).

#### `PUT /api/auth/profile`
Update user profile (requires authentication).

#### `POST /api/auth/upgrade`
Upgrade membership tier (requires authentication).

---

### 🃏 Cards

#### `GET /api/cards`
Get all tarot cards.

**Query Parameters:**
- `arcana` (optional): Filter by arcana type (major, minor, hidden)
- `limit` (optional): Limit number of results

**Response:**
```json
{
  "cards": [
    {
      "id": 1,
      "name": "The Fool",
      "arcana": "major",
      "number": 0,
      "keywords": ["new beginnings", "innocence"],
      "meaning": "New beginnings and unlimited potential"
    }
  ],
  "total": 94
}
```

#### `GET /api/cards/:id`
Get specific card by ID.

#### `GET /api/cards/random/:count`
Get random cards (max 10).

#### `GET /api/cards/search/:query`
Search cards by name, keywords, or meaning.

---

### 🔮 Readings

#### `POST /api/readings/perform`
Perform a new tarot reading.

**Request Body:**
```json
{
  "cards": [
    {"id": 1, "name": "The Fool"},
    {"id": 3, "name": "The High Priestess"},
    {"id": 18, "name": "The Star"}
  ],
  "question": "What guidance do you have for my spiritual journey?",
  "spread": "three-card"
}
```

**Response:**
```json
{
  "success": true,
  "reading": {
    "id": "reading-123",
    "cards": [...],
    "question": "What guidance...",
    "interpretation": "The cards reveal...",
    "collectiveWisdom": "The universe speaks...",
    "personalAnalysis": "Your journey shows...",
    "wisdomIntegration": "By integrating...",
    "poeticSublimation": "Like stars dancing...",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### `GET /api/readings/history`
Get user's reading history (requires authentication).

#### `GET /api/readings/:id`
Get specific reading by ID.

#### `POST /api/readings/:id/share`
Create shareable link for reading.

#### `GET /api/readings/shared/:shareId`
Get shared reading (public access).

#### `DELETE /api/readings/:id`
Delete reading (Moon Shadow tier required).

---

### 💳 Payments

#### `POST /api/payments/create-intent`
Create payment intent for membership upgrade.

**Request Body:**
```json
{
  "tier": "moon-shadow",
  "amount": 5,
  "currency": "USD"
}
```

#### `POST /api/payments/webhooks/buymeacoffee`
Buy Me a Coffee webhook endpoint.

#### `POST /api/payments/webhooks/ipass`
iPass Money webhook endpoint.

---

### 🤖 AI Integration

#### `POST /api/ai/chat`
Direct Monica AI chat interface (requires authentication).

**Request Body:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a mystical tarot reader..."
    },
    {
      "role": "user", 
      "content": "Interpret these cards..."
    }
  ],
  "model": "claude-3-5-sonnet-20241022"
}
```

---

### 👑 Admin (Requires Authentication + Admin Role)

#### `GET /api/admin/stats`
Get system statistics and metrics.

**Response:**
```json
{
  "users": {
    "total": 1250,
    "free": 1000,
    "moonShadow": 200,
    "nightGod": 50
  },
  "readings": {
    "total": 15650,
    "today": 127
  },
  "revenue": {
    "total": 3750,
    "thisMonth": 450
  },
  "ai": {
    "monicaRequests": 8950,
    "successRate": 98.5
  }
}
```

#### `GET /api/admin/activity`
Get recent system activity.

---

### 🏥 Health & Monitoring

#### `GET /health`
System health check (public endpoint).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "uptime": 86400,
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 📊 Rate Limits

- **General API:** 100 requests per 15 minutes per IP
- **Monica AI:** 60 requests per minute (unlimited with subscription)
- **Free Users:** 3 readings per day
- **Paid Users:** Unlimited readings

---

## ❌ Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input data |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions/tier |
| 404  | Not Found - Resource doesn't exist |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

**Error Response Format:**
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 🔧 SDKs and Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:3001/api';
const token = 'your-jwt-token';

// Perform reading
const response = await fetch(`${API_BASE}/readings/perform`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    cards: [
      { id: 1, name: 'The Fool' },
      { id: 3, name: 'The High Priestess' }
    ],
    question: 'What does the future hold?'
  })
});

const reading = await response.json();
console.log(reading.interpretation);
```

### cURL Examples
```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Perform reading
curl -X POST http://localhost:3001/api/readings/perform \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"cards":[{"id":1,"name":"The Fool"}],"question":"Test reading"}'

# Get cards
curl http://localhost:3001/api/cards?arcana=major&limit=5
```

---

## 🚀 Getting Started

1. **Register Account:** `POST /api/auth/register`
2. **Get JWT Token:** Use login response token for authentication
3. **Fetch Cards:** `GET /api/cards` to get available cards
4. **Perform Reading:** `POST /api/readings/perform` with selected cards
5. **Upgrade Tier:** `POST /api/auth/upgrade` for unlimited access

---

## 🔮 Monica AI Integration

Night God Tarot uses Monica AI as the primary intelligence system:

- **Unlimited Usage:** 60 requests per minute
- **Multiple Models:** Claude-3.5-Sonnet, GPT-4O, Yi-Large, Gemini-1.5-Flash
- **Intelligent Routing:** Automatic model selection for optimal results
- **Fallback System:** Graceful degradation with mock responses

---

**🌟 May the divine wisdom flow through your API integrations! ✨**