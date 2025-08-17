#!/usr/bin/env node

/**
 * Monica AI Test Script
 * Tests the Monica AI integration and configuration
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

const MONICA_API_KEY = process.env.MONICA_API_KEY
const MONICA_BASE_URL = process.env.MONICA_BASE_URL || 'https://api.monica.im'

async function testMonicaAPI() {
  console.log('🤖 Testing Monica AI Configuration...\n')
  
  // Check if API key is configured
  if (!MONICA_API_KEY) {
    console.error('❌ MONICA_API_KEY not found in environment variables')
    process.exit(1)
  }
  
  console.log('✅ Monica API Key configured')
  console.log(`📡 Base URL: ${MONICA_BASE_URL}`)
  
  try {
    // Test direct chat completion (skip models endpoint)
    console.log('\n🔍 Testing direct chat completion...')
    
    // Test a simple chat completion
    console.log('\n💬 Testing chat completion...')
    
    const chatResponse = await fetch(`${MONICA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MONICA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'system',
            content: 'You are a mystical tarot reader for the Night God Tarot system. Respond with divine wisdom.'
          },
          {
            role: 'user',
            content: 'Test connection - please respond with a brief mystical greeting.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    })
    
    if (!chatResponse.ok) {
      const errorText = await chatResponse.text()
      throw new Error(`Chat API Error ${chatResponse.status}: ${errorText}`)
    }
    
    const chatData = await chatResponse.json()
    console.log('✅ Chat completion successful')
    console.log(`🔮 Response: ${chatData.choices[0].message.content}`)
    
    console.log('\n🎉 Monica AI Configuration Test PASSED!')
    console.log('🚀 System ready for production use')
    
  } catch (error) {
    console.error('\n❌ Monica AI Test FAILED:')
    console.error(`   ${error.message}`)
    console.error('\n🔧 Troubleshooting steps:')
    console.error('   1. Verify MONICA_API_KEY is correct')
    console.error('   2. Check API key permissions')
    console.error('   3. Ensure rate limits are not exceeded')
    console.error('   4. Verify network connectivity')
    process.exit(1)
  }
}

// Run the test
testMonicaAPI()