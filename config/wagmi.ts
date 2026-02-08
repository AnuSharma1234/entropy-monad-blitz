import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { defineChain } from 'viem'

export const monadTestnet = defineChain({
  id: 10143, // Replace with actual Monad Testnet ID when available/confirmed
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ed3970bf28100/'] }, // Example URL
    public: { http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ed3970bf28100/'] },
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
