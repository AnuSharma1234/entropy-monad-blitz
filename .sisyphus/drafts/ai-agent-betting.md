# Draft: AI Agent Betting Platform on Monad

## Requirements (confirmed from user)

- **Core Concept**: NOT human gambling → AI Agents betting on behalf of users
- **Chain**: Monad Testnet ONLY (hard restriction)
- **AI Provider**: Gemini API ONLY
- **Reference**: moltbook.com (Reddit-style AI agent environment, but for betting)
- **Frontend**: Use existing cyber/neon theme from current codebase

## User-Stated Requirements

1. **User Signup Flow**:
   - User creates account
   - User customizes AI agent characteristics (risk-taking, conservativeness, humor, etc.)
   - Characteristics must be BALANCED (no always-win settings)
   - Settings editable post-signup

2. **Staking**:
   - User stakes MON tokens
   - Agent plays autonomously using staked funds

3. **Spectator Mode**:
   - Humans can watch agents playing and placing bets
   - Real-time visibility into agent decisions

4. **Agent Profiles**:
   - Each agent has a profile page
   - Display winning stats and other metrics

## Key Architecture Pivot (vs Original Entropy V1)

| Original Entropy V1 | New AI Agent Platform |
|---------------------|----------------------|
| Human makes bet decisions | AI agent makes decisions |
| Games: Mines, Plinko, Dice, etc. | Games TBD (same or different?) |
| Sidebets via Telegram | Agent-to-agent betting? |
| Human staking for yield | Human stakes → agent plays |
| User plays directly | User watches agent play |

## From PDF (Entropy V1 Architecture)

- **SidebetFactory** → deploys per-market contracts
- **Oracle**: Chainlink Any-API for outcome verification
- **Telegram Bot**: `/sidebet` commands, deep links
- **Gasless UX**: AA + Paymaster option
- **Chat on market pages**: Firebase/WebSocket
- **Games**: Mines, Plinko, CoinFlip, Dice, Crash, Wheel

## Interview Decisions (Round 7 - Final Model)

### Betting Model - CHANGED from original
- **DROP yield-funded model** - too complex for hackathon
- **Direct pool betting**: User deposits MON, agent bets directly from pool
- **Principal at risk**: Acceptable for testnet demo
- **Testnet tokens only**: No real money involved

### Concurrent Agents
- **5 agents max** for MVP
- Each user provides own Gemini API key
- Rate limits distributed per-user

### Decision Frequency
- **Keep 5-10 seconds** - user prefers more action
- Small bets (0.001-0.01 MON) to extend funds

## Interview Decisions (Round 6 - Metis Gaps Resolved)

### Gemini API
- **Tier**: FREE tier (hackathon project, no budget)
- **User provides API key**: User enters their own Gemini API key at signup
- **Key validation**: Test API key at signup to ensure it works
- **Per-user keys**: Each agent uses its owner's API key (distributes rate limits)
- **Implication**: Each user's agent is limited to ~15 RPM (their own quota)

### Transaction Custody
- **Model**: Pool Contract
- User deposits MON into pool contract
- Server calls `placeBet()` which pulls from pool
- User retains withdrawal rights (24h cooldown)

### Betting Economics
- **NO mock yield** - use actual MON tokens for betting
- **Real betting with small amounts** - acceptable for testnet
- **Budget constraint**: Stay under 5 MON total usage for testing
- **Implication**: Very small bets (e.g., 0.001-0.01 MON per bet)

### Pyth Entropy Address FIX
- **WRONG** (in original draft): `0x2880aB155794e7179c9eE2e38200202908C17B43` (this is Price Feeds)
- **CORRECT**: `0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320` (actual Entropy VRF)

### wagmi Config FIX
- **WRONG** (in current code): `rpc-devnet.monadinfra.com`
- **CORRECT**: `https://testnet-rpc.monad.xyz`

## Interview Decisions (Round 5 - Final)

### Agent Backend Architecture
- **Centralized server** runs all agents
- Server calls Gemini API on behalf of all agents
- Simpler, cheaper, faster to build

### Agent Decision Frequency
- **Every 5-10 seconds** - fast-paced, more action
- Agent continuously evaluates and makes decisions

### House Edge
- **2% house edge** - industry standard
- Applied to all casino games

### Stat Edit Cooldown
- **24 hour cooldown** when editing agent stats
- Prevents gaming the system

### Test Strategy
- **TDD (test-driven development)**
- Write tests first, implement to pass

## Interview Decisions (Round 4)

### Agent Naming
- **User-chosen name** - users pick their own agent name

### Agent Avatar
- **Auto-generated** based on agent stats
- Colors/style reflect personality (e.g., red for aggressive, blue for analytical)

### Agent Persistence
- **Persistent + Editable**
- Stats can be changed later (with cooldown or fee to prevent gaming)

### Withdrawal Lock
- **24-hour cooldown** before withdrawing staked MON
- Agent stops playing when withdrawal initiated

### Yield Source (Testnet)
- **Mock yield** for testnet
- Simulated ~13% APR (matching Monad native staking)
- For mainnet: switch to real Monad staking precompile

## Interview Decisions (Round 3)

### MVP Games
- **ALL 4 games for MVP**: Mines, Plinko, CoinFlip, Dice
- (User selected all 4, expanding MVP scope slightly)

### Points Budget
- **35 points** total for 7 stats
- Average: 5 per stat
- Allows 3-4 stats at high level, others must sacrifice

### Authentication
- **Wallet-only** (MetaMask, WalletConnect)
- Wallet address = user identity
- Simple, no email/password

### VRF Provider
- **Pyth Entropy** - fastest, cheapest on Monad
- Proven by APT Casino on Monad
- Testnet contract: `0x2880aB155794e7179c9eE2e38200202908C17B43`

### Spectator Chat
- **Supabase Realtime** - free tier, fast setup
- Real-time pub/sub for chat messages

## Interview Decisions (Round 2)

### Agent Characteristics (7 stats, points-budget system)
All stats are 1-10 scale. Users get a fixed points budget (e.g., 35 points) to distribute.

1. **Risk Tolerance** - Higher = bigger bets, lower = smaller safer bets
2. **Aggression** - Higher = more frequent bets, lower = waits for better odds
3. **Analytical** - Higher = better EV calculation, lower = emotional decisions
4. **Patience** - Higher = long-term gains, lower = chases quick wins
5. **Unpredictability** - Higher = unexpected plays, lower = predictable strategy
6. **Herd Mentality** - Higher = follows successful agents, lower = independent
7. **Humor** - Higher = funny commentary, lower = all business

**Balance Mechanism**: Can't max everything due to fixed budget.

### Agent-vs-Agent Mechanics
- **Type**: Head-to-head challenges
- **How it works**: Both agents play same game, bet on who gets higher score
- **Winner**: Takes the combined pool

### Spectator Features (ALL selected)
- ✅ Live activity feed (real-time bet updates)
- ✅ Spectator chat (Twitch-style)
- ✅ Global leaderboards (profit, win rate rankings)
- ✅ Agent profiles with stats
- ✅ Agent decision commentary (AI explains its reasoning)

### Funding Model
- **Type**: Yield-funded (principal protected)
- User stakes MON → earns yield → yield funds agent betting
- Principal remains safe

### Scope
- **MVP (Phase 1)**: 1-2 casino games, basic agent config, agent profiles, spectator feed
- **Phase 2+**: All 6 games, Agent-vs-Agent (head-to-head), advanced features

## Interview Decisions (Round 1)

### Betting Activities
- **Casino Games**: YES - All 6 (Mines, Plinko, CoinFlip, Dice, Crash, Wheel)
- **Agent-vs-Agent**: YES - Agents can bet against each other
- **Model**: HYBRID - Agents play house games AND bet against other agents

### Agent Balance System
- **Type**: Stat Tradeoffs (points-based)
- **Concept**: Higher risk tolerance = lower accuracy, high aggression = higher variance
- **Total points**: Fixed budget - can't max everything
- **Fair-play**: No always-win configuration possible due to tradeoffs

### Agent Autonomy
- **Level**: Fully autonomous
- **Frequency**: Continuous decisions based on opportunities
- **User control**: Budget limits only (staked amount)

### Features NOT Carried Over (explicitly excluded)
- ~~Telegram bot integration~~ - NOT relevant to pivoted project

### Features TBD (need confirmation)
- Yield-funded model?
- Sidebets/prediction markets?
- Gasless AA?
- Chat on market pages?
- Provably fair (Pyth VRF)?

## Open Questions (Need Clarification)

### 1. GAMES - What do agents play?
- Same 6 games from Entropy V1? (Mines, Plinko, CoinFlip, Dice, Crash, Wheel)
- Or different games designed for agent-vs-agent?
- Or agents bet on sidebets/prediction markets?

### 2. AGENT CHARACTERISTICS - Balance System
- User mentioned "intertwined" stats to prevent always-win settings
- Need to define the characteristic system
- How do characteristics affect betting behavior?

### 3. AGENT AUTONOMY - Decision Making
- How often do agents make decisions?
- Continuous play? Scheduled? On-demand?
- Budget limits per session/day?

### 4. SPECTATOR MODE - Real-time Updates
- Just view past bets? Or live betting stream?
- WebSocket for real-time? Or polling?

### 5. SCOPE
- Is Telegram bot still needed?
- Are sidebets (prediction markets) still part of this?
- What about the yield-funded model from original Entropy?

## Technical Decisions (from original Entropy V1 draft)

- **VRF**: Pyth Entropy (fastest, cheapest on Monad)
- **Contract Framework**: Foundry
- **Network**: Monad Testnet (Chain ID 10143)
- **Staking Model**: LP Token Pool
- **Betting Token**: MON only

## Research Completed

### Monad Chain (from bg_65bf518b)
- **Testnet**: Chain ID 10143, RPC: https://testnet-rpc.monad.xyz
- **Performance**: 10,000 TPS, 400ms blocks, 800ms finality
- **Staking Precompile**: `0x0000000000000000000000000000000000001000`
  - `delegate(validatorId)` - stake MON to validator
  - `undelegate()`, `withdraw()`, `claimRewards()`, `compound()`
  - Staking APR: ~13%
- **Dev Tools**: Foundry >= 1.5.1, Viem >= 2.40.0, Hardhat compatible
- **Faucet**: https://faucet.monad.xyz (0.1 MON / 6 hours)
- **Key Advantage**: Low gas = micro-betting viable, fast finality = instant settlement

### moltbook.com Architecture (from bg_ade69c45)
- **Tech Stack**: Next.js + Turbopack + Tailwind + React (likely Vercel)
- **Agent Interaction Model**:
  - Agents are first-class "users" - can post, comment, upvote
  - Reddit-style: Posts, Submolts (like subreddits), Pairings (agent+human)
  - Agents authenticate with Moltbook identity
- **Agent Customization**: Via `/skill.md` file - manifest describing agent persona/interface
- **Signup Flow (3-step)**:
  1. Owner sends skill.md to agent
  2. Agent signs up → produces claim link
  3. Owner tweets to verify ownership (social proof)
- **Key Endpoints**:
  - `/skill.md` - agent configuration
  - `/u` - agents listing
  - `/m` - submolts listing
  - `/developers/apply` - developer API access

### Gemini API (from bg_653427f7)
- **Recommended Model**: Gemini 2.0 Flash (GA Feb 2026)
  - 1M token context window
  - 2x faster output, 66% reduced latency
  - Built-in tool use / function calling
  - Native multimodal generation
- **Alternative**: Gemini 2.0 Flash-Lite (50% cheaper, for simple tasks)
- **Agent Pattern**: LLM loop with tools - model decides when to call tools
- **Rate Limits**: Free tier = 15 RPM, 1,500 RPD. Paid tier = 300 RPM, 10K+ RPD
- **Pricing** (per 1M tokens):
  - 2.0 Flash: $0.075 input, $0.30 output
  - Flash-Lite: $0.0375 input, $0.15 output
  - Context caching: 50% discount on cached tokens
- **Function Calling**: Define tools as JSON schemas, model returns structured `function_call`
- **Best Practices for Betting Agents**:
  - Low temperature (0.1-0.2) for consistent decisions
  - Define hard limits in system instructions
  - Validate ALL function calls before execution
  - Use structured JSON output mode
  - Implement circuit breakers and logging

## Scope Boundaries (FINAL)

### INCLUDE (MVP)
1. **4 games**: Mines, Plinko, CoinFlip, Dice (on-chain with Pyth VRF)
2. **Agent creation**: 7 stats with 35-point budget, user-chosen name, auto-generated avatar
3. **Agent autonomous play**: Gemini 2.0 Flash, 5-10s decisions, centralized server
4. **User API key**: User provides own Gemini API key at signup (validates on entry)
5. **Pool contract**: Deposit MON, direct betting from pool, 24h withdrawal cooldown
6. **Wallet auth**: MetaMask/WalletConnect only
7. **Pyth Entropy VRF**: Provably fair outcomes
8. **Spectator features**: Live feed, Supabase chat, leaderboards, agent profiles, decision commentary
9. **Agent persistence**: Editable stats with 24h cooldown
10. **5 concurrent agents** max
11. **TDD**: Test-driven development

### EXCLUDE (MVP)
- ~~Yield-funded model~~ → Direct pool betting instead
- ~~Agent-vs-Agent~~ → Phase 2
- ~~Crash, Wheel games~~ → Phase 2
- ~~Telegram bot~~ → Not relevant
- ~~Gasless/AA~~ → Out of scope
- ~~Multi-token~~ → MON only
- ~~Prediction markets/sidebets~~ → Legacy V1

## Technical Decisions (FINAL)
