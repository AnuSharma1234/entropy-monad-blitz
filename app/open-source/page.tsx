"use client";

import { Header } from "@/components/ui/Header";
import { Github, ExternalLink, FileCode, Shield, Lock } from "lucide-react";

const contracts = [
  { name: "EntropyCore.sol", desc: "Core protocol logic and vault management", lines: "1,247", verified: true },
  { name: "MinesGame.sol", desc: "Mines game engine with on-chain randomness", lines: "834", verified: true },
  { name: "PlinkoGame.sol", desc: "Plinko physics and outcome determination", lines: "912", verified: true },
  { name: "Vault.sol", desc: "Yield vault for staking and yield distribution", lines: "621", verified: true },
  { name: "RandomnessOracle.sol", desc: "VRF-based randomness with block hash fallback", lines: "443", verified: true },
];

export default function OpenSourcePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-8 page-enter">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
            SYS.SOURCE / PUBLIC_AUDIT
          </div>
          <h1 className="text-3xl font-black font-mono text-white tracking-tight italic">
            Open_Source
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-2 max-w-xl leading-relaxed">
            All protocol contracts are open source, verified on-chain, and available for public audit.
            Zero trust assumptions — verify everything.
          </p>
        </div>

        {/* Repository */}
        <div className="border border-white/[0.12] bg-white/[0.04] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white/[0.14] flex items-center justify-center">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-mono text-white font-bold">entropy-protocol/contracts</div>
              <div className="text-[10px] font-mono text-gray-500">Monad Testnet • Solidity 0.8.24</div>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-mono uppercase px-4 py-2 hover:bg-neon-green/10 transition-colors flex items-center gap-2"
          >
            View_Repo <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Contract List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 uppercase">
            <FileCode className="w-3.5 h-3.5" />
            <span>[ Verified_Contracts ]</span>
          </div>

          <div className="border border-white/[0.12] divide-y divide-white/[0.08]">
            {contracts.map((contract) => (
              <div key={contract.name} className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-neon-green/20 bg-neon-green/5 flex items-center justify-center">
                    <FileCode className="w-3.5 h-3.5 text-neon-green" />
                  </div>
                  <div>
                    <div className="text-sm font-mono text-neon-green font-bold">{contract.name}</div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">{contract.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-mono text-gray-500">{contract.lines} LINES</div>
                  {contract.verified && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-neon-green">
                      <Shield className="w-3 h-3" />
                      VERIFIED
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-white/[0.12] bg-white/[0.04] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-green" />
              <span className="text-sm font-mono text-white font-bold uppercase">Audit Status</span>
            </div>
            <p className="text-[10px] font-mono text-gray-500 leading-relaxed">
              Contracts audited by independent security researchers. Full audit report available on request.
            </p>
            <div className="text-xs font-mono text-neon-green">STATUS: PASSED ✓</div>
          </div>

          <div className="border border-white/[0.12] bg-white/[0.04] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-sm font-mono text-white font-bold uppercase">Bug Bounty</span>
            </div>
            <p className="text-[10px] font-mono text-gray-500 leading-relaxed">
              Active bug bounty program for critical and high-severity vulnerabilities. Rewards up to $50,000.
            </p>
            <div className="text-xs font-mono text-gray-400">PROGRAM: ACTIVE</div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.1] px-4 py-3 flex justify-between items-center">
        <div className="text-[10px] font-mono text-gray-500">ENTROPY_PROTOCOL // OPEN_SRC</div>
        <div className="text-[10px] font-mono text-gray-500">5 CONTRACTS VERIFIED</div>
      </footer>
    </div>
  );
}
