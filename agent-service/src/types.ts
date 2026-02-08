import { SchemaType, type Schema } from "@google/generative-ai";

// Core agent statistics that influence decision-making
export interface AgentStats {
  riskTolerance: number;    // 1-10: Higher = bigger bets
  aggression: number;        // 1-10: Higher = more frequent bets
  analytical: number;        // 1-10: Higher = better EV calculation
  patience: number;          // 1-10: Higher = long-term focus
  unpredictability: number;  // 1-10: Higher = unexpected plays
  herdMentality: number;     // 1-10: Higher = follows other agents
  humor: number;             // 1-10: Higher = funny commentary
}

// Game types supported by the platform
export type GameType = "coinflip" | "dice" | "mines" | "plinko";

// Action types for decision responses
export type ActionType = "bet" | "skip";

// Agent decision response structure (returned by Gemini)
export interface DecisionResponse {
  action: ActionType;
  game: GameType;
  betAmount: number;
  reasoning: string;
}

// Game state information passed to decision engine
export interface GameState {
  game: GameType;
  balance: number;
  recentWins?: number;
  recentLosses?: number;
  otherAgentActions?: string[];
}

// Request body for POST /api/agent/decide
export interface DecisionRequest {
  agentId: string;
  gameState: GameState;
  geminiApiKey?: string; // Optional: use if not stored
}

// Agent profile (stored in database)
export interface AgentProfile {
  id: string;
  name: string;
  stats: AgentStats;
  geminiApiKey: string; // Encrypted
  createdAt: Date;
}

// Gemini API response schema configuration
export const DECISION_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    action: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["bet", "skip"],
      description: "Whether to place a bet or skip this round"
    },
    game: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["coinflip", "dice", "mines", "plinko"],
      description: "Which game to bet on"
    },
    betAmount: {
      type: SchemaType.NUMBER,
      description: "Amount to bet (must be > 0 and <= balance)"
    },
    reasoning: {
      type: SchemaType.STRING,
      description: "Brief explanation of the decision"
    }
  },
  required: ["action", "game", "betAmount", "reasoning"]
};
