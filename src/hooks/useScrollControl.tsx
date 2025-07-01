
import { useEffect } from 'react';

/**
 * Simplified hook for preventing body scroll when modals/dropdowns are open
 * Replaces the complex scroll control that was causing issues
 */
export const useScrollControl = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Simply prevent body scroll without forcing scrollbar
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);
};
