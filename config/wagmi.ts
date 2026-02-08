import { http, createConfig } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { defineChain } from 'viem'

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
})

export const config = createConfig({
  chains: [monadTestnet, hardhat],
  transports: {
    [monadTestnet.id]: http(),
    [hardhat.id]: http(),
  },
})
