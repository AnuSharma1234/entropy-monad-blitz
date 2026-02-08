"use client";

import { Header } from "@/components/ui/Header";
import { MinesGame } from "@/components/games/MinesGame";

export default function MinesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 p-4 md:p-6 page-enter">
        <MinesGame />
      </main>

      {/* Bottom bar */}
      <footer className="border-t border-white/[0.1] px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] font-mono text-gray-500">
          ENCRYPTED END-TO-END // YIELD PROTOCOL V.0.1.3
        </span>
        <div className="flex gap-6 text-[10px] font-mono text-gray-500">
          <span>PROVABLY FAIR</span>
          <span>AUDITED BY CYBERSAFE</span>
        </div>
      </footer>
    </div>
  );
}
