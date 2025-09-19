import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Plus, Edit, Save, Eye, EyeOff } from "lucide-react";
import { useAccount } from 'wagmi';
import { useStealthSquadContract } from '@/hooks/useContract';
import { useFHEOperations } from '@/lib/fhe-utils';
import { useState } from 'react';

export default function Lineups() {
  const { isConnected, address } = useAccount();
  const { addPlayer, isPending } = useStealthSquadContract();
  const { encryptPlayer } = useFHEOperations();
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEncrypted, setShowEncrypted] = useState(false);

  const positions = [
    { name: 'Quarterback', abbreviation: 'QB', max: 1 },
    { name: 'Running Back', abbreviation: 'RB', max: 2 },
    { name: 'Wide Receiver', abbreviation: 'WR', max: 3 },
    { name: 'Tight End', abbreviation: 'TE', max: 1 },
    { name: 'Kicker', abbreviation: 'K', max: 1 },
    { name: 'Defense', abbreviation: 'DEF', max: 1 }
  ];

  const currentLineup = [
    { id: 1, name: 'QB1', position: 'QB', value: 150, isEncrypted: true },
    { id: 2, name: 'RB1', position: 'RB', value: 120, isEncrypted: true },
    { id: 3, name: 'RB2', position: 'RB', value: 100, isEncrypted: true },
    { id: 4, name: 'WR1', position: 'WR', value: 110, isEncrypted: true },
    { id: 5, name: 'WR2', position: 'WR', value: 90, isEncrypted: true },
    { id: 6, name: 'WR3', position: 'WR', value: 80, isEncrypted: true },
    { id: 7, name: 'TE1', position: 'TE', value: 70, isEncrypted: true },
    { id: 8, name: 'K1', position: 'K', value: 60, isEncrypted: true },
    { id: 9, name: 'DEF1', position: 'DEF', value: 50, isEncrypted: true }
  ];

  const addEncryptedPlayer = async () => {
    if (!isConnected) return;
    
    setIsAddingPlayer(true);
    try {
      const playerData = encryptPlayer({
        name: `Player ${Date.now()}`,
        position: 'QB',
        performanceScore: 85,
        price: 100
      });
      await addPlayer(
        playerData.encryptedName,
        playerData.encryptedPosition,
        playerData.encryptedScore,
        playerData.encryptedPrice,
        playerData.proof
      );
    } catch (error) {
      console.error('Error adding player:', error);
    } finally {
      setIsAddingPlayer(false);
    }
  };

  const getPositionCount = (position: string) => {
    return currentLineup.filter(player => player.position === position).length;
  };

  const getPositionMax = (position: string) => {
    const pos = positions.find(p => p.abbreviation === position);
    return pos ? pos.max : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-stadium">Encrypted Lineup Builder</h1>
          <p className="text-xl text-muted-foreground">
            Build your fantasy lineup with complete privacy. Your opponents won't see your strategy until game time.
          </p>
          {isConnected && (
            <div className="mt-6 flex gap-4 justify-center">
              <Button 
                onClick={addEncryptedPlayer}
                disabled={isPending || isAddingPlayer}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAddingPlayer ? 'Adding Encrypted Player...' : 'Add FHE Player'}
              </Button>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Lineup'}
              </Button>
              <Button 
                onClick={() => setShowEncrypted(!showEncrypted)}
                variant="outline"
              >
                {showEncrypted ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showEncrypted ? 'Hide Encrypted' : 'Show Encrypted'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Lineup */}
          <div className="lg:col-span-2">
            <Card className="stadium-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-stadium">Current Lineup</CardTitle>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">FHE Encrypted</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.abbreviation} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{position.name} ({position.abbreviation})</h3>
                        <Badge variant="outline">
                          {getPositionCount(position.abbreviation)}/{position.max}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {currentLineup
                          .filter(player => player.position === position.abbreviation)
                          .map((player) => (
                            <div key={player.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {player.name.charAt(player.name.length - 1)}
                                </div>
                                <div>
                                  <div className="font-medium">{player.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {showEncrypted ? `Value: ${player.value}` : 'Value: [Encrypted]'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {player.isEncrypted && (
                                  <Lock className="w-4 h-4 text-green-500" />
                                )}
                                {isEditing && (
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        {getPositionCount(position.abbreviation) < position.max && isEditing && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={addEncryptedPlayer}
                            disabled={isAddingPlayer}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add {position.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lineup Stats & Features */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-stadium">Lineup Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Players:</span>
                    <span className="font-bold">{currentLineup.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encrypted Players:</span>
                    <span className="font-bold text-green-600">{currentLineup.filter(p => p.isEncrypted).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-bold">
                      {showEncrypted ? currentLineup.reduce((sum, p) => sum + p.value, 0) : '[Encrypted]'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategy Level:</span>
                    <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-stadium">Encryption Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">FHE Protection</h4>
                      <p className="text-sm text-muted-foreground">
                        All player data is encrypted using Fully Homomorphic Encryption
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Private Strategy</h4>
                      <p className="text-sm text-muted-foreground">
                        Your lineup remains hidden until game time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Fair Competition</h4>
                      <p className="text-sm text-muted-foreground">
                        No strategy copying, pure skill-based competition
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-stadium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" onClick={addEncryptedPlayer} disabled={isAddingPlayer}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Player
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Lineup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
