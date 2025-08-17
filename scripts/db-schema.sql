-- Night God Tarot Database Schema
-- PostgreSQL schema for production deployment

-- Create database (run as admin)
-- CREATE DATABASE nightgod_tarot;
-- CREATE USER nightgod WITH PASSWORD 'secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE nightgod_tarot TO nightgod;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tier VARCHAR(50) DEFAULT 'free' CHECK (tier IN ('free', 'moon-shadow', 'night-god')),
    reading_count INTEGER DEFAULT 0,
    last_reading_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upgraded_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Tarot cards table
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    arcana VARCHAR(50) NOT NULL CHECK (arcana IN ('major', 'minor', 'hidden')),
    suit VARCHAR(50),
    rank VARCHAR(50),
    number INTEGER,
    keywords TEXT[],
    meaning TEXT,
    reversed_meaning TEXT,
    image_url VARCHAR(500),
    element VARCHAR(50),
    planet VARCHAR(50),
    zodiac VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Readings table
CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cards JSONB NOT NULL,
    question TEXT,
    spread VARCHAR(100) DEFAULT 'three-card',
    interpretation TEXT,
    collective_wisdom TEXT,
    personal_analysis TEXT,
    wisdom_integration TEXT,
    poetic_sublimation TEXT,
    ai_model VARCHAR(100),
    confidence_score DECIMAL(3,2),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    is_shared BOOLEAN DEFAULT false,
    shared_id UUID,
    shared_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading history for analytics
CREATE TABLE IF NOT EXISTS reading_analytics (
    id SERIAL PRIMARY KEY,
    reading_id UUID REFERENCES readings(id) ON DELETE CASCADE,
    user_tier VARCHAR(50),
    cards_count INTEGER,
    response_time_ms INTEGER,
    ai_tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payment_provider VARCHAR(50) NOT NULL,
    external_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    tier VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Novel content for AI integration
CREATE TABLE IF NOT EXISTS novel_content (
    id SERIAL PRIMARY KEY,
    chapter INTEGER,
    section VARCHAR(255),
    content TEXT NOT NULL,
    themes TEXT[],
    characters TEXT[],
    keywords TEXT[],
    embedding VECTOR(1536), -- For future AI embedding search
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at);
CREATE INDEX IF NOT EXISTS idx_readings_shared ON readings(shared_id) WHERE is_shared = true;
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- Insert initial tarot cards data
INSERT INTO cards (name, arcana, number, keywords, meaning, image_url) VALUES
('The Fool', 'major', 0, ARRAY['new beginnings', 'innocence', 'spontaneity'], 'New beginnings and unlimited potential', '/assets/01_The_Fool.png'),
('The Magician', 'major', 1, ARRAY['manifestation', 'resourcefulness', 'power'], 'Manifestation and personal power', '/assets/02_The_Magician.png'),
('The High Priestess', 'major', 2, ARRAY['intuition', 'sacred knowledge', 'divine feminine'], 'Intuition and inner wisdom', '/assets/03_The_High_Priestess.png')
-- Add more cards as needed
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample admin user (change password in production!)
INSERT INTO users (email, name, password_hash, tier) VALUES 
('admin@nightgodtarot.com', 'Night God Admin', '$2a$12$encrypted_password_here', 'night-god')
ON CONFLICT (email) DO NOTHING;