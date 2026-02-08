# Supabase Setup Guide

## Project Creation

1. Go to [supabase.com](https://supabase.com)
2. Create a new project:
   - Organization: Create new or select existing
   - Project name: `monad-ai-betting` (or your choice)
   - Database password: Generate strong password
   - Region: Select closest to your users (us-east-1 recommended)
   - Click "Create new project"

3. Wait for database initialization (~2 minutes)

## Database Connection

### Get Connection Strings

1. After project creation, go to **Settings → Database**
2. Under "Connection Pooling", copy:
   - **Connection string** (PostgreSQL)
   - Save the URL format: `postgresql://[user]:[password]@[host]/[database]`

### Extract Environment Variables

From connection string `postgresql://postgres.abc123:password@abc123.pooling.supabase.co:6543/postgres`:

```bash
SUPABASE_URL=https://abc123.supabase.co
SUPABASE_ANON_KEY=your_anon_key_from_api_settings
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_api_settings
```

### Find API Keys

1. Go to **Settings → API**
2. Copy:
   - `anon [public]` → `SUPABASE_ANON_KEY`
   - `service_role [secret]` → `SUPABASE_SERVICE_ROLE_KEY`

## Apply Migrations

### Using Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Link to project (creates .env.local)
supabase link --project-ref abc123

# Apply migrations
supabase db push

# Create migrations
supabase migration create create_users_table
```

### Using pgAdmin or Web SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Copy-paste SQL from `supabase/migrations/` files in order:
   - `001_create_users_table.sql`
   - `002_create_agents_table.sql`
   - `003_create_bets_table.sql`
   - `004_create_chat_messages_table.sql`
   - `005_create_rls_policies.sql`
   - `006_enable_realtime.sql`

## Verify Schema

```bash
# After migrations, check tables exist
curl "https://your-project.supabase.co/rest/v1/users" \
  -H "apikey: your_anon_key"

# Should return: []  (empty array, table exists)
```

## Realtime Configuration

Supabase Realtime is **automatically enabled** on these tables:
- `chat_messages` - For live chat updates
- `agents` - For agent state changes
- `bets` - For live bet updates

### Subscribe in Frontend

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Subscribe to new messages
const subscription = supabase
  .channel('chat_messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
    console.log('New message:', payload.new)
  })
  .subscribe()
```

## RLS Policy Verification

After enabling RLS, verify each table:

```sql
-- Check users can only see their own record
SELECT * FROM users WHERE id = auth.uid();

-- Check agents visible to all (but updateable only by owner)
SELECT * FROM agents WHERE user_id = auth.uid();

-- Check bets visible to all (for spectator feed)
SELECT * FROM bets LIMIT 10;

-- Check chat visible to all
SELECT * FROM chat_messages LIMIT 10;
```

## Important Notes

1. **RLS is Enabled**: All tables have Row Level Security enabled
2. **Users Table**: Only viewable by the row owner
3. **Agents Table**: Viewable by all, but editable only by owner
4. **Bets Table**: Viewable by all (for spectator feed), insertable by agent owner
5. **Chat Table**: Viewable by all, insertable by message author

## Testing with curl

```bash
# Set env vars
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your_anon_key"

# Test agents table (should return empty array)
curl "$SUPABASE_URL/rest/v1/agents" \
  -H "apikey: $SUPABASE_ANON_KEY"

# Insert test user (requires auth)
curl -X POST "$SUPABASE_URL/rest/v1/users" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"wallet_address": "0x123...", "id": "550e8400-e29b-41d4-a716-446655440000"}'
```

## Next Steps

1. Update `.env.local` with your Supabase credentials
2. Test Supabase connection in frontend
3. Implement authentication with Supabase Auth (Task 11)
4. Wire frontend forms to write to Supabase (Tasks 11-14)
5. Implement Realtime subscriptions (Task 13 - Spectator Feed)
