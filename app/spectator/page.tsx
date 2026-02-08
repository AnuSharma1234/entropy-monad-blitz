"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Filter, Send, Zap, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";

const MOCK_ACTIVITIES = [
  {
    id: 1,
    agentId: 1,
    agentName: "CYBER_GAMBLER_420",
    game: "MINES",
    action: "BET_PLACED",
    amount: "0.5 MON",
    time: "2s ago",
    outcome: null,
  },
  {
    id: 2,
    agentId: 2,
    agentName: "DEGEN_MASTER_9000",
    game: "PLINKO",
    action: "WIN",
    amount: "0.3 MON",
    payout: "+1.2 MON",
    time: "15s ago",
    outcome: "win",
  },
  {
    id: 3,
    agentId: 3,
    agentName: "RISK_TAKER_777",
    game: "DICE",
    action: "LOSS",
    amount: "1.0 MON",
    time: "32s ago",
    outcome: "loss",
  },
  {
    id: 4,
    agentId: 1,
    agentName: "CYBER_GAMBLER_420",
    game: "COINFLIP",
    action: "WIN",
    amount: "0.2 MON",
    payout: "+0.39 MON",
    time: "1m ago",
    outcome: "win",
  },
  {
    id: 5,
    agentId: 4,
    agentName: "ANALYTICAL_BOT_42",
    game: "MINES",
    action: "CASHOUT",
    amount: "0.15 MON",
    payout: "+0.45 MON",
    time: "2m ago",
    outcome: "win",
  },
];

const MOCK_CHAT = [
  { id: 1, user: "0x742d...e8f9", message: "CYBER_GAMBLER on fire today!", time: "1m ago" },
  { id: 2, user: "0x891a...c2d4", message: "Following DEGEN_MASTER strategy", time: "3m ago" },
  { id: 3, user: "0x5f3e...7b8a", message: "Plinko odds looking good rn", time: "5m ago" },
];

type GameFilter = "ALL" | "MINES" | "PLINKO" | "DICE" | "COINFLIP";

export default function SpectatorPage() {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT);
  const [newMessage, setNewMessage] = useState("");
  const [gameFilter, setGameFilter] = useState<GameFilter>("ALL");

  const filteredActivities = activities.filter(
    (activity) => gameFilter === "ALL" || activity.game === gameFilter
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: chatMessages.length + 1,
      user: "0xYour...Addr",
      message: newMessage,
      time: "just now",
    };

    setChatMessages([message, ...chatMessages]);
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      
      <main className="flex-1 p-6 space-y-6 page-enter overflow-auto max-w-7xl mx-auto w-full">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
            ● LIVE_SPECTATOR_MODE
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight">
            SPECTATOR_FEED<span className="text-neon-green">.LIVE</span>
          </h1>
          <p className="text-[11px] font-mono text-gray-500 mt-2">
            Watch AI agents bet in real-time. All bets streamed live from Monad testnet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-white/[0.12] bg-white/[0.04] p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  Filter by Game
                </div>
                
                <div className="flex gap-2">
                  {(["ALL", "MINES", "PLINKO", "DICE", "COINFLIP"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGameFilter(filter)}
                      className={`px-3 py-1 text-[10px] font-mono uppercase border transition-colors ${
                        gameFilter === filter
                          ? "bg-neon-green/10 text-neon-green border-neon-green"
                          : "text-gray-400 border-white/[0.12] hover:border-white/[0.24]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-mono text-gray-500 uppercase">
                  Live Activity Feed
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-dot online" />
                  <span className="text-[10px] font-mono text-neon-green uppercase">
                    {filteredActivities.length} Active
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 border transition-all hover:border-white/[0.24] ${
                      activity.outcome === "win"
                        ? "bg-neon-green/5 border-neon-green/20"
                        : activity.outcome === "loss"
                        ? "bg-error/5 border-error/20"
                        : "bg-black/20 border-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            href={`/agent/${activity.agentId}`}
                            className="text-sm font-mono font-bold text-white hover:text-neon-green transition-colors"
                          >
                            {activity.agentName}
                          </Link>
                          <span className="text-[10px] font-mono text-gray-500">•</span>
                          <span className="text-[10px] font-mono text-neon-green uppercase font-bold">
                            {activity.game}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className={`uppercase font-bold ${
                            activity.outcome === "win"
                              ? "text-neon-green"
                              : activity.outcome === "loss"
                              ? "text-error"
                              : "text-gray-400"
                          }`}>
                            {activity.action}
                          </span>
                          <span className="text-gray-400">{activity.amount}</span>
                          {activity.payout && (
                            <>
                              <span className="text-gray-500">→</span>
                              <span className={
                                activity.payout.startsWith("+") ? "text-neon-green" : "text-error"
                              }>
                                {activity.payout}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-[10px] font-mono text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Live Chat
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neon-green">{msg.user}</span>
                      <span className="text-[10px] font-mono text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm font-mono text-white">{msg.message}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" variant="default" size="sm" fullWidth>
                  <Send className="w-3 h-3 mr-2" />
                  Send
                </Button>
              </form>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Quick Stats
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Total Bets Today</div>
                  <div className="text-2xl font-bold font-mono text-white">1,247</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Volume (24h)</div>
                  <div className="text-2xl font-bold font-mono text-neon-green">142.5 MON</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Active Agents</div>
                  <div className="text-2xl font-bold font-mono text-white">34</div>
                </div>
              </div>
            </div>

            <div className="border border-white/[0.12] bg-white/[0.04] p-6">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
                Actions
              </div>
              
              <div className="space-y-2">
                <Link href="/agent/create">
                  <Button variant="default" size="sm" fullWidth>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Agent
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" size="sm" fullWidth>
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" fullWidth>
                    Dashboard
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
