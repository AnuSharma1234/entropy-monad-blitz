"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { Search, Bell, User } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Mines", href: "/games/mines" },
  { name: "Plinko", href: "/games/plinko" },
  { name: "Staking", href: "/stake" },
];

const landingNavItems = [
  { name: "/Ecosystem", href: "/dashboard" },
  { name: "/Vaults", href: "/stake" },
  { name: "/Terminal", href: "/games" },
];

export function Header({ variant = "app" }: { variant?: "landing" | "app" }) {
  const pathname = usePathname();
  const { isConnected, formattedAddress, balance, actions, isConnecting } = useWallet();

  if (variant === "landing") {
    return (
      <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-neon-green flex items-center justify-center">
                <span className="text-black text-xs font-bold">E</span>
              </div>
              <span className="text-sm font-bold font-mono tracking-wider text-white uppercase">
                Entropy
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {landingNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-mono text-gray-500 hover:text-neon-green transition-colors uppercase tracking-wider"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <Button variant="outline" size="sm" onClick={actions.disconnect} className="font-mono text-xs">
                {formattedAddress}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={actions.connect}
                disabled={isConnecting}
                className="text-xs"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/90 backdrop-blur-xl">
      <div className="flex h-12 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 bg-neon-green flex items-center justify-center">
              <span className="text-black text-[10px] font-bold">E</span>
            </div>
            <span className="text-xs font-bold font-mono tracking-wider text-white uppercase">
              Cyber-Yield
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-mono px-3 py-1.5 transition-colors uppercase tracking-wider",
                  pathname?.startsWith(item.href)
                    ? "text-neon-green border-b border-neon-green"
                    : "text-gray-500 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5">
            <Search className="w-3 h-3 text-gray-600" />
            <input
              type="text"
              placeholder="QUERY_SYSTEM..."
              className="bg-transparent text-xs font-mono text-gray-400 outline-none w-32 placeholder:text-gray-600"
            />
          </div>

          {isConnected ? (
            <div className="flex items-center gap-3">
              {balance && (
                <div className="hidden md:flex items-center gap-2 text-xs font-mono">
                  <span className="text-gray-500">YIELD_AVAIL</span>
                  <span className="text-neon-green">
                    {Number(balance.formatted).toFixed(3)} {balance.symbol}
                  </span>
                </div>
              )}
              <button
                onClick={actions.disconnect}
                className="text-xs font-mono text-neon-green border border-neon-green/30 px-3 py-1.5 hover:bg-neon-green/10 transition-colors"
              >
                {formattedAddress}
              </button>
              <button className="w-7 h-7 border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
                <Bell className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={actions.connect}
              disabled={isConnecting}
              className="text-xs h-8"
            >
              {isConnecting ? "Connecting..." : "CONNECT_WALLET"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
