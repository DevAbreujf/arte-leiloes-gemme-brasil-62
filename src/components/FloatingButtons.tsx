
import React from 'react';
import FloatingWhatsAppButton from './FloatingWhatsAppButton';
import ScrollToTopButton from './ScrollToTopButton';

/**
 * Container para os botões flutuantes no canto inferior direito
 */
const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <ScrollToTopButton />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default FloatingButtons;
