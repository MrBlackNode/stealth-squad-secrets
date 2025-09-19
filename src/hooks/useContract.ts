import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { config } from '../../config';

// Contract ABI for Stealth Squad Secrets FHE Contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_teamName", "type": "string"},
      {"internalType": "bytes", "name": "initialScore", "type": "bytes"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "createTeam",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_position", "type": "string"},
      {"internalType": "bytes", "name": "performanceScore", "type": "bytes"},
      {"internalType": "bytes", "name": "price", "type": "bytes"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "addPlayer",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "playerId", "type": "uint256"},
      {"internalType": "uint256", "name": "toTeamId", "type": "uint256"},
      {"internalType": "bytes", "name": "proposedPrice", "type": "bytes"},
      {"internalType": "bytes", "name": "inputProof", "type": "bytes"}
    ],
    "name": "proposeTrade",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "teamId", "type": "uint256"}],
    "name": "getTeamInfo",
    "outputs": [
      {"internalType": "string", "name": "teamName", "type": "string"},
      {"internalType": "uint8", "name": "totalScore", "type": "uint8"},
      {"internalType": "uint8", "name": "wins", "type": "uint8"},
      {"internalType": "uint8", "name": "losses", "type": "uint8"},
      {"internalType": "uint8", "name": "ties", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - will be set after deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function useStealthSquadContract() {
  const { address } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();

  // FHE-encrypted team creation
  const createTeam = async (teamName: string, initialScore: string, inputProof: string) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createTeam',
        args: [teamName, initialScore, inputProof],
      });
      return hash;
    } catch (err) {
      console.error('Error creating encrypted team:', err);
      throw err;
    }
  };

  // FHE-encrypted player addition
  const addPlayer = async (
    name: string, 
    position: string, 
    performanceScore: string, 
    price: string, 
    inputProof: string
  ) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addPlayer',
        args: [name, position, performanceScore, price, inputProof],
      });
      return hash;
    } catch (err) {
      console.error('Error adding encrypted player:', err);
      throw err;
    }
  };

  // FHE-encrypted trade proposal
  const proposeTrade = async (
    playerId: number, 
    toTeamId: number, 
    proposedPrice: string, 
    inputProof: string
  ) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'proposeTrade',
        args: [BigInt(playerId), BigInt(toTeamId), proposedPrice, inputProof],
      });
      return hash;
    } catch (err) {
      console.error('Error proposing encrypted trade:', err);
      throw err;
    }
  };

  const getTeamInfo = (teamId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getTeamInfo',
      args: [BigInt(teamId)],
    });
  };

  return {
    createTeam,
    addPlayer,
    proposeTrade,
    getTeamInfo,
    isPending,
    error,
    address,
  };
}

export function useTeamData(teamId: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      // This would call the contract function
      // For now, return mock data
      return {
        teamName: `Team ${teamId}`,
        totalScore: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        isActive: true,
        owner: '0x0000000000000000000000000000000000000000',
        createdAt: Date.now(),
      };
    },
    enabled: !!teamId,
  });

  return { data, isLoading, error };
}
