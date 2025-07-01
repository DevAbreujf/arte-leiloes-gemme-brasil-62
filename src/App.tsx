
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LanguageProvider from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Catalogos from "./pages/Catalogos";
import ComoComprar from "./pages/ComoComprar";
import ComoVender from "./pages/ComoVender";
import Midia from "./pages/Midia";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogos" element={<Catalogos />} />
            <Route path="/como-comprar" element={<ComoComprar />} />
            <Route path="/como-vender" element={<ComoVender />} />
            <Route path="/midia" element={<Midia />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/contato" element={<Contato />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
