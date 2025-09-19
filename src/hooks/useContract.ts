import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

// Contract ABI would be generated from the Solidity contract
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

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual deployed contract address

export function useStealthSquadContract() {
  const { address } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();

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
      console.error('Error creating team:', err);
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
