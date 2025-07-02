
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import LanguageProvider from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SubdomainRouter from "./components/SubdomainRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/PageLoader";

// Lazy load pages with error handling
const Index = lazy(() => import("./pages/Index").catch(() => ({ default: () => <div>Erro ao carregar página inicial</div> })));
const Catalogos = lazy(() => import("./pages/Catalogos").catch(() => ({ default: () => <div>Erro ao carregar catálogos</div> })));
const ComoComprar = lazy(() => import("./pages/ComoComprar").catch(() => ({ default: () => <div>Erro ao carregar página</div> })));
const ComoVender = lazy(() => import("./pages/ComoVender").catch(() => ({ default: () => <div>Erro ao carregar página</div> })));
const Midia = lazy(() => import("./pages/Midia").catch(() => ({ default: () => <div>Erro ao carregar mídia</div> })));
const QuemSomos = lazy(() => import("./pages/QuemSomos").catch(() => ({ default: () => <div>Erro ao carregar página</div> })));
const Contato = lazy(() => import("./pages/Contato").catch(() => ({ default: () => <div>Erro ao carregar contato</div> })));
const NotFound = lazy(() => import("./pages/NotFound").catch(() => ({ default: () => <div>Página não encontrada</div> })));
const Login = lazy(() => import("./pages/Login").catch(() => ({ default: () => <div>Erro ao carregar login</div> })));
const AdminPanel = lazy(() => import("./pages/AdminPanel").catch(() => ({ default: () => <div>Erro ao carregar painel admin</div> })));

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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Site principal (não admin)
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
