import { useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi';
import AgentRegistryABI from '@/lib/contracts/AgentRegistry.json';

const AGENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

export function useAgentRegistry() {
  const { data, write: registerAgent, isLoading, isError, error } = useContractWrite({
    address: AGENT_REGISTRY_ADDRESS,
    abi: AgentRegistryABI,
    functionName: 'registerAgent',
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    registerAgent,
    isLoading,
    isConfirming,
    isSuccess,
    isError,
    error,
    txHash: data?.hash,
  };
}

export function useAgentData(agentId: bigint | undefined) {
  const { data, isLoading, isError } = useContractRead({
    address: AGENT_REGISTRY_ADDRESS,
    abi: AgentRegistryABI,
    functionName: 'getAgent',
    args: agentId !== undefined ? [agentId] : undefined,
    enabled: agentId !== undefined,
  });

  return {
    agentData: data,
    isLoading,
    isError,
  };
}
