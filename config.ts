// Environment configuration for Stealth Squad Secrets
export const config = {
  chainId: 11155111, // Sepolia testnet
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID',
  infuraApiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || 'YOUR_INFURA_API_KEY',
  alternativeRpcUrl: 'https://1rpc.io/sepolia'
} as const;
