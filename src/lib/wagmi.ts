import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { config } from '../../config';

export const wagmiConfig = getDefaultConfig({
  appName: 'Stealth Squad Secrets',
  projectId: config.walletConnectProjectId,
  chains: [sepolia],
  ssr: false,
});
