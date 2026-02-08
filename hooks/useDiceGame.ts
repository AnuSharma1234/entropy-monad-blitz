import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import DiceGameABI from '@/lib/contracts/DiceGame.json';

const DICE_ADDRESS = process.env.NEXT_PUBLIC_DICE_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = DiceGameABI as any;

export function useDiceGame() {
  const { data: txHash, writeContract, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    placeBet: (agentId: `0x${string}`, target: bigint, isOver: boolean, amount: bigint) => {
      writeContract({
        address: DICE_ADDRESS,
        abi,
        functionName: 'placeBet',
        args: [agentId, target, isOver, amount],
        value: amount,
      });
    },
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    txHash,
  };
}

export function useDiceBet(sequenceNumber: bigint | undefined) {
  const { data, isLoading, isError } = useReadContract({
    address: DICE_ADDRESS,
    abi,
    functionName: 'getBet',
    args: sequenceNumber !== undefined ? [sequenceNumber] : undefined,
    query: {
      enabled: sequenceNumber !== undefined,
    },
  });

  return {
    betData: data,
    isLoading,
    isError,
  };
}

export function useDiceVRFFee() {
  const { data, isLoading } = useReadContract({
    address: DICE_ADDRESS,
    abi,
    functionName: 'getVRFFee',
  });

  return {
    vrfFee: data,
    isLoading,
  };
}
