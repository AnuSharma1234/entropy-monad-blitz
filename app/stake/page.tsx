"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { useAgentPool } from "@/hooks/useAgentPool";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const MOCK_POSITIONS = [
  {
    asset: "ETH/CYBER-LP",
    balance: "4.2001 ETH",
    yield: "+0.124 ETH",
    lock: "~14h 22m",
    locked: true,
  },
  {
    asset: "CYBER-NODE",
    balance: "1,200.00 CYBR",
    yield: "+45.50 CYBR",
    lock: "UNLOCKED",
    locked: false,
  },
];

function StakePageContent() {
  const searchParams = useSearchParams();
  const agentIdParam = searchParams.get("agentId");
  const agentId = agentIdParam ? BigInt(agentIdParam) : 1n;
  const [stakeAmount, setStakeAmount] = useState("1.50");
  const [withdrawAmount, setWithdrawAmount] = useState("4.20");
  const [stakeMode, setStakeMode] = useState<"stake" | "withdraw">("stake");
  const { isConnected, balance } = useWallet();
  
  const {
    deposit,
    requestWithdraw,
    withdraw,
    balance: stakedBalance,
    refetchBalance,
    isDepositPending,
    isDepositConfirming,
    isDepositSuccess,
    isRequestWithdrawPending,
    isWithdrawPending,
    isWithdrawConfirming,
    isWithdrawSuccess,
    isBalanceLoading,
  } = useAgentPool(agentId);

  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess) {
      refetchBalance();
    }
  }, [isDepositSuccess, isWithdrawSuccess, refetchBalance]);

  const handleStake = () => {
    const amount = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));
    deposit(amount);
  };

  const handleRequestWithdraw = () => {
    const amount = BigInt(Math.floor(parseFloat(withdrawAmount) * 1e18));
    requestWithdraw(amount);
  };

  const handleWithdraw = () => {
    withdraw();
  };

  const formatBalance = (bal: bigint | undefined) => {
    if (!bal) return "0.00";
    return (Number(bal) / 1e18).toFixed(4);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-48 shrink-0 border-r border-white/[0.1] bg-black flex-col p-4 space-y-1">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-neon-green flex items-center justify-center">
                <span className="text-black text-[10px] font-bold">⚡</span>
              </div>
              <span className="text-xs font-mono font-bold text-white uppercase">CyberStake</span>
            </div>
          </div>

          {[
            { label: "Overview", active: false },
            { label: "Stake", active: true },
            { label: "Withdraw", active: false },
            { label: "History", active: false },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Stake") setStakeMode("stake");
                if (item.label === "Withdraw") setStakeMode("withdraw");
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all w-full text-left border-l-2",
                item.active || (item.label === "Stake" && stakeMode === "stake") || (item.label === "Withdraw" && stakeMode === "withdraw")
                  ? "bg-neon-green/10 text-neon-green border-neon-green"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06] border-transparent"
              )}
            >
              <span className="uppercase">{item.label}</span>
            </button>
          ))}

          <div className="flex-1" />

          {/* Protocol Status */}
          <div className="border border-white/[0.12] p-3">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Protocol Status</div>
            <div className="flex items-center gap-1.5">
              <span className="status-dot online" />
              <span className="text-[10px] font-mono text-neon-green uppercase">Mainnet V2.1.0 Online</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 space-y-6 page-enter overflow-auto">
          {/* Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight italic mb-1">
                Staking & Liquidity
              </h1>
              <p className="text-[11px] font-mono text-gray-500">
                Yield-funded on-chain gaming infrastructure. Secure your assets in the dark-web vault.
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-gray-500 uppercase mb-0.5">Total Value Locked</div>
              <div className="text-xl font-bold font-mono text-white">$42,901,054.21</div>
            </div>
          </div>

          {/* Stake & Unstake panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* STAKE panel */}
            <div className="border border-white/[0.12] bg-white/[0.04] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Panel_ID: STAKE_01</div>
                  <h2 className="text-lg font-mono font-bold text-white uppercase">Stake Assets</h2>
                </div>
                <span className="border border-neon-green/30 bg-neon-green/10 text-neon-green text-[10px] font-mono px-2 py-0.5 uppercase">
                  APR: 24.5%
                </span>
              </div>

              {/* Stake/Withdraw toggle */}
              <div className="grid grid-cols-2 gap-0 border border-white/[0.14]">
                <button
                  onClick={() => setStakeMode("stake")}
                  className={cn(
                    "text-xs font-mono py-2.5 uppercase transition-all",
                    stakeMode === "stake"
                      ? "bg-white text-black font-bold"
                      : "text-gray-400 hover:bg-white/[0.06]"
                  )}
                >
                  Stake
                </button>
                <button
                  onClick={() => setStakeMode("withdraw")}
                  className={cn(
                    "text-xs font-mono py-2.5 uppercase transition-all",
                    stakeMode === "withdraw"
                      ? "bg-white text-black font-bold"
                      : "text-gray-400 hover:bg-white/[0.06]"
                  )}
                >
                  Withdraw
                </button>
              </div>

              {/* Amount to Stake */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-gray-400 uppercase">
                  <span>Amount to Stake</span>
                  <span>Staked: {formatBalance(stakedBalance as bigint | undefined)} ETH</span>
                </div>
                <div className="flex items-center border border-white/[0.14] bg-white/[0.04]">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 bg-transparent text-xl font-mono font-bold text-white px-3 py-3 outline-none"
                  />
                  <span className="text-xs font-mono text-gray-400 px-2">ETH</span>
                  <button 
                    className="text-[10px] font-mono text-neon-green border-l border-white/[0.14] px-3 py-3 hover:bg-white/[0.06] uppercase"
                    onClick={() => {
                      if (typeof balance === 'object' && balance?.formatted) {
                        setStakeAmount(balance.formatted);
                      } else {
                        setStakeAmount(balance?.toString() || "0");
                      }
                    }}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Estimates */}
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between text-gray-500">
                  <span className="text-[11px] uppercase">Est. Daily Yield</span>
                  <span className="text-neon-green text-[11px]">+0.001 ETH</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="text-[11px] uppercase">Gas Estimate</span>
                  <span className="text-[11px]">~0.0042 ETH</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="text-[11px] uppercase">Lock-up Duration</span>
                  <span className="text-[11px]">72H MINIMUM</span>
                </div>
              </div>

              {/* Confirm button */}
              <button 
                onClick={handleStake}
                disabled={isDepositPending || isDepositConfirming || !stakeAmount}
                className="w-full bg-neon-green text-black font-mono font-bold text-sm uppercase py-3.5 hover:bg-[#00CC6A] transition-colors neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDepositPending 
                  ? "Waiting for Signature..." 
                  : isDepositConfirming 
                  ? "Confirming..." 
                  : "Confirm Stake"}
              </button>
            </div>

            {/* UNSTAKE / CLAIM panel */}
            <div className="border border-white/[0.12] bg-white/[0.04] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Panel_ID: STAKE_02</div>
                  <h2 className="text-lg font-mono font-bold text-white uppercase">Unstake / Claim</h2>
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  Staked: {formatBalance(stakedBalance as bigint | undefined)} ETH
                </span>
              </div>

              {/* Amount to withdraw */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Amount to Withdraw</div>
                <div className="flex items-center border border-white/[0.14] bg-white/[0.04]">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="flex-1 bg-transparent text-xl font-mono font-bold text-white px-3 py-3 outline-none"
                  />
                  <span className="text-xs font-mono text-gray-400 px-3">ETH</span>
                </div>
              </div>

              {/* Withdrawal penalty alert */}
              <div className="border border-warning/30 bg-warning/5 p-4 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-warning uppercase mb-1">
                    24H Cooldown Required
                  </h4>
                  <p className="text-[10px] font-mono text-gray-400 leading-relaxed">
                    First call requestWithdraw() to start 24-hour cooldown. After cooldown expires, call withdraw() to claim funds.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleRequestWithdraw}
                  disabled={isRequestWithdrawPending || !withdrawAmount}
                  className="flex-1 border border-warning text-warning font-mono font-bold text-sm uppercase py-3.5 hover:bg-warning/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRequestWithdrawPending ? "Requesting..." : "Request Withdraw"}
                </button>
                
                <button 
                  onClick={handleWithdraw}
                  disabled={isWithdrawPending || isWithdrawConfirming}
                  className="flex-1 border border-neon-green text-neon-green font-mono font-bold text-sm uppercase py-3.5 hover:bg-neon-green/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawPending 
                    ? "Waiting..." 
                    : isWithdrawConfirming 
                    ? "Confirming..." 
                    : "Withdraw"}
                </button>
              </div>
            </div>
          </div>

          {/* Active Node Positions */}
          <div className="border border-white/[0.12] bg-white/[0.04]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.1]">
              <h2 className="text-sm font-mono font-bold text-white uppercase">Active Node Positions</h2>
              <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Sync Status: Optimal</span>
                <span className="status-dot online" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-mono text-gray-500 uppercase border-b border-white/[0.1]">
                    <th className="px-5 py-3">Asset Identifier</th>
                    <th className="px-5 py-3">Staked Balance</th>
                    <th className="px-5 py-3">Yield Accrued</th>
                    <th className="px-5 py-3">Lock Status</th>
                    <th className="px-5 py-3">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_POSITIONS.map((pos, i) => (
                    <tr key={i} className="border-b border-white/[0.08] last:border-b-0 hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-4 flex items-center gap-2">
                        <div className="w-6 h-6 border border-white/[0.14] bg-white/[0.06] flex items-center justify-center">
                          <span className="text-[10px] font-mono text-gray-400">⊙</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">{pos.asset}</span>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-white">{pos.balance}</td>
                      <td className="px-5 py-4 text-xs font-mono text-neon-green">{pos.yield}</td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-[10px] font-mono px-2 py-0.5 border uppercase",
                            pos.locked
                              ? "border-warning/30 text-warning"
                              : "border-neon-green/30 text-neon-green"
                          )}
                        >
                          {pos.lock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-[10px] font-mono text-neon-green uppercase hover:underline">
                          Manage_Link
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom footer bar */}
      <footer className="border-t border-white/[0.1] px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-gray-500">
          © 2024 CYBERSTAKE LABS // CORE_OS
        </span>
        <div className="flex gap-6 text-[10px] font-mono">
          <span className="text-neon-green">GAS: 12 GWEI</span>
          <span className="text-gray-500">BLOCK: 19482031</span>
        </div>
      </footer>
    </div>
  );
}

function StakePageFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm font-mono text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function StakePage() {
  return (
    <Suspense fallback={<StakePageFallback />}>
      <StakePageContent />
    </Suspense>
  );
}
