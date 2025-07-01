
import React from 'react';
import { useScrollVisibility } from '../hooks/useScrollVisibility';

/**
 * Componente de botão para voltar ao topo da página
 */
const ScrollToTopButton = () => {
  const isVisible = useScrollVisibility(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`w-12 h-12 bg-lagemme-dark hover:bg-lagemme-medium text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      aria-label="Voltar ao topo da página"
    >
      <svg
        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
