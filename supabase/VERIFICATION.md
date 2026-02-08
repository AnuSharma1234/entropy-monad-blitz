# Supabase Verification Scenarios

## Scenario 1: Verify Tables Exist (No Auth Required)

Using the ANON_KEY, verify each table exists and is accessible via REST API:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your_anon_key_here"

curl "$SUPABASE_URL/rest/v1/agents" \
  -H "apikey: $SUPABASE_ANON_KEY"

# Expected response: [] (empty array, table exists)
```

### Expected Results

| Table | Command | Expected Response |
|-------|---------|-------------------|
| agents | `curl ... /agents` | `[]` |
| bets | `curl ... /bets` | `[]` |
| users | `curl ... /users` | RLS error or `[]` |
| chat_messages | `curl ... /chat_messages` | `[]` |

## Scenario 2: Verify RLS Policies

Test that RLS policies prevent unauthorized access:

```bash
curl -X POST "$SUPABASE_URL/rest/v1/agents" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "TestAgent",
    "stats": {
      "riskTolerance": 5,
      "aggression": 5,
      "analytical": 5,
      "patience": 5,
      "unpredictability": 5,
      "herdMentality": 5,
      "humor": 5
    }
  }'

# Expected: 401 Unauthorized (no auth context)
# OR: 201 Created (if using authenticated user)
```

## Scenario 3: Verify Realtime Subscriptions

The following tables have Realtime enabled and can be subscribed to:

1. **chat_messages**: For live chat updates
2. **agents**: For agent profile changes
3. **bets**: For live bet activity

Subscribe and verify real-time updates:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const subscription = supabase
  .channel('chat_messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'chat_messages' },
    (payload) => console.log('New message:', payload.new)
  )
  .subscribe()

// When a new message is inserted, event fires immediately
```

## Scenario 4: Full Data Flow (With Authentication)

Once authentication is implemented:

```typescript
const user = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
})

const { error } = await supabase
  .from('agents')
  .insert({
    user_id: user.user.id,
    name: 'MyAgent',
    stats: { /* 7 stats */ },
    gemini_api_key_encrypted: 'encrypted_key'
  })

// RLS ensures only authenticated users can insert
// RLS ensures agents.user_id must match auth.uid()
```

## Acceptance Criteria

### Schema Verification (REQUIRED)
- [ ] All 4 tables exist: `users`, `agents`, `bets`, `chat_messages`
- [ ] `curl "$SUPABASE_URL/rest/v1/agents" -H "apikey: $SUPABASE_ANON_KEY"` returns `[]`
- [ ] Migration files are in `supabase/migrations/`

### RLS Verification
- [ ] `users` table RLS enabled
- [ ] `agents` table RLS enabled with user-only update policy
- [ ] `bets` table RLS enabled (view all, insert own)
- [ ] `chat_messages` table RLS enabled (view all, insert own)

### Realtime Verification
- [ ] `chat_messages` table published to supabase_realtime
- [ ] `agents` table published to supabase_realtime
- [ ] `bets` table published to supabase_realtime

### Configuration
- [ ] `.env.example` contains SUPABASE_URL and SUPABASE_ANON_KEY placeholders
- [ ] `supabase/SETUP.md` includes step-by-step setup instructions
- [ ] `supabase/verify-setup.sh` can test connectivity

## Integration Points

### Task 11 (Agent Creation UI)
- Reads from `agents` table via Supabase client
- Encrypts Gemini API key before storing

### Task 13 (Spectator Feed)
- Subscribes to `bets` table for real-time activity
- Subscribes to `chat_messages` for live chat

### Task 16 (Agent Decision Loop)
- Inserts new bets into `bets` table
- Updates `agents` stats table
- Broadcasts to Realtime subscribers

## Testing Checklist

- [ ] Create Supabase account and project
- [ ] Apply all 6 migration files in order
- [ ] Verify each table exists via REST API
- [ ] Check RLS policies are enabled
- [ ] Test Realtime subscription (optional, requires auth)
- [ ] Save SUPABASE_URL and SUPABASE_ANON_KEY to `.env.local`
