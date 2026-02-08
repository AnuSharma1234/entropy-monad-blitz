"use client";

import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { ArrowUpRight, Landmark, Zap, ShieldAlert, TrendingUp, Shovel, Grid3X3, Download, Upload } from "lucide-react";
import Link from "next/link";

const MOCK_DATA = {
  totalValue: 43406.42,
  principal: 42069.0,
  yieldGen: 1337.42,
  riskLevel: "LOW_MOD",
  apy: 18.4,
  apyChange: "+2.1%",
};

const MOCK_FEED = [
  { time: "14:22:41", event: "YIELD_CLAIM: SUCCESS → VAL_CORE_#2", amount: "+$12.42", color: "text-neon-green" },
  { time: "13:40:09", event: "GOV_TX_#124: VOTE_AFFIRMATIVE", amount: "", color: "text-gray-500" },
  { time: "12:18:32", event: "REBALANCE: AUTO_HEDGE_TRIGGER18 → HEDGR_PRO", amount: "", color: "text-gray-500" },
];

export default function Dashboard() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="border border-white/10 bg-black p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-mono font-bold text-neon-green mb-2">ACCESS RESTRICTED</h2>
            <p className="text-xs font-mono text-gray-500">Connect your wallet to access the command center.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden lg:flex" />

        <main className="flex-1 p-6 space-y-6 page-enter overflow-auto">
          {/* Title */}
          <div>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">
              ● AUTHENTICATION_SUCCESS
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight">
              COMMAND_CENTER<span className="text-neon-green">.EXE</span>
            </h1>
          </div>

          {/* Main balance card */}
          <div className="border border-white/5 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="status-dot online" />
              <span className="text-[10px] font-mono text-gray-500 uppercase">NET_AGGREGATE_VALUATION</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-black font-mono text-white">
                ${MOCK_DATA.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm font-mono text-neon-green flex items-center gap-1">
                +2.4% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-gray-600 uppercase">Principal</span>
                <Landmark className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-1">
                ${MOCK_DATA.principal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] font-mono text-gray-600 uppercase">
                NODE_VERIFIED: YES
              </div>
            </div>

            <div className="border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-gray-600 uppercase">Yield_Gen</span>
                <Zap className="w-3.5 h-3.5 text-neon-green" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-1">
                ${MOCK_DATA.yieldGen.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] font-mono text-neon-green uppercase">
                +13.4% PERFORMANCE
              </div>
            </div>

            <div className="border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-gray-600 uppercase">Risk_Level</span>
                <ShieldAlert className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mb-1">
                {MOCK_DATA.riskLevel}
              </div>
              <div className="text-[10px] font-mono text-gray-600 uppercase">
                MODE_NEUTRAL: ACTIVE
              </div>
            </div>
          </div>

          {/* APY Chart + Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* APY Chart area */}
            <div className="border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">APY_FLUX_PROTOCOL</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black font-mono text-white">{MOCK_DATA.apy}%</span>
                    <span className="text-xs font-mono text-neon-green">{MOCK_DATA.apyChange}</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-gray-600 uppercase">7D_DELTA</div>
              </div>

              {/* Simulated chart area */}
              <div className="h-32 relative chart-glow border-b border-white/5">
                <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,255,136,0.15)" />
                      <stop offset="100%" stopColor="rgba(0,255,136,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 Q30,70 60,65 T120,55 T180,40 T240,45 T300,30"
                    fill="none"
                    stroke="#00FF88"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0,80 Q30,70 60,65 T120,55 T180,40 T240,45 T300,30 L300,100 L0,100 Z"
                    fill="url(#chartGrad)"
                  />
                </svg>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between text-[9px] font-mono text-gray-700 px-2">
                  <span>MON</span>
                  <span>WED</span>
                  <span>FRI</span>
                  <span>SUN</span>
                </div>
              </div>
            </div>

            {/* Action buttons grid */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/stake">
                <button className="w-full h-full min-h-[100px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-neon-green/20 transition-all flex flex-col items-center justify-center gap-3 p-4 group">
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-neon-green transition-colors" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Stake</span>
                </button>
              </Link>
              <Link href="/stake?mode=withdraw">
                <button className="w-full h-full min-h-[100px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all flex flex-col items-center justify-center gap-3 p-4 group">
                  <Download className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Withdraw</span>
                </button>
              </Link>
              <Link href="/games/mines">
                <button className="w-full h-full min-h-[100px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-neon-green/20 transition-all flex flex-col items-center justify-center gap-3 p-4 group">
                  <Shovel className="w-6 h-6 text-gray-500 group-hover:text-neon-green transition-colors" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Mines</span>
                </button>
              </Link>
              <Link href="/games/plinko">
                <button className="w-full h-full min-h-[100px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-neon-green/20 transition-all flex flex-col items-center justify-center gap-3 p-4 group">
                  <Grid3X3 className="w-6 h-6 text-gray-500 group-hover:text-neon-green transition-colors" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Plinko</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Live Sequence Stream */}
          <div className="border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="status-dot online" />
                <span className="text-[10px] font-mono text-gray-500 uppercase">Live_Sequence_Stream</span>
              </div>
              <span className="text-[10px] font-mono text-gray-700">ID_0029461</span>
            </div>

            <div className="space-y-0">
              {MOCK_FEED.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-t border-white/5 first:border-t-0">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-gray-700">{item.time}</span>
                    <span className="text-xs font-mono text-gray-400">{item.event}</span>
                  </div>
                  {item.amount && (
                    <span className={`text-xs font-mono font-bold ${item.color}`}>{item.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
