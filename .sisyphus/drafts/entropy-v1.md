# Draft: Entropy V1 — On-Chain Gambling dApp on Monad

## Requirements (confirmed)
- **Chain**: Monad and Monad Testnet ONLY. No other chains or testnets allowed.
- **Project Name**: Entropy
- **Type**: Yield-funded on-chain gambling/gaming dApp
- **Existing Codebase**: Next.js frontend with Tailwind, wagmi, viem, zustand. Two games (Mines, Plinko) implemented client-side only (Math.random). No smart contracts, no ABIs, no on-chain logic.

## PDF Specification Summary (from user-pasted content)

### Core Concept
- Entropy is a **yield-funded gambling dApp** on Monad
- Users stake assets → yield generated → yield funds game payouts
- Games include: Mines, Plinko, Coin Flip, Dice, Crash, Wheel
- **Provably fair** via server seed + client seed + nonce + SHA-256
- **Sidebets feature**: Social prediction markets spawned from Telegram bot

### Architecture from PDF
- **SidebetFactory** → deploys per-market SidebetContract instances
- **EntropyBalanceManager** — manages principal/yield/risk buckets
- **EntropyTreasury** — treasury management
- **Oracle integration**: Chainlink Any-API for outcome verification
- **Telegram Bot**: `/sidebet` commands create markets, deep links to web UI
- **Chat on market pages** (Firebase/WebSocket)
- **Gasless UX**: Account Abstraction + Paymaster option

### Key Technical Decisions from PDF
- Randomness: Commit-reveal as primary, Chainlink VRF as option
- Oracle for sidebets: Chainlink Any-API + multi-source verification
- Bankroll model: LP token staking pool with Kelly criterion
- House edge: ~2% standard
- Wallet: MetaMask / WalletConnect + optional AA gasless flow

## Research Findings

### Monad Chain (from bg_27b3b824)
- **Mainnet LIVE** since Nov 24, 2025 — Chain ID: 143
- **Testnet**: Chain ID 10143
- 10,000 TPS, 400ms block time, 800ms finality
- Full EVM Cancun fork compatibility
- Max contract size: 128KB (5x Ethereum)
- Near-zero gas costs
- **VRF Providers on Monad**: Pyth Entropy (recommended), Chainlink VRF, Supra dVRF, Orochi VRF, Switchboard VRF, Gelato VRF
- **Existing gambling dApps**: APT Casino (uses Pyth Entropy), MonadCasino (slot machine)
- **Dev tools**: Hardhat, Foundry, OpenZeppelin all fully compatible
- **RPC endpoints**: rpc.monad.xyz (QuickNode), rpc1.monad.xyz (Alchemy), etc.

### Provably Fair Patterns (from bg_43687883)
- **VAULT777Team/casino-contracts**: 12 games, Chainlink VRF V2+, BankLP staking pool, Kelly criterion — most comprehensive reference
- **LP Token Model**: ERC20 shares, proportional P&L distribution, accProfitPerShare
- **Kelly Criterion**: bankroll risk management for max bet calculation
- **Commit-Reveal**: Alternative to VRF, no oracle costs but multi-participant
- **Server Seed + Client Seed + Nonce**: Used by Stake.com, Roobet — off-chain computation, on-chain verification
- **House edge**: Applied to theoretical payouts (e.g., coinflip 1.98x instead of 2x)

### Codebase State (from bg_a78db942)
- **Frontend**: Polished UI with cyber/neon theme, all pages exist
- **Games**: Mines (5x5 grid, Math.random), Plinko (canvas physics, local RNG) — UI-only
- **Wallet**: wagmi useConnect/useDisconnect/useBalance — basic, no tx sending
- **Staking**: UI-only, mock data
- **Fairness**: Static demo, not connected to chain
- **Contracts**: ZERO — no Solidity, no ABIs, no contract interactions
- **wagmi config**: monadTestnet defined with old devnet RPC, needs updating

## Interview Decisions (Round 1 & 2)
- **Scope**: Full V1 — everything in PDF (all games, sidebets, Telegram bot, staking, fairness, gasless AA)
- **VRF Provider**: Pyth Entropy (fastest, cheapest, proven on Monad by APT Casino)
- **Contract Framework**: Foundry (faster compilation, better gas optimization, Monad template available)
- **Target Network**: Monad Testnet first → Mainnet after verification
- **Test Strategy**: Tests after implementation (not TDD)
- **Staking Model**: LP Token Pool (users stake MON → receive LP tokens → share house profits/losses)
- **Betting Token**: MON only (native token)
- **Telegram Bot**: Basic (market creation + deep links to web UI + resolution updates)
- **Games**: All 6 (Mines, Plinko, CoinFlip, Dice, Crash, Wheel) + Sidebets

## Interview Decisions (Round 3)
- **Gasless AA**: Plan architecture, build later (not blocking core casino)
- **Frontend**: Extend existing UI (polished cyber/neon theme) — wire components to contracts, add new game UIs
- **Sidebet Oracle**: ~~Chainlink Any-API~~ → REPLACED (deprecated/unavailable on Monad)
- **Market Chat**: Supabase (short delay acceptable, simpler infra than Firebase/WebSocket)

## Interview Decisions (Round 4 — Metis Gap Resolution)
- **Sidebet Oracle**: Hybrid 2-tier approach:
  - **Crypto price markets** ("Will BTC hit $100K?"): **Pyth Price Feeds** (direct on-chain price check, testnet: `0x2880aB155794e7179c9eE2e38200202908C17B43`)
  - **Sports / social / custom markets**: **Switchboard Custom Feeds** using HttpTask → any API (ESPN, Twitter, custom) → JsonParseTask → on-chain resolution
  - Switchboard on Monad Mainnet: `0xB7F03eee7B9F56347e32cC71DaD65B303D5a0E67`
  - Switchboard on Monad Testnet: `0xD3860E2C66cBd5c969Fa7343e6912Eff0416bA33`
- **Sidebet Liquidity**: Market requires bets on BOTH sides before activation (peer-to-peer, no house exposure)
- **House edge**: 2% across all games (industry standard, matches PDF spec)
- **LP shares**: Transferable ERC20 token (composable, users can trade/transfer)
- **Bankroll**: Single shared pool for all games (simpler, deeper liquidity)
- **Max bet**: Dynamic Kelly criterion (% of bankroll based on game edge)
- **VRF 2-tx UX**: Accepted with pending state UI (spinner + "Waiting for result", ~1-2s on Monad)
- **VRF fee payment**: House pays (included in game contract, funded from bankroll)
- **Withdrawal lock**: 24h cooldown, no penalty fee
- **Crash multiplier**: Standard `f(t) = 1.0024^t` with 1% house edge crash point
- **Sidebet market types**: Arbitrary (crypto, sports, events, custom — any topic)
- **Currency labels**: All "MON" throughout UI

## Open Questions
- NONE — all critical decisions made

## Scope Boundaries
- INCLUDE: Smart contracts (6 games + sidebets + staking pool + treasury), Pyth Entropy VRF integration, Pyth Price Feeds for crypto sidebets, Switchboard Custom Feeds for sports/social/custom sidebets, provably fair verification, Telegram bot (basic), frontend contract integration, wagmi config update, Supabase chat for sidebet markets
- INCLUDE (later phase, planned): Gasless AA + Paymaster + Web3Auth
- EXCLUDE: Custom ERC20 token, multi-chain support, fiat onramp, mobile app, security audit (separate engagement), full Telegram Mini App
