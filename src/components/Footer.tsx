
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Componente Footer
 * Rodapé elegante com informações de contato e navegação
 */
const Footer = () => {
  const { t } = useLanguage();

  const handleAddressClick = () => {
    const address = "Rua Visconde de Pirajá, 550 Loja 206 - Ipanema - Rio de Janeiro - RJ, CEP: 22410-002";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-300 mt-auto w-full overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Menu */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-lagemme-dark mb-6 border-b border-gray-300 pb-2">
              Menu
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 text-sm block truncate"
                >
                  {t('catalogs')}
                </a>
              </li>
              <li>
                <a 
                  href="https://www.iarremate.com/quero-comprar" 
                  className="text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 text-sm block truncate"
                >
                  {t('howToBuy')}
                </a>
              </li>
              <li>
                <a 
                  href="https://www.iarremate.com/quero-vender" 
                  className="text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 text-sm block truncate"
                >
                  {t('howToSell')}
                </a>
              </li>
              <li>
                <a 
                  href="/quem-somos" 
                  className="text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 text-sm block truncate"
                >
                  {t('aboutUs')}
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 text-sm block truncate"
                >
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-lagemme-dark mb-6 border-b border-gray-300 pb-2">
              {t('serviceTitle')}
            </h3>
            <div className="text-lagemme-medium text-sm leading-relaxed overflow-hidden">
              <p className="break-words hyphens-auto">
                {t('serviceHours')}
              </p>
            </div>
          </div>

          {/* Contato */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-lagemme-dark mb-6 border-b border-gray-300 pb-2">
              {t('contactTitle')}
            </h3>
            <div className="space-y-4 overflow-hidden">
              <div className="flex items-start space-x-3 text-lagemme-medium">
                <svg className="w-4 h-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div className="text-sm min-w-0 overflow-hidden">
                  <div className="break-words whitespace-normal">
                    <a href="tel:+552125413192" className="hover:text-lagemme-dark transition-colors duration-200">
                      (21) 2541-3192
                    </a>
                  </div>
                  <div className="break-words whitespace-normal">
                    <a href="tel:+5521969848592" className="hover:text-lagemme-dark transition-colors duration-200">
                      (21) 96984-8592 Petrópolis
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-lagemme-medium">
                <svg className="w-4 h-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118L10 12.116 2 8.118V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a 
                  href="mailto:lagemmerio2@gmail.com"
                  className="text-sm break-all min-w-0 overflow-hidden hover:text-lagemme-dark transition-colors duration-200"
                >
                  lagemmerio2@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-lagemme-dark mb-6 border-b border-gray-300 pb-2">
              {t('addressTitle')}
            </h3>
            <div className="flex items-start space-x-3 text-lagemme-medium overflow-hidden">
              <svg className="w-4 h-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <button
                onClick={handleAddressClick}
                className="text-sm leading-relaxed break-words min-w-0 overflow-hidden hyphens-auto hover:text-lagemme-dark transition-colors duration-200 text-left cursor-pointer"
              >
                {t('address')}
              </button>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <p className="text-sm text-lagemme-medium break-words">
              {t('copyright')}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <a 
                href="#" 
                className="text-sm text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 break-words"
              >
                {t('termsConditions')}
              </a>
              <a 
                href="#" 
                className="text-sm text-lagemme-medium hover:text-lagemme-dark transition-colors duration-200 break-words"
              >
                {t('privacyPolicy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
