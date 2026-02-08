import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import AgentPoolV2ABI from '@/lib/contracts/AgentPoolV2.json';

const AGENT_POOL_ADDRESS = process.env.NEXT_PUBLIC_AGENT_POOL_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = AgentPoolV2ABI as any;

/** AgentPoolV2: agentId-based, native MON. Pass agentId to stake/deposit for an agent. */
export function useAgentPool(agentId: bigint | undefined) {
  const { data: depositTxHash, writeContract: writeDeposit, isPending: isDepositPending } = useWriteContract();

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

  return {
    deposit: (amount: bigint) => {
      if (!agentId) return;
      writeDeposit({
        address: AGENT_POOL_ADDRESS,
        abi,
        functionName: 'deposit',
        args: [agentId],
        value: amount,
      });
    },
    balance,
    refetchBalance,
    isDepositPending,
    isDepositConfirming,
    isDepositSuccess,
    isBalanceLoading,
    requestWithdraw: () => {},
    withdraw: () => {},
    isRequestWithdrawPending: false,
    isWithdrawPending: false,
    isWithdrawConfirming: false,
    isWithdrawSuccess: false,
  };
}
