import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import AgentPoolABI from '@/lib/contracts/AgentPool.json';

const AGENT_POOL_ADDRESS = process.env.NEXT_PUBLIC_AGENT_POOL_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = AgentPoolABI as any;

export function useAgentPool() {
  const { address } = useAccount();

  const { data: depositTxHash, writeContract: writeDeposit, isPending: isDepositPending } = useWriteContract();
  const { data: requestWithdrawTxHash, writeContract: writeRequestWithdraw, isPending: isRequestWithdrawPending } = useWriteContract();
  const { data: withdrawTxHash, writeContract: writeWithdraw, isPending: isWithdrawPending } = useWriteContract();

  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
    address: AGENT_POOL_ADDRESS,
    abi,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
  });

  return {
    deposit: (amount: bigint) => {
      writeDeposit({
        address: AGENT_POOL_ADDRESS,
        abi,
        functionName: 'deposit',
        value: amount,
      });
    },
    requestWithdraw: (amount: bigint) => {
      writeRequestWithdraw({
        address: AGENT_POOL_ADDRESS,
        abi,
        functionName: 'requestWithdraw',
        args: [amount],
      });
    },
    withdraw: () => {
      writeWithdraw({
        address: AGENT_POOL_ADDRESS,
        abi,
        functionName: 'withdraw',
      });
    },
    balance,
    refetchBalance,
    isDepositPending,
    isDepositConfirming,
    isDepositSuccess,
    isRequestWithdrawPending,
    isWithdrawPending,
    isWithdrawConfirming,
    isWithdrawSuccess,
    isBalanceLoading,
  };
}
