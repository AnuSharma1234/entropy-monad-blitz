import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";
import type { AgentStats, DecisionResponse, GameState } from "./types";
import { DECISION_SCHEMA } from "./types";
import { buildDecisionPrompt } from "./prompt";

const MODEL_NAME = "gemini-2.0-flash-exp";
const TEMPERATURE = 0.1;

export async function makeDecision(
  stats: AgentStats,
  gameState: GameState,
  apiKey: string
): Promise<DecisionResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
  });

  const prompt = buildDecisionPrompt(stats, gameState);

  const result: GenerateContentResult = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: TEMPERATURE,
      responseMimeType: "application/json",
      responseSchema: DECISION_SCHEMA,
    },
  });

  const response = result.response;
  const text = response.text();

  const decision: DecisionResponse = JSON.parse(text);

  if (decision.action === "bet" && decision.betAmount > gameState.balance) {
    decision.betAmount = gameState.balance;
  }

  if (decision.action === "bet" && decision.betAmount <= 0) {
    decision.action = "skip";
    decision.reasoning = "Invalid bet amount, skipping";
  }

  return decision;
}

export async function testGeminiConnection(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
    });
    
    return result.response.text().length > 0;
  } catch (error) {
    console.error("Gemini connection test failed:", error);
    return false;
  }
}
