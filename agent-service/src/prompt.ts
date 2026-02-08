import type { AgentStats, GameState } from "./types";

export function buildDecisionPrompt(
  stats: AgentStats,
  gameState: GameState
): string {
  const { game, balance, recentWins = 0, recentLosses = 0, otherAgentActions = [] } = gameState;

  const agentPersonality = describePersonality(stats);
  const gameContext = describeGameContext(game, balance, recentWins, recentLosses);
  const socialContext = otherAgentActions.length > 0 
    ? `\n\nOther agents are: ${otherAgentActions.join(", ")}`
    : "";

  return `You are an AI betting agent with the following personality traits (1-10 scale):
- Risk Tolerance: ${stats.riskTolerance}/10 ${agentPersonality.risk}
- Aggression: ${stats.aggression}/10 ${agentPersonality.aggression}
- Analytical: ${stats.analytical}/10 ${agentPersonality.analytical}
- Patience: ${stats.patience}/10 ${agentPersonality.patience}
- Unpredictability: ${stats.unpredictability}/10 ${agentPersonality.unpredictability}
- Herd Mentality: ${stats.herdMentality}/10 ${agentPersonality.herd}
- Humor: ${stats.humor}/10 ${agentPersonality.humor}

${gameContext}${socialContext}

Your decision must reflect your personality. Consider:
- Risk Tolerance affects bet sizing
- Aggression affects betting frequency
- Analytical affects game selection and EV calculation
- Patience affects long-term strategy vs quick wins
- Unpredictability adds randomness to expected patterns
- Herd Mentality influences following other agents
- Humor affects reasoning tone

Decide whether to bet or skip this round. If betting, choose a game and amount.`;
}

function describePersonality(stats: AgentStats) {
  return {
    risk: stats.riskTolerance >= 7 ? "(high roller)" : stats.riskTolerance <= 3 ? "(conservative)" : "(balanced)",
    aggression: stats.aggression >= 7 ? "(very active)" : stats.aggression <= 3 ? "(selective)" : "(moderate)",
    analytical: stats.analytical >= 7 ? "(data-driven)" : stats.analytical <= 3 ? "(intuitive)" : "(pragmatic)",
    patience: stats.patience >= 7 ? "(long-term)" : stats.patience <= 3 ? "(impulsive)" : "(balanced)",
    unpredictability: stats.unpredictability >= 7 ? "(chaotic)" : stats.unpredictability <= 3 ? "(predictable)" : "(mixed)",
    herd: stats.herdMentality >= 7 ? "(follower)" : stats.herdMentality <= 3 ? "(independent)" : "(aware)",
    humor: stats.humor >= 7 ? "(comedic)" : stats.humor <= 3 ? "(serious)" : "(casual)",
  };
}

function describeGameContext(
  game: string,
  balance: number,
  recentWins: number,
  recentLosses: number
): string {
  const streak = recentWins - recentLosses;
  const streakDesc = streak > 0 ? `on a ${streak}-win streak` : streak < 0 ? `on a ${Math.abs(streak)}-loss streak` : "neutral";
  
  return `Current situation:
- Available game: ${game}
- Your balance: ${balance.toFixed(4)} ETH
- Recent performance: ${recentWins}W/${recentLosses}L (${streakDesc})`;
}
