import express, { type Request, type Response } from "express";
import type { DecisionRequest, DecisionResponse } from "./types";
import { makeDecision } from "./gemini";
import { validateApiKey } from "./crypto";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "agent-service" });
});

app.post("/api/agent/decide", async (req: Request, res: Response) => {
  try {
    const { agentId, gameState, geminiApiKey } = req.body as DecisionRequest;

    if (!agentId) {
      res.status(400).json({ error: "agentId is required" });
      return;
    }

    if (!gameState) {
      res.status(400).json({ error: "gameState is required" });
      return;
    }

    if (!geminiApiKey) {
      res.status(400).json({ error: "geminiApiKey is required" });
      return;
    }

    if (!validateApiKey(geminiApiKey)) {
      res.status(400).json({ error: "Invalid Gemini API key format" });
      return;
    }

    const mockStats = {
      riskTolerance: 5,
      aggression: 5,
      analytical: 7,
      patience: 6,
      unpredictability: 3,
      herdMentality: 4,
      humor: 5
    };

    const decision: DecisionResponse = await makeDecision(
      mockStats,
      gameState,
      geminiApiKey
    );

    res.json(decision);
  } catch (error) {
    console.error("Error making decision:", error);
    res.status(500).json({ 
      error: "Failed to make decision", 
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Agent service listening on port ${PORT}`);
});

export default app;
