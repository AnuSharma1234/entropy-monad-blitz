"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import {
  LayoutDashboard,
  PieChart,
  Lock,
  ScrollText,
  Swords,
  History,
  Award,
  Settings,
  Wallet,
  User,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, group: "CORE_MODULES" },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: PieChart, group: "CORE_MODULES" },
  { name: "Vaults", href: "/stake", icon: Lock, group: "CORE_MODULES" },
  { name: "Logs", href: "/history", icon: ScrollText, group: "CORE_MODULES" },
];

const systemItems: SidebarItem[] = [
  { name: "Settings", href: "/settings", icon: Settings, group: "SYSTEM" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isConnected, formattedAddress } = useWallet();

  return (
    <aside
      className={cn(
        "w-52 min-h-screen border-r border-white/5 bg-black flex flex-col py-4 px-3 shrink-0",
        className
      )}
    >
      {/* User Profile */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 border border-white/10 bg-white/5 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">OPERATOR_01</div>
            <div className="text-[10px] font-mono text-gray-600">LVL_09</div>
          </div>
        </div>
      </div>

      {/* Core Modules */}
      <div className="mb-6">
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider px-2 mb-2">
          Core_Modules
        </div>
        <nav className="space-y-0.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all group",
                  isActive
                    ? "bg-neon-green/10 text-neon-green border-l-2 border-neon-green"
                    : "text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-neon-green" : "text-gray-600 group-hover:text-white")} />
                <span className="uppercase">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System */}
      <div className="mb-6">
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider px-2 mb-2">
          System
        </div>
        <nav className="space-y-0.5">
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all group",
                  isActive
                    ? "bg-neon-green/10 text-neon-green border-l-2 border-neon-green"
                    : "text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-neon-green" : "text-gray-600 group-hover:text-white")} />
                <span className="uppercase">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* System Load */}
      <div className="px-2 py-3 border border-white/5 bg-white/[0.02]">
        <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">System_Load</div>
        <div className="progress-bar mb-1">
          <div className="progress-bar-fill" style={{ width: "62%" }} />
        </div>
        <div className="text-[10px] font-mono text-neon-green">42,069.7%</div>
      </div>
    </aside>
  );
}
