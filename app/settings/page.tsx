"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { useWallet } from "@/hooks/useWallet";
import { AlertTriangle, Terminal, Shield, Settings2, Key, Wallet2, User } from "lucide-react";

const sidebarNav = [
  { label: "Profile", icon: User },
  { label: "Security", icon: Shield },
  { label: "Technical", icon: Settings2, active: true },
  { label: "Sessions", icon: Key },
  { label: "Wallets", icon: Wallet2 },
];

export default function SettingsPage() {
  const { isConnected, actions } = useWallet();

  const [hardwareAccel, setHardwareAccel] = useState(true);
  const [autoGas, setAutoGas] = useState(true);
  const [principalBetting, setPrincipalBetting] = useState(false);
  const [sessionKeys, setSessionKeys] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <div className="flex flex-1">
        {/* LEFT SIDEBAR */}
        <aside className="w-56 border-r border-white/5 p-5 hidden md:flex flex-col gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-neon-green uppercase tracking-wider">NODE_01</div>
            <div className="text-[10px] font-mono text-gray-700">OPERATOR // VERIFIED</div>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarNav.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition-colors ${
                  item.active
                    ? "text-neon-green bg-neon-green/5 border-l-2 border-neon-green"
                    : "text-gray-600 hover:text-gray-400 border-l-2 border-transparent"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2">
            <div className="text-[10px] font-mono text-gray-700 uppercase">Session_Uptime</div>
            <div className="text-xs font-mono text-gray-500">04:32:11</div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-neon-green/40 rounded-full" style={{ width: "72%" }} />
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 max-w-3xl space-y-8 page-enter">
          <div>
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">
              CONFIG / TECHNICAL / V1.2.0
            </div>
            <h1 className="text-2xl font-black font-mono text-white tracking-tight italic">
              System_Settings
            </h1>
          </div>

          {/* Execution Preferences */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 uppercase">
              <span>⊞</span>
              <span>[ Execution_Preferences ]</span>
            </div>

            <div className="border border-white/5 bg-white/[0.02] divide-y divide-white/5">
              {/* Hardware Acceleration */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-mono text-white uppercase font-bold">Hardware Acceleration</div>
                  <div className="text-[10px] font-mono text-gray-600 mt-1">
                    Enable GPU-assisted rendering for game interfaces and chart elements
                  </div>
                </div>
                <label className="cyber-toggle">
                  <input
                    type="checkbox"
                    checked={hardwareAccel}
                    onChange={(e) => setHardwareAccel(e.target.checked)}
                  />
                  <span className="cyber-toggle-slider" />
                </label>
              </div>

              {/* Auto Gas */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-mono text-white uppercase font-bold">Auto-Gas Management</div>
                  <div className="text-[10px] font-mono text-gray-600 mt-1">
                    Automatically estimate and set optimal gas parameters for transactions
                  </div>
                </div>
                <label className="cyber-toggle">
                  <input
                    type="checkbox"
                    checked={autoGas}
                    onChange={(e) => setAutoGas(e.target.checked)}
                  />
                  <span className="cyber-toggle-slider" />
                </label>
              </div>
            </div>
          </section>

          {/* Protocol Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>[ Protocol_Security ]</span>
            </div>

            <div className="border border-white/5 bg-white/[0.02] divide-y divide-white/5">
              {/* Principal Betting */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-red-500/30 bg-red-500/5 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-mono text-white uppercase font-bold">Principal Betting Protocol</div>
                    <div className="text-[10px] font-mono text-red-400/80 mt-1">
                      WARNING: Enables wagering with deposited principal. HIGH_RISK. Funds may be lost.
                    </div>
                  </div>
                </div>
                <label className="cyber-toggle">
                  <input
                    type="checkbox"
                    checked={principalBetting}
                    onChange={(e) => setPrincipalBetting(e.target.checked)}
                  />
                  <span className="cyber-toggle-slider" />
                </label>
              </div>

              {/* Session Keys */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-mono text-white uppercase font-bold">Persistent Session Keys</div>
                  <div className="text-[10px] font-mono text-gray-600 mt-1">
                    Maintain session keys across browser restarts for seamless re-authentication
                  </div>
                </div>
                <label className="cyber-toggle">
                  <input
                    type="checkbox"
                    checked={sessionKeys}
                    onChange={(e) => setSessionKeys(e.target.checked)}
                  />
                  <span className="cyber-toggle-slider" />
                </label>
              </div>
            </div>
          </section>

          {/* Terminal Debug */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 uppercase">
              <Terminal className="w-3.5 h-3.5" />
              <span>[ Terminal_Debug_Mode ]</span>
            </div>

            <div className="border border-white/5 bg-white/[0.02] p-5 space-y-4">
              <p className="text-xs font-mono text-gray-500 leading-relaxed">
                Advanced diagnostics console for monitoring real-time protocol state, 
                transaction queues, and kernel sync status. Authorized operators only.
              </p>
              <button className="border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-mono uppercase px-5 py-2.5 hover:bg-neon-green/10 transition-colors">
                Launch_Console
              </button>
            </div>
          </section>

          {/* Disconnect */}
          {isConnected && (
            <section className="border-t border-white/5 pt-6">
              <button
                onClick={actions.disconnect}
                className="border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono uppercase px-5 py-2.5 hover:bg-red-500/10 transition-colors"
              >
                Terminate_Session
              </button>
            </section>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex gap-6 text-[10px] font-mono text-gray-700">
          <span>KERNEL: STABLE</span>
          <span>ENV: TESTNET</span>
        </div>
        <div className="text-[10px] font-mono text-gray-700">
          ENTROPY_SYS v1.2.0 © 2024
        </div>
      </footer>
    </div>
  );
}
