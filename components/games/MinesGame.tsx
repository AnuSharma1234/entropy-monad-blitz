"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Bomb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";

const GRID_SIZE = 25;

const MOCK_ACTIVITY = [
  { user: "USER_#94", mult: "2.44x", color: "text-neon-green" },
  { user: "0xBE...21", mult: "1.08x", color: "text-neon-green" },
  { user: "SYS_FAIL", mult: "0.00x", color: "text-error" },
  { user: "CYBER_MKR", mult: "4.20x", color: "text-neon-green" },
];

export function MinesGame() {
  const { balance } = useWallet();
  const [betAmount, setBetAmount] = useState("0.05");
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "CASHED_OUT" | "BUSTED">("IDLE");
  const [grid, setGrid] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [minesMap, setMinesMap] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [revealedCount, setRevealedCount] = useState(0);
  const [mode, setMode] = useState<"manual" | "auto">("manual");

  const calculateMultiplier = (mines: number, revealed: number) => {
    let multiplier = 1;
    for (let i = 0; i < revealed; i++) {
      multiplier *= (25 - i) / (25 - mines - i);
    }
    return multiplier;
  };

  const currentMultiplier = calculateMultiplier(mineCount, revealedCount);
  const nextMultiplier = calculateMultiplier(mineCount, revealedCount + 1);
  const potentialWin = parseFloat(betAmount || "0") * currentMultiplier;

  const startGame = () => {
    if (!betAmount || parseFloat(betAmount) <= 0) return;
    setGameState("PLAYING");
    setGrid(Array(GRID_SIZE).fill(false));
    setRevealedCount(0);

    const newMines = Array(GRID_SIZE).fill(false);
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const idx = Math.floor(Math.random() * GRID_SIZE);
      if (!newMines[idx]) {
        newMines[idx] = true;
        minesPlaced++;
      }
    }
    setMinesMap(newMines);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== "PLAYING" || grid[index]) return;
    if (minesMap[index]) {
      setGameState("BUSTED");
      setGrid(Array(GRID_SIZE).fill(true));
    } else {
      const newGrid = [...grid];
      newGrid[index] = true;
      setGrid(newGrid);
      setRevealedCount((prev) => prev + 1);
    }
  };

  const cashOut = () => {
    setGameState("CASHED_OUT");
    setGrid(Array(GRID_SIZE).fill(true));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-full max-w-[1100px] mx-auto min-h-[600px]">
      {/* ── LEFT PANEL: Controls ── */}
      <div className="w-full lg:w-64 shrink-0 border border-white/5 bg-black p-5 space-y-5">
        <div>
          <h2 className="text-sm font-mono font-bold text-white uppercase mb-0.5">Manual_Control</h2>
          <div className="text-[9px] font-mono text-gray-700 uppercase">AUTH_STATUS:LEVEL_C4</div>
        </div>

        {/* Bet Amount */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Bet_Amount</div>
          <div className="flex items-center border border-white/10 bg-white/[0.02]">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={gameState === "PLAYING"}
              className="flex-1 bg-transparent text-sm font-mono text-white px-3 py-2.5 outline-none w-full"
            />
            <span className="text-[10px] font-mono text-gray-600 px-3">ETH</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {["1/2", "2X", "MAX"].map((label) => (
              <button
                key={label}
                disabled={gameState === "PLAYING"}
                onClick={() => {
                  const val = parseFloat(betAmount || "0");
                  if (label === "1/2") setBetAmount((val / 2).toFixed(4));
                  if (label === "2X") setBetAmount((val * 2).toFixed(4));
                  if (label === "MAX") setBetAmount(balance ? Number(balance.formatted).toFixed(4) : "0");
                }}
                className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-[10px] font-mono text-gray-400 py-1.5 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mine Density */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Mine_Density</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 3, 5, 24].map((count) => (
              <button
                key={count}
                disabled={gameState === "PLAYING"}
                onClick={() => setMineCount(count)}
                className={cn(
                  "border text-xs font-mono py-2 transition-all",
                  mineCount === count
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-white/10 bg-white/[0.02] text-gray-500 hover:bg-white/[0.05]"
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Initialize / Cash Out */}
        <div className="space-y-2 pt-2">
          {gameState === "PLAYING" ? (
            <>
              <button
                onClick={cashOut}
                className="w-full bg-neon-green text-black font-mono font-bold text-sm uppercase py-3.5 hover:bg-[#00CC6A] transition-colors neon-glow"
              >
                Cash_Out ({potentialWin.toFixed(4)})
              </button>
            </>
          ) : (
            <button
              onClick={startGame}
              disabled={!betAmount || parseFloat(betAmount) <= 0}
              className="w-full bg-neon-green text-black font-mono font-bold text-sm uppercase py-3.5 hover:bg-[#00CC6A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed neon-glow"
            >
              Initialize
            </button>
          )}

          {gameState === "PLAYING" && (
            <div className="text-center text-xs font-mono text-error cursor-pointer hover:underline uppercase">
              Cash_Out
            </div>
          )}
        </div>

        {/* Mode Toggle */}
        <div className="border-t border-white/5 pt-4 space-y-2">
          <button
            onClick={() => setMode("manual")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition-all border",
              mode === "manual"
                ? "border-neon-green bg-neon-green/10 text-neon-green"
                : "border-transparent text-gray-600 hover:text-gray-400"
            )}
          >
            <span className="text-base">⊞</span> Manual_Mode
          </button>
          <button
            onClick={() => setMode("auto")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase transition-all",
              mode === "auto" ? "text-neon-green" : "text-gray-600 hover:text-gray-400"
            )}
          >
            <span className="text-base">✧</span> Auto_Pilot
          </button>
        </div>
      </div>

      {/* ── CENTER: Game Grid ── */}
      <div className="flex-1 border border-white/5 border-l-0 bg-black/50 p-5 flex flex-col">
        {/* Multiplier Display */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Network_Multiplier</div>
            <span className="text-4xl font-black font-mono text-neon-green text-glow">
              {currentMultiplier.toFixed(2)}x
            </span>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-gray-600 uppercase mb-1">Next_Step</div>
            <span className="text-lg font-bold font-mono text-gray-400">
              {nextMultiplier.toFixed(2)}x
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="status-dot online" />
          <span className="text-[10px] font-mono text-gray-600 uppercase">
            Status: {gameState === "PLAYING" ? "OPERATIONAL // ON-CHAIN" : gameState === "BUSTED" ? "TERMINATED" : "STANDBY"}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: GRID_SIZE }).map((_, i) => {
            const isRevealed = grid[i];
            const isMine = minesMap[i];
            const isExploded = isRevealed && isMine && gameState === "BUSTED";

            return (
              <motion.button
                key={i}
                whileHover={!isRevealed && gameState === "PLAYING" ? { scale: 1.03 } : {}}
                whileTap={!isRevealed && gameState === "PLAYING" ? { scale: 0.97 } : {}}
                onClick={() => handleTileClick(i)}
                disabled={isRevealed || gameState !== "PLAYING"}
                className={cn(
                  "mine-tile aspect-square flex items-center justify-center border transition-all relative",
                  !isRevealed
                    ? "bg-white/[0.03] border-white/10 hover:border-neon-green/30 cursor-pointer"
                    : isMine
                    ? isExploded
                      ? "bg-error/20 border-error/50"
                      : "bg-white/[0.02] border-white/5 opacity-40"
                    : "bg-neon-green/10 border-neon-green/30"
                )}
              >
                <AnimatePresence mode="wait">
                  {isRevealed && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      {isMine ? (
                        <Bomb className={cn("w-6 h-6", isExploded ? "text-error" : "text-gray-600")} />
                      ) : (
                        <Diamond className="w-6 h-6 text-neon-green" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Kernel Info */}
        <div className="mt-auto text-[10px] font-mono text-gray-700 space-y-0.5">
          <div>KERNEL_CODE: RUNNING</div>
          <div>HASH_RATE: 44.1T4/S</div>
          <div>BLOCK_HEIGHT: 19521</div>
        </div>

        {/* Bottom stats */}
        <div className="flex justify-end gap-6 mt-3 text-[10px] font-mono text-gray-700">
          <span>GAS_PRICE: 18 GWEI</span>
          <span>LATENCY: 12MS</span>
          <span>VRF: NODE_EAST_01</span>
        </div>

        {/* Result message */}
        <AnimatePresence>
          {(gameState === "BUSTED" || gameState === "CASHED_OUT") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mt-4 text-center p-3 border font-mono",
                gameState === "BUSTED"
                  ? "border-error/30 bg-error/5 text-error"
                  : "border-neon-green/30 bg-neon-green/5 text-neon-green"
              )}
            >
              <div className="text-lg font-bold uppercase">
                {gameState === "BUSTED" ? "SEQUENCE_TERMINATED" : "EXTRACTION_COMPLETE"}
              </div>
              {gameState === "CASHED_OUT" && (
                <div className="text-sm mt-1">+{potentialWin.toFixed(4)} ETH</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── RIGHT PANEL: Activity ── */}
      <div className="w-full lg:w-56 shrink-0 border border-white/5 border-l-0 bg-black p-5 space-y-5 hidden lg:block">
        <div className="flex items-center gap-2 mb-4">
          <span className="status-dot online" />
          <span className="text-[10px] font-mono text-gray-500 uppercase">Global_Activity</span>
        </div>

        <div className="space-y-3">
          {MOCK_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-600">{item.user}</span>
              <span className={cn("text-xs font-mono font-bold", item.color)}>{item.mult}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Pool Utilization */}
        <div className="border border-white/5 p-3 mt-8">
          <div className="text-[10px] font-mono text-gray-600 uppercase mb-2">Pool_Utilization</div>
          <div className="progress-bar mb-2">
            <div className="progress-bar-fill" style={{ width: "88%" }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-gray-600 uppercase">Optimized</span>
            <span className="text-white">88%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
