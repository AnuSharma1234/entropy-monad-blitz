import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import CoinFlipGameABI from '@/lib/contracts/CoinFlipGame.json';

const COINFLIP_ADDRESS = process.env.NEXT_PUBLIC_COINFLIP_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = CoinFlipGameABI as any;

export function useCoinFlipGame() {
  const { data: txHash, writeContract, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    placeBet: (agentId: bigint, side: boolean, amount: bigint) => {
      writeContract({
        address: COINFLIP_ADDRESS,
        abi,
        functionName: 'placeBet',
        args: [agentId, side, amount],
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

export function useCoinFlipBet(sequenceNumber: bigint | undefined) {
  const { data, isLoading, isError } = useReadContract({
    address: COINFLIP_ADDRESS,
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
