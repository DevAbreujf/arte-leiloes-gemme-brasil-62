
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsMobile } from '../hooks/use-mobile';
import LanguageSelector from './LanguageSelector';
import MobileLanguageSelector from './MobileLanguageSelector';

interface HeaderProps {
  onMenuToggle: () => void;
}

/**
 * Componente Header
 * Cabeçalho fixo com logo, navegação principal e botão de menu - otimizado para mobile
 */
const Header = ({ onMenuToggle }: HeaderProps) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  

  return (
    <header className="fixed top-[70px] md:top-12 left-0 right-0 bg-white shadow-sm z-40 border-b border-gray-200 overflow-visible">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 overflow-visible">
        <div className="flex items-center h-20 md:h-28 overflow-visible">
          {/* Logo */}
          <div className="flex-shrink-0 mr-4 md:mr-0">
            <Link to="/">
              <img 
                src="/images/logo.png" 
                alt="La Gemme Leilões" 
                className="h-16 md:h-22 w-auto"
              />
            </Link>
          </div>

          {/* Links de navegação principal - Desktop apenas */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-medium">{t('home')}</span>
            </Link>
            <Link 
              to="/catalogos" 
              className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{t('catalogs')}</span>
            </Link>
          </nav>

          {/* Espaçador para empurrar seletores e menu para a direita */}
          <div className="flex-grow"></div>

          {/* Seletores de idioma e botão menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Language Selector */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            
            {/* Mobile Language Selector */}
            <div className="md:hidden relative overflow-visible">
              <MobileLanguageSelector />
            </div>
            
            
            <button
              onClick={onMenuToggle}
              className="flex items-center space-x-2 px-3 py-2 md:px-4 text-gray-800 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline font-medium text-sm md:text-base">{t('menu')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
