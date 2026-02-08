-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users table RLS: Users can only view their own record
CREATE POLICY users_view_own ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY users_update_own ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Agents table RLS: Users can view all agents, but only modify their own
CREATE POLICY agents_view_all ON agents FOR SELECT
  USING (true);

CREATE POLICY agents_insert_own ON agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY agents_update_own ON agents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY agents_delete_own ON agents FOR DELETE
  USING (auth.uid() = user_id);

-- Bets table RLS: Users can view all bets (for spectator feed), but queries are filtered by agent ownership
CREATE POLICY bets_view_all ON bets FOR SELECT
  USING (true);

CREATE POLICY bets_insert_own ON bets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat messages RLS: All users can view chat, but only send messages as themselves
CREATE POLICY chat_messages_view_all ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY chat_messages_insert_own ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
