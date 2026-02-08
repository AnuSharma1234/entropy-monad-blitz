import { createPublicClient, createWalletClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { monadTestnet } from "./chains";
import { makeDecision } from "./gemini";
import { decryptApiKey } from "./crypto";
import type { AgentStats, GameState, DecisionResponse } from "./types";
import {
  COINFLIP_ABI,
  DICE_ABI,
  MINES_ABI,
  PLINKO_ABI,
  AGENT_POOL_ABI,
} from "./abis";

const DECISION_INTERVAL = 7000;
const MIN_BET_AMOUNT = 0.001;
const GEMINI_RATE_LIMIT_DELAY = 4000;

interface AgentRecord {
  id: number;
  user_id: string;
  name: string;
  stats: AgentStats;
  gemini_api_key_encrypted: string;
  status?: string;
}

interface PendingBet {
  agentId: number;
  sequenceNumber: bigint;
  timestamp: number;
}

export interface LoopConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
  monadRpcUrl: string;
  deployerPrivateKey: Address;
  coinflipAddress: Address;
  diceAddress: Address;
  minesAddress: Address;
  plinkoAddress: Address;
  agentPoolAddress: Address;
}

const pendingBets = new Map<number, PendingBet>();
const lastDecisionTime = new Map<number, number>();

function shouldMakeDecision(agentId: number): boolean {
  const lastTime = lastDecisionTime.get(agentId) || 0;
  const now = Date.now();
  
  if (now - lastTime < GEMINI_RATE_LIMIT_DELAY) {
    return false;
  }
  
  if (pendingBets.has(agentId)) {
    const pending = pendingBets.get(agentId)!;
    if (now - pending.timestamp < 30000) {
      return false;
    }
    pendingBets.delete(agentId);
  }
  
  return true;
}

async function getAgentBalance(
  publicClient: ReturnType<typeof createPublicClient>,
  agentPoolAddress: Address,
  agentId: number
): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: agentPoolAddress,
      abi: AGENT_POOL_ABI,
      functionName: "getBalance",
      args: [BigInt(agentId)],
    });
    return balance as bigint;
  } catch (error) {
    console.error(`Failed to get balance for agent ${agentId}:`, error);
    return 0n;
  }
}

async function executeCoinflipBet(
  walletClient: any,
  coinflipAddress: Address,
  agentId: number,
  betAmount: number,
  decision: DecisionResponse
): Promise<bigint | null> {
  try {
    const side = Math.random() > 0.5;
    const hash = await walletClient.writeContract({
      address: coinflipAddress,
      abi: COINFLIP_ABI,
      functionName: "placeBet",
      args: [BigInt(agentId), side, BigInt(Math.floor(betAmount * 1e18))],
    }) as `0x${string}`;
    
    console.log(`[Agent ${agentId}] CoinFlip bet placed: ${hash}`);
    return 1n;
  } catch (error) {
    console.error(`[Agent ${agentId}] CoinFlip bet failed:`, error);
    return null;
  }
}

async function executeDiceBet(
  walletClient: any,
  diceAddress: Address,
  agentId: number,
  betAmount: number,
  decision: DecisionResponse
): Promise<bigint | null> {
  try {
    const target = Math.floor(Math.random() * 95) + 5;
    const isOver = Math.random() > 0.5;
    
    const hash = await walletClient.writeContract({
      address: diceAddress,
      abi: DICE_ABI,
      functionName: "placeBet",
      args: [
        BigInt(agentId),
        BigInt(target),
        isOver,
        BigInt(Math.floor(betAmount * 1e18)),
      ],
      chain: monadTestnet,
    });
    
    console.log(`[Agent ${agentId}] Dice bet placed: ${hash}`);
    return 1n;
  } catch (error) {
    console.error(`[Agent ${agentId}] Dice bet failed:`, error);
    return null;
  }
}

async function executeMinesBet(
  walletClient: any,
  minesAddress: Address,
  agentId: number,
  betAmount: number,
  decision: DecisionResponse
): Promise<bigint | null> {
  try {
    const mineCount = Math.floor(Math.random() * 20) + 3;
    
    const hash = await walletClient.writeContract({
      address: minesAddress,
      abi: MINES_ABI,
      functionName: "startGame",
      args: [
        BigInt(agentId),
        mineCount,
        BigInt(Math.floor(betAmount * 1e18)),
      ],
      chain: monadTestnet,
    });
    
    console.log(`[Agent ${agentId}] Mines game started: ${hash}`);
    return 1n;
  } catch (error) {
    console.error(`[Agent ${agentId}] Mines bet failed:`, error);
    return null;
  }
}

async function executePlinkoBet(
  walletClient: any,
  plinkoAddress: Address,
  agentId: number,
  betAmount: number,
  decision: DecisionResponse
): Promise<bigint | null> {
  try {
    const riskLevel = Math.floor(Math.random() * 3);
    
    const hash = await walletClient.writeContract({
      address: plinkoAddress,
      abi: PLINKO_ABI,
      functionName: "dropBall",
      args: [
        BigInt(agentId),
        riskLevel,
        BigInt(Math.floor(betAmount * 1e18)),
      ],
      chain: monadTestnet,
    });
    
    console.log(`[Agent ${agentId}] Plinko ball dropped: ${hash}`);
    return 1n;
  } catch (error) {
    console.error(`[Agent ${agentId}] Plinko bet failed:`, error);
    return null;
  }
}

async function logBetToSupabase(
  supabase: SupabaseClient,
  agentId: number,
  userId: string,
  decision: DecisionResponse
): Promise<void> {
  try {
    const { error } = await supabase.from("bets").insert({
      agent_id: agentId,
      user_id: userId,
      game: decision.game,
      bet_amount: decision.betAmount,
      outcome: null,
      payout: null,
      reasoning: decision.reasoning,
    });
    
    if (error) {
      console.error(`[Agent ${agentId}] Failed to log bet:`, error);
    }
  } catch (error) {
    console.error(`[Agent ${agentId}] Failed to log bet:`, error);
  }
}

async function processAgent(
  agent: AgentRecord,
  config: LoopConfig,
  supabase: SupabaseClient,
  publicClient: ReturnType<typeof createPublicClient>,
  walletClient: any
): Promise<void> {
  if (!shouldMakeDecision(agent.id)) {
    return;
  }

  try {
    const balance = await getAgentBalance(
      publicClient,
      config.agentPoolAddress,
      agent.id
    );
    const balanceInEth = Number(balance) / 1e18;

    if (balanceInEth < MIN_BET_AMOUNT) {
      console.log(`[Agent ${agent.id}] Insufficient balance: ${balanceInEth}`);
      return;
    }

    const decryptedApiKey = await decryptApiKey(
      agent.gemini_api_key_encrypted
    );

    const gameState: GameState = {
      game: "coinflip",
      balance: balanceInEth,
      recentWins: 0,
      recentLosses: 0,
    };

    const decision = await makeDecision(
      agent.stats,
      gameState,
      decryptedApiKey
    );
    
    lastDecisionTime.set(agent.id, Date.now());

    if (decision.action === "skip") {
      console.log(`[Agent ${agent.id}] Skipped: ${decision.reasoning}`);
      return;
    }

    const cappedBetAmount = Math.min(decision.betAmount, balanceInEth * 0.5);

    let sequenceNumber: bigint | null = null;

    switch (decision.game) {
      case "coinflip":
        sequenceNumber = await executeCoinflipBet(
          walletClient,
          config.coinflipAddress,
          agent.id,
          cappedBetAmount,
          decision
        );
        break;
      case "dice":
        sequenceNumber = await executeDiceBet(
          walletClient,
          config.diceAddress,
          agent.id,
          cappedBetAmount,
          decision
        );
        break;
      case "mines":
        sequenceNumber = await executeMinesBet(
          walletClient,
          config.minesAddress,
          agent.id,
          cappedBetAmount,
          decision
        );
        break;
      case "plinko":
        sequenceNumber = await executePlinkoBet(
          walletClient,
          config.plinkoAddress,
          agent.id,
          cappedBetAmount,
          decision
        );
        break;
    }

    if (sequenceNumber) {
      pendingBets.set(agent.id, {
        agentId: agent.id,
        sequenceNumber,
        timestamp: Date.now(),
      });

      await logBetToSupabase(supabase, agent.id, agent.user_id, {
        ...decision,
        betAmount: cappedBetAmount,
      });
    }
  } catch (error) {
    console.error(`[Agent ${agent.id}] Error processing agent:`, error);
  }
}

export async function startDecisionLoop(config: LoopConfig): Promise<void> {
  console.log("Starting agent decision loop...");

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

  const account = privateKeyToAccount(config.deployerPrivateKey);

  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http(config.monadRpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(config.monadRpcUrl),
  });

  setInterval(async () => {
    try {
      const { data: agents, error } = await supabase
        .from("agents")
        .select("*")
        .eq("status", "active");

      if (error) {
        console.error("Failed to fetch agents:", error);
        return;
      }

      if (!agents || agents.length === 0) {
        return;
      }

      for (const agent of agents) {
        await processAgent(
          agent as AgentRecord,
          config,
          supabase,
          publicClient,
          walletClient
        );
      }
    } catch (error) {
      console.error("Error in decision loop:", error);
    }
  }, DECISION_INTERVAL);
}
