"use client";

import { Header } from "@/components/ui/Header";
import Link from "next/link";
import { Bomb, Grip, ArrowRight, Zap } from "lucide-react";

const games = [
  {
    slug: "mines",
    title: "MINES",
    subtitle: "GRID_PROTOCOL",
    description: "Navigate a 5×5 kernel grid. Each uncovered node increases your multiplier. Trigger a mine and your payload is lost. Cash out at any time.",
    icon: Bomb,
    stats: { edge: "1.0%", maxWin: "24.75x", speed: "<200ms" },
    status: "ONLINE",
  },
  {
    slug: "plinko",
    title: "PLINKO",
    subtitle: "DROP_ENGINE",
    description: "Deploy a payload through a physics-based pin field. Adjustable risk matrix and density rows determine multiplier distribution at the terminal row.",
    icon: Grip,
    stats: { edge: "1.0%", maxWin: "1000x", speed: "<200ms" },
    status: "ONLINE",
  },
];

export default function GamesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8 page-enter">
        <div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
            SYS.GAMES / PROVABLY FAIR
          </div>
          <h1 className="text-3xl font-black font-mono text-white tracking-tight italic">
            Game_Terminals
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-2">
            Select an active terminal to begin. All outcomes are cryptographically verified on-chain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Link key={game.slug} href={`/games/${game.slug}`} className="group">
              <div className="border border-white/[0.12] bg-white/[0.04] hover:border-neon-green/30 transition-all duration-300 h-full flex flex-col">
                {/* Header */}
                <div className="border-b border-white/[0.1] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <game.icon className="w-4 h-4 text-neon-green" />
                    <span className="text-xs font-mono text-gray-500 uppercase">{game.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-[10px] font-mono text-neon-green">{game.status}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 space-y-4">
                  <h2 className="text-2xl font-black font-mono text-white group-hover:text-neon-green transition-colors">
                    {game.title}
                  </h2>
                  <p className="text-xs font-mono text-gray-500 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase">House_Edge</div>
                      <div className="text-sm font-mono text-white font-bold">{game.stats.edge}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase">Max_Win</div>
                      <div className="text-sm font-mono text-neon-green font-bold">{game.stats.maxWin}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase">Finality</div>
                      <div className="text-sm font-mono text-white font-bold">{game.stats.speed}</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.1] px-5 py-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500 group-hover:text-neon-green transition-colors uppercase">
                    Initialize_Terminal
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-green group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Protocol Info */}
        <div className="border border-white/[0.12] bg-white/[0.04] p-5 flex items-center gap-4">
          <Zap className="w-5 h-5 text-neon-green shrink-0" />
          <div>
            <div className="text-xs font-mono text-white uppercase font-bold">Provably Fair Protocol</div>
            <div className="text-[10px] font-mono text-gray-500 mt-1">
              All game outcomes use SHA-256 seed composition with on-chain block hash verification.
              <Link href="/fairness" className="text-neon-green hover:underline ml-1">View_Verifier →</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.1] px-4 py-3 flex justify-between items-center">
        <div className="text-[10px] font-mono text-gray-500">ENTROPY_PROTOCOL // MONAD_TESTNET</div>
        <div className="text-[10px] font-mono text-gray-500">2 TERMINALS ACTIVE</div>
      </footer>
    </div>
  );
}
