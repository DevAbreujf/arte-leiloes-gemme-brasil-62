import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que força o scroll para o topo da página quando a rota muda
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força o scroll para o topo quando a rota muda
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Usa 'instant' para evitar animação de scroll
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
