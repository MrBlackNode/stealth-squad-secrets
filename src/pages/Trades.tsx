import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, ArrowRightLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAccount } from 'wagmi';
import { useStealthSquadContract } from '@/hooks/useContract';
import { useFHEOperations } from '@/lib/fhe-utils';
import { useState } from 'react';

export default function Trades() {
  const { isConnected, address } = useAccount();
  const { proposeTrade, isPending } = useStealthSquadContract();
  const { encryptTrade } = useFHEOperations();
  const [isProposingTrade, setIsProposingTrade] = useState(false);

  const tradeOffers = [
    {
      id: 1,
      fromTeam: "Crypto Warriors",
      toTeam: "Blockchain Titans",
      playerName: "QB1",
      position: "Quarterback",
      proposedValue: 150,
      status: "pending",
      createdAt: "2024-01-10",
      expiresAt: "2024-01-17"
    },
    {
      id: 2,
      fromTeam: "DeFi Defenders",
      toTeam: "NFT Knights",
      playerName: "RB1",
      position: "Running Back",
      proposedValue: 120,
      status: "accepted",
      createdAt: "2024-01-08",
      expiresAt: "2024-01-15"
    },
    {
      id: 3,
      fromTeam: "Smart Contract Squad",
      toTeam: "Hash Heroes",
      playerName: "WR1",
      position: "Wide Receiver",
      proposedValue: 100,
      status: "rejected",
      createdAt: "2024-01-05",
      expiresAt: "2024-01-12"
    }
  ];

  const proposeEncryptedTrade = async () => {
    if (!isConnected) return;
    
    setIsProposingTrade(true);
    try {
      const tradeData = encryptTrade({
        playerId: 1,
        proposedPrice: 100,
        fromTeam: "My Team",
        toTeam: "Target Team"
      });
      await proposeTrade(1, 2, tradeData.encryptedPrice, tradeData.proof);
    } catch (error) {
      console.error('Error proposing trade:', error);
    } finally {
      setIsProposingTrade(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-stadium">Private Trade Center</h1>
          <p className="text-xl text-muted-foreground">
            Negotiate trades without revealing your team composition or future strategies
          </p>
          {isConnected && (
            <div className="mt-6">
              <Button 
                onClick={proposeEncryptedTrade}
                disabled={isPending || isProposingTrade}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {isProposingTrade ? 'Proposing Encrypted Trade...' : 'Propose FHE Trade'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Trade Offers */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-stadium">Active Trade Offers</h2>
            <div className="space-y-4">
              {tradeOffers.map((offer) => (
                <Card key={offer.id} className="stadium-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{offer.playerName} - {offer.position}</CardTitle>
                      <Badge className={getStatusColor(offer.status)}>
                        {getStatusIcon(offer.status)}
                        <span className="ml-1 capitalize">{offer.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span>FHE Encrypted Trade</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">From Team:</span>
                        <span>{offer.fromTeam}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">To Team:</span>
                        <span>{offer.toTeam}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Proposed Value:</span>
                        <span className="text-green-600 font-bold">{offer.proposedValue} points</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created:</span>
                        <span>{offer.createdAt}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Expires:</span>
                        <span>{offer.expiresAt}</span>
                      </div>
                      
                      {offer.status === 'pending' && (
                        <div className="flex gap-2 pt-4">
                          <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trade Features */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-stadium">Encrypted Trading Features</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Lock className="w-8 h-8 text-blue-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">Private Negotiations</h3>
                      <p className="text-muted-foreground">
                        All trade discussions are encrypted using FHE technology. Your strategies remain hidden until both parties agree.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-green-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">Fair Trading</h3>
                      <p className="text-muted-foreground">
                        No information asymmetry. Both parties see the same encrypted data, ensuring fair negotiations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <ArrowRightLeft className="w-8 h-8 text-purple-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">Secure Execution</h3>
                      <p className="text-muted-foreground">
                        Trades are executed on-chain with encrypted data, ensuring transparency and security.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
