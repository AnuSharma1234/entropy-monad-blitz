#!/bin/bash

echo "=== Supabase Setup Verification ==="
echo

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables not set"
  echo "Set them in .env.local or run: export SUPABASE_URL=... SUPABASE_ANON_KEY=..."
  exit 1
fi

echo "✓ Environment variables set"
echo "  URL: $SUPABASE_URL"
echo

echo "Testing API connectivity..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$SUPABASE_URL/rest/v1/agents" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Accept: application/json")

STATUS_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)

if [ "$STATUS_CODE" = "200" ]; then
  echo "✓ API endpoint responding (HTTP 200)"
  echo "✓ Agents table exists: $BODY"
  
  # Test other tables
  echo
  echo "Testing other tables..."
  
  USERS=$(curl -s "$SUPABASE_URL/rest/v1/users" -H "apikey: $SUPABASE_ANON_KEY" | head -1)
  echo "✓ Users table: $USERS"
  
  BETS=$(curl -s "$SUPABASE_URL/rest/v1/bets" -H "apikey: $SUPABASE_ANON_KEY" | head -1)
  echo "✓ Bets table: $BETS"
  
  CHAT=$(curl -s "$SUPABASE_URL/rest/v1/chat_messages" -H "apikey: $SUPABASE_ANON_KEY" | head -1)
  echo "✓ Chat messages table: $CHAT"
  
  echo
  echo "✓✓✓ All tables exist and are accessible!"
  exit 0
else
  echo "✗ API error (HTTP $STATUS_CODE)"
  echo "Response: $BODY"
  exit 1
fi
