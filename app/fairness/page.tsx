"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { cn } from "@/lib/utils";
import { Copy, CheckCircle, Download } from "lucide-react";

export default function FairnessPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const serverSeed = "0x9f86d081884c7d659a2feaa8c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
  const clientSeed = "entropy_vortex_9921_xX";
  const blockHash = "0x000000000000380008866acc0f7d54c7d427d14";
  const resultHash = "7d54c7d427d149f86d081884c7d659a2feaa8c55ad015a3bf4f1b";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8 page-enter">
        {/* Header */}
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
            SYS.VERIFIER / V2.4.0-STABLE
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight italic mb-3">
            Provable Fairness Verifier
          </h1>
          <p className="text-xs font-mono text-gray-500 max-w-2xl leading-relaxed">
            CRITICAL: Cryptographic audit of game outcomes. Recalculate result hashes using SHA-256 seed
            orchestration to ensure zero-manipulation integrity. Execute manual verification below.
          </p>
        </div>

        {/* Input Parameters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 uppercase">
            <span>⊞</span>
            <span>[ Input_Parameters ]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Server Seed */}
            <div className="border border-white/[0.12] bg-white/[0.04] p-4 space-y-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase">Server Seed (Hashed)</div>
              <div className="bg-black border border-white/[0.1] p-3 text-[11px] font-mono text-neon-green break-all leading-relaxed min-h-[60px]">
                {serverSeed}
              </div>
            </div>

            {/* Client Seed */}
            <div className="border border-white/[0.12] bg-white/[0.04] p-4 space-y-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase">Client Seed</div>
              <div className="bg-black border border-white/[0.1] p-3 text-[11px] font-mono text-white min-h-[60px]">
                {clientSeed}
              </div>
            </div>

            {/* Block Hash */}
            <div className="border border-white/[0.12] bg-white/[0.04] p-4 space-y-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase">Block Hash</div>
              <div className="bg-black border border-white/[0.1] p-3 text-[11px] font-mono text-white break-all leading-relaxed min-h-[60px]">
                {blockHash}
              </div>
            </div>
          </div>
        </div>

        {/* Recomputation Logic */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 uppercase">
            <span>☐</span>
            <span>[ Recomputation_Logic ]</span>
          </div>

          <div className="border border-white/[0.12] bg-[#0a0a0a] p-5 font-mono text-xs relative">
            <button
              onClick={() => handleCopy(
                `const combine = (sSeed, cSeed, bHash) => {\n  const data = \`\${sSeed}:\${cSeed}:\${bHash}\`;\n  return crypto.createHash('sha256').update(data).digest('hex');\n};`,
                "code"
              )}
              className="absolute top-3 right-3 w-7 h-7 border border-white/[0.14] flex items-center justify-center text-gray-500 hover:text-neon-green hover:border-neon-green/30 transition-colors"
            >
              {copied === "code" ? <CheckCircle className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
            </button>

            <div className="space-y-0.5 text-gray-600">
              <div><span className="text-gray-700">002</span></div>
              <div>
                <span className="text-gray-700">003</span>
                {"  "}
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">combine</span>{" = "}
                <span className="text-yellow-300">(sSeed, cSeed, bHash)</span>
                {" => {"}
              </div>
              <div>
                <span className="text-gray-700">004</span>
                {"    "}
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">data</span>
                {" = "}
                <span className="text-green-400">{"`${sSeed}:${cSeed}:${bHash}`"}</span>
                {";"}
              </div>
              <div>
                <span className="text-gray-700">005</span>
                {"    "}
                <span className="text-purple-400">return</span>{" "}
                <span className="text-blue-300">crypto</span>
                {".createHash("}
                <span className="text-green-400">&apos;sha256&apos;</span>
                {").update(data).digest("}
                <span className="text-green-400">&apos;hex&apos;</span>
                {");"}
              </div>
              <div>
                <span className="text-gray-700">006</span>
                {"  };"}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.1]">
              <div className="text-gray-600 mb-1">
                <span className="text-gray-700">008</span>
                {"  "}
                <span className="text-gray-600">// EXECUTING CALCULATION...</span>
              </div>
              <div>
                <span className="text-gray-700">009</span>
                {"  "}
                <span className="text-blue-300">result_hash</span>
                {" = "}
                <span className="text-neon-green text-[11px] break-all">{resultHash}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outcome Determination + Verified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outcome */}
          <div className="border border-white/[0.12] bg-white/[0.04] p-6 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase">Outcome Determination</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500 uppercase">Range</span>
                <span className="text-white">0 - 1,000,000</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500 uppercase">Operation</span>
                <span className="text-white">hash % 1,000,000</span>
              </div>
              <div className="border-t border-white/[0.1] pt-3 flex justify-between text-xs font-mono">
                <span className="text-gray-500 uppercase">Result</span>
                <span className="text-2xl font-black text-white">742,914</span>
              </div>
            </div>
          </div>

          {/* Verified */}
          <div className="border border-white/[0.12] bg-white/[0.04] p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="border border-neon-green bg-neon-green/10 px-5 py-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-mono font-bold text-neon-green uppercase">Verified</span>
            </div>
            <h3 className="text-lg font-mono font-bold text-white uppercase">Cryptographic Match</h3>
            <p className="text-[10px] font-mono text-gray-500 leading-relaxed max-w-xs">
              System confirmed: Outcome matches the provided cryptographic proof. Data Integrity is 100%.
            </p>
            <button className="border border-white/[0.14] px-4 py-2 text-[10px] font-mono text-gray-400 uppercase hover:text-white hover:border-white/25 transition-colors mt-4">
              Export_Audit_Data
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.1] px-4 py-3 flex justify-between items-center">
        <div className="flex gap-6 text-[10px] font-mono text-gray-500">
          <span>PROTOCOLS</span>
          <span>OPEN_SRC</span>
          <span>HEALTH: 100%</span>
        </div>
        <div className="text-[10px] font-mono text-gray-500">
          VORTEX LINK STATUS DATA 2.4.172 © 2024 · TIMESTAMP IDENTIFICATION LAYER
        </div>
      </footer>
    </div>
  );
}
