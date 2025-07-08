
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente SideMenu
 * Menu lateral deslizante com navegação completa
 */
const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const { t } = useLanguage();

  // Lista de itens do menu principal
  const menuItems = [
    { 
      key: 'home', 
      label: t('home'), 
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    { 
      key: 'catalogs', 
      label: t('catalogs'), 
      path: '/catalogos',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      key: 'howToBuy', 
      label: t('howToBuy'), 
      path: 'https://www.iarremate.com/quero-comprar',
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      key: 'howToSell', 
      label: t('howToSell'), 
      path: 'https://www.iarremate.com/quero-vender',
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      key: 'media', 
      label: t('media'), 
      path: '/midia',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      key: 'aboutUs', 
      label: t('aboutUs'), 
      path: '/quem-somos',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      key: 'contact', 
      label: t('contact'), 
      path: '/contato',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118L10 12.116 2 8.118V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed top-0 right-0 h-full w-[85vw] md:w-[35vw] lg:w-80 max-w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Cabeçalho do menu */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-light text-gray-600">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Botões de Login e Cadastro */}
        <div className="px-4 py-4 border-b border-gray-200">
          <a href="https://www.iarremate.com/login" className="block w-full text-center px-3 py-2 mb-2 bg-lagemme-dark text-white rounded-md hover:bg-lagemme-medium transition-colors duration-200 text-sm">
            {t('login')}
          </a>
          <a href="https://www.iarremate.com/cadastro" className="block w-full text-center px-3 py-2 bg-lagemme-dark text-white rounded-md hover:bg-lagemme-medium transition-colors duration-200 text-sm">
            {t('signup')}
          </a>
        </div>

        {/* Lista de navegação */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.key}>
                {item.external ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-md transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-700 rounded-md transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Links legais na parte inferior */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-600 transition-colors duration-200"
          >
            {t('termsConditions')}
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-600 transition-colors duration-200"
          >
            {t('privacyPolicy')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
