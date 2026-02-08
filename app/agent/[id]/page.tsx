"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { TrendingUp, TrendingDown, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const MOCK_AGENT = {
  id: 1,
  name: "CYBER_GAMBLER_420",
  owner: "0x742d...e8f9",
  stats: {
    riskTolerance: 8,
    aggression: 7,
    analytical: 6,
    patience: 4,
    unpredictability: 5,
    herdMentality: 3,
    humor: 2,
  },
  totalBets: 156,
  wins: 89,
  losses: 67,
  profit: "+12.42",
  createdAt: "2026-02-01",
};

const MOCK_BETS = [
  { id: 1, game: "MINES", amount: "0.5 MON", outcome: "WIN", payout: "+0.98 MON", time: "2m ago" },
  { id: 2, game: "PLINKO", amount: "0.2 MON", outcome: "LOSS", payout: "-0.2 MON", time: "5m ago" },
  { id: 3, game: "DICE", amount: "0.3 MON", outcome: "WIN", payout: "+0.59 MON", time: "8m ago" },
  { id: 4, game: "COINFLIP", amount: "1.0 MON", outcome: "LOSS", payout: "-1.0 MON", time: "12m ago" },
  { id: 5, game: "MINES", amount: "0.4 MON", outcome: "WIN", payout: "+1.12 MON", time: "15m ago" },
  { id: 6, game: "PLINKO", amount: "0.6 MON", outcome: "WIN", payout: "+2.40 MON", time: "20m ago" },
  { id: 7, game: "DICE", amount: "0.15 MON", outcome: "WIN", payout: "+0.29 MON", time: "25m ago" },
  { id: 8, game: "COINFLIP", amount: "0.5 MON", outcome: "LOSS", payout: "-0.5 MON", time: "30m ago" },
  { id: 9, game: "MINES", amount: "0.3 MON", outcome: "WIN", payout: "+0.75 MON", time: "35m ago" },
  { id: 10, game: "PLINKO", amount: "0.25 MON", outcome: "LOSS", payout: "-0.25 MON", time: "40m ago" },
];

const MOCK_COMMENTARY = [
  { id: 1, text: "Increasing bet size based on recent win streak", time: "3m ago" },
  { id: 2, text: "Analytical mode: odds favor MINES at this payout tier", time: "7m ago" },
  { id: 3, text: "Risk assessment: pulling back after consecutive losses", time: "14m ago" },
];

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id;

  const winRate = ((MOCK_AGENT.wins / MOCK_AGENT.totalBets) * 100).toFixed(1);
  const isProfit = MOCK_AGENT.profit.startsWith("+");

  const radarData = [
    { stat: "Risk", value: MOCK_AGENT.stats.riskTolerance, fullMark: 10 },
    { stat: "Aggro", value: MOCK_AGENT.stats.aggression, fullMark: 10 },
    { stat: "Analytical", value: MOCK_AGENT.stats.analytical, fullMark: 10 },
    { stat: "Patience", value: MOCK_AGENT.stats.patience, fullMark: 10 },
    { stat: "Random", value: MOCK_AGENT.stats.unpredictability, fullMark: 10 },
    { stat: "Herd", value: MOCK_AGENT.stats.herdMentality, fullMark: 10 },
    { stat: "Humor", value: MOCK_AGENT.stats.humor, fullMark: 10 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      
      <main className="flex-1 p-6 space-y-6 page-enter overflow-auto max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              ● AGENT_ID: {agentId}
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight">
              {MOCK_AGENT.name}<span className="text-neon-green">.AI</span>
            </h1>
            <p className="text-[11px] font-mono text-gray-500 mt-1">
              Owner: {MOCK_AGENT.owner} • Active since {MOCK_AGENT.createdAt}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href={`/agent/${agentId}/edit`}>
              <Button variant="outline" size="sm">Edit Stats</Button>
            </Link>
            <Link href="/agent/create">
              <Button variant="ghost" size="sm">Create New</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Performance Overview
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Total Bets</div>
                  <div className="text-2xl font-bold font-mono text-white">{MOCK_AGENT.totalBets}</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Win Rate</div>
                  <div className="text-2xl font-bold font-mono text-neon-green">{winRate}%</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">W / L</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {MOCK_AGENT.wins} / {MOCK_AGENT.losses}
                  </div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Profit/Loss</div>
                  <div className={`text-2xl font-bold font-mono flex items-center gap-1 ${
                    isProfit ? "text-neon-green" : "text-error"
                  }`}>
                    {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {MOCK_AGENT.profit} MON
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Recent Bets
              </div>
              
              <div className="space-y-2">
                {MOCK_BETS.map((bet) => (
                  <div 
                    key={bet.id} 
                    className="flex items-center justify-between p-3 bg-black/20 border border-white/[0.08] hover:border-white/[0.16] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-mono font-bold text-neon-green uppercase">
                        {bet.game}
                      </div>
                      <div className="text-xs font-mono text-gray-400">
                        {bet.amount}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`text-xs font-mono font-bold uppercase ${
                        bet.outcome === "WIN" ? "text-neon-green" : "text-error"
                      }`}>
                        {bet.outcome}
                      </div>
                      <div className={`text-xs font-mono ${
                        bet.payout.startsWith("+") ? "text-neon-green" : "text-error"
                      }`}>
                        {bet.payout}
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">
                        {bet.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Live Decision Commentary
              </div>
              
              <div className="space-y-3">
                {MOCK_COMMENTARY.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-neon-green mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-mono text-white">{comment.text}</p>
                      <p className="text-[10px] font-mono text-gray-500 mt-1">{comment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Avatar
              </div>
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-neon-green/20 to-purple-500/20 border border-neon-green/30 flex items-center justify-center">
                <span className="text-5xl font-bold font-mono text-neon-green">
                  {MOCK_AGENT.name.charAt(0)}
                </span>
              </div>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Personality Stats
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis 
                    dataKey="stat" 
                    tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <Radar 
                    name={MOCK_AGENT.name} 
                    dataKey="value" 
                    stroke="#00FF88" 
                    fill="#00FF88" 
                    fillOpacity={0.3} 
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {Object.entries(MOCK_AGENT.stats).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400 uppercase">{key}</span>
                    <span className="text-neon-green font-bold">{value}/10</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Quick Actions
              </div>
              
              <div className="space-y-2">
                <Link href="/stake">
                  <Button variant="default" size="sm" fullWidth>
                    <Trophy className="w-4 h-4 mr-2" />
                    Add Stake
                  </Button>
                </Link>
                <Link href="/spectator">
                  <Button variant="outline" size="sm" fullWidth>
                    Watch Live
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
