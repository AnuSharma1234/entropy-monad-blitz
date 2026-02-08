import { expect, test, describe, beforeAll } from "bun:test";
import { makeDecision } from "../src/gemini";
import type { AgentStats, GameState } from "../src/types";
import { encryptApiKey, decryptApiKey, validateApiKey } from "../src/crypto";

const TEST_API_KEY = process.env.GEMINI_API_KEY || "";

describe("Gemini Client", () => {
  beforeAll(() => {
    if (!TEST_API_KEY) {
      console.warn("Warning: GEMINI_API_KEY not set. Gemini tests will be skipped.");
    }
  });

  test("should return valid decision structure", async () => {
    if (!TEST_API_KEY) {
      console.log("Skipping test: No API key");
      return;
    }

    const stats: AgentStats = {
      riskTolerance: 5,
      aggression: 5,
      analytical: 7,
      patience: 6,
      unpredictability: 3,
      herdMentality: 4,
      humor: 5
    };

    const gameState: GameState = {
      game: "coinflip",
      balance: 1.0,
      recentWins: 2,
      recentLosses: 1
    };

    const decision = await makeDecision(stats, gameState, TEST_API_KEY);

    expect(decision).toHaveProperty("action");
    expect(decision).toHaveProperty("game");
    expect(decision).toHaveProperty("betAmount");
    expect(decision).toHaveProperty("reasoning");

    expect(["bet", "skip"]).toContain(decision.action);
    expect(["coinflip", "dice", "mines", "plinko"]).toContain(decision.game);
    expect(typeof decision.betAmount).toBe("number");
    expect(typeof decision.reasoning).toBe("string");

    if (decision.action === "bet") {
      expect(decision.betAmount).toBeGreaterThan(0);
      expect(decision.betAmount).toBeLessThanOrEqual(gameState.balance);
    }
  }, 30000);

  test("should use temperature 0.1 for consistent decisions", async () => {
    if (!TEST_API_KEY) {
      console.log("Skipping test: No API key");
      return;
    }

    const stats: AgentStats = {
      riskTolerance: 8,
      aggression: 9,
      analytical: 8,
      patience: 3,
      unpredictability: 2,
      herdMentality: 2,
      humor: 4
    };

    const gameState: GameState = {
      game: "dice",
      balance: 0.5,
      recentWins: 5,
      recentLosses: 0
    };

    const decision1 = await makeDecision(stats, gameState, TEST_API_KEY);
    const decision2 = await makeDecision(stats, gameState, TEST_API_KEY);

    expect(decision1.action).toBe(decision2.action);
  }, 60000);

  test("should incorporate agent stats in decision", async () => {
    if (!TEST_API_KEY) {
      console.log("Skipping test: No API key");
      return;
    }

    const conservativeStats: AgentStats = {
      riskTolerance: 1,
      aggression: 1,
      analytical: 9,
      patience: 10,
      unpredictability: 1,
      herdMentality: 1,
      humor: 1
    };

    const gameState: GameState = {
      game: "mines",
      balance: 10.0,
      recentWins: 0,
      recentLosses: 3
    };

    const decision = await makeDecision(conservativeStats, gameState, TEST_API_KEY);

    if (decision.action === "bet") {
      expect(decision.betAmount).toBeLessThan(gameState.balance * 0.2);
    }
  }, 30000);
});

describe("Crypto Utilities", () => {
  test("should encrypt and decrypt API key", async () => {
    const originalKey = "AIzaSyDTestKey123456789";
    
    const encrypted = await encryptApiKey(originalKey);
    expect(encrypted).not.toBe(originalKey);
    expect(encrypted.length).toBeGreaterThan(0);
    
    const decrypted = await decryptApiKey(encrypted);
    expect(decrypted).toBe(originalKey);
  });

  test("should validate API key format", () => {
    expect(validateApiKey("AIzaSyDTestKey123456789")).toBe(true);
    expect(validateApiKey("short")).toBe(false);
    expect(validateApiKey("InvalidPrefixButLongEnough123")).toBe(false);
    expect(validateApiKey("")).toBe(false);
  });

  test("encrypted values should be different for same input", async () => {
    const originalKey = "AIzaSyDTestKey123456789";
    
    const encrypted1 = await encryptApiKey(originalKey);
    const encrypted2 = await encryptApiKey(originalKey);
    
    expect(encrypted1).not.toBe(encrypted2);
    
    const decrypted1 = await decryptApiKey(encrypted1);
    const decrypted2 = await decryptApiKey(encrypted2);
    
    expect(decrypted1).toBe(originalKey);
    expect(decrypted2).toBe(originalKey);
  });
});
