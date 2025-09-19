import { Button } from "@/components/ui/button";
import { Wallet, Shield, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import logo from "@/assets/logo.png";

export const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img src={logo} alt="Stealth Squad Secrets Logo" className="w-10 h-10" />
            <Shield className="w-3 h-3 absolute -top-1 -right-1 text-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stadium">Stealth Squad Secrets</h1>
            <p className="text-xs text-muted-foreground">FHE-Powered Fantasy Sports</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/leagues" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Leagues
          </Link>
          <Link to="/trades" className="text-foreground hover:text-accent transition-colors">Trades</Link>
          <Link to="/lineups" className="text-foreground hover:text-accent transition-colors">Lineups</Link>
          <Link to="/stats" className="text-foreground hover:text-accent transition-colors">Stats</Link>
          <Link to="/learn" className="text-foreground hover:text-accent transition-colors">Learn FHE</Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              <span>FHE Protected</span>
            </div>
          )}
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>
    </header>
  );
};