import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import PlinkoGameABI from '@/lib/contracts/PlinkoGame.json';

const PLINKO_ADDRESS = process.env.NEXT_PUBLIC_PLINKO_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = PlinkoGameABI as any;

export enum RiskLevel {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

export function usePlinkoGame() {
  const { data: txHash, writeContract, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    dropBall: (agentId: `0x${string}`, riskLevel: RiskLevel, betAmount: bigint) => {
      writeContract({
        address: PLINKO_ADDRESS,
        abi,
        functionName: 'dropBall',
        args: [agentId, riskLevel, betAmount],
        value: betAmount,
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

export function usePlinkoBet(sequenceNumber: bigint | undefined) {
  const { data, isLoading, isError } = useReadContract({
    address: PLINKO_ADDRESS,
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

export function usePlinkoMultipliers(riskLevel: RiskLevel | undefined) {
  const { data, isLoading } = useReadContract({
    address: PLINKO_ADDRESS,
    abi,
    functionName: 'getMultipliers',
    args: riskLevel !== undefined ? [riskLevel] : undefined,
    query: {
      enabled: riskLevel !== undefined,
    },
  });

  return {
    multipliers: data,
    isLoading,
  };
}

export function usePlinkoVRFFee() {
  const { data, isLoading } = useReadContract({
    address: PLINKO_ADDRESS,
    abi,
    functionName: 'getVRFFee',
  });

  return {
    vrfFee: data,
    isLoading,
  };
}
