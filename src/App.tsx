import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LanguageProvider from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import Index from "./pages/Index";
import Catalogos from "./pages/Catalogos";
import ComoComprar from "./pages/ComoComprar";
import ComoVender from "./pages/ComoVender";
import Midia from "./pages/Midia";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

// Função para verificar se estamos no subdomínio admin
const isAdminSubdomain = () => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname.startsWith('admin.');
};

const App = () => {
  // Se estivermos no subdomínio admin, mostrar apenas o conteúdo admin
  if (isAdminSubdomain()) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rota raiz do subdomínio admin vai para login */}
                <Route path="/" element={<Login />} />
                
                {/* Rota do painel administrativo */}
                <Route 
                  path="/painel" 
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Compatibilidade com rotas /admin no subdomínio */}
                <Route path="/admin" element={<Navigate to="/" replace />} />
                <Route path="/admin/painel" element={<Navigate to="/painel" replace />} />
                
                {/* Catch-all para redirecionar para login */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  }

  // Site principal (não admin)
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalogos" element={<Catalogos />} />
                <Route path="/como-comprar" element={<ComoComprar />} />
                <Route path="/como-vender" element={<ComoVender />} />
                <Route path="/midia" element={<Midia />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/contato" element={<Contato />} />
                
                {/* Rotas Administrativas (fallback para domínio principal) */}
                <Route path="/admin" element={<Login />} />
                <Route 
                  path="/admin/painel" 
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
