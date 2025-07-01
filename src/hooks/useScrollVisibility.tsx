
import { useState, useEffect } from 'react';

/**
 * Hook para detectar quando mostrar/esconder botões baseado na posição do scroll
 */
export const useScrollVisibility = (threshold: number = 300) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Throttle para performance
    let timeoutId: NodeJS.Timeout;
    const throttledToggleVisibility = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(toggleVisibility, 100);
    };

    window.addEventListener('scroll', throttledToggleVisibility);

    return () => {
      window.removeEventListener('scroll', throttledToggleVisibility);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold]);

  return isVisible;
};
