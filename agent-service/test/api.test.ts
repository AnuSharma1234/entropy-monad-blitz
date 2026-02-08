import { expect, test, describe } from "bun:test";
import type { DecisionRequest } from "../src/types";

const BASE_URL = "http://localhost:3001";

describe("Agent Service API", () => {
  test("health endpoint returns ok", async () => {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json() as { status: string; service: string };
    
    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.service).toBe("agent-service");
  });

  test("decide endpoint validates required fields", async () => {
    const response = await fetch(`${BASE_URL}/api/agent/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    
    const data = await response.json() as { error: string };
    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  test("decide endpoint validates API key format", async () => {
    const request: DecisionRequest = {
      agentId: "test-agent",
      gameState: {
        game: "coinflip",
        balance: 1.0
      },
      geminiApiKey: "invalid-key"
    };

    const response = await fetch(`${BASE_URL}/api/agent/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    
    const data = await response.json() as { error: string };
    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid Gemini API key format");
  });
});
