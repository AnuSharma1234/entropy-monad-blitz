# AI Agent Betting Platform on Monad

## TL;DR

> **Quick Summary**: Build a platform where AI agents (powered by Gemini) bet autonomously on casino games (Mines, Plinko, CoinFlip, Dice) on behalf of users. Users customize agent personality traits, stake MON tokens, and watch their agents play in real-time.
> 
> **Deliverables**:
> - Smart contracts: 4 game contracts + staking pool + agent registry (Foundry/Solidity)
> - Agent service: Gemini-powered decision engine (Node.js/TypeScript)
> - Frontend: Agent creation, profiles, spectator mode, leaderboards (Next.js)
> - Infrastructure: Supabase for chat + agent state, Pyth Entropy for VRF
> 
> **Estimated Effort**: Large (1-2 weeks)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Phase 0 (VRF Spike) → Contracts → Agent Service → Frontend → Integration

---

## Context

### Original Request
Build an AI Agent betting platform inspired by moltbook.com where AI agents bet on behalf of users instead of humans gambling directly. Agents should have customizable personality traits, play casino games autonomously, and users can spectate.

### Interview Summary
**Key Decisions**:
- **Pivot from Entropy V1**: Dropped yield-funded model, Telegram bot, sidebets
- **Games**: 4 for MVP (Mines, Plinko, CoinFlip, Dice)
- **Agent Traits**: 7 stats (Risk, Aggression, Analytical, Patience, Unpredictability, Herd, Humor) with 35-point budget
- **AI Provider**: Gemini 2.0 Flash (user provides own API key)
- **Chain**: Monad Testnet only (Chain ID 10143)
- **Betting**: Direct from pool (no yield model)
- **Scale**: 5 concurrent agents max

**Research Findings**:
- Monad: 400ms blocks, 10K TPS, sub-cent gas
- Pyth Entropy VRF at `0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320`
- Gemini free tier: 15 RPM per API key (user keys distribute load)
- Existing frontend has cyber/neon theme ready to extend

### Metis Review
**Identified Gaps** (addressed):
- Pyth Entropy address corrected (was using Price Feeds address)
- wagmi RPC URL needs update to testnet
- Yield model dropped in favor of direct pool betting
- User-provided API keys for Gemini (no backend costs)
- Agent decision frequency kept at 5-10s per user preference

---

## Work Objectives

### Core Objective
Build a hackathon-ready demo where AI agents autonomously bet on casino games on Monad testnet, with spectator mode for users to watch.

### Concrete Deliverables
1. `contracts/` - Foundry project with 4 game contracts + pool + registry
2. `agent-service/` - Node.js service for Gemini-powered agent decisions
3. `app/agent/` - Agent creation and profile pages
4. `app/spectator/` - Live spectator feed with chat
5. `app/leaderboard/` - Global agent rankings
6. Updated `config/wagmi.ts` - Fixed Monad testnet RPC

### Definition of Done
- [ ] Agent can be created with custom stats (sum=35 validated)
- [ ] Agent places bets autonomously every 5-10 seconds
- [ ] Game outcomes resolved via Pyth Entropy VRF on-chain
- [ ] Spectator feed shows live agent activity
- [ ] Leaderboard displays agent rankings by profit
- [ ] All tests pass (`bun test`, `forge test`)
- [ ] Deployed to Monad testnet

### Must Have
- 4 working games with on-chain VRF
- Agent trait system (7 stats, 35-point budget)
- User-provided Gemini API key (validated at signup)
- Pool contract (deposit/withdraw with 24h cooldown)
- Spectator live feed
- Agent profiles with stats display
- 2% house edge on all games

### Must NOT Have (Guardrails)
- ~~Agent-vs-Agent~~ - Phase 2
- ~~Crash/Wheel games~~ - Phase 2
- ~~Yield-funded model~~ - Dropped, use direct betting
- ~~Telegram bot~~ - Not relevant to pivot
- ~~Gasless/AA/Paymaster~~ - Out of scope
- ~~Factory pattern for games~~ - 1 contract per game, simple
- ~~Custom WebSocket server~~ - Use Supabase Realtime
- ~~New UI component library~~ - Extend existing components
- ~~GraphQL/BFF patterns~~ - Direct API routes

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks MUST be verifiable by running commands or using automated tools.

### Test Decision
- **Infrastructure exists**: NO (need to set up)
- **Automated tests**: YES (TDD)
- **Framework**: `bun test` for TypeScript, `forge test` for Solidity

### Test Setup Task
- [ ] 0.1 Install bun test framework
- [ ] 0.2 Install Foundry and configure for Monad

### Agent-Executed QA Scenarios (MANDATORY)

**Verification Tool by Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| Smart Contracts | Bash (forge test, cast) | Deploy, call functions, assert events |
| Agent Service | Bash (curl, bun test) | API endpoints, JSON responses |
| Frontend | Playwright | Navigate, interact, assert DOM |
| Integration | Playwright + Bash | Full flow end-to-end |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 (Foundation - BLOCKING):
└── Task 1: VRF Spike (validate Pyth Entropy works on Monad)
└── Task 2: Fix wagmi config + Foundry setup

Wave 1 (Contracts - After Wave 0):
├── Task 3: Pool Contract
├── Task 4: Agent Registry Contract
├── Task 5: CoinFlip Game Contract
└── Task 6: Dice Game Contract

Wave 2 (After Wave 1):
├── Task 7: Mines Game Contract
├── Task 8: Plinko Game Contract
├── Task 9: Agent Service Setup
└── Task 10: Supabase Setup

Wave 3 (Frontend - After Wave 2):
├── Task 11: Agent Creation UI
├── Task 12: Agent Profile Page
├── Task 13: Spectator Feed
└── Task 14: Leaderboard

Wave 4 (Integration - After Wave 3):
├── Task 15: Wire Frontend to Contracts
├── Task 16: Agent Decision Loop
└── Task 17: End-to-End Testing
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3-8 | 2 |
| 2 | None | 3-17 | 1 |
| 3 | 1, 2 | 15 | 4, 5, 6 |
| 4 | 1, 2 | 15 | 3, 5, 6 |
| 5 | 1, 2 | 15 | 3, 4, 6 |
| 6 | 1, 2 | 15 | 3, 4, 5 |
| 7 | 1, 2 | 15 | 8, 9, 10 |
| 8 | 1, 2 | 15 | 7, 9, 10 |
| 9 | 2 | 16 | 7, 8, 10 |
| 10 | 2 | 13, 16 | 7, 8, 9 |
| 11 | 4 | 15 | 12, 13, 14 |
| 12 | 4 | 17 | 11, 13, 14 |
| 13 | 10 | 17 | 11, 12, 14 |
| 14 | 4 | 17 | 11, 12, 13 |
| 15 | 3-8, 11 | 17 | 16 |
| 16 | 9, 10, 15 | 17 | None |
| 17 | 15, 16 | None | None |

---

## TODOs

### Phase 0: Foundation (BLOCKING)

- [x] 1. VRF Spike - Validate Pyth Entropy on Monad Testnet

  **What to do**:
  - Create minimal Foundry project
  - Implement simple consumer contract that requests random number
  - Deploy to Monad testnet
  - Call request function, wait for callback
  - Verify random number is delivered

  **Must NOT do**:
  - Build full game logic
  - Add any business logic beyond VRF test

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - Simple spike, just needs Foundry knowledge

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0 (with Task 2)
  - **Blocks**: Tasks 3-8
  - **Blocked By**: None

  **References**:
  - `https://docs.pyth.network/entropy/evm` - Pyth Entropy EVM guide
  - `0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320` - Entropy address on Monad testnet
  - `https://testnet-rpc.monad.xyz` - Monad testnet RPC

  **Acceptance Criteria**:
  - [ ] `forge build` succeeds
  - [ ] Contract deployed to Monad testnet (address stored in .env)
  - [ ] `cast send $VRF_TEST "requestRandom()"` emits RequestCreated event
  - [ ] Callback received within 30 seconds
  - [ ] Random number logged in contract event

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: VRF request and callback on Monad testnet
    Tool: Bash (forge, cast)
    Preconditions: Foundry installed, deployer wallet funded with testnet MON
    Steps:
      1. forge create src/VRFSpike.sol:VRFSpike --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY
      2. Extract deployed address from output
      3. cast send $DEPLOYED_ADDRESS "requestRandom()" --rpc-url https://testnet-rpc.monad.xyz --private-key $PRIVATE_KEY --value 0.001ether
      4. Wait 30 seconds
      5. cast logs --from-block latest-100 --to-block latest --address $DEPLOYED_ADDRESS --rpc-url https://testnet-rpc.monad.xyz
      6. Assert: RandomReceived event present with non-zero randomNumber
    Expected Result: VRF callback received, random number logged
    Evidence: Transaction hash and event logs captured
  ```

  **Commit**: YES
  - Message: `feat(contracts): validate Pyth Entropy VRF on Monad testnet`
  - Files: `contracts/src/VRFSpike.sol`, `contracts/script/DeploySpike.s.sol`
  - Pre-commit: `forge build && forge test`

---

- [x] 2. Fix wagmi Config + Foundry Setup

  **What to do**:
  - Update `config/wagmi.ts` RPC URL from `rpc-devnet.monadinfra.com` to `https://testnet-rpc.monad.xyz`
  - Initialize Foundry project in `contracts/` directory
  - Configure `foundry.toml` for Monad testnet
  - Add `.env.example` with required variables
  - Install Pyth Entropy SDK: `forge install pyth-network/pyth-sdk-solidity`
  - Install OpenZeppelin: `forge install OpenZeppelin/openzeppelin-contracts`

  **Must NOT do**:
  - Build any game contracts yet
  - Modify existing frontend components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 0 (with Task 1)
  - **Blocks**: Tasks 3-17
  - **Blocked By**: None

  **References**:
  - `config/wagmi.ts:1-50` - Current wagmi config (needs RPC fix)
  - `https://book.getfoundry.sh/` - Foundry documentation
  - `https://docs.monad.xyz/developers/tools/foundry` - Monad Foundry guide

  **Acceptance Criteria**:
  - [ ] `config/wagmi.ts` uses `https://testnet-rpc.monad.xyz` for Monad chain
  - [ ] `contracts/` directory exists with `foundry.toml`
  - [ ] `forge build` succeeds in contracts directory
  - [ ] `lib/pyth-sdk-solidity` and `lib/openzeppelin-contracts` installed
  - [ ] `.env.example` contains: `PRIVATE_KEY`, `MONAD_RPC_URL`, `PYTH_ENTROPY_ADDRESS`

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: wagmi connects to Monad testnet
    Tool: Bash (grep, bun)
    Preconditions: Project dependencies installed
    Steps:
      1. grep -r "testnet-rpc.monad.xyz" config/wagmi.ts
      2. Assert: Match found (RPC URL updated)
      3. bun run build (Next.js build)
      4. Assert: Build succeeds without chain errors
    Expected Result: wagmi configured for Monad testnet
    Evidence: grep output and build success

  Scenario: Foundry project setup
    Tool: Bash (forge)
    Preconditions: Foundry installed
    Steps:
      1. cd contracts && forge build
      2. Assert: Exit code 0
      3. ls lib/
      4. Assert: pyth-sdk-solidity and openzeppelin-contracts present
    Expected Result: Foundry project compiles
    Evidence: forge build output
  ```

  **Commit**: YES
  - Message: `chore: fix wagmi RPC URL and setup Foundry project`
  - Files: `config/wagmi.ts`, `contracts/foundry.toml`, `contracts/.env.example`
  - Pre-commit: `forge build`

---

### Phase 1: Smart Contracts

- [x] 3. Pool Contract - User Deposits and Withdrawals

  **What to do**:
  - Create `AgentPool.sol` - manages user deposits
  - Functions: `deposit()`, `requestWithdraw(amount)`, `withdraw()`, `getBalance(user)`
  - 24-hour withdrawal cooldown
  - Events: `Deposited`, `WithdrawRequested`, `Withdrawn`
  - Track per-user balances
  - Allow authorized game contracts to debit balances for bets

  **Must NOT do**:
  - Implement yield logic
  - Implement betting logic (that's in game contracts)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 4, 5, 6)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1, 2

  **References**:
  - OpenZeppelin ReentrancyGuard pattern
  - `.sisyphus/drafts/ai-agent-betting.md` - 24h cooldown decision

  **Acceptance Criteria**:
  - [ ] `forge test` passes for AgentPool
  - [ ] TDD: Test written before implementation
  - [ ] Test: deposit 1 MON → balance = 1 MON
  - [ ] Test: requestWithdraw sets unlock time = now + 24h
  - [ ] Test: withdraw before cooldown reverts with "Cooldown not expired"
  - [ ] Test: withdraw after cooldown succeeds

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Deposit and withdrawal flow
    Tool: Bash (forge test)
    Preconditions: Foundry project setup
    Steps:
      1. cd contracts && forge test --match-contract AgentPoolTest -vvv
      2. Assert: All tests pass
      3. Assert: Output shows "deposit", "requestWithdraw", "withdraw" tests
    Expected Result: Pool contract tests pass
    Evidence: Test output captured

  Scenario: Deploy and test on Monad testnet
    Tool: Bash (forge, cast)
    Preconditions: Wave 0 complete, deployer funded
    Steps:
      1. forge script script/DeployPool.s.sol --rpc-url $MONAD_RPC_URL --broadcast
      2. cast send $POOL_ADDRESS "deposit()" --value 0.1ether --rpc-url $MONAD_RPC_URL --private-key $PRIVATE_KEY
      3. cast call $POOL_ADDRESS "getBalance(address)" $WALLET_ADDRESS --rpc-url $MONAD_RPC_URL
      4. Assert: Returns 0.1 ether (100000000000000000)
    Expected Result: Deposit reflected in balance
    Evidence: cast output captured
  ```

  **Commit**: YES
  - Message: `feat(contracts): add AgentPool with deposit/withdraw and 24h cooldown`
  - Files: `contracts/src/AgentPool.sol`, `contracts/test/AgentPool.t.sol`
  - Pre-commit: `forge test`

---

- [x] 4. Agent Registry Contract

  **What to do**:
  - Create `AgentRegistry.sol` - stores agent metadata on-chain
  - Functions: `registerAgent(name, stats)`, `updateStats(agentId, stats)`, `getAgent(agentId)`
  - Validate stats sum to exactly 35
  - 24-hour cooldown on stat updates
  - Store: name, 7 stats, owner address, creation time, last update time
  - Events: `AgentRegistered`, `AgentUpdated`

  **Must NOT do**:
  - Store Gemini API keys on-chain (security risk)
  - Implement avatar generation (off-chain)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 3, 5, 6)
  - **Blocks**: Tasks 11, 12, 14, 15
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `.sisyphus/drafts/ai-agent-betting.md` - 7 stats definition

  **Acceptance Criteria**:
  - [ ] `forge test` passes for AgentRegistry
  - [ ] TDD: Tests written before implementation
  - [ ] Test: registerAgent with stats summing to 35 succeeds
  - [ ] Test: registerAgent with stats summing to 40 reverts "Stats must sum to 35"
  - [ ] Test: updateStats before 24h cooldown reverts "Cooldown not expired"
  - [ ] Test: updateStats after 24h succeeds

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Agent registration with stat validation
    Tool: Bash (forge test)
    Preconditions: Foundry project setup
    Steps:
      1. forge test --match-contract AgentRegistryTest -vvv
      2. Assert: All tests pass
      3. Assert: "Stats must sum to 35" revert tested
    Expected Result: Registry validates stat budget
    Evidence: Test output

  Scenario: Register agent on testnet
    Tool: Bash (cast)
    Preconditions: Registry deployed
    Steps:
      1. cast send $REGISTRY_ADDRESS "registerAgent(string,(uint8,uint8,uint8,uint8,uint8,uint8,uint8))" "TestBot" "(5,5,5,5,5,5,5)" --rpc-url $MONAD_RPC_URL --private-key $PRIVATE_KEY
      2. Assert: Transaction succeeds
      3. cast call $REGISTRY_ADDRESS "getAgent(uint256)" 1 --rpc-url $MONAD_RPC_URL
      4. Assert: Returns agent data with name "TestBot"
    Expected Result: Agent registered on-chain
    Evidence: Transaction hash and call output
  ```

  **Commit**: YES
  - Message: `feat(contracts): add AgentRegistry with stat validation`
  - Files: `contracts/src/AgentRegistry.sol`, `contracts/test/AgentRegistry.t.sol`
  - Pre-commit: `forge test`

---

- [x] 5. CoinFlip Game Contract

  **What to do**:
  - Create `CoinFlipGame.sol` - simplest game to start
  - Integrate Pyth Entropy for VRF
  - Functions: `placeBet(agentId, side, amount)`, `entropyCallback()`
  - 2% house edge (win pays 1.96x instead of 2x)
  - Pull from AgentPool for bet amount
  - Credit winnings back to AgentPool
  - Events: `BetPlaced`, `BetResolved`
  - Handle callback failures gracefully (never revert in callback)

  **Must NOT do**:
  - Allow direct ETH bets (must use pool)
  - Implement timeout/refund yet (can add later)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 3, 4, 6)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `https://docs.pyth.network/entropy/evm` - Entropy integration
  - VRFSpike.sol from Task 1 - callback pattern
  - OpenZeppelin ReentrancyGuard

  **Acceptance Criteria**:
  - [ ] `forge test` passes for CoinFlipGame
  - [ ] TDD: Tests written first
  - [ ] Test: placeBet emits BetPlaced event
  - [ ] Test: entropyCallback with 0 = heads win, 1 = tails win
  - [ ] Test: Win pays 1.96x bet amount (2% edge)
  - [ ] Test: Loss debits bet amount from pool
  - [ ] Integration test on Monad testnet

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: CoinFlip game flow
    Tool: Bash (forge test)
    Preconditions: AgentPool deployed
    Steps:
      1. forge test --match-contract CoinFlipGameTest -vvv
      2. Assert: All tests pass
      3. Assert: House edge calculation correct (1.96x payout)
    Expected Result: CoinFlip logic validated
    Evidence: Test output

  Scenario: End-to-end CoinFlip on testnet
    Tool: Bash (cast)
    Preconditions: CoinFlip and Pool deployed, agent registered, pool funded
    Steps:
      1. cast send $COINFLIP "placeBet(uint256,bool,uint256)" 1 true 10000000000000000 --rpc-url $MONAD_RPC_URL --private-key $PRIVATE_KEY
      2. Assert: BetPlaced event emitted
      3. Wait 30 seconds for VRF callback
      4. cast logs --address $COINFLIP --rpc-url $MONAD_RPC_URL
      5. Assert: BetResolved event with outcome
    Expected Result: Bet resolves via VRF
    Evidence: Event logs
  ```

  **Commit**: YES
  - Message: `feat(contracts): add CoinFlip game with Pyth Entropy VRF`
  - Files: `contracts/src/CoinFlipGame.sol`, `contracts/test/CoinFlipGame.t.sol`
  - Pre-commit: `forge test`

---

- [x] 6. Dice Game Contract

  **What to do**:
  - Create `DiceGame.sol` - roll 1-100, bet over/under target
  - Integrate Pyth Entropy for VRF
  - Functions: `placeBet(agentId, target, isOver, amount)`
  - Dynamic payout based on probability (e.g., over 50 = 1.96x, over 90 = 9.8x)
  - 2% house edge applied to all payouts
  - Pull from AgentPool, credit winnings back

  **Must NOT do**:
  - Support multiple dice (just 1-100 roll)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 3, 4, 5)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1, 2

  **References**:
  - CoinFlipGame.sol pattern (same VRF integration)
  - Kelly criterion for payout calculation

  **Acceptance Criteria**:
  - [ ] `forge test` passes for DiceGame
  - [ ] TDD: Tests first
  - [ ] Test: Roll over 50 with win pays 1.96x
  - [ ] Test: Roll over 95 with win pays ~19.6x (adjusting for edge)
  - [ ] Test: Payout formula: (100 / winProbability) * 0.98

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Dice payout calculation
    Tool: Bash (forge test)
    Preconditions: Foundry setup
    Steps:
      1. forge test --match-contract DiceGameTest -vvv
      2. Assert: Payout tests for various targets pass
    Expected Result: Dynamic payouts calculated correctly
    Evidence: Test output
  ```

  **Commit**: YES
  - Message: `feat(contracts): add Dice game with dynamic payouts`
  - Files: `contracts/src/DiceGame.sol`, `contracts/test/DiceGame.t.sol`
  - Pre-commit: `forge test`

---

- [ ] 7. Mines Game Contract

  **What to do**:
  - Create `MinesGame.sol` - grid with hidden mines
  - VRF generates mine positions at game start
  - Functions: `startGame(agentId, mineCount, betAmount)`, `reveal(gameId, position)`, `cashOut(gameId)`
  - Multiplier increases with each safe reveal
  - 2% house edge in multiplier calculation

  **Must NOT do**:
  - Allow changing mine count mid-game

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `components/games/MinesGame.tsx:1-331` - Existing UI patterns
  - Standard Mines multiplier formula

  **Acceptance Criteria**:
  - [ ] `forge test` passes for MinesGame
  - [ ] TDD: Tests first
  - [ ] Test: Game start with VRF generates mine positions
  - [ ] Test: Reveal safe tile increases multiplier
  - [ ] Test: Reveal mine ends game with loss
  - [ ] Test: CashOut pays current multiplier

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Mines game flow
    Tool: Bash (forge test)
    Steps:
      1. forge test --match-contract MinesGameTest -vvv
      2. Assert: Start, reveal, cashout flow tested
    Expected Result: Mines logic validated
    Evidence: Test output
  ```

  **Commit**: YES
  - Message: `feat(contracts): add Mines game with VRF mine generation`
  - Files: `contracts/src/MinesGame.sol`, `contracts/test/MinesGame.t.sol`
  - Pre-commit: `forge test`

---

- [ ] 8. Plinko Game Contract

  **What to do**:
  - Create `PlinkoGame.sol` - ball drops through pegs
  - VRF generates path (series of left/right decisions)
  - Risk levels: Low, Medium, High (different multiplier distributions)
  - Functions: `dropBall(agentId, riskLevel, betAmount)`

  **Must NOT do**:
  - Simulate physics on-chain (just random path)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 9, 10)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `components/games/PlinkoGame.tsx:1-400` - Existing UI and multiplier tables

  **Acceptance Criteria**:
  - [ ] `forge test` passes for PlinkoGame
  - [ ] TDD: Tests first
  - [ ] Test: Low risk has tighter multiplier range
  - [ ] Test: High risk has wider multiplier range (0.2x to 100x)

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Plinko risk levels
    Tool: Bash (forge test)
    Steps:
      1. forge test --match-contract PlinkoGameTest -vvv
      2. Assert: Risk level multiplier distributions tested
    Expected Result: Plinko payouts validated
    Evidence: Test output
  ```

  **Commit**: YES
  - Message: `feat(contracts): add Plinko game with risk levels`
  - Files: `contracts/src/PlinkoGame.sol`, `contracts/test/PlinkoGame.t.sol`
  - Pre-commit: `forge test`

---

- [ ] 9. Agent Service Setup

  **What to do**:
  - Create `agent-service/` Node.js project with TypeScript
  - Set up Gemini API client with user-provided keys
  - Create agent decision endpoint: `POST /api/agent/decide`
  - Create agent CRUD endpoints
  - Implement Gemini prompt for betting decisions
  - Return structured JSON: `{ action, game, betAmount, reasoning }`
  - Store user's Gemini API key encrypted in database

  **Must NOT do**:
  - Use hardcoded Gemini API key
  - Implement decision loop yet (just endpoint)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 10)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - Gemini 2.0 Flash API documentation
  - `.sisyphus/drafts/ai-agent-betting.md` - 7 stats influence prompt

  **Acceptance Criteria**:
  - [ ] `bun test` passes for agent service
  - [ ] TDD: Tests first
  - [ ] POST /api/agent/decide returns valid JSON structure
  - [ ] API key validation at registration
  - [ ] Low temperature (0.1) for consistent decisions
  - [ ] Structured output mode enabled

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Agent decision endpoint
    Tool: Bash (curl, bun test)
    Preconditions: Agent service running
    Steps:
      1. cd agent-service && bun test
      2. Assert: All tests pass
      3. curl -X POST http://localhost:3001/api/agent/decide -H "Content-Type: application/json" -d '{"agentId":"test","gameState":{"game":"coinflip","balance":1.0}}'
      4. Assert: Response contains action, game, betAmount, reasoning
    Expected Result: Valid decision JSON
    Evidence: curl output
  ```

  **Commit**: YES
  - Message: `feat(agent-service): setup Gemini-powered decision engine`
  - Files: `agent-service/src/`, `agent-service/package.json`
  - Pre-commit: `bun test`

---

- [ ] 10. Supabase Setup

  **What to do**:
  - Create Supabase project
  - Design database schema: `users`, `agents`, `bets`, `chat_messages`
  - Set up Realtime for chat and live feed
  - Create RLS policies for security
  - Export connection strings to `.env`

  **Must NOT do**:
  - Store Gemini API keys in plain text (encrypt them)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9)
  - **Blocks**: Tasks 13, 16
  - **Blocked By**: Task 2

  **References**:
  - Supabase documentation
  - `.sisyphus/drafts/ai-agent-betting.md` - agent stats schema

  **Acceptance Criteria**:
  - [ ] Supabase project created
  - [ ] Tables created: users, agents, bets, chat_messages
  - [ ] RLS policies prevent unauthorized access
  - [ ] Realtime enabled for chat_messages table
  - [ ] Connection string in `.env`

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Supabase connection and schema
    Tool: Bash (supabase CLI or curl)
    Steps:
      1. curl "$SUPABASE_URL/rest/v1/agents" -H "apikey: $SUPABASE_ANON_KEY"
      2. Assert: Returns empty array (table exists)
    Expected Result: Database accessible
    Evidence: curl output
  ```

  **Commit**: YES
  - Message: `feat(infra): setup Supabase with schema and realtime`
  - Files: `supabase/migrations/`, `.env.example`
  - Pre-commit: N/A

---

### Phase 2: Frontend

- [ ] 11. Agent Creation UI

  **What to do**:
  - Create `app/agent/create/page.tsx`
  - 7 stat sliders (1-10 each)
  - Points budget counter (35 total)
  - Name input field
  - Gemini API key input (validated on submit)
  - Auto-generated avatar preview (based on stats hash)
  - Connect to AgentRegistry contract

  **Must NOT do**:
  - Create new UI components (use existing Button, Card, Input)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 13, 14)
  - **Blocks**: Task 15
  - **Blocked By**: Task 4

  **References**:
  - `components/ui/Input.tsx` - existing input component
  - `components/ui/Button.tsx` - existing button styles
  - `app/stake/page.tsx:1-150` - page layout pattern
  - `app/globals.css` - cyber/neon theme

  **Acceptance Criteria**:
  - [ ] 7 sliders visible, each 1-10 range
  - [ ] Points counter updates in real-time
  - [ ] Cannot submit if points != 35
  - [ ] API key tested before submission
  - [ ] Success redirects to agent profile

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Agent creation form validation
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/agent/create
      2. Assert: 7 slider inputs visible
      3. Assert: Points counter shows "35 remaining"
      4. Adjust Risk Tolerance slider to 10
      5. Assert: Counter updates to "26 remaining"
      6. Fill name input with "TestBot"
      7. Fill API key input with valid key
      8. Click submit button
      9. Wait for navigation (timeout: 10s)
      10. Assert: URL contains /agent/
      11. Screenshot: .sisyphus/evidence/task-11-agent-create.png
    Expected Result: Agent created and redirected to profile
    Evidence: .sisyphus/evidence/task-11-agent-create.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add agent creation page with stat sliders`
  - Files: `app/agent/create/page.tsx`
  - Pre-commit: `bun run lint`

---

- [ ] 12. Agent Profile Page

  **What to do**:
  - Create `app/agent/[id]/page.tsx`
  - Display agent name, auto-generated avatar
  - Radar chart for 7 stats
  - Win/loss record, profit/loss
  - Recent bet history list
  - Live decision commentary feed

  **Must NOT do**:
  - Add editing UI here (separate page or modal later)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11, 13, 14)
  - **Blocks**: Task 17
  - **Blocked By**: Task 4

  **References**:
  - `app/dashboard/page.tsx:1-220` - card layout patterns
  - `components/ui/Card.tsx` - card component
  - Recharts or similar for radar chart

  **Acceptance Criteria**:
  - [ ] Agent name and avatar displayed
  - [ ] 7 stats shown in radar chart
  - [ ] Win/loss count visible
  - [ ] Recent bets list (last 10)
  - [ ] Live commentary updates in real-time

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Agent profile displays correctly
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/agent/1
      2. Assert: Agent name visible
      3. Assert: Radar chart canvas present
      4. Assert: Win/loss stats visible
      5. Assert: Bet history list present
      6. Screenshot: .sisyphus/evidence/task-12-agent-profile.png
    Expected Result: Profile page renders correctly
    Evidence: .sisyphus/evidence/task-12-agent-profile.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add agent profile page with stats radar chart`
  - Files: `app/agent/[id]/page.tsx`
  - Pre-commit: `bun run lint`

---

- [ ] 13. Spectator Feed

  **What to do**:
  - Create `app/spectator/page.tsx`
  - Live activity feed showing all agent bets in real-time
  - Supabase Realtime subscription for updates
  - Chat panel using Supabase Realtime
  - Filter by game type
  - Click agent name to go to profile

  **Must NOT do**:
  - Build custom WebSocket (use Supabase)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11, 12, 14)
  - **Blocks**: Task 17
  - **Blocked By**: Task 10

  **References**:
  - `app/dashboard/page.tsx:192-214` - live feed pattern (MOCK_FEED)
  - Supabase Realtime documentation

  **Acceptance Criteria**:
  - [ ] Live feed container visible
  - [ ] Activity updates without page refresh
  - [ ] Chat input and message list visible
  - [ ] Clicking agent name navigates to profile

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Spectator feed with realtime updates
    Tool: Playwright
    Preconditions: Dev server running, Supabase connected
    Steps:
      1. Navigate to http://localhost:3000/spectator
      2. Assert: Live feed container visible
      3. Assert: Chat input visible
      4. Wait for activity (timeout: 30s)
      5. Assert: At least 1 activity item appears
      6. Screenshot: .sisyphus/evidence/task-13-spectator.png
    Expected Result: Live updates appear
    Evidence: .sisyphus/evidence/task-13-spectator.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add spectator page with live feed and chat`
  - Files: `app/spectator/page.tsx`
  - Pre-commit: `bun run lint`

---

- [ ] 14. Leaderboard

  **What to do**:
  - Create `app/leaderboard/page.tsx`
  - Table/list of top agents by profit
  - Columns: Rank, Agent Name, Owner, Profit, Win Rate, Total Bets
  - Sortable by different metrics
  - Pagination or infinite scroll

  **Must NOT do**:
  - Complex filtering (just sort)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 11, 12, 13)
  - **Blocks**: Task 17
  - **Blocked By**: Task 4

  **References**:
  - `app/history/page.tsx` - table patterns

  **Acceptance Criteria**:
  - [ ] Leaderboard table renders
  - [ ] Agents sorted by profit by default
  - [ ] Click column header to sort
  - [ ] Click agent name to go to profile

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Leaderboard displays and sorts
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/leaderboard
      2. Assert: Table with headers visible
      3. Click "Win Rate" header
      4. Assert: Table reorders
      5. Screenshot: .sisyphus/evidence/task-14-leaderboard.png
    Expected Result: Sortable leaderboard
    Evidence: .sisyphus/evidence/task-14-leaderboard.png
  ```

  **Commit**: YES
  - Message: `feat(frontend): add leaderboard page with sortable rankings`
  - Files: `app/leaderboard/page.tsx`
  - Pre-commit: `bun run lint`

---

### Phase 3: Integration

- [ ] 15. Wire Frontend to Contracts

  **What to do**:
  - Add contract ABIs to `lib/contracts/`
  - Create hooks: `useAgentPool`, `useAgentRegistry`, `useCoinFlip`, etc.
  - Wire agent creation to AgentRegistry contract
  - Wire deposit/withdraw to AgentPool contract
  - Update game UIs to use contract calls

  **Must NOT do**:
  - Modify contract logic

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 16)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 3-8, 11

  **References**:
  - `hooks/useWallet.ts` - existing wagmi patterns
  - wagmi useContractWrite, useContractRead

  **Acceptance Criteria**:
  - [ ] ABIs exported from Foundry included
  - [ ] Agent creation calls AgentRegistry.registerAgent()
  - [ ] Deposit calls AgentPool.deposit()
  - [ ] All contract interactions work on testnet

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Frontend contract integration
    Tool: Playwright
    Preconditions: Contracts deployed, wallet connected with MON
    Steps:
      1. Navigate to http://localhost:3000/agent/create
      2. Fill form with valid stats
      3. Click submit
      4. Confirm wallet transaction
      5. Assert: AgentRegistered event emitted (check console/logs)
      6. Assert: Redirect to agent profile
    Expected Result: On-chain agent registration
    Evidence: Transaction hash
  ```

  **Commit**: YES
  - Message: `feat(frontend): wire UI to smart contracts`
  - Files: `lib/contracts/`, `hooks/useAgentPool.ts`, etc.
  - Pre-commit: `bun run lint`

---

- [ ] 16. Agent Decision Loop

  **What to do**:
  - Create background worker that runs agent decision loop
  - Every 5-10 seconds per agent:
    1. Get agent state from DB
    2. Call Gemini API with game state and agent traits
    3. Execute decision (place bet via contract)
    4. Log decision and reasoning to DB
    5. Broadcast to spectator feed via Supabase Realtime
  - Handle rate limits gracefully
  - Handle VRF pending states

  **Must NOT do**:
  - Run loop for inactive/unfunded agents

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 9, 10, 15)
  - **Parallel Group**: Sequential after Wave 4 start
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 9, 10, 15

  **References**:
  - `agent-service/` from Task 9
  - viem for contract calls

  **Acceptance Criteria**:
  - [ ] Agent makes decisions every 5-10 seconds
  - [ ] Decisions appear in spectator feed
  - [ ] Gemini API called with correct prompt
  - [ ] Contract transactions submitted
  - [ ] VRF callback handled

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Agent plays autonomously
    Tool: Bash (logs, curl)
    Preconditions: Agent registered, pool funded, service running
    Steps:
      1. tail -f agent-service/logs/agent.log
      2. Wait 30 seconds
      3. Assert: At least 3 decision logs appear
      4. Assert: Each log contains action, game, reasoning
      5. curl http://localhost:3001/api/agent/1/stats
      6. Assert: totalBets > 0
    Expected Result: Agent betting autonomously
    Evidence: Log output and API response
  ```

  **Commit**: YES
  - Message: `feat(agent-service): implement autonomous decision loop`
  - Files: `agent-service/src/loop.ts`
  - Pre-commit: `bun test`

---

- [ ] 17. End-to-End Testing

  **What to do**:
  - Full E2E test: signup → create agent → deposit → agent plays → spectator sees
  - Playwright test suite for critical paths
  - Verify all components work together
  - Document any issues found

  **Must NOT do**:
  - Fix bugs here (create issues for follow-up)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (final integration)
  - **Parallel Group**: Final task
  - **Blocks**: None (end)
  - **Blocked By**: Tasks 15, 16

  **References**:
  - All previous tasks

  **Acceptance Criteria**:
  - [ ] E2E test passes
  - [ ] Agent plays 10 rounds without error
  - [ ] Spectator sees all 10 bets
  - [ ] Leaderboard updates correctly

  **Agent-Executed QA Scenarios**:

  ```
  Scenario: Full end-to-end flow
    Tool: Playwright + Bash
    Preconditions: All services running, contracts deployed
    Steps:
      1. Connect wallet at localhost:3000
      2. Navigate to /agent/create
      3. Fill stats (5,5,5,5,5,5,5), name "E2EBot", valid API key
      4. Submit and confirm transaction
      5. Navigate to /stake, deposit 0.5 MON
      6. Wait 60 seconds
      7. Navigate to /agent/1
      8. Assert: totalBets >= 5
      9. Navigate to /spectator
      10. Assert: Activity feed shows E2EBot bets
      11. Navigate to /leaderboard
      12. Assert: E2EBot appears in list
      13. Screenshot: .sisyphus/evidence/task-17-e2e-complete.png
    Expected Result: Full flow works
    Evidence: .sisyphus/evidence/task-17-e2e-complete.png
  ```

  **Commit**: YES
  - Message: `test: add end-to-end integration tests`
  - Files: `e2e/full-flow.spec.ts`
  - Pre-commit: `bun test:e2e`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(contracts): validate Pyth Entropy VRF` | VRFSpike.sol | forge test |
| 2 | `chore: fix wagmi RPC URL and setup Foundry` | wagmi.ts, foundry.toml | forge build |
| 3 | `feat(contracts): add AgentPool` | AgentPool.sol | forge test |
| 4 | `feat(contracts): add AgentRegistry` | AgentRegistry.sol | forge test |
| 5 | `feat(contracts): add CoinFlip game` | CoinFlipGame.sol | forge test |
| 6 | `feat(contracts): add Dice game` | DiceGame.sol | forge test |
| 7 | `feat(contracts): add Mines game` | MinesGame.sol | forge test |
| 8 | `feat(contracts): add Plinko game` | PlinkoGame.sol | forge test |
| 9 | `feat(agent-service): setup Gemini engine` | agent-service/ | bun test |
| 10 | `feat(infra): setup Supabase` | supabase/ | N/A |
| 11 | `feat(frontend): add agent creation` | app/agent/create/ | bun lint |
| 12 | `feat(frontend): add agent profile` | app/agent/[id]/ | bun lint |
| 13 | `feat(frontend): add spectator feed` | app/spectator/ | bun lint |
| 14 | `feat(frontend): add leaderboard` | app/leaderboard/ | bun lint |
| 15 | `feat(frontend): wire contracts` | hooks/, lib/contracts/ | bun lint |
| 16 | `feat(agent-service): decision loop` | agent-service/loop.ts | bun test |
| 17 | `test: add e2e tests` | e2e/ | bun test:e2e |

---

## Success Criteria

### Verification Commands
```bash
# Contracts compile and test
cd contracts && forge test

# Agent service tests pass
cd agent-service && bun test

# Frontend builds
bun run build

# E2E tests pass
bun test:e2e
```

### Final Checklist
- [ ] All 4 games work with on-chain VRF
- [ ] Agent creation validates 35-point budget
- [ ] Agent plays autonomously every 5-10 seconds
- [ ] Spectator feed updates in real-time
- [ ] Leaderboard shows rankings
- [ ] All tests pass
- [ ] Deployed to Monad testnet
