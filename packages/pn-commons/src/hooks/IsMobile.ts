import { useEffect, useState } from 'react';

/**
 * Checks if we are on a mobile device 
 */
export function useIsMobile() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return width <= 1200;
}
