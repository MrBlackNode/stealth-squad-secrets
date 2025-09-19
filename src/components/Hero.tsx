import { Button } from "@/components/ui/button";
import { Shield, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-helmet.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80"></div>
      </div>
      
      {/* Stadium Lighting Effects */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-stadium-glow/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-crypto-blue/20 rounded-full blur-3xl animate-glow-pulse"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-glow">
            <span className="block text-stadium">Stealth Squad.</span>
            <span className="block text-crypto">Secrets Protected.</span>
            <span className="block text-foreground">FHE Powered.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The revolutionary fantasy sports platform where your strategies, trades, and team data are encrypted 
            using Fully Homomorphic Encryption. Play with complete privacy and security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/join">
              <Button variant="hero" size="lg" className="text-xl px-8 py-6">
                <Shield className="w-6 h-6 mr-2" />
                Join Encrypted League
              </Button>
            </Link>
            <Link to="/learn">
              <Button variant="field" size="lg" className="text-xl px-8 py-6">
                <Lock className="w-6 h-6 mr-2" />
                Learn About FHE
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/50 stadium-glow">
              <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-stadium">Encrypted Lineups</h3>
              <p className="text-muted-foreground">Your strategies stay hidden until game time with FHE technology</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/50 crypto-glow">
              <Lock className="w-12 h-12 text-crypto-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-crypto">Private Trades</h3>
              <p className="text-muted-foreground">Negotiate trades without revealing your team composition</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border/50">
              <Zap className="w-12 h-12 text-stadium-light mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Fair Competition</h3>
              <p className="text-muted-foreground">No strategy copying, pure skill-based fantasy football</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};