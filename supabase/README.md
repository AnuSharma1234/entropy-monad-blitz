# Supabase Database Setup

This directory contains all database configuration and migrations for the AI Agent Betting Platform.

## Quick Start

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note the URL and anon key

2. **Apply Migrations**
   - Copy migrations to Supabase SQL editor
   - Or use Supabase CLI: `supabase db push`

3. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in SUPABASE_URL and SUPABASE_ANON_KEY

4. **Verify Setup**
   - Run `bash supabase/verify-setup.sh`
   - Or test: `curl $SUPABASE_URL/rest/v1/agents -H "apikey: $SUPABASE_ANON_KEY"`

## Files Overview

### Migrations (Applied in Order)
- **001_create_users_table.sql** - User identity with wallet address
- **002_create_agents_table.sql** - Agent registry with JSON stats
- **003_create_bets_table.sql** - Bet history with game tracking
- **004_create_chat_messages_table.sql** - Realtime chat messages
- **005_create_rls_policies.sql** - Row-level security for all tables
- **006_enable_realtime.sql** - Realtime publication configuration

### Documentation
- **SETUP.md** - Step-by-step project creation guide
- **VERIFICATION.md** - Testing scenarios and acceptance criteria
- **verify-setup.sh** - Automated connectivity test script

## Database Schema

### users
- `id` (UUID) - Primary key, matches Supabase Auth user ID
- `wallet_address` (TEXT) - Unique wallet address
- `created_at` (TIMESTAMP)
- RLS: Users see only their own record

### agents
- `id` (BIGSERIAL) - Primary key
- `user_id` (UUID) - Foreign key to users
- `name` (TEXT) - Agent name
- `stats` (JSONB) - 7 agent traits
- `gemini_api_key_encrypted` (TEXT) - Encrypted API key
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- RLS: All can view, only owner can modify

### bets
- `id` (BIGSERIAL) - Primary key
- `agent_id` (BIGINT) - Foreign key to agents
- `user_id` (UUID) - Foreign key to users
- `game` (TEXT) - Game type (coinflip, dice, mines, plinko)
- `bet_amount` (NUMERIC) - Bet size in MON
- `outcome` (TEXT) - Bet result
- `payout` (NUMERIC) - Amount won
- `reasoning` (TEXT) - Agent's decision explanation
- `created_at` (TIMESTAMP)
- RLS: All can view (spectator feed), only owner can insert

### chat_messages
- `id` (BIGSERIAL) - Primary key
- `user_id` (UUID) - Foreign key to users
- `message` (TEXT) - Message content
- `created_at` (TIMESTAMP)
- RLS: All can view, only author can insert
- **Realtime Enabled**: Live chat updates

## Security

### Row Level Security (RLS)
All tables have RLS enabled. Policies enforce:

1. **Users**: Only view own record
2. **Agents**: View all, modify only own
3. **Bets**: View all (public spectator feed), insert only own
4. **Chat**: View all, insert only own messages

### API Keys
- **ANON_KEY**: Safe for frontend (read-only for most data)
- **SERVICE_ROLE_KEY**: Keep secret (backend use only)
- **User API Keys**: Store encrypted in agents.gemini_api_key_encrypted

## Realtime Features

Supabase Realtime is enabled for:
- **chat_messages**: Live chat updates
- **agents**: Real-time agent profile changes
- **bets**: Live bet activity feed

Example subscription:
```typescript
const channel = supabase
  .channel('public:bets')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'bets' },
    (payload) => console.log('New activity:', payload)
  )
  .subscribe()
```

## Integration Points

### Task 11 - Agent Creation UI
- Create authenticated user via Supabase Auth
- Insert agent into agents table
- Encrypt Gemini API key before storing

### Task 13 - Spectator Feed
- Subscribe to bets table Realtime
- Subscribe to chat_messages Realtime
- Display activity in real-time

### Task 16 - Agent Decision Loop
- Insert bets after contract execution
- Update agent stats
- Broadcast to spectators via Realtime

## Testing

### Verify Tables Exist
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your_key"

curl "$SUPABASE_URL/rest/v1/agents" -H "apikey: $SUPABASE_ANON_KEY"
# Expected: []
```

### Test with Script
```bash
bash supabase/verify-setup.sh
```

## Troubleshooting

### "table does not exist"
- Ensure all migrations were applied in order
- Check Supabase SQL editor for errors

### "401 Unauthorized"
- ANON_KEY is invalid or expired
- Check API settings in Supabase dashboard

### RLS policies blocking inserts
- Ensure user is authenticated (auth.uid() set)
- Check policy allows the operation
- Test with SERVICE_ROLE_KEY first (bypasses RLS)

## Next Steps

1. Create Supabase project at https://supabase.com
2. Follow SETUP.md for credential setup
3. Apply all migrations
4. Run verify-setup.sh to confirm
5. Proceed with frontend tasks (11-16)
