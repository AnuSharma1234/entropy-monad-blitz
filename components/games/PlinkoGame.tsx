"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { ChevronDown, Monitor, Award, Clock, Settings as SettingsIcon, Home, History, Lock } from "lucide-react";

const ROWS = 12;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 420;
const PEG_RADIUS = 3;
const BALL_RADIUS = 5;
const GRAVITY = 0.15;
const BOUNCE = 0.5;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
  landed: boolean;
  bucket?: number;
}

const MOCK_DROPS = [
  { addr: "0x4f...2e9", mult: "x2.5", color: "text-neon-green", active: false },
  { addr: "0x9a...11b", mult: "x1.0", color: "text-gray-500", active: false },
  { addr: "0x22...55c", mult: "x10.0", color: "text-neon-green", active: true },
  { addr: "0x11...88d", mult: "x0.5", color: "text-gray-600", active: false },
];

export function PlinkoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animRef = useRef<number>(0);
  const { balance } = useWallet();
  const [betAmount, setBetAmount] = useState("0.05");
  const [risk, setRisk] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [rows, setRows] = useState(12);
  const [lastBucket, setLastBucket] = useState<number | null>(null);

  const multipliers = risk === "LOW"
    ? [0.5, 0.8, 1.0, 1.2, 4.5, 1.2, 1.0, 0.8, 0.5]
    : risk === "HIGH"
    ? [0.2, 0.5, 1.0, 2.0, 10.0, 2.0, 1.0, 0.5, 0.2]
    : [0.2, 0.5, 1.0, 1.0, 4.5, 1.0, 1.0, 0.5, 0.2];

  // Calculate peg positions
  const getPegs = useCallback(() => {
    const pegs: { x: number; y: number }[] = [];
    const startX = CANVAS_WIDTH / 2;
    const startY = 40;
    const gapX = 32;
    const gapY = 28;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX - (row * gapX) / 2 + col * gapX;
        const y = startY + row * gapY;
        pegs.push({ x, y });
      }
    }
    return pegs;
  }, [rows]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pegs = getPegs();

    const update = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Subtle grid lines
      ctx.strokeStyle = "rgba(0, 255, 136, 0.03)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // "VOID OS" watermark
      ctx.fillStyle = "rgba(0, 255, 136, 0.04)";
      ctx.font = "bold 48px monospace";
      ctx.textAlign = "center";
      ctx.fillText("VOID OS", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

      // Draw pegs
      pegs.forEach((peg) => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 136, 0.4)";
        ctx.fill();
      });

      // Update balls
      ballsRef.current = ballsRef.current
        .map((ball) => {
          if (ball.landed) return ball;

          let { x, y, vx, vy } = ball;
          vy += GRAVITY;
          x += vx;
          y += vy;

          // Collision with pegs
          pegs.forEach((peg) => {
            const dx = x - peg.x;
            const dy = y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < PEG_RADIUS + BALL_RADIUS) {
              const angle = Math.atan2(dy, dx);
              const speed = Math.sqrt(vx * vx + vy * vy) * BOUNCE;
              const randomOffset = (Math.random() - 0.5) * 1.2;
              vx = Math.cos(angle + randomOffset) * speed;
              vy = Math.sin(angle + randomOffset) * speed;
              const overlap = PEG_RADIUS + BALL_RADIUS - dist;
              x += Math.cos(angle) * overlap;
              y += Math.sin(angle) * overlap;
            }
          });

          // Walls
          if (x < BALL_RADIUS) { x = BALL_RADIUS; vx = Math.abs(vx) * 0.5; }
          if (x > CANVAS_WIDTH - BALL_RADIUS) { x = CANVAS_WIDTH - BALL_RADIUS; vx = -Math.abs(vx) * 0.5; }

          // Landing
          if (y > CANVAS_HEIGHT - 30) {
            const bucketWidth = CANVAS_WIDTH / multipliers.length;
            const bucket = Math.min(multipliers.length - 1, Math.max(0, Math.floor(x / bucketWidth)));
            setLastBucket(bucket);
            return { ...ball, x, y: CANVAS_HEIGHT - 25, vx: 0, vy: 0, landed: true, bucket };
          }

          return { ...ball, x, y, vx, vy };
        })
        .filter((ball) => !(ball.landed && Date.now() - ball.id > 3000));

      // Draw balls
      ballsRef.current.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#00FF88";
        ctx.shadowColor = "#00FF88";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animRef.current);
  }, [getPegs, multipliers.length]);

  const dropBall = () => {
    const noise = (Math.random() - 0.5) * 6;
    ballsRef.current.push({
      x: CANVAS_WIDTH / 2 + noise,
      y: 15,
      vx: 0,
      vy: 0,
      id: Date.now(),
      landed: false,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-full max-w-[1100px] mx-auto min-h-[600px]">
      {/* ── LEFT: Sidebar Nav ── */}
      <div className="hidden lg:flex w-48 shrink-0 border border-white/5 bg-black flex-col p-4 space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-neon-green flex items-center justify-center">
            <span className="text-black text-[10px] font-bold">⚡</span>
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">CyberYield</div>
            <div className="text-[9px] font-mono text-neon-green">V2.0.4-0N_CHAIN</div>
          </div>
        </div>

        {[
          { icon: Home, label: "Home", active: false },
          { icon: Award, label: "Leaderboard", active: false },
          { icon: History, label: "History", active: false },
          { icon: Award, label: "Rewards", active: false },
        ].map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all w-full text-left",
              item.active
                ? "bg-neon-green/10 text-neon-green"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        <div className="text-[10px] font-mono text-gray-700 uppercase tracking-wider px-3 mt-6 mb-2">
          System
        </div>
        {[
          { icon: Lock, label: "Vaults" },
          { icon: SettingsIcon, label: "Settings" },
        ].map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-gray-500 hover:text-white hover:bg-white/5 transition-all w-full text-left"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        <div className="flex-1" />

        {/* Yield generated */}
        <div className="border border-white/5 p-3 mt-auto">
          <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Yield Generated</div>
          <div className="text-sm font-mono font-bold text-white">2.458 ETH</div>
        </div>
      </div>

      {/* ── CENTER LEFT: Terminal Config ── */}
      <div className="w-full lg:w-72 shrink-0 border border-white/5 lg:border-l-0 bg-black p-5 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚙</span>
          <h2 className="text-sm font-mono font-bold text-white">Terminal Config</h2>
        </div>

        {/* Risk Matrix */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Risk Matrix</div>
          <div className="grid grid-cols-3 gap-0 border border-white/10">
            {(["LOW", "MEDIUM", "HIGH"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRisk(r)}
                className={cn(
                  "text-[10px] font-mono py-2.5 uppercase transition-all",
                  risk === r
                    ? "bg-neon-green text-black font-bold"
                    : "bg-transparent text-gray-500 hover:bg-white/5"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Density (Rows) */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Density (Rows)</div>
          <div className="relative">
            <select
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="w-full bg-white/[0.02] border border-white/10 text-sm font-mono text-white px-3 py-2.5 outline-none appearance-none cursor-pointer"
            >
              {[8, 10, 12, 14, 16].map((r) => (
                <option key={r} value={r} className="bg-black">
                  {r} Layers
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payload */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Payload (ETH)</div>
          <div className="flex items-center border border-white/10 bg-white/[0.02]">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="flex-1 bg-transparent text-sm font-mono text-white px-3 py-2.5 outline-none w-full"
            />
            <div className="flex gap-1 px-2">
              <button
                onClick={() => setBetAmount((parseFloat(betAmount || "0") / 2).toFixed(4))}
                className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-0.5 hover:bg-white/5"
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount((parseFloat(betAmount || "0") * 2).toFixed(4))}
                className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-0.5 hover:bg-white/5"
              >
                x2
              </button>
            </div>
          </div>
        </div>

        {/* Drop Button */}
        <button
          onClick={dropBall}
          className="w-full bg-neon-green text-black font-mono font-bold text-sm uppercase py-3.5 hover:bg-[#00CC6A] transition-colors neon-glow"
        >
          Initiate Drop
        </button>

        {/* Protocol Info */}
        <div className="border border-white/5 p-3 flex gap-6">
          <div>
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Protocol Fee</div>
            <div className="text-sm font-mono font-bold text-white">0.5%</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Hash Integrity</div>
            <div className="flex items-center gap-1.5">
              <span className="status-dot online" />
              <span className="text-xs font-mono text-neon-green uppercase">Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER RIGHT: Canvas + Multipliers ── */}
      <div className="flex-1 border border-white/5 lg:border-l-0 bg-black/50 flex flex-col">
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="max-w-full"
          />
        </div>

        {/* Multiplier Buckets */}
        <div className="flex gap-1 px-4 pb-4">
          {multipliers.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 text-center py-2.5 border font-mono text-xs transition-all",
                lastBucket === i
                  ? "border-neon-green bg-neon-green/10 text-neon-green font-bold"
                  : "border-white/5 text-gray-600"
              )}
            >
              {m}
            </div>
          ))}
        </div>

        {/* Global Stream */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              Global Stream // Active Drops
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-neon-green" />
              <span className="w-2 h-2 rounded-full bg-gray-700" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {MOCK_DROPS.map((drop, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 border shrink-0 min-w-[150px]",
                  drop.active
                    ? "border-neon-green bg-neon-green/5"
                    : "border-white/5"
                )}
              >
                <Monitor className="w-3 h-3 text-gray-600" />
                <span className="text-[11px] font-mono text-gray-500">{drop.addr}</span>
                <span className={cn("text-xs font-mono font-bold ml-auto", drop.color)}>{drop.mult}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
