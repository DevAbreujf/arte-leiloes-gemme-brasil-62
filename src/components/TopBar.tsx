
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Componente TopBar
 * Barra superior fixa com informações de atendimento - otimizada para mobile
 */
const TopBar = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 h-auto md:h-12">
      {/* Desktop Layout */}
      <div className="hidden md:block py-3 px-4 h-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between text-sm h-full">
            <div className="font-medium">
              {t('serviceHours')}
            </div>
            <div className="flex items-center space-x-6">
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
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden py-2 px-4">
        <div className="container mx-auto px-2">
          {/* Primeira linha: Horário de atendimento */}
          <div className="text-center text-xs font-medium mb-2 leading-tight">
            {t('serviceHoursMobile')}
          </div>
          {/* Segunda linha: Contatos */}
          <div className="flex justify-center items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>(21) 2541-3192</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118L10 12.116 2 8.118V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>lagemmerio2@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
