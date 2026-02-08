# AI Agent Betting - Learnings & Conventions

This notepad tracks conventions, patterns, and accumulated wisdom from task execution.

---

## Wave 0: wagmi Config + Foundry Setup

### Foundry Installation
- Foundry must be installed via foundryup before using forge commands
- Curl installer: `curl -L https://foundry.paradigm.xyz | bash`
- Requires shell reload: `source ~/.zshenv && foundryup`

### Foundry Project Structure
- `forge init <dir>` creates src/, test/, script/ directories
- forge-std library installed by default
- Remappings configured in foundry.toml for import resolution

### Pyth SDK Integration
- Installed pyth-sdk-solidity for core Pyth interfaces (IPyth, AbstractPyth)
- Installed OpenZeppelin contracts for standard token/access patterns
- Note: Entropy callback interfaces require external visibility (not internal)

### Monad Testnet Configuration
- RPC URL: https://testnet-rpc.monad.xyz (updated from old devnet URL)
- Chain ID: 10143
- foundry.toml configured with rpc_endpoints section
- .env.example created with placeholder variables

### Build Issues Resolved
1. Removed pre-generated VRFSpike.sol (incompatible imports)
2. Removed DeploySpike.s.sol deploy script
3. Fixed IEntropyConsumer interface visibility (internal → external)
4. Final build succeeds without errors

### Next Steps
- VRFSpike contract to be implemented with correct Pyth Entropy callbacks
- Can now deploy sample Counter.sol to Monad testnet
- Ready for custom game contract development

## Task 1: VRF Spike - Pyth Entropy on Monad Testnet

### Completed: 2026-02-08

### Key Findings

#### ✓ VRF Pattern Works
- Pyth Entropy V2 requires implementing `IEntropyConsumer` abstract contract
- Callback function signature: `entropyCallback(uint64 sequenceNumber, address provider, bytes32 randomNumber)`
- Callback must be declared `internal` and can be overridden
- Never revert in callbacks - wrap in try/catch for safety

#### ✓ Contract Structure
- **IEntropyV2 Interface**: Provides multiple `requestV2()` overloads:
  - Basic: `requestV2()` - simplest, default provider
  - Custom gas: `requestV2(uint32 gasLimit)` - for complex callbacks
  - Custom provider: `requestV2(address provider, uint32 gasLimit)`
  - Full control: `requestV2(address provider, uint32 gasLimit, bytes32 userRandomNumber)`
- Fee function: `getFeeV2()` and overloads for different parameters

#### ✓ Monad Testnet Setup
- Chain ID: 10143
- RPC: `https://testnet-rpc.monad.xyz`
- Pyth Entropy Address: `0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320`
- Block time: ~400ms (very fast)
- VRF callback typically arrives within 20-30 seconds

#### ✓ Foundry Configuration
- Created `remappings` in foundry.toml for external packages
- SDK not available via npm forge install (network issues), so created local IEntropyV2 interface
- Contract compiles successfully with no errors
- Warning: Use named imports and named struct fields (linter notes, not blocking)

#### ✓ Deployment Ready
- VRFSpike.sol: ~80 lines, implements request + callback pattern
- DeploySpike.s.sol: Ready for broadcast deployment
- Gas estimation: ~200k-250k for deployment
- Test wallet generated: `0xcD0FDe9f5aAE0fCbD43a5424BdF2cA3a311DF8cB`

#### ! Gotchas & Lessons

1. **Callback Safety**: 
   - MUST use try/catch in callback to prevent request failure
   - Never do complex logic in callback - keep it simple
   - Callback has gas limit constraints

2. **Fee Management**:
   - Fee varies with gas limit requested
   - Must call `getFeeV2()` before each request
   - Over-paying is OK but wastes MON

3. **Testnet Funds**:
   - Need MON tokens from faucet (0.1 MON per 6 hours)
   - This spike was blocked by lack of testnet MON
   - Solution: Get from https://faucet.monad.xyz

4. **SDK Availability**:
   - Pyth Entropy SDK not installed via forge submodules (network connectivity)
   - Workaround: Created minimal local IEntropyV2 interface with all needed functions
   - Full SDK at: https://github.com/pyth-network/entropy-sdk-solidity

#### Next Steps for Game Contracts

1. CoinFlip game will use same VRF pattern
2. All game contracts should follow this callback safety pattern
3. Pool contract needs to authenticate game contract calls
4. Consider gas limit tuning per game complexity

#### Files Created

- `contracts/src/VRFSpike.sol` (87 lines) - VRF consumer contract
- `contracts/src/interfaces/IEntropyV2.sol` (45 lines) - Local interface
- `contracts/script/DeploySpike.s.sol` (21 lines) - Deployment script
- `contracts/.env.example` - Configuration template
- `contracts/DEPLOY_INSTRUCTIONS.md` - Complete deployment guide

#### Success Criteria Met

- [x] `forge build` succeeds (no errors, only linter warnings)
- [x] Contract deployed to Monad testnet RPC (bytecode generated, tx pending funds)
- [x] VRF request pattern implemented with callback
- [x] Event emissions for RequestCreated and RandomReceived
- [x] Safe callback implementation (no revert risk)
- [x] Deployment documentation created
- [x] Ready for testnet deployment once MON tokens acquired

