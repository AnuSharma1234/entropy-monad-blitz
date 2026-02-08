"use client";

import { Header } from "@/components/ui/Header";
import { PlinkoGame } from "@/components/games/PlinkoGame";

export default function PlinkoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 p-4 md:p-6 page-enter">
        <PlinkoGame />
      </main>
    </div>
  );
}
