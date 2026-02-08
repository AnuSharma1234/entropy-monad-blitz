import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import AgentRegistryABI from '@/lib/contracts/AgentRegistry.json';

const AGENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

const abi = AgentRegistryABI as any;

export function useAgentRegistry() {
  const { data: txHash, writeContract, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    registerAgent: (name: string, stats: [bigint, bigint, bigint, bigint, bigint, bigint, bigint]) => {
      writeContract({
        address: AGENT_REGISTRY_ADDRESS,
        abi,
        functionName: 'registerAgent',
        args: [name, stats],
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

export function useAgentData(agentId: bigint | undefined) {
  const { data, isLoading, isError } = useReadContract({
    address: AGENT_REGISTRY_ADDRESS,
    abi,
    functionName: 'getAgent',
    args: agentId !== undefined ? [agentId] : undefined,
    query: {
      enabled: agentId !== undefined,
    },
  });

  return {
    agentData: data,
    isLoading,
    isError,
  };
}
