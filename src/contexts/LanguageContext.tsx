
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos para o contexto de idioma
interface LanguageContextType {
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  t: (key: string) => string;
}

// Traduções para o site
const translations = {
  pt: {
    // Header
    home: 'Home',
    catalogs: 'Catálogos',
    menu: 'Menu',
    // Menu lateral
    howToBuy: 'Como Comprar',
    howToSell: 'Como Vender',
    media: 'Mídia',
    aboutUs: 'Quem Somos',
    contact: 'Contato',
    termsConditions: 'Termos e Condições',
    privacyPolicy: 'Política de Privacidade',
    // TopBar
    serviceHours: 'Atendimento segunda a sexta das 10h às 12h ou das 14h30 às 17h',
    // Footer
    serviceTitle: 'Atendimento',
    contactTitle: 'Contato',
    addressTitle: 'Endereço',
    address: 'Rua Visconde de Pirajá, 550 Loja 206 - Ipanema - Rio de Janeiro - RJ, CEP: 22410-002',
    copyright: '©La Gemme Leilões - V9.0'
  },
  en: {
    // Header
    home: 'Home',
    catalogs: 'Catalogs',
    menu: 'Menu',
    // Menu lateral
    howToBuy: 'How to Buy',
    howToSell: 'How to Sell',
    media: 'Media',
    aboutUs: 'About Us',
    contact: 'Contact',
    termsConditions: 'Terms and Conditions',
    privacyPolicy: 'Privacy Policy',
    // TopBar
    serviceHours: 'Service Monday to Friday from 10am to 12pm or 2:30pm to 5pm',
    // Footer
    serviceTitle: 'Service',
    contactTitle: 'Contact',
    addressTitle: 'Address',
    address: 'Rua Visconde de Pirajá, 550 Store 206 - Ipanema - Rio de Janeiro - RJ, ZIP: 22410-002',
    copyright: '©La Gemme Auctions - V9.0'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Provider do contexto de idioma
 * Gerencia o estado do idioma atual e fornece funções de tradução
 */
const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook para usar o contexto de idioma
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
