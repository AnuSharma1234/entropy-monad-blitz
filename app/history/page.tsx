"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { cn } from "@/lib/utils";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const FILTERS = ["All Events", "Stakes", "Wins/Losses", "Withdrawals"];

const MOCK_HISTORY = [
  { date: "2023-10-24 14:02:11", type: "STAKE", hash: "0x71c...8a2f", amount: "+500.00 SOL", status: "SUCCESS" },
  { date: "2023-10-24 13:55:04", type: "WIN", hash: "0x02d...4b1c", amount: "+1,250.50 SOL", status: "SUCCESS" },
  { date: "2023-10-24 12:30:45", type: "LOSE", hash: "0x33a...9f02", amount: "-200.00 SOL", status: "SUCCESS" },
  { date: "2023-10-24 11:15:28", type: "WITHDRAW", hash: "0xbb1...cc44", amount: "-1,000.00 SOL", status: "PENDING" },
  { date: "2023-10-24 10:05:12", type: "STAKE", hash: "0xee4...dd11", amount: "+500.00 SOL", status: "FAILED" },
];

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("All Events");

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-52 shrink-0 border-r border-white/[0.1] bg-black flex-col p-4">
          <div className="mb-6">
            <div className="text-sm font-mono font-bold text-white mb-0.5">NODE_772</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">Verified_Operator_V2</div>
          </div>

          <nav className="space-y-0.5">
            {[
              { label: "Overview", active: false, icon: "◇" },
              { label: "Live Matches", active: false, icon: "⚔" },
              { label: "Vaults", active: false, icon: "▣" },
              { label: "History", active: true, icon: "≡" },
            ].map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-xs font-mono transition-all w-full text-left border-l-2",
                  item.active
                    ? "bg-neon-green/10 text-neon-green border-neon-green"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06] border-transparent"
                )}
              >
                <span>{item.icon}</span>
                <span className="uppercase">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="border border-white/[0.12] p-3">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Network_Status</div>
            <div className="flex items-center gap-1.5">
              <span className="status-dot online" />
              <span className="text-[10px] font-mono text-neon-green uppercase">Operational</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 space-y-6 page-enter overflow-auto">
          {/* Title row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-mono text-gray-500 border border-white/[0.14] px-2 py-0.5 uppercase">
                  LOG_V1.0.4
                </span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Stable_Release</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight italic">
                Transaction_Logs
              </h1>
              <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase">
                Real-time on_chain event_monitoring active
              </p>
            </div>

            <button className="flex items-center gap-2 border border-white/[0.14] px-4 py-2.5 text-xs font-mono text-gray-400 hover:text-white hover:border-white/25 transition-colors uppercase">
              <Download className="w-3.5 h-3.5" />
              Export_CSV
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "text-[10px] font-mono px-4 py-2 border uppercase transition-all",
                  activeFilter === filter
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-white/[0.14] text-gray-400 hover:text-white hover:border-white/25"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-white/[0.12] bg-white/[0.04]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.1]">
                    <th className="px-5 py-4 text-[10px] font-mono text-gray-500 uppercase font-normal">Timestamp</th>
                    <th className="px-5 py-4 text-[10px] font-mono text-gray-500 uppercase font-normal">Event_Type</th>
                    <th className="px-5 py-4 text-[10px] font-mono text-gray-500 uppercase font-normal">TX_Hash</th>
                    <th className="px-5 py-4 text-[10px] font-mono text-gray-500 uppercase font-normal text-right">Amount</th>
                    <th className="px-5 py-4 text-[10px] font-mono text-gray-500 uppercase font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.map((tx, i) => (
                    <tr key={i} className="border-b border-white/[0.08] last:border-b-0 hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-4 text-xs font-mono text-gray-500">{tx.date}</td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-mono px-2.5 py-1 border uppercase",
                            tx.type === "WIN"
                              ? "border-neon-green/30 text-neon-green bg-neon-green/5"
                              : tx.type === "LOSE"
                              ? "border-error/30 text-error bg-error/5"
                              : tx.type === "WITHDRAW"
                              ? "border-warning/30 text-warning bg-warning/5"
                              : "border-white/10 text-gray-400"
                          )}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-gray-500">{tx.hash}</td>
                      <td className={cn(
                        "px-5 py-4 text-xs font-mono text-right font-bold",
                        tx.amount.startsWith("+") ? "text-neon-green" : tx.amount.startsWith("-") ? "text-white" : "text-gray-400"
                      )}>
                        {tx.amount}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={cn(
                            "text-[10px] font-mono px-2.5 py-1 border uppercase",
                            tx.status === "SUCCESS"
                              ? "border-neon-green/30 text-neon-green"
                              : tx.status === "PENDING"
                              ? "border-gray-600 text-gray-500"
                              : "border-error/30 text-error"
                          )}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.1]">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Showing 5 of 128 Events</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 border border-white/[0.14] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/25 transition-colors">
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button className="w-7 h-7 border border-neon-green bg-neon-green/10 text-neon-green flex items-center justify-center text-[10px] font-mono">
                  1
                </button>
                <button className="w-7 h-7 border border-white/[0.14] flex items-center justify-center text-[10px] font-mono text-gray-400 hover:text-white hover:border-white/25 transition-colors">
                  2
                </button>
                <button className="w-7 h-7 border border-white/[0.14] flex items-center justify-center text-gray-500 hover:text-white hover:border-white/25 transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom bar */}
      <footer className="border-t border-white/[0.1] px-4 py-2 flex justify-between items-center">
        <div className="flex gap-4 text-[10px] font-mono text-gray-500">
          <span>⊞ BLOCK: 231,002,118</span>
          <span>⚡ LATENCY: 12ms</span>
        </div>
        <div className="flex gap-4 text-[10px] font-mono text-gray-500">
          <span>CONNECTION: SECURED_SSL_V3</span>
          <span className="text-white font-bold">SYSTEM_NOMINAL</span>
        </div>
      </footer>
    </div>
  );
}
