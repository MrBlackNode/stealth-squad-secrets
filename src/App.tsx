import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/lib/providers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Leagues from "./pages/Leagues";
import Trades from "./pages/Trades";
import Lineups from "./pages/Lineups";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";

const App = () => (
  <Providers>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/lineups" element={<Lineups />} />
          <Route path="/stats" element={<Stats />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Providers>
);

export default App;
