
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsMobile } from '../hooks/use-mobile';

/**
 * Componente MobileLanguageSelector
 * Seletor de idioma otimizado para mobile - mostra apenas bandeiras em mobile
 */
const MobileLanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  const toggleSelector = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (newLanguage: 'pt' | 'en') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleSelector}
          className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-md hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:outline-none"
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
        
        {isOpen && (
          <>
            {/* Overlay transparente para capturar cliques fora */}
            <div 
              className="fixed inset-0 z-[9998] bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown fixo */}
            <div 
              className="fixed bg-white border border-gray-300 shadow-xl rounded-md z-[9999] min-w-[120px]"
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`
              }}
            >
              <button
                onClick={() => handleLanguageChange('pt')}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 text-left first:rounded-t-md"
              >
                <img 
                  src="/images/flags/brazil.png" 
                  alt="Bandeira do Brasil" 
                  className="w-4 h-3 rounded-sm object-cover"
                />
                <span className="text-sm">Português</span>
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 text-left last:rounded-b-md"
              >
                <img 
                  src="/images/flags/usa.png" 
                  alt="Bandeira dos EUA" 
                  className="w-4 h-3 rounded-sm object-cover"
                />
                <span className="text-sm">English</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
};

export default MobileLanguageSelector;
