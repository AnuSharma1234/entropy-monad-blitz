"use client";

import { Header } from "@/components/ui/Header";
import { useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock market data - in production, fetch from API
const MOCK_MARKETS = [
  {
    id: "1",
    title: "Will BTC hit $100k by Mar 15?",
    category: "Crypto",
    description: "Bitcoin price prediction market",
    totalStake: 125500,
    participants: 342,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    odds: { yes: 1.65, no: 2.4 },
    status: "ACTIVE",
  },
  {
    id: "2",
    title: "Will ETH outperform BTC this month?",
    category: "Crypto",
    description: "Ethereum vs Bitcoin performance comparison",
    totalStake: 87300,
    participants: 218,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    odds: { yes: 1.85, no: 2.1 },
    status: "ACTIVE",
  },
  {
    id: "3",
    title: "Monad mainnet launch before Q2?",
    category: "Protocol",
    description: "Monad blockchain mainnet launch timeline",
    totalStake: 156800,
    participants: 512,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    odds: { yes: 2.1, no: 1.75 },
    status: "ACTIVE",
  },
  {
    id: "4",
    title: "Will XRP reach $2 by Q2 2026?",
    category: "Crypto",
    description: "XRP price target market",
    totalStake: 98200,
    participants: 289,
    expiresAt: new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000),
    odds: { yes: 1.55, no: 2.6 },
    status: "ACTIVE",
  },
];

export default function MarketsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatStake = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-8 page-enter">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">
              ENTROPY / SIDEBETS MARKET
            </div>
            <h1 className="text-4xl font-black font-mono text-white tracking-tight italic">
              Active Markets
            </h1>
            <p className="text-xs font-mono text-gray-500 mt-2 max-w-md">
              Join prediction markets, stake positions, and settle outcomes. All bets are secured by Monad smart contracts.
            </p>
          </div>

          {/* Create Market Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-mono text-sm font-bold hover:bg-white transition-all duration-300 rounded-none border-2 border-neon-green hover:border-white"
          >
            <Plus className="w-4 h-4" />
            Create Market
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-white/5 bg-white/[0.02] p-4 rounded-none">
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Active Markets</div>
            <div className="text-2xl font-mono font-bold text-neon-green">{MOCK_MARKETS.length}</div>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-4 rounded-none">
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Total Staked</div>
            <div className="text-2xl font-mono font-bold text-white">
              {formatStake(MOCK_MARKETS.reduce((sum, m) => sum + m.totalStake, 0))}
            </div>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-4 rounded-none">
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Total Participants</div>
            <div className="text-2xl font-mono font-bold text-white">
              {MOCK_MARKETS.reduce((sum, m) => sum + m.participants, 0).toLocaleString()}
            </div>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-4 rounded-none">
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">24h Volume</div>
            <div className="text-2xl font-mono font-bold text-neon-green">$842K</div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 gap-4">
          {MOCK_MARKETS.map((market) => (
            <Link key={market.id} href={`/markets/${market.id}`} className="block group">
              <div className="border border-white/[0.12] bg-white/[0.04] p-6">
                <h3 className="text-lg font-mono font-bold text-white">{market.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="border border-white/5 bg-white/[0.02] p-5 flex items-start gap-4">
          <TrendingUp className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-mono text-white uppercase font-bold">Smart Contract Secured</div>
            <div className="text-[10px] font-mono text-gray-600 mt-1 leading-relaxed">
              All markets are governed by transparent smart contracts. Stakes are held in the SidebetFactory contract until settlement. Market resolution uses decentralized oracles (Chainlink, Tellor) for accuracy and tamper-resistance.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="text-[10px] font-mono text-gray-700">ENTROPY_PROTOCOL // MONAD</div>
        <div className="text-[10px] font-mono text-gray-700">{MOCK_MARKETS.length} MARKETS ACTIVE</div>
      </footer>
    </div>
  );
}
