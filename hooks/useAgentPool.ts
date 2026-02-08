import { useContractWrite, useContractRead, useWaitForTransaction, useAccount } from 'wagmi';
import AgentPoolABI from '@/lib/contracts/AgentPool.json';

const AGENT_POOL_ADDRESS = process.env.NEXT_PUBLIC_AGENT_POOL_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

export function useAgentPool() {
  const { address } = useAccount();

  const { data: depositData, write: deposit, isLoading: isDepositLoading } = useContractWrite({
    address: AGENT_POOL_ADDRESS,
    abi: AgentPoolABI,
    functionName: 'deposit',
  });

  const { data: requestWithdrawData, write: requestWithdraw, isLoading: isRequestWithdrawLoading } = useContractWrite({
    address: AGENT_POOL_ADDRESS,
    abi: AgentPoolABI,
    functionName: 'requestWithdraw',
  });

  const { data: withdrawData, write: withdraw, isLoading: isWithdrawLoading } = useContractWrite({
    address: AGENT_POOL_ADDRESS,
    abi: AgentPoolABI,
    functionName: 'withdraw',
  });

  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useContractRead({
    address: AGENT_POOL_ADDRESS,
    abi: AgentPoolABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransaction({
    hash: depositData?.hash,
  });

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransaction({
    hash: withdrawData?.hash,
  });

  return {
    deposit,
    requestWithdraw,
    withdraw,
    balance,
    refetchBalance,
    isDepositLoading,
    isDepositConfirming,
    isDepositSuccess,
    isRequestWithdrawLoading,
    isWithdrawLoading,
    isWithdrawConfirming,
    isWithdrawSuccess,
    isBalanceLoading,
  };
}
