
import React, { useState } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import SideMenu from './SideMenu';
import FloatingButtons from './FloatingButtons';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Componente Layout
 * Layout base reutilizável para todas as páginas - otimizado para mobile
 */
const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-lagemme-dark font-sans w-full no-horizontal-scroll">
      {/* Overlay para quando o menu estiver aberto */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}
      
      <TopBar />
      <Header onMenuToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />
      
      {/* Conteúdo principal - TopBar mobile (70px) + Header mobile (80px) = 150px / desktop (48px + 112px) = 160px */}
      <main className="pt-[150px] md:pt-40 min-h-screen w-full">
        {children}
      </main>
      
      <Footer />
      
      {/* Botões flutuantes */}
      <FloatingButtons />
    </div>
  );
};

export default Layout;
