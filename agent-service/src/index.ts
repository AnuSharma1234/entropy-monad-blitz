import express, { type Request, type Response } from "express";
import type { DecisionRequest, DecisionResponse } from "./types";
import { makeDecision } from "./gemini";
import { validateApiKey } from "./crypto";
import { startDecisionLoop, type LoopConfig } from "./loop";
import type { Address } from "viem";

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
  
  // Start the decision loop if all required environment variables are set
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'MONAD_RPC_URL',
    'DEPLOYER_PRIVATE_KEY',
    'COINFLIP_ADDRESS',
    'DICE_ADDRESS',
    'MINES_ADDRESS',
    'PLINKO_ADDRESS',
    'AGENT_POOL_ADDRESS',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Decision loop disabled. Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('   Set these variables in .env to enable autonomous agent decisions');
  } else {
    console.log('✅ Starting autonomous agent decision loop...');
    
    const loopConfig: LoopConfig = {
      supabaseUrl: process.env.SUPABASE_URL!,
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      monadRpcUrl: process.env.MONAD_RPC_URL!,
      deployerPrivateKey: process.env.DEPLOYER_PRIVATE_KEY as Address,
      coinflipAddress: process.env.COINFLIP_ADDRESS as Address,
      diceAddress: process.env.DICE_ADDRESS as Address,
      minesAddress: process.env.MINES_ADDRESS as Address,
      plinkoAddress: process.env.PLINKO_ADDRESS as Address,
      agentPoolAddress: process.env.AGENT_POOL_ADDRESS as Address,
    };
    
    startDecisionLoop(loopConfig).catch((error) => {
      console.error('❌ Failed to start decision loop:', error);
    });
  }
});

export default app;
