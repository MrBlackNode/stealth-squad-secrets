# Vercel Deployment Guide for Stealth Squad Secrets

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare the required configuration values

## Step-by-Step Deployment Process

### Step 1: Connect GitHub Repository to Vercel

1. **Login to Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project" button
   - Select "Import Git Repository"
   - Choose `MrBlackNode/stealth-squad-secrets` from the list
   - Click "Import"

### Step 2: Configure Project Settings

1. **Framework Preset**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Root Directory**
   - Leave as default (project root)

### Step 3: Set Environment Variables

In the Vercel dashboard, go to **Settings > Environment Variables** and add:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

**Important**: Make sure to add these variables for all environments (Production, Preview, Development).

### Step 4: Configure Build Settings

1. **Node.js Version**
   - Go to **Settings > General**
   - Set Node.js Version to `18.x` or `20.x`

2. **Build Command Override**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 5: Deploy

1. **Initial Deployment**
   - Click "Deploy" button
   - Wait for the build process to complete
   - Vercel will automatically assign a domain (e.g., `stealth-squad-secrets.vercel.app`)

2. **Custom Domain (Optional)**
   - Go to **Settings > Domains**
   - Add your custom domain
   - Configure DNS records as instructed

### Step 6: Verify Deployment

1. **Check Application**
   - Visit your deployed URL
   - Test wallet connection functionality
   - Verify all features are working

2. **Test Wallet Integration**
   - Connect with MetaMask or Rainbow wallet
   - Ensure Sepolia testnet is configured
   - Test contract interactions

## Post-Deployment Configuration

### Smart Contract Deployment

1. **Deploy FHE Contract**
   ```bash
   # Install Hardhat
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   
   # Deploy to Sepolia
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Update Contract Address**
   - Copy the deployed contract address
   - Update `src/hooks/useContract.ts` with the new address
   - Redeploy to Vercel

### Environment-Specific Settings

1. **Production Environment**
   - Use production RPC URLs
   - Configure production wallet connect project ID
   - Set up monitoring and analytics

2. **Staging Environment**
   - Create a separate Vercel project for staging
   - Use testnet configurations
   - Enable preview deployments for pull requests

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no typos in values

3. **Wallet Connection Issues**
   - Verify RPC URL is accessible
   - Check WalletConnect project ID
   - Ensure proper network configuration

### Performance Optimization

1. **Build Optimization**
   - Enable Vercel's automatic optimizations
   - Configure caching headers
   - Optimize bundle size

2. **CDN Configuration**
   - Vercel automatically provides global CDN
   - Configure custom headers if needed
   - Enable compression

## Monitoring and Maintenance

### Analytics Setup

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor performance metrics
   - Track user interactions

2. **Error Monitoring**
   - Set up error tracking
   - Monitor wallet connection failures
   - Track contract interaction errors

### Updates and Maintenance

1. **Automatic Deployments**
   - Push to main branch triggers production deployment
   - Create feature branches for testing
   - Use preview deployments for testing

2. **Rollback Strategy**
   - Use Vercel's rollback feature if needed
   - Keep previous deployments available
   - Test rollback procedures

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to repository
   - Use Vercel's secure environment variable storage
   - Rotate keys regularly

2. **Smart Contract Security**
   - Audit FHE contract before mainnet deployment
   - Test thoroughly on testnet
   - Implement proper access controls

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **RainbowKit Documentation**: [rainbowkit.com](https://rainbowkit.com)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh)
- **FHE Documentation**: [docs.zama.ai](https://docs.zama.ai)

## Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build settings optimized
- [ ] Initial deployment successful
- [ ] Wallet connection tested
- [ ] Contract interactions verified
- [ ] Custom domain configured (if applicable)
- [ ] Analytics and monitoring set up
- [ ] Performance optimized
- [ ] Security measures implemented

## Next Steps

1. **Smart Contract Deployment**: Deploy the FHE contract to Sepolia testnet
2. **User Testing**: Conduct thorough testing with real users
3. **Mainnet Preparation**: Prepare for mainnet deployment
4. **Marketing**: Launch the platform to the community
5. **Monitoring**: Set up comprehensive monitoring and alerting

---

**Note**: This deployment guide assumes you have the necessary permissions and access to configure the Vercel project. Make sure to coordinate with your team for any production deployments.
