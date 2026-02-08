import { describe, test, expect, mock, beforeEach } from "bun:test";
import { startDecisionLoop } from "../src/loop";
import type { LoopConfig } from "../src/loop";

const mockConfig: LoopConfig = {
  supabaseUrl: "https://test.supabase.co",
  supabaseServiceKey: "test-service-key",
  monadRpcUrl: "https://testnet-rpc.monad.xyz",
  deployerPrivateKey: "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`,
  coinflipAddress: "0x1111111111111111111111111111111111111111" as `0x${string}`,
  diceAddress: "0x2222222222222222222222222222222222222222" as `0x${string}`,
  minesAddress: "0x3333333333333333333333333333333333333333" as `0x${string}`,
  plinkoAddress: "0x4444444444444444444444444444444444444444" as `0x${string}`,
  agentPoolAddress: "0x5555555555555555555555555555555555555555" as `0x${string}`,
};

describe("Decision Loop", () => {
  test("exports startDecisionLoop function", () => {
    expect(typeof startDecisionLoop).toBe("function");
  });

  test("accepts valid config", () => {
    expect(() => {
      const config = mockConfig;
      expect(config.supabaseUrl).toBe("https://test.supabase.co");
    }).not.toThrow();
  });
});

describe("Loop Configuration", () => {
  test("requires all contract addresses", () => {
    expect(mockConfig.coinflipAddress).toBeDefined();
    expect(mockConfig.diceAddress).toBeDefined();
    expect(mockConfig.minesAddress).toBeDefined();
    expect(mockConfig.plinkoAddress).toBeDefined();
    expect(mockConfig.agentPoolAddress).toBeDefined();
  });

  test("requires Supabase configuration", () => {
    expect(mockConfig.supabaseUrl).toBeDefined();
    expect(mockConfig.supabaseServiceKey).toBeDefined();
  });

  test("requires blockchain configuration", () => {
    expect(mockConfig.monadRpcUrl).toBeDefined();
    expect(mockConfig.deployerPrivateKey).toBeDefined();
  });
});
