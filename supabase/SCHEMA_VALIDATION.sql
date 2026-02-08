-- This file validates the schema after all migrations are applied
-- Run these queries in Supabase SQL Editor to verify setup

-- 1. Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
-- Expected: agents, bets, chat_messages, users

-- 2. Validate users table structure
\d users
-- Expected columns: id (UUID), wallet_address (TEXT), created_at, updated_at

-- 3. Validate agents table structure
\d agents
-- Expected columns: id (BIGSERIAL), user_id (UUID), name, stats (JSONB), gemini_api_key_encrypted, created_at, updated_at

-- 4. Validate bets table structure
\d bets
-- Expected columns: id (BIGSERIAL), agent_id, user_id, game, bet_amount, outcome, payout, reasoning, created_at

-- 5. Validate chat_messages table structure
\d chat_messages
-- Expected columns: id (BIGSERIAL), user_id (UUID), message, created_at

-- 6. Check RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
-- Expected: all tables have rowsecurity = true

-- 7. Check RLS policies exist
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
-- Expected: 12 policies total (3 for users, 4 for agents, 2 for bets, 2 for chat_messages, 1 for enable RLS)

-- 8. Check indexes exist
SELECT tablename, indexname FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'agents', 'bets', 'chat_messages')
ORDER BY tablename, indexname;
-- Expected: Multiple indexes for performance (especially on created_at DESC for bets)

-- 9. Validate trigger functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'update_%'
ORDER BY routine_name;
-- Expected: update_agents_updated_at, update_users_updated_at

-- 10. Validate Realtime publication
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
-- Expected: rows for chat_messages, agents, bets

-- 11. Test data insertion (will fail with RLS if user not authenticated)
-- Note: These will fail in REST API without authentication, but succeed in SQL Editor
INSERT INTO chat_messages (user_id, message) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Test message');
-- Expected: Insert succeeds (SQL Editor bypasses RLS)

-- 12. Verify foreign key constraints
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_schema = 'public' 
AND table_name IN ('agents', 'bets', 'chat_messages')
ORDER BY table_name, constraint_name;
-- Expected: agents.user_id -> users.id, bets.agent_id -> agents.id, bets.user_id -> users.id, chat_messages.user_id -> users.id
