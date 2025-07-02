
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsMobile } from '../hooks/use-mobile';

/**
 * Componente MobileLanguageSelector
 * Versão ultra-robusta com tratamento separado de eventos
 */
const MobileLanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleLanguageSelect = (newLanguage: 'pt' | 'en') => {
    // Fechar dropdown
    setIsOpen(false);
    
    // Usar requestAnimationFrame para garantir que a mudança aconteça no próximo frame
    requestAnimationFrame(() => {
      setLanguage(newLanguage);
    });
  };

  // Calcular posição do dropdown
  const getDropdownPosition = () => {
    if (!containerRef.current) return { top: 0, right: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    };
  };


  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleOutsideClick = (event: Event) => {
      const target = event.target as Node;
      
      // Verificar se o clique foi fora do botão e fora do dropdown
      if (containerRef.current && !containerRef.current.contains(target)) {
        // Também verificar se não foi clique no dropdown (que está no portal)
        const dropdownElement = document.querySelector('[data-mobile-language-dropdown]');
        if (!dropdownElement || !dropdownElement.contains(target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Só renderizar em mobile
  if (!isMobile) {
    return null;
  }
  
  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={handleToggle}
        className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img 
          src={language === 'pt' 
            ? "/images/flags/brazil.png" 
            : "/images/flags/usa.png"
          }
          alt={language === 'pt' ? "Bandeira do Brasil" : "Bandeira dos EUA"}
          className="w-4 h-3 rounded-sm object-cover"
        />
      </button>
      
      {isOpen && ReactDOM.createPortal(
        <div 
          data-mobile-language-dropdown="true"
          className="fixed bg-white border border-gray-300 shadow-lg rounded-md z-[9999] min-w-[140px]"
          style={{
            top: `${getDropdownPosition().top}px`,
            right: `${getDropdownPosition().right}px`
          }}
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLanguageSelect('pt');
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLanguageSelect('pt');
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={
              `w-full flex items-center space-x-2 px-3 py-2 text-left rounded-t-md transition-colors cursor-pointer select-none ${
                language === 'pt' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-100 text-gray-700 active:bg-gray-200'
              }`
            }
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <img 
              src="/images/flags/brazil.png" 
              alt="Brasil" 
              className="w-4 h-3 rounded-sm object-cover pointer-events-none"
            />
            <span className="text-sm font-medium pointer-events-none">Português</span>
          </button>
          
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLanguageSelect('en');
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLanguageSelect('en');
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={
              `w-full flex items-center space-x-2 px-3 py-2 text-left rounded-b-md transition-colors cursor-pointer select-none ${
                language === 'en' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-100 text-gray-700 active:bg-gray-200'
              }`
            }
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            <img 
              src="/images/flags/usa.png" 
              alt="USA" 
              className="w-4 h-3 rounded-sm object-cover pointer-events-none"
            />
            <span className="text-sm font-medium pointer-events-none">English</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MobileLanguageSelector;
