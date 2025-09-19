import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Trophy, Users, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useAccount } from 'wagmi';
import { useStealthSquadContract } from '@/hooks/useContract';
import { useFHEOperations } from '@/lib/fhe-utils';
import { useState } from 'react';

export default function Stats() {
  const { isConnected, address } = useAccount();
  const { getTeamInfo, isPending } = useStealthSquadContract();
  const { decryptValue } = useFHEOperations();
  const [showEncrypted, setShowEncrypted] = useState(false);

  const teamStats = {
    totalScore: 1250,
    weeklyAverage: 147.8,
    rank: 3,
    wins: 8,
    losses: 2,
    ties: 1,
    winRate: 72.7,
    totalTrades: 12,
    successfulTrades: 9,
    tradeSuccessRate: 75
  };

  const playerStats = [
    { name: 'QB1', position: 'QB', points: 245, games: 11, avg: 22.3, trend: 'up' },
    { name: 'RB1', position: 'RB', points: 198, games: 11, avg: 18.0, trend: 'up' },
    { name: 'RB2', position: 'RB', points: 156, games: 11, avg: 14.2, trend: 'down' },
    { name: 'WR1', position: 'WR', points: 189, games: 11, avg: 17.2, trend: 'up' },
    { name: 'WR2', position: 'WR', points: 142, games: 11, avg: 12.9, trend: 'stable' },
    { name: 'WR3', position: 'WR', points: 98, games: 11, avg: 8.9, trend: 'down' },
    { name: 'TE1', position: 'TE', points: 89, games: 11, avg: 8.1, trend: 'up' },
    { name: 'K1', position: 'K', points: 67, games: 11, avg: 6.1, trend: 'stable' },
    { name: 'DEF1', position: 'DEF', points: 76, games: 11, avg: 6.9, trend: 'up' }
  ];

  const leagueStats = [
    { name: 'Elite Crypto League', rank: 3, totalPlayers: 12, points: 1250, trend: 'up' },
    { name: 'Privacy Champions', rank: 1, totalPlayers: 8, points: 1180, trend: 'down' },
    { name: 'FHE Masters', rank: 5, totalPlayers: 6, points: 980, trend: 'up' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-stadium">Performance Statistics</h1>
          <p className="text-xl text-muted-foreground">
            Track your encrypted fantasy performance with detailed analytics and insights
          </p>
          {isConnected && (
            <div className="mt-6">
              <Button 
                onClick={() => setShowEncrypted(!showEncrypted)}
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {showEncrypted ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showEncrypted ? 'Hide Encrypted Data' : 'Show Encrypted Data'}
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Team Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="stadium-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-stadium">Team Performance</CardTitle>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">FHE Encrypted</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-stadium mb-2">
                      {showEncrypted ? teamStats.totalScore : '[Encrypted]'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {showEncrypted ? teamStats.weeklyAverage : '[Encrypted]'}
                    </div>
                    <div className="text-sm text-muted-foreground">Weekly Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      #{showEncrypted ? teamStats.rank : '[Encrypted]'}
                    </div>
                    <div className="text-sm text-muted-foreground">League Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {showEncrypted ? `${teamStats.winRate}%` : '[Encrypted]'}
                    </div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Player Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-stadium">Player Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playerStats.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {player.name.charAt(player.name.length - 1)}
                        </div>
                        <div>
                          <div className="font-semibold">{player.name} - {player.position}</div>
                          <div className="text-sm text-muted-foreground">
                            {player.games} games played
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="font-bold">
                            {showEncrypted ? player.points : '[Encrypted]'}
                          </div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">
                            {showEncrypted ? player.avg : '[Encrypted]'}
                          </div>
                          <div className="text-xs text-muted-foreground">Avg</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(player.trend)}
                          <span className={`text-sm ${getTrendColor(player.trend)}`}>
                            {player.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* League Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-stadium">League Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leagueStats.map((league, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div>
                        <div className="font-semibold">{league.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {league.totalPlayers} players
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          #{showEncrypted ? league.rank : '[Encrypted]'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {showEncrypted ? league.points : '[Encrypted]'} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-stadium">Trading Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Trades:</span>
                    <span className="font-bold">
                      {showEncrypted ? teamStats.totalTrades : '[Encrypted]'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Successful:</span>
                    <span className="font-bold text-green-600">
                      {showEncrypted ? teamStats.successfulTrades : '[Encrypted]'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-bold">
                      {showEncrypted ? `${teamStats.tradeSuccessRate}%` : '[Encrypted]'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encryption Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-stadium">Privacy Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">FHE Protection</h4>
                      <p className="text-sm text-muted-foreground">
                        All statistics are encrypted using Fully Homomorphic Encryption
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Private Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Your performance data remains private and secure
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">Real-time Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Statistics update in real-time with encrypted calculations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
