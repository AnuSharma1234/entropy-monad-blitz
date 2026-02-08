import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import MinesGameABI from '@/lib/contracts/MinesGame.json';

const MINES_ADDRESS = process.env.NEXT_PUBLIC_MINES_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = MinesGameABI as any;

export function useMinesGame() {
  const { data: startTxHash, writeContract: writeStart, isPending: isStartPending, isError: isStartError, error: startError } = useWriteContract();
  const { data: revealTxHash, writeContract: writeReveal, isPending: isRevealPending, isError: isRevealError, error: revealError } = useWriteContract();
  const { data: cashOutTxHash, writeContract: writeCashOut, isPending: isCashOutPending, isError: isCashOutError, error: cashOutError } = useWriteContract();

  const { isLoading: isStartConfirming, isSuccess: isStartSuccess } = useWaitForTransactionReceipt({
    hash: startTxHash,
  });

  const { isLoading: isRevealConfirming, isSuccess: isRevealSuccess } = useWaitForTransactionReceipt({
    hash: revealTxHash,
  });

  const { isLoading: isCashOutConfirming, isSuccess: isCashOutSuccess } = useWaitForTransactionReceipt({
    hash: cashOutTxHash,
  });

  return {
    startGame: (agentId: bigint, mineCount: bigint, betAmount: bigint) => {
      writeStart({
        address: MINES_ADDRESS,
        abi,
        functionName: 'startGame',
        args: [agentId, mineCount, betAmount],
      });
    },
    reveal: (gameId: bigint, position: bigint) => {
      writeReveal({
        address: MINES_ADDRESS,
        abi,
        functionName: 'reveal',
        args: [gameId, position],
      });
    },
    cashOut: (gameId: bigint) => {
      writeCashOut({
        address: MINES_ADDRESS,
        abi,
        functionName: 'cashOut',
        args: [gameId],
      });
    },
    isStartPending,
    isStartConfirming,
    isStartSuccess,
    isStartError,
    startError,
    startTxHash,
    isRevealPending,
    isRevealConfirming,
    isRevealSuccess,
    isRevealError,
    revealError,
    revealTxHash,
    isCashOutPending,
    isCashOutConfirming,
    isCashOutSuccess,
    isCashOutError,
    cashOutError,
    cashOutTxHash,
  };
}

export function useMinesGameData(gameId: bigint | undefined) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: MINES_ADDRESS,
    abi,
    functionName: 'getGame',
    args: gameId !== undefined ? [gameId] : undefined,
    query: {
      enabled: gameId !== undefined,
    },
  });

  return {
    gameData: data,
    isLoading,
    isError,
    refetch,
  };
}

export function useMinesTileRevealed(gameId: bigint | undefined, position: bigint | undefined) {
  const { data, isLoading } = useReadContract({
    address: MINES_ADDRESS,
    abi,
    functionName: 'isRevealed',
    args: gameId !== undefined && position !== undefined ? [gameId, position] : undefined,
    query: {
      enabled: gameId !== undefined && position !== undefined,
    },
  });

  return {
    isRevealed: data,
    isLoading,
  };
}
