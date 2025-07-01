
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Componente TopBar
 * Barra superior fixa com informações de atendimento - otimizada para mobile
 */
const TopBar = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 h-12 overflow-hidden">
      <div className="py-3 px-4 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm overflow-hidden">
            <div className="mb-1 md:mb-0 font-medium truncate text-xs md:text-sm">
              {t('serviceHours')}
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>(21) 2541-3192</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118L10 12.116 2 8.118V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>lagemmerio2@gmail.com</span>
              </div>
            </div>
            {/* Mobile: Show only phone number */}
            <div className="md:hidden flex items-center space-x-2 text-xs">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>(21) 2541-3192</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
