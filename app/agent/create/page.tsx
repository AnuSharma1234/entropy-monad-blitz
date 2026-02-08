"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWallet } from "@/hooks/useWallet";
import { useAgentRegistry } from "@/hooks/useAgentRegistry";
import { Zap, Sparkles, Brain, Clock, Shuffle, Users, Smile } from "lucide-react";

const STAT_CONFIG = [
  { 
    key: "riskTolerance", 
    label: "Risk Tolerance", 
    icon: Zap,
    description: "Higher = bigger bets, more aggressive stakes"
  },
  { 
    key: "aggression", 
    label: "Aggression", 
    icon: Sparkles,
    description: "Higher = more frequent bets, less patience"
  },
  { 
    key: "analytical", 
    label: "Analytical", 
    icon: Brain,
    description: "Higher = better EV calculation, strategic play"
  },
  { 
    key: "patience", 
    label: "Patience", 
    icon: Clock,
    description: "Higher = long-term focus, waits for good odds"
  },
  { 
    key: "unpredictability", 
    label: "Unpredictability", 
    icon: Shuffle,
    description: "Higher = unexpected plays, random decisions"
  },
  { 
    key: "herdMentality", 
    label: "Herd Mentality", 
    icon: Users,
    description: "Higher = follows trends, copies other agents"
  },
  { 
    key: "humor", 
    label: "Humor", 
    icon: Smile,
    description: "Higher = funny commentary, entertaining chat"
  },
] as const;

type StatKey = typeof STAT_CONFIG[number]["key"];

export default function CreateAgentPage() {
  const router = useRouter();
  const { isConnected, address } = useWallet();
  const { registerAgent, isPending, isConfirming, isSuccess, isError, error, txHash } = useAgentRegistry();
  
  const [agentName, setAgentName] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [stats, setStats] = useState<Record<StatKey, number>>({
    riskTolerance: 5,
    aggression: 5,
    analytical: 5,
    patience: 5,
    unpredictability: 5,
    herdMentality: 5,
    humor: 5,
  });

  const pointsUsed = Object.values(stats).reduce((sum, val) => sum + val, 0);
  const pointsRemaining = 35 - pointsUsed;
  const isValidBudget = pointsUsed === 35;

  const canSubmit = 
    agentName.trim().length > 0 && 
    geminiApiKey.trim().length > 0 && 
    isValidBudget &&
    isConnected;

  const handleStatChange = (key: StatKey, value: number) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit) return;

    console.log("Creating agent:", {
      name: agentName,
      stats,
      owner: address,
      apiKey: geminiApiKey.substring(0, 10) + "...",
    });

    // Convert stats to contract format (array of bigint)
    const statsArray: [bigint, bigint, bigint, bigint, bigint, bigint, bigint] = [
      BigInt(stats.riskTolerance),
      BigInt(stats.aggression),
      BigInt(stats.analytical),
      BigInt(stats.patience),
      BigInt(stats.unpredictability),
      BigInt(stats.herdMentality),
      BigInt(stats.humor),
    ];

    // Store Gemini API key in localStorage (encrypted in production)
    localStorage.setItem(`agent_api_key_${agentName}`, geminiApiKey);

    // Call contract to register agent
    registerAgent(agentName, statsArray);
  };

  // Redirect to agent profile on successful registration
  useEffect(() => {
    if (isSuccess) {
      // In production, parse AgentRegistered event to get actual agentId
      // For now, redirect to placeholder
      router.push("/agent/1");
    }
  }, [isSuccess, router]);

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="border border-white/[0.14] bg-black p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-mono font-bold text-neon-green mb-2">ACCESS RESTRICTED</h2>
            <p className="text-xs font-mono text-gray-500">Connect your wallet to create an agent.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      
      <main className="flex-1 p-6 space-y-6 page-enter overflow-auto max-w-4xl mx-auto w-full">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
            ● AGENT_CREATION_PROTOCOL
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-mono text-white tracking-tight">
            CREATE_AGENT<span className="text-neon-green">.EXE</span>
          </h1>
          <p className="text-[11px] font-mono text-gray-500 mt-2">
            Configure your autonomous betting agent. Allocate 35 personality points across 7 traits.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-white/[0.12] bg-white/[0.04] p-6">
            <label className="text-[10px] font-mono text-gray-500 uppercase mb-2 block">
              Agent Name
            </label>
            <Input
              type="text"
              placeholder="e.g. CYBER_GAMBLER_420"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              maxLength={32}
              required
            />
          </div>

          <div className="border border-white/[0.12] bg-white/[0.04] p-6">
            <label className="text-[10px] font-mono text-gray-500 uppercase mb-2 block">
              Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="AIza..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              required
            />
            <p className="text-[10px] font-mono text-gray-500 mt-2">
              Get your free API key at{" "}
              <a 
                href="https://ai.google.dev/gemini-api/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neon-green hover:underline"
              >
                ai.google.dev
              </a>
            </p>
          </div>

          <div className="border border-white/[0.12] bg-white/[0.04] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                Personality Budget
              </span>
              <div className={`text-2xl font-bold font-mono ${
                isValidBudget 
                  ? "text-neon-green" 
                  : pointsUsed > 35 
                    ? "text-error" 
                    : "text-warning"
              }`}>
                {pointsUsed} / 35
              </div>
            </div>
            
            {!isValidBudget && (
              <div className={`text-xs font-mono ${
                pointsUsed > 35 ? "text-error" : "text-warning"
              }`}>
                {pointsUsed > 35 
                  ? `⚠ Reduce by ${pointsUsed - 35} points` 
                  : `⚠ Allocate ${35 - pointsUsed} more points`}
              </div>
            )}
          </div>

          <div className="border border-white/[0.12] bg-white/[0.04] p-6 space-y-6">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
              Personality Traits
            </div>

            {STAT_CONFIG.map(({ key, label, icon: Icon, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-neon-green" />
                    <span className="text-sm font-mono text-white uppercase">{label}</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-neon-green">
                    {stats[key]}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stats[key]}
                  onChange={(e) => handleStatChange(key, parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green slider"
                />
                
                <p className="text-[10px] font-mono text-gray-500">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="border border-white/[0.12] bg-white/[0.04] p-6">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-4">
              Avatar Preview
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-neon-green/20 to-purple-500/20 border border-neon-green/30 flex items-center justify-center">
              <span className="text-3xl font-bold font-mono text-neon-green">
                {agentName.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-500 mt-2">
              Generated from personality hash
            </p>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            disabled={!canSubmit || isPending || isConfirming}
          >
            {isPending
              ? "Waiting for Signature..."
              : isConfirming
              ? "Confirming Transaction..."
              : !isValidBudget 
              ? "Allocate All 35 Points" 
              : "Deploy Agent"}
          </Button>

          {isError && error && (
            <div className="border border-error/30 bg-error/10 p-4">
              <p className="text-xs font-mono text-error">
                ⚠ Transaction Failed: {error.message}
              </p>
            </div>
          )}

          {txHash && (
            <div className="border border-neon-green/30 bg-neon-green/10 p-4">
              <p className="text-xs font-mono text-neon-green">
                ✓ Transaction Hash: {txHash}
              </p>
            </div>
          )}
        </form>
      </main>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--neon);
          cursor: pointer;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--neon);
          cursor: pointer;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
      `}</style>
    </div>
  );
}
