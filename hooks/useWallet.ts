"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatAddress } from "@/lib/utils";

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
  });

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return {
    address,
    formattedAddress: address ? formatAddress(address) : "",
    isConnected,
    isConnecting,
    chainId: chain?.id,
    balance: balanceData,
    actions: {
      connect: handleConnect,
      disconnect: handleDisconnect,
      refetchBalance,
    },
  };
}
