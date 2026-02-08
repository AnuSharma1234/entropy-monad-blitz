import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import AgentPoolABI from '@/lib/contracts/AgentPool.json';

const AGENT_POOL_ADDRESS = process.env.NEXT_PUBLIC_AGENT_POOL_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = AgentPoolABI as any;

export type AgentPoolReturn = {
  deposit: (amount: bigint) => void;
  requestWithdraw: (amount: bigint) => void;
  withdraw: () => void;
  balance: bigint | undefined;
  refetchBalance: () => void;
  isDepositPending: boolean;
  isDepositConfirming: boolean;
  isDepositSuccess: boolean;
  isBalanceLoading: boolean;
  isRequestWithdrawPending: boolean;
  isWithdrawPending: boolean;
  isWithdrawConfirming: boolean;
  isWithdrawSuccess: boolean;
};

/** AgentPool: User-based pool with requestWithdraw/withdraw flow. */
export function useAgentPool(agentId: bigint | undefined): AgentPoolReturn {
  const { data: depositTxHash, writeContract: writeDeposit, isPending: isDepositPending } = useWriteContract();
  const { data: requestWithdrawTxHash, writeContract: writeRequestWithdraw, isPending: isRequestWithdrawPending } = useWriteContract();
  const { data: withdrawTxHash, writeContract: writeWithdraw, isPending: isWithdrawPending } = useWriteContract();

  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
    address: AGENT_POOL_ADDRESS,
    abi,
    functionName: 'getBalance',
    args: agentId !== undefined ? [agentId] : undefined,
    query: {
      enabled: agentId !== undefined,
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
        args: [amount],
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
        args: [],
      });
    },
    balance: balance as bigint | undefined,
    refetchBalance,
    isDepositPending,
    isDepositConfirming,
    isDepositSuccess,
    isBalanceLoading,
    isRequestWithdrawPending,
    isWithdrawPending,
    isWithdrawConfirming,
    isWithdrawSuccess,
  };
}
