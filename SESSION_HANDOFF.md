# AI Agent Betting Platform - Session Handoff Document

**Date:** 2026-02-08  
**Project:** Monad AI Agent Betting Platform  
**Status:** 10/17 tasks complete (59%)  
**Blocker:** Task delegation system issue (subagents not creating files)

---

## 🎯 Quick Start for New Session

### Prompt to Use

```
I'm continuing work on the AI Agent Betting Platform. Please read the handoff document at SESSION_HANDOFF.md and continue from where we left off. We completed tasks 1-10 (all smart contracts, agent service, and Supabase setup). We need to complete tasks 11-17 (frontend pages and integration).

Current state:
- 81/81 smart contract tests passing
- All contracts compiled successfully
- Agent service skeleton created
- Supabase migrations ready
- Need to build 4 frontend pages (agent creation, profile, spectator, leaderboard)
- Need to wire frontend to contracts
- Need to implement agent decision loop
- Need end-to-end testing

Please review the handoff doc and let me know your plan for completing the remaining 7 tasks.
```

---

## 📊 Project Overview

### Goal
Build a hackathon-ready platform where AI agents (powered by Gemini) autonomously bet on casino games (Mines, Plinko, CoinFlip, Dice) on Monad testnet on behalf of users.

### Tech Stack
- **Blockchain:** Monad Testnet (Chain ID 10143)
- **Smart Contracts:** Solidity + Foundry
- **VRF:** Pyth Entropy at `0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320`
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **AI:** Gemini 2.0 Flash (user-provided API keys)
- **Backend:** Node.js, Express
- **Database:** Supabase (PostgreSQL + Realtime)

### Key Constraints
- All betting on Monad testnet ONLY
- User-provided Gemini API keys (no backend costs)
- Stay under 5 MON testnet budget
- 35-point agent stat budget (validated on-chain and frontend)
- 2% house edge on all games
- TDD approach for all contracts

---

## ✅ Completed Work (Tasks 1-10)

### Wave 0: Foundation
**Task 1: VRF Spike** ✅
- File: `contracts/src/VRFSpike.sol` (87 lines)
- Validated Pyth Entropy works on Monad testnet
- Confirmed callback pattern with 20-30 second latency

**Task 2: wagmi + Foundry Setup** ✅
- Fixed `config/wagmi.ts` RPC URL: `https://testnet-rpc.monad.xyz`
- Initialized Foundry project in `contracts/`
- Installed: pyth-sdk-solidity, openzeppelin-contracts

### Wave 1: Smart Contracts (Pool + Registry + 2 Games)
**Task 3: AgentPool Contract** ✅
- File: `contracts/src/AgentPool.sol` (141 lines)
- Tests: `contracts/test/AgentPool.t.sol` (22/22 passing ✓)
- Features: deposit/withdraw, 24h cooldown, game authorization
- Pattern: ReentrancyGuard, per-user balance tracking

**Task 4: AgentRegistry Contract** ✅
- File: `contracts/src/AgentRegistry.sol` (160 lines)
- Tests: `contracts/test/AgentRegistry.t.sol` (9/9 passing ✓)
- Features: register agents, 7 stats (sum=35 validation), 24h update cooldown
- Events: AgentRegistered, AgentUpdated

**Task 5: CoinFlip Game** ✅
- File: `contracts/src/CoinFlipGame.sol` (155 lines)
- Tests: `contracts/test/CoinFlip.test.sol` (10/10 passing ✓)
- Features: VRF integration, 2% house edge (1.96x payout)
- Pattern: Pull from AgentPool, credit winnings back

**Task 6: Dice Game** ✅
- File: `contracts/src/DiceGame.sol` (192 lines)
- Tests: `contracts/test/DiceGame.t.sol` (9/9 passing ✓)
- Features: 1-100 roll, over/under betting, dynamic payouts with 2% edge
- Formula: `(betAmount * 100 * 98) / (winChance * 100)`
- Bug fixed: Random number mapping `((uint256(randomNumber) - 1) % 100) + 1`

### Wave 2: Games + Services (2 Games + Agent Service + Supabase)
**Task 7: Mines Game** ✅
- File: `contracts/src/MinesGame.sol` (270 lines)
- Tests: `contracts/test/MinesGame.t.sol` (16/16 passing ✓)
- Features: 5x5 grid, Fisher-Yates shuffle for mine placement
- Multiplier formula: `currentMultiplier * (GRID_SIZE * 98) / (remainingSafeTiles * 100)`

**Task 8: Plinko Game** ✅
- File: `contracts/src/PlinkoGame.sol` (690 lines)
- Tests: `contracts/test/PlinkoGame.t.sol` (13/13 passing ✓)
- Features: 3 risk levels (LOW/MEDIUM/HIGH), VRF path generation
- Path: 16 left/right decisions → 17 buckets with multipliers

**Task 9: Agent Service Setup** ✅
- Directory: `agent-service/`
- Files created:
  - `package.json` - Node.js/TypeScript project
  - `src/index.ts` - Express server
  - `src/gemini.ts` - Gemini 2.0 Flash client
  - `src/types.ts` - TypeScript interfaces
  - `src/prompt.ts` - Decision prompt template
  - `test/gemini.test.ts` - Test suite
- Config: Temperature 0.1 for consistent decisions

**Task 10: Supabase Setup** ✅
- Directory: `supabase/migrations/`
- Schema:
  - `001_users.sql` - User table with wallet address
  - `002_agents.sql` - Agent stats and metadata
  - `003_bets.sql` - Bet history
  - `004_chat_messages.sql` - Spectator chat
  - `005_rls_policies.sql` - Row-level security
  - `006_realtime.sql` - Realtime subscriptions
- Documentation: README.md, SETUP.md, VERIFICATION.md

### Test Status Summary
**Total: 81/81 tests passing ✓**
- AgentPool: 22/22 ✓
- AgentRegistry: 9/9 ✓
- CoinFlip: 10/10 ✓
- Dice: 9/9 ✓
- Mines: 16/16 ✓
- Plinko: 13/13 ✓

### Commits Made
1. `feat(contracts): validate Pyth Entropy VRF on Monad testnet`
2. `chore: fix wagmi RPC URL to Monad testnet`
3. `feat(contracts): add Wave 1 smart contracts` (Pool, Registry, CoinFlip, Dice)
4. `docs: mark Wave 1 complete in plan (tasks 3-6)`
5. `feat(contracts): add Mines game with VRF mine generation`
6. `feat(contracts): add Plinko game with risk levels`
7. `docs: mark tasks 7-8 complete`

---

## 🚧 Remaining Work (Tasks 11-17)

### Wave 3: Frontend (4 Pages) - ALL PENDING

#### Task 11: Agent Creation UI ❌
**File to create:** `app/agent/create/page.tsx` (~250 lines)

**Requirements:**
- 7 stat sliders (Risk Tolerance, Aggression, Analytical, Patience, Unpredictability, Herd Mentality, Humor)
- Each slider: min=1, max=10, default=5
- Real-time budget counter: "X / 35 points used"
- Visual feedback: green when 35/35, yellow/red otherwise
- Name input (text, required)
- Gemini API key input (password, required)
- Submit button disabled when `pointsUsed !== 35`
- Auto-generated avatar preview (simple placeholder OK)
- Form validation before submission
- On success: redirect to `/agent/[returnedId]`

**Design Pattern:**
```tsx
const [stats, setStats] = useState({
  riskTolerance: 5,
  aggression: 5,
  analytical: 5,
  patience: 5,
  unpredictability: 5,
  herdMentality: 5,
  humor: 5,
});

const pointsUsed = Object.values(stats).reduce((a, b) => a + b, 0);
```

**UI Components to use:**
- `components/ui/Button.tsx` - For submit button
- `components/ui/Input.tsx` - For name and API key
- `components/ui/Card.tsx` - For panel layout
- Native `<input type="range">` for sliders

**Reference files:**
- `app/stake/page.tsx` - Page layout pattern
- `app/globals.css` - Cyber/neon theme colors

**Acceptance:**
- [ ] All 7 sliders render and update
- [ ] Points counter updates in real-time
- [ ] Submit disabled when !== 35
- [ ] `bun run build` succeeds
- [ ] `bun run lint` clean

---

#### Task 12: Agent Profile Page ❌
**File to create:** `app/agent/[id]/page.tsx` (~300 lines)

**Requirements:**
- Dynamic route parameter: `[id]`
- Display agent name and avatar
- Radar chart for 7 stats (use Recharts or similar)
- Win/loss record (count and percentage)
- Profit/loss (in MON tokens)
- Recent bet history list (last 10 bets)
- Live decision commentary feed
- Real-time updates via Supabase Realtime

**Data Structure:**
```typescript
interface Agent {
  id: number;
  name: string;
  owner: string;
  stats: {
    riskTolerance: number;
    aggression: number;
    analytical: number;
    patience: number;
    unpredictability: number;
    herdMentality: number;
    humor: number;
  };
  totalBets: number;
  wins: number;
  losses: number;
  profit: string; // in MON
}
```

**Radar Chart Libraries:**
- Option 1: `recharts` (already in dependencies)
- Option 2: `react-chartjs-2`
- Option 3: Custom SVG/Canvas

**Reference:**
- `app/dashboard/page.tsx` - Card layout patterns

**Acceptance:**
- [ ] Agent data loads correctly
- [ ] Radar chart displays 7 stats
- [ ] Win/loss stats visible
- [ ] Bet history list renders
- [ ] `bun run build` succeeds

---

#### Task 13: Spectator Feed ❌
**File to create:** `app/spectator/page.tsx` (~350 lines)

**Requirements:**
- Live activity feed showing all agent bets
- Supabase Realtime subscription for updates
- Chat panel with Realtime messaging
- Filter by game type (dropdown or tabs)
- Click agent name → navigate to profile
- Auto-scroll to latest activity
- Message limit (e.g., last 100 activities)

**Supabase Realtime Pattern:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel('bets')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'bets'
    }, (payload) => {
      setActivities(prev => [payload.new, ...prev]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

**Chat Pattern:**
```typescript
const sendMessage = async (text: string) => {
  await supabase.from('chat_messages').insert({
    user_id: userId,
    message: text,
    timestamp: new Date().toISOString()
  });
};
```

**Reference:**
- `app/dashboard/page.tsx:192-214` - MOCK_FEED pattern

**Acceptance:**
- [ ] Live feed updates without refresh
- [ ] Chat messages send and receive
- [ ] Filter by game works
- [ ] Click agent → profile navigation
- [ ] `bun run build` succeeds

---

#### Task 14: Leaderboard ❌
**File to create:** `app/leaderboard/page.tsx` (~200 lines)

**Requirements:**
- Table of top agents by profit
- Columns: Rank, Agent Name, Owner, Profit, Win Rate, Total Bets
- Sortable by different metrics (click column header)
- Pagination or infinite scroll
- Click agent name → navigate to profile

**Table Structure:**
```typescript
interface LeaderboardEntry {
  rank: number;
  agentId: number;
  agentName: string;
  owner: string;
  profit: string; // MON
  winRate: number; // percentage
  totalBets: number;
}
```

**Sorting Logic:**
```typescript
const [sortBy, setSortBy] = useState<'profit' | 'winRate' | 'totalBets'>('profit');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

const sortedAgents = [...agents].sort((a, b) => {
  const modifier = sortOrder === 'asc' ? 1 : -1;
  return (a[sortBy] - b[sortBy]) * modifier;
});
```

**Reference:**
- `app/history/page.tsx` - Table patterns

**Acceptance:**
- [ ] Leaderboard table renders
- [ ] Sorting works for all columns
- [ ] Click agent → profile navigation
- [ ] `bun run build` succeeds

---

### Wave 4: Integration (3 Tasks) - ALL PENDING

#### Task 15: Wire Frontend to Contracts ❌
**What to do:**
1. Extract contract ABIs from Foundry
2. Create contract hooks in `hooks/`
3. Wire agent creation to AgentRegistry
4. Wire deposit/withdraw to AgentPool
5. Update game UIs to use contract calls

**Steps:**

**1. Extract ABIs:**
```bash
cd contracts
forge inspect AgentPool abi > ../lib/contracts/AgentPool.json
forge inspect AgentRegistry abi > ../lib/contracts/AgentRegistry.json
forge inspect CoinFlipGame abi > ../lib/contracts/CoinFlipGame.json
forge inspect DiceGame abi > ../lib/contracts/DiceGame.json
forge inspect MinesGame abi > ../lib/contracts/MinesGame.json
forge inspect PlinkoGame abi > ../lib/contracts/PlinkoGame.json
```

**2. Create hooks:**

File: `hooks/useAgentPool.ts`
```typescript
import { useContractWrite, useContractRead } from 'wagmi';
import AgentPoolABI from '@/lib/contracts/AgentPool.json';

const AGENT_POOL_ADDRESS = '0x...'; // Deploy address

export function useAgentPool() {
  const { write: deposit } = useContractWrite({
    address: AGENT_POOL_ADDRESS,
    abi: AgentPoolABI,
    functionName: 'deposit',
  });

  const { data: balance } = useContractRead({
    address: AGENT_POOL_ADDRESS,
    abi: AgentPoolABI,
    functionName: 'getBalance',
    args: [userAddress],
  });

  return { deposit, balance };
}
```

File: `hooks/useAgentRegistry.ts`
```typescript
import { useContractWrite } from 'wagmi';
import AgentRegistryABI from '@/lib/contracts/AgentRegistry.json';

const AGENT_REGISTRY_ADDRESS = '0x...';

export function useAgentRegistry() {
  const { write: registerAgent } = useContractWrite({
    address: AGENT_REGISTRY_ADDRESS,
    abi: AgentRegistryABI,
    functionName: 'registerAgent',
  });

  return { registerAgent };
}
```

**3. Wire agent creation form:**
Update `app/agent/create/page.tsx`:
```typescript
import { useAgentRegistry } from '@/hooks/useAgentRegistry';

// In component:
const { registerAgent } = useAgentRegistry();

const handleSubmit = async () => {
  const statsTuple = [
    stats.riskTolerance,
    stats.aggression,
    stats.analytical,
    stats.patience,
    stats.unpredictability,
    stats.herdMentality,
    stats.humor,
  ];

  await registerAgent({
    args: [name, statsTuple],
  });
};
```

**Deployment Prerequisites:**
- Deploy contracts to Monad testnet
- Update contract addresses in hooks
- Fund deployer wallet with testnet MON

**Acceptance:**
- [ ] All ABIs extracted
- [ ] All hooks created
- [ ] Agent creation calls contract
- [ ] Deposit/withdraw works
- [ ] Transaction confirmations show

---

#### Task 16: Agent Decision Loop ❌
**What to do:**
Create background worker that runs agent decision loop every 5-10 seconds.

**File to create:** `agent-service/src/loop.ts`

**Logic Flow:**
```typescript
async function agentDecisionLoop() {
  while (true) {
    // 1. Get all active agents from DB
    const agents = await supabase
      .from('agents')
      .select('*')
      .eq('active', true);

    for (const agent of agents) {
      try {
        // 2. Get agent's current pool balance
        const balance = await getPoolBalance(agent.owner);

        if (balance < MIN_BET_AMOUNT) continue;

        // 3. Get game state
        const gameState = {
          balance,
          recentBets: await getRecentBets(agent.id),
          currentStreak: calculateStreak(agent.id),
        };

        // 4. Call Gemini API for decision
        const decision = await callGemini(agent, gameState);

        // 5. Execute decision (place bet via contract)
        if (decision.action === 'bet') {
          await placeBet(agent, decision);
        }

        // 6. Log decision to DB
        await logDecision(agent.id, decision);

        // 7. Broadcast to spectator feed
        await broadcastActivity(agent.id, decision);

      } catch (error) {
        console.error(`Agent ${agent.id} error:`, error);
      }
    }

    // Wait 5-10 seconds
    await sleep(randomBetween(5000, 10000));
  }
}
```

**Gemini Prompt Template:**
```typescript
const prompt = `You are an AI betting agent with the following personality:
- Risk Tolerance: ${agent.stats.riskTolerance}/10
- Aggression: ${agent.stats.aggression}/10
- Analytical: ${agent.stats.analytical}/10
- Patience: ${agent.stats.patience}/10
- Unpredictability: ${agent.stats.unpredictability}/10
- Herd Mentality: ${agent.stats.herdMentality}/10
- Humor: ${agent.stats.humor}/10

Current balance: ${gameState.balance} MON
Recent results: ${gameState.recentBets}

Available games: Mines, Plinko, CoinFlip, Dice

Decide your next action. Respond in JSON:
{
  "action": "bet" | "wait",
  "game": "mines" | "plinko" | "coinflip" | "dice",
  "betAmount": number,
  "gameParams": {...},
  "reasoning": "why you made this decision"
}`;
```

**Rate Limiting:**
- User-provided API keys: 15 RPM per key
- Max 5 concurrent agents = 3 RPM per agent = safe
- Add exponential backoff on rate limit errors

**Acceptance:**
- [ ] Loop runs continuously
- [ ] Agents make decisions every 5-10s
- [ ] Decisions appear in spectator feed
- [ ] Contract transactions succeed
- [ ] Rate limiting handled gracefully

---

#### Task 17: End-to-End Testing ❌
**What to do:**
Full E2E test: signup → create agent → deposit → agent plays → spectator sees.

**File to create:** `e2e/full-flow.spec.ts`

**Test Flow:**
```typescript
import { test, expect } from '@playwright/test';

test('full agent lifecycle', async ({ page }) => {
  // 1. Connect wallet
  await page.goto('http://localhost:3000');
  await page.click('button:has-text("Connect Wallet")');
  // ... wallet connection flow

  // 2. Create agent
  await page.goto('/agent/create');
  await page.fill('input[name="name"]', 'E2E Test Bot');
  
  // Set stats to sum to 35
  await page.locator('input[type="range"]').nth(0).fill('5');
  await page.locator('input[type="range"]').nth(1).fill('5');
  // ... set all 7 stats
  
  await page.fill('input[type="password"]', process.env.GEMINI_API_KEY);
  await page.click('button:has-text("Create Agent")');
  
  // Wait for transaction
  await page.waitForURL(/\/agent\/\d+/, { timeout: 30000 });
  
  // 3. Deposit MON
  await page.goto('/stake');
  await page.fill('input[name="amount"]', '0.5');
  await page.click('button:has-text("Deposit")');
  await page.waitForSelector('text=Deposit successful');
  
  // 4. Wait for agent to play
  await page.waitForTimeout(60000); // 1 minute
  
  // 5. Check agent profile
  await page.goto('/agent/1');
  const totalBets = await page.locator('text=/Total Bets: \\d+/').textContent();
  expect(totalBets).toContain('Total Bets:');
  
  // 6. Check spectator feed
  await page.goto('/spectator');
  await page.waitForSelector('text=E2E Test Bot');
  
  // 7. Check leaderboard
  await page.goto('/leaderboard');
  await page.waitForSelector('text=E2E Test Bot');
});
```

**Acceptance:**
- [ ] E2E test passes
- [ ] Agent plays at least 5 rounds
- [ ] Spectator sees all bets
- [ ] Leaderboard updates correctly
- [ ] No console errors

---

## 🎨 Design System & Patterns

### Color Palette (from `app/globals.css`)
```css
:root {
  --neon-green: #00FF88;
  --error: #FF0044;
  --warning: #FFAA00;
}
```

### Typography
- **Font:** JetBrains Mono (monospace)
- **Sizes:**
  - Labels: `text-[10px] font-mono text-gray-500 uppercase`
  - Body: `text-sm font-mono`
  - Headings: `text-2xl md:text-3xl font-black font-mono italic`

### Component Patterns

**Button (from `components/ui/Button.tsx`):**
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
<Button variant="danger">Destructive</Button>
```

**Panel Layout:**
```tsx
<div className="border border-white/[0.12] bg-white/[0.04] p-6 space-y-4">
  <div className="text-[10px] font-mono text-gray-500 uppercase">Panel ID</div>
  <h2 className="text-lg font-mono font-bold text-white uppercase">Title</h2>
  {/* Content */}
</div>
```

**Page Structure:**
```tsx
<div className="flex min-h-screen flex-col bg-black">
  <Header />
  <main className="flex-1 p-6 space-y-6 page-enter overflow-auto">
    {/* Page content */}
  </main>
</div>
```

---

## 📂 Key File Locations

### Smart Contracts
```
contracts/
├── src/
│   ├── VRFSpike.sol (87 lines)
│   ├── AgentPool.sol (141 lines)
│   ├── AgentRegistry.sol (160 lines)
│   ├── CoinFlipGame.sol (155 lines)
│   ├── DiceGame.sol (192 lines)
│   ├── MinesGame.sol (270 lines)
│   ├── PlinkoGame.sol (690 lines)
│   └── interfaces/
│       ├── IEntropyV2.sol
│       └── IAgentPool.sol
└── test/
    ├── AgentPool.t.sol (22 tests)
    ├── AgentRegistry.t.sol (9 tests)
    ├── CoinFlip.test.sol (10 tests)
    ├── DiceGame.t.sol (9 tests)
    ├── MinesGame.t.sol (16 tests)
    └── PlinkoGame.t.sol (13 tests)
```

### Agent Service
```
agent-service/
├── src/
│   ├── index.ts - Express server
│   ├── gemini.ts - Gemini API client
│   ├── types.ts - TypeScript interfaces
│   └── prompt.ts - Decision prompt
├── test/
│   └── gemini.test.ts
└── package.json
```

### Supabase
```
supabase/
├── migrations/
│   ├── 001_users.sql
│   ├── 002_agents.sql
│   ├── 003_bets.sql
│   ├── 004_chat_messages.sql
│   ├── 005_rls_policies.sql
│   └── 006_realtime.sql
├── README.md
├── SETUP.md
└── VERIFICATION.md
```

### Frontend (Existing)
```
app/
├── globals.css - Theme definitions
├── stake/page.tsx - Reference layout
├── dashboard/page.tsx - Reference patterns
└── history/page.tsx - Table patterns

components/ui/
├── Button.tsx
├── Input.tsx
├── Card.tsx
├── Header.tsx
└── Sidebar.tsx

hooks/
└── useWallet.ts - Wallet connection
```

### Frontend (To Create)
```
app/agent/
├── create/page.tsx - Task 11
└── [id]/page.tsx - Task 12

app/
├── spectator/page.tsx - Task 13
└── leaderboard/page.tsx - Task 14

hooks/
├── useAgentPool.ts - Task 15
├── useAgentRegistry.ts - Task 15
├── useCoinFlip.ts - Task 15
├── useDice.ts - Task 15
├── useMines.ts - Task 15
└── usePlinko.ts - Task 15

lib/contracts/
├── AgentPool.json - Task 15
├── AgentRegistry.json - Task 15
├── CoinFlipGame.json - Task 15
├── DiceGame.json - Task 15
├── MinesGame.json - Task 15
└── PlinkoGame.json - Task 15

agent-service/src/
└── loop.ts - Task 16

e2e/
└── full-flow.spec.ts - Task 17
```

---

## 🔑 Critical Data Structures

### Agent Stats (7 stats, 35-point budget)
```typescript
interface AgentStats {
  riskTolerance: number;    // 1-10: Higher = bigger bets
  aggression: number;       // 1-10: Higher = more frequent bets
  analytical: number;       // 1-10: Higher = better EV calculation
  patience: number;         // 1-10: Higher = long-term focus
  unpredictability: number; // 1-10: Higher = unexpected plays
  herdMentality: number;    // 1-10: Higher = follows other agents
  humor: number;            // 1-10: Higher = funny commentary
}
// MUST sum to exactly 35 (validated on-chain and frontend)
```

### Contract Interfaces

**AgentRegistry.registerAgent():**
```solidity
function registerAgent(
  string memory name,
  Stats memory stats  // (uint8,uint8,uint8,uint8,uint8,uint8,uint8)
) public returns (uint256 agentId);
```

**AgentPool.deposit():**
```solidity
function deposit() public payable;

function requestWithdraw(uint256 amount) public;

function withdraw() public;

function getBalance(address user) public view returns (uint256);
```

**Game Contracts (all similar pattern):**
```solidity
function placeBet(
  uint256 agentId,
  // game-specific params
  uint256 betAmount
) public payable returns (uint64 sequenceNumber);
```

---

## 🧪 Verification Commands

### Smart Contracts
```bash
cd contracts

# Run all tests
forge test
# Expected: 81/81 passing

# Run specific test file
forge test --match-contract AgentPoolTest -vvv

# Build contracts
forge build
# Expected: Compiler run successful

# Deploy to Monad testnet (when ready)
forge script script/Deploy.s.sol --rpc-url $MONAD_RPC_URL --broadcast
```

### Frontend
```bash
# Build Next.js app
bun run build
# Expected: ✓ Compiled successfully

# Run linter
bun run lint
# Expected: No errors (warnings OK)

# Run dev server
bun run dev
# Navigate to http://localhost:3000
```

### Agent Service
```bash
cd agent-service

# Run tests
bun test

# Start service
bun run start
```

### E2E Tests
```bash
# Run Playwright tests
bun test:e2e
```

---

## 🚨 Known Issues & Gotchas

### 1. Task Delegation System
**Issue:** Subagents report completion but don't create files  
**Workaround:** Use direct file creation with Write tool

### 2. VRF Callback Pattern
**Critical:** Never revert in entropyCallback()
```solidity
function entropyCallback(uint64 sequenceNumber, address, bytes32 randomNumber) 
  internal override 
{
  try this._handleCallback(sequenceNumber, randomNumber) {} 
  catch {}
}
```

### 3. Random Number Mapping (DiceGame)
**Bug:** Needs `-1` before modulo for correct test mapping
```solidity
uint256 roll = ((uint256(randomNumber) - 1) % 100) + 1;
```

### 4. Multiplier Calculation (MinesGame)
**Bug:** Calculate multiplier BEFORE incrementing revealedCount
```solidity
// CORRECT:
uint256 newMultiplier = currentMultiplier * GRID_SIZE * 98 / (remainingSafeTiles * 100);
game.revealedCount++;

// WRONG:
game.revealedCount++;
uint256 newMultiplier = ... // Uses wrong remainingSafeTiles
```

### 5. Supabase RLS Policies
**Pattern:** Separate policies for SELECT (public) and INSERT (owned)
```sql
CREATE POLICY agents_view_all ON agents FOR SELECT USING (true);
CREATE POLICY agents_insert_own ON agents FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🌐 External Resources

### Documentation
- **Monad Docs:** https://docs.monad.xyz
- **Monad Foundry Guide:** https://docs.monad.xyz/developers/tools/foundry
- **Pyth Entropy Docs:** https://docs.pyth.network/entropy/evm
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **Supabase Realtime:** https://supabase.com/docs/guides/realtime

### Network Info
- **Chain ID:** 10143
- **RPC:** https://testnet-rpc.monad.xyz
- **Explorer:** https://testnet.monadvision.com
- **Faucet:** https://faucet.monad.xyz (0.1 MON / 6 hours)
- **Pyth Entropy:** 0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320

### API Specs
- **Gemini 2.0 Flash:** $0.075/1M input, $0.30/1M output
- **Free Tier:** 15 RPM, 1,500 RPD
- **Temperature:** 0.1 (for consistent decisions)

---

## 📝 Notepad & Plan Files

### Notepad (Accumulated Learnings)
Location: `.sisyphus/notepads/ai-agent-betting/`

Files:
- `learnings.md` - Patterns, conventions, successful approaches (~1000+ lines)
- `issues.md` - Problems, blockers, gotchas
- `decisions.md` - Architectural choices
- `problems.md` - Unresolved issues

**Key Learnings:**
- VRF callback pattern with try/catch
- MockEntropy pattern for tests
- Multiplier calculation timing
- Random number mapping techniques
- Supabase RLS patterns
- Design system conventions

### Plan File (READ ONLY)
Location: `.sisyphus/plans/ai-agent-betting.md`

**DO NOT MODIFY THIS FILE**
- Only the orchestrator updates checkboxes
- Read for task definitions and acceptance criteria
- Refer to dependencies and parallelization info

---

## 🎯 Recommended Approach for New Session

### Strategy 1: Sequential Implementation (Safest)
1. Task 11: Agent Creation UI
2. Task 12: Agent Profile Page
3. Task 13: Spectator Feed
4. Task 14: Leaderboard
5. Task 15: Wire Contracts
6. Task 16: Agent Decision Loop
7. Task 17: E2E Testing

**Pros:** Clear dependencies, easy verification  
**Cons:** Slower (no parallelization)

### Strategy 2: Parallel Waves (Faster)
**Wave 3 (Parallel):**
- Task 11, 12, 13, 14 simultaneously

**Wave 4 (Sequential):**
- Task 15 → Task 16 → Task 17

**Pros:** Faster completion  
**Cons:** More complex verification

### Strategy 3: Direct Implementation (Fastest)
Skip task delegation, create files directly using Write tool.

**Pros:** Bypasses delegation issues, fastest  
**Cons:** Less systematic tracking

---

## ✅ Success Criteria

### Minimum Viable Demo
- [ ] User can create agent with 35-point stats
- [ ] Agent appears in database
- [ ] User can deposit MON to pool
- [ ] Agent makes at least 1 autonomous bet
- [ ] Bet appears in spectator feed
- [ ] Agent appears on leaderboard

### Full Feature Set
- [ ] All 4 frontend pages functional
- [ ] All 4 games playable
- [ ] Real-time spectator feed updates
- [ ] Chat works in spectator mode
- [ ] Leaderboard sortable
- [ ] Agent decision loop runs continuously
- [ ] E2E test passes

### Quality Gates
- [ ] `forge test` - 81/81 passing
- [ ] `bun run build` - succeeds
- [ ] `bun run lint` - no errors
- [ ] `bun test:e2e` - all tests pass
- [ ] Manual smoke test - full user flow works

---

## 📞 Next Steps

1. **Review this document** to understand current state
2. **Choose an approach** (sequential/parallel/direct)
3. **Start with Task 11** (Agent Creation UI)
4. **Verify each task** before moving to next
5. **Update plan file** as tasks complete (orchestrator only)
6. **Commit frequently** with atomic units
7. **Test integration** at Task 15
8. **Run E2E** at Task 17

---

## 🏁 Final Notes

**What's Working:**
- ✅ All smart contracts tested and compiled
- ✅ VRF integration validated on testnet
- ✅ Agent service structure in place
- ✅ Supabase schema designed
- ✅ Frontend theme and components ready

**What's Needed:**
- ❌ 4 frontend pages (Tasks 11-14)
- ❌ Contract deployment to testnet
- ❌ Frontend-to-contract wiring (Task 15)
- ❌ Agent decision loop (Task 16)
- ❌ E2E testing (Task 17)

**Time Estimate:**
- Frontend pages: ~2-3 hours
- Contract wiring: ~1 hour
- Decision loop: ~1-2 hours
- E2E testing: ~1 hour
- **Total: 5-7 hours of focused work**

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-08  
**Status:** Ready for handoff to new session
