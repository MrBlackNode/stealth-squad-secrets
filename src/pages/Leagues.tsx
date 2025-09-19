import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Lock, Star, Calendar, DollarSign } from "lucide-react";
import { useAccount } from 'wagmi';
import { useStealthSquadContract } from '@/hooks/useContract';
import { useFHEOperations } from '@/lib/fhe-utils';
import { useState } from 'react';

export default function Leagues() {
  const { isConnected, address } = useAccount();
  const { createTeam, isPending } = useStealthSquadContract();
  const { encryptTeam } = useFHEOperations();
  const [isCreatingLeague, setIsCreatingLeague] = useState(false);

  const leagues = [
    {
      id: 1,
      name: "Elite Crypto League",
      participants: 12,
      maxParticipants: 16,
      entryFee: 0.1,
      prizePool: 1.2,
      isEncrypted: true,
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15"
    },
    {
      id: 2,
      name: "Privacy Champions",
      participants: 8,
      maxParticipants: 10,
      entryFee: 0.05,
      prizePool: 0.5,
      isEncrypted: true,
      status: "recruiting",
      startDate: "2024-01-20",
      endDate: "2024-02-20"
    },
    {
      id: 3,
      name: "FHE Masters",
      participants: 6,
      maxParticipants: 8,
      entryFee: 0.02,
      prizePool: 0.16,
      isEncrypted: true,
      status: "recruiting",
      startDate: "2024-01-25",
      endDate: "2024-02-25"
    }
  ];

  const createEncryptedLeague = async () => {
    if (!isConnected) return;
    
    setIsCreatingLeague(true);
    try {
      const leagueData = encryptTeam({
        name: `League ${Date.now()}`,
        initialScore: 0,
        strategy: 'Competitive'
      });
      await createTeam(leagueData.encryptedName, leagueData.encryptedScore, leagueData.proof);
    } catch (error) {
      console.error('Error creating league:', error);
    } finally {
      setIsCreatingLeague(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-stadium">Fantasy Leagues</h1>
          <p className="text-xl text-muted-foreground">
            Join encrypted fantasy leagues where your strategies remain private until game time
          </p>
          {isConnected && (
            <div className="mt-6">
              <Button 
                onClick={createEncryptedLeague}
                disabled={isPending || isCreatingLeague}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Trophy className="w-4 h-4 mr-2" />
                {isCreatingLeague ? 'Creating Encrypted League...' : 'Create FHE League'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <Card key={league.id} className="stadium-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-stadium">{league.name}</CardTitle>
                  <Badge variant={league.status === 'active' ? 'default' : 'secondary'}>
                    {league.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>FHE Encrypted</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Participants</span>
                    </div>
                    <span>{league.participants}/{league.maxParticipants}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Entry Fee</span>
                    </div>
                    <span>{league.entryFee} ETH</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>Prize Pool</span>
                    </div>
                    <span>{league.prizePool} ETH</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <span className="text-sm">{league.startDate} - {league.endDate}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      variant={league.status === 'active' ? 'default' : 'outline'}
                      disabled={league.participants >= league.maxParticipants}
                    >
                      {league.status === 'active' ? 'View League' : 'Join League'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4 text-stadium">League Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Encrypted Strategies</h3>
                <p className="text-muted-foreground">
                  Your team composition and strategies remain encrypted until game time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Fair Competition</h3>
                <p className="text-muted-foreground">
                  No strategy copying, pure skill-based fantasy competition
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure Rewards</h3>
                <p className="text-muted-foreground">
                  Encrypted prize distribution with transparent results
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
