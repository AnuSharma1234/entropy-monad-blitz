"use client";

import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Monitor, ShieldCheck, BarChart3, Layers, Globe, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="landing" />

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-14 overflow-hidden grid-bg">
        {/* Radial glow behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-neon-green/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-8 border border-white/5 px-4 py-1.5"
          >
            <span className="status-dot online" />
            PROTOCOL_STATUS: [ACTIVE_LINK]
          </motion.div>

          {/* Giant glitch title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glitch-title text-6xl sm:text-8xl md:text-9xl font-black font-mono tracking-tighter text-white mb-8 leading-none"
            data-text="ENTROPY"
          >
            ENTROPY
          </motion.h1>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {[
              { label: "SECURITY_TIER", value: "PRINCIPAL PROTECTED" },
              { label: "YIELD_ENGINE", value: "AGGREGATED FLOWS" },
              { label: "LATENCY_SPEC", value: "< 200MS STATE SYNC" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-white/10 bg-white/[0.02] px-5 py-3 text-center min-w-[180px]"
              >
                <div className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-1">
                  {item.label}
                </div>
                <div className="text-xs font-mono font-bold text-white uppercase">
                  {item.value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-sm tracking-widest">
                Initialize Link
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CAPITAL SYNTHESIS FLOW ── */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-3">
              // OPERATIONS_SEQUENCE
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-mono text-white tracking-tight">
              Capital Synthesis Flow
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                num: "01",
                title: "STAKE",
                tag: "[SYS_IN]",
                desc: "Deposit assets to audited vault. Liquidity generates yield.",
              },
              {
                num: "02",
                title: "ACCRUE",
                tag: "[SYS_CALC]",
                desc: "Yield is harvested and converted into gaming credits.",
              },
              {
                num: "03",
                title: "PLAY",
                tag: "[SYS_OUT]",
                desc: "Execute transactions using yield credits. Non-extractive gaming.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="border border-white/5 p-6 relative group hover:border-neon-green/20 transition-all"
              >
                {/* Corner decoration */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green opacity-30" />

                <div className="inline-block bg-neon-green text-black text-lg font-mono font-black px-3 py-1 mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-mono font-bold text-white mb-1">{step.title}</h3>
                <div className="text-[10px] font-mono text-gray-600 mb-3">{step.tag}</div>
                <p className="text-xs font-mono text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYSTEM INTEGRITY ── */}
      <section className="py-24 px-4 border-t border-white/5 bg-white/[0.01]">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16"
          >
            <div>
              <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-3">
                HARDENED_SPEC_V4.2
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-mono text-white tracking-tight">
                System Integrity
              </h2>
            </div>
            <div className="text-[10px] font-mono text-gray-600 uppercase text-right mt-4 md:mt-0">
              04_SYSTEM_OVERRIDE_ACTIVE<br />
              CORE_REVISION_0492
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Monitor,
                module: "MODULE_01",
                title: "ZK-STATE ENGINE",
                desc: "Recursive proofs for instantaneous blokd finality in competitive environments.",
              },
              {
                icon: ShieldCheck,
                module: "MODULE_02",
                title: "AUDIT TRANSPARENCY",
                desc: "Continuous real-time verification of vault insolvency and asset backing.",
              },
              {
                icon: BarChart3,
                module: "MODULE_03",
                title: "YIELD INDEXER",
                desc: "Multi-chain aggregator capturing the highest risk-adjusted base rates.",
              },
              {
                icon: Globe,
                module: "MODULE_04",
                title: "INTER-CHAIN MSG",
                desc: "Hyper-fast messaging bus for assets moving between Layer-2 ecosystems.",
              },
            ].map((mod, i) => (
              <motion.div
                key={mod.module}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/5 p-5 hover:border-neon-green/20 transition-all group"
              >
                <mod.icon className="w-5 h-5 text-neon-green mb-4 group-hover:text-glow" />
                <div className="text-[9px] font-mono text-gray-600 uppercase mb-1">{mod.module}</div>
                <h3 className="text-sm font-mono font-bold text-white mb-2">{mod.title}</h3>
                <p className="text-[11px] font-mono text-gray-600 leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCESS TERMINAL CTA ── */}
      <section className="py-32 px-4 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-green/5 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center"
        >
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-4">
            Waiting for uplink...
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono text-white tracking-tight italic mb-8">
            Access System Terminal
          </h2>
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-10 text-sm tracking-widest">
              Establish Link
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-neon-green flex items-center justify-center">
                  <span className="text-black text-[10px] font-bold">E</span>
                </div>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Entropy Protocol
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-600 leading-relaxed uppercase">
                Yield-funded gaming infrastructure for the digital<br />
                concession. Built on hardened cryptographic primitives.
              </p>
            </div>

            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">
                Directory
              </div>
              <div className="space-y-1.5">
                {["Documentation", "Governance", "Risk Framework"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-[11px] font-mono text-gray-600 hover:text-neon-green transition-colors uppercase"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">
                Communications
              </div>
              <div className="space-y-1.5">
                {["X / Terminal", "Discord_Link", "Github_Repo"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-[11px] font-mono text-gray-600 hover:text-neon-green transition-colors uppercase"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-8 pt-6 flex justify-between">
            <div className="text-[10px] font-mono text-gray-700">
              © 2024 ENTROPY_FOUNDATION
            </div>
            <div className="text-[10px] font-mono text-gray-700">
              38.8997° N / 128.6597° S
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
