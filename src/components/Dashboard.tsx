import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Shield, Eye, EyeOff, Lock } from "lucide-react";
import { useAccount } from 'wagmi';
import { useStealthSquadContract } from '@/hooks/useContract';

export const Dashboard = () => {
  const { isConnected, address } = useAccount();
  const { createTeam, isPending } = useStealthSquadContract();
  return (
    <section className="py-16 field-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-stadium">Stealth Squad Dashboard</h2>
          <p className="text-xl text-muted-foreground">
            {isConnected 
              ? `Welcome back, ${address?.slice(0, 6)}...${address?.slice(-4)}! Monitor your encrypted fantasy empire`
              : 'Connect your wallet to access your encrypted fantasy teams'
            }
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* League Overview */}
          <Card className="lg:col-span-2 stadium-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stadium">
                <Users className="w-6 h-6" />
                Active Leagues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Elite Crypto League", players: 12, encrypted: true, position: 3 },
                  { name: "Privacy Champions", players: 10, encrypted: true, position: 1 },
                  { name: "FHE Masters", players: 8, encrypted: true, position: 5 },
                ].map((league, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-crypto-blue rounded-full animate-glow-pulse"></div>
                      <div>
                        <h4 className="font-semibold text-foreground">{league.name}</h4>
                        <p className="text-sm text-muted-foreground">{league.players} players</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-accent/20 text-accent">
                        Position #{league.position}
                      </Badge>
                      <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                        <Shield className="w-3 h-3 mr-1" />
                        Encrypted
                      </Badge>
                      <Button variant="field" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="crypto-glow">
              <CardHeader>
                <CardTitle className="text-crypto">Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-stadium mb-2">147.8</div>
                <p className="text-sm text-muted-foreground mb-4">Average Points</p>
                <div className="flex items-center gap-2 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12.3% from last week</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                  Privacy Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lineup Encryption</span>
                    <Badge className="bg-crypto-blue/20 text-crypto-blue">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Trade History</span>
                    <Badge className="bg-crypto-blue/20 text-crypto-blue">Encrypted</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Strategy Protection</span>
                    <Badge className="bg-crypto-blue/20 text-crypto-blue">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-stadium">Encrypted Lineup Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Build your lineup with complete privacy. Your opponents won't see your strategy until game time.</p>
              <Button variant="hero" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Build Encrypted Lineup
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-crypto">Private Trade Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Negotiate trades without revealing your team composition or future plans.</p>
              <Button variant="crypto" className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Enter Trade Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};