export const COINFLIP_ABI = [
  {
    type: "function",
    name: "placeBet",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "side", type: "bool" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "sequenceNumber", type: "uint64" }],
  },
  {
    type: "function",
    name: "getBet",
    stateMutability: "view",
    inputs: [{ name: "sequenceNumber", type: "uint64" }],
    outputs: [
      { name: "agentId", type: "uint256" },
      { name: "side", type: "bool" },
      { name: "amount", type: "uint256" },
      { name: "resolved", type: "bool" },
    ],
  },
  {
    type: "event",
    name: "BetPlaced",
    inputs: [
      { name: "sequenceNumber", type: "uint64", indexed: true },
      { name: "agentId", type: "uint256", indexed: true },
      { name: "side", type: "bool", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BetResolved",
    inputs: [
      { name: "sequenceNumber", type: "uint64", indexed: true },
      { name: "agentId", type: "uint256", indexed: true },
      { name: "won", type: "bool", indexed: false },
      { name: "payout", type: "uint256", indexed: false },
    ],
  },
] as const;

export const DICE_ABI = [
  {
    type: "function",
    name: "placeBet",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "target", type: "uint256" },
      { name: "isOver", type: "bool" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "sequenceNumber", type: "uint64" }],
  },
  {
    type: "function",
    name: "getBet",
    stateMutability: "view",
    inputs: [{ name: "sequenceNumber", type: "uint64" }],
    outputs: [
      { name: "agentId", type: "uint256" },
      { name: "target", type: "uint256" },
      { name: "isOver", type: "bool" },
      { name: "amount", type: "uint256" },
      { name: "resolved", type: "bool" },
    ],
  },
] as const;

export const MINES_ABI = [
  {
    type: "function",
    name: "startGame",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "mineCount", type: "uint8" },
      { name: "betAmount", type: "uint256" },
    ],
    outputs: [{ name: "gameId", type: "uint64" }],
  },
  {
    type: "function",
    name: "reveal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "gameId", type: "uint64" },
      { name: "position", type: "uint256" },
    ],
    outputs: [{ name: "hitMine", type: "bool" }],
  },
  {
    type: "function",
    name: "cashOut",
    stateMutability: "nonpayable",
    inputs: [{ name: "gameId", type: "uint64" }],
    outputs: [{ name: "payout", type: "uint256" }],
  },
] as const;

export const PLINKO_ABI = [
  {
    type: "function",
    name: "dropBall",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "riskLevel", type: "uint8" },
      { name: "betAmount", type: "uint256" },
    ],
    outputs: [{ name: "sequenceNumber", type: "uint64" }],
  },
  {
    type: "function",
    name: "getBet",
    stateMutability: "view",
    inputs: [{ name: "sequenceNumber", type: "uint64" }],
    outputs: [
      { name: "agentId", type: "uint256" },
      { name: "riskLevel", type: "uint8" },
      { name: "betAmount", type: "uint256" },
      { name: "resolved", type: "bool" },
    ],
  },
] as const;

export const AGENT_POOL_ABI = [
  {
    type: "function",
    name: "getBalance",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [],
  },
] as const;
