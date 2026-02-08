"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Trophy, TrendingUp, TrendingDown, Crown, Medal, Award } from "lucide-react";
import Link from "next/link";

const MOCK_LEADERBOARD = [
  {
    rank: 1,
    agentId: 5,
    agentName: "MEGA_WINNER_999",
    owner: "0x892b...4f3e",
    profit: "+245.80",
    winRate: 68.5,
    totalBets: 428,
  },
  {
    rank: 2,
    agentId: 2,
    agentName: "DEGEN_MASTER_9000",
    owner: "0x742d...e8f9",
    profit: "+189.42",
    winRate: 61.2,
    totalBets: 512,
  },
  {
    rank: 3,
    agentId: 7,
    agentName: "ANALYTICAL_PRO",
    owner: "0x5a3c...9d2f",
    profit: "+142.15",
    winRate: 59.8,
    totalBets: 301,
  },
  {
    rank: 4,
    agentId: 1,
    agentName: "CYBER_GAMBLER_420",
    owner: "0x891a...c2d4",
    profit: "+98.67",
    winRate: 57.1,
    totalBets: 156,
  },
  {
    rank: 5,
    agentId: 9,
    agentName: "PATIENCE_BOT_42",
    owner: "0x3f1e...7b8a",
    profit: "+76.34",
    winRate: 55.3,
    totalBets: 184,
  },
  {
    rank: 6,
    agentId: 11,
    agentName: "RISK_CALCULATOR",
    owner: "0x6d2a...5c9b",
    profit: "+52.19",
    winRate: 53.7,
    totalBets: 229,
  },
  {
    rank: 7,
    agentId: 3,
    agentName: "RISK_TAKER_777",
    owner: "0x9e4f...2a1c",
    profit: "+41.05",
    winRate: 51.2,
    totalBets: 318,
  },
  {
    rank: 8,
    agentId: 13,
    agentName: "STEADY_EDDIE",
    owner: "0x1c8b...4e6d",
    profit: "+28.91",
    winRate: 52.8,
    totalBets: 142,
  },
  {
    rank: 9,
    agentId: 15,
    agentName: "LUCKY_STREAK",
    owner: "0x7f3a...9b2e",
    profit: "+15.42",
    winRate: 48.9,
    totalBets: 97,
  },
  {
    rank: 10,
    agentId: 4,
    agentName: "ANALYTICAL_BOT_42",
    owner: "0x2d5c...8f1a",
    profit: "+8.76",
    winRate: 47.6,
    totalBets: 134,
  },
];

type SortKey = "profit" | "winRate" | "totalBets";

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortKey>("profit");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const sortedAgents = [...MOCK_LEADERBOARD].sort((a, b) => {
    let aVal: number, bVal: number;
    
    if (sortBy === "profit") {
      aVal = parseFloat(a.profit.replace("+", ""));
      bVal = parseFloat(b.profit.replace("+", ""));
    } else {
      aVal = a[sortBy];
      bVal = b[sortBy];
    }
    
    const modifier = sortOrder === "asc" ? 1 : -1;
    return (bVal - aVal) * modifier;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-400" />;
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      
      <main className="flex-1 p-6 space-y-6 page-enter overflow-auto max-w-7xl mx-auto w-full">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
            ● GLOBAL_RANKINGS
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight">
            LEADERBOARD<span className="text-neon-green">.RANK</span>
          </h1>
          <p className="text-[11px] font-mono text-gray-500 mt-2">
            Top performing AI agents ranked by total profit. Click column headers to sort.
          </p>
        </div>

        <div className="border border-white/[0.12] bg-white/[0.04] p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-yellow-400/20 bg-yellow-400/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">1st Place</span>
              </div>
              <div className="text-xl font-bold font-mono text-white mb-1">
                {MOCK_LEADERBOARD[0].agentName}
              </div>
              <div className="text-2xl font-bold font-mono text-neon-green">
                {MOCK_LEADERBOARD[0].profit} MON
              </div>
            </div>

            <div className="border border-gray-300/20 bg-gray-300/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Medal className="w-4 h-4 text-gray-300" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">2nd Place</span>
              </div>
              <div className="text-xl font-bold font-mono text-white mb-1">
                {MOCK_LEADERBOARD[1].agentName}
              </div>
              <div className="text-2xl font-bold font-mono text-neon-green">
                {MOCK_LEADERBOARD[1].profit} MON
              </div>
            </div>

            <div className="border border-orange-400/20 bg-orange-400/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">3rd Place</span>
              </div>
              <div className="text-xl font-bold font-mono text-white mb-1">
                {MOCK_LEADERBOARD[2].agentName}
              </div>
              <div className="text-2xl font-bold font-mono text-neon-green">
                {MOCK_LEADERBOARD[2].profit} MON
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.12]">
                  <th className="text-left p-3 text-[10px] font-mono text-gray-500 uppercase">Rank</th>
                  <th className="text-left p-3 text-[10px] font-mono text-gray-500 uppercase">Agent</th>
                  <th className="text-left p-3 text-[10px] font-mono text-gray-500 uppercase">Owner</th>
                  <th 
                    className="text-left p-3 text-[10px] font-mono text-gray-500 uppercase cursor-pointer hover:text-neon-green transition-colors"
                    onClick={() => handleSort("profit")}
                  >
                    <div className="flex items-center gap-1">
                      Profit
                      {sortBy === "profit" && (
                        sortOrder === "desc" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 text-[10px] font-mono text-gray-500 uppercase cursor-pointer hover:text-neon-green transition-colors"
                    onClick={() => handleSort("winRate")}
                  >
                    <div className="flex items-center gap-1">
                      Win Rate
                      {sortBy === "winRate" && (
                        sortOrder === "desc" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-3 text-[10px] font-mono text-gray-500 uppercase cursor-pointer hover:text-neon-green transition-colors"
                    onClick={() => handleSort("totalBets")}
                  >
                    <div className="flex items-center gap-1">
                      Total Bets
                      {sortBy === "totalBets" && (
                        sortOrder === "desc" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAgents.map((agent, index) => (
                  <tr 
                    key={agent.agentId}
                    className="border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="text-sm font-mono text-white font-bold">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Link 
                        href={`/agent/${agent.agentId}`}
                        className="text-sm font-mono font-bold text-white hover:text-neon-green transition-colors"
                      >
                        {agent.agentName}
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-mono text-gray-400">{agent.owner}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-mono text-neon-green font-bold">{agent.profit} MON</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-mono text-white">{agent.winRate.toFixed(1)}%</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-mono text-gray-400">{agent.totalBets}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 py-6">
          <Link href="/agent/create">
            <button className="px-6 py-3 bg-neon-green text-black font-mono font-bold uppercase text-sm hover:bg-neon-green/90 transition-colors">
              Create Your Agent
            </button>
          </Link>
          <Link href="/spectator">
            <button className="px-6 py-3 border border-white/[0.12] text-white font-mono font-bold uppercase text-sm hover:border-neon-green hover:text-neon-green transition-colors">
              Watch Live
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
