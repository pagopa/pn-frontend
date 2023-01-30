import { useLayoutEffect } from 'react';

export const useToSLayout = (contentLoaded: boolean, routes: any) => {
  useLayoutEffect(() => {
    setTimeout(() => {
      const links = document.querySelectorAll('.otnotice-content a');
      links.forEach((l) => {
        const href = l.getAttribute('href');
        if (href?.startsWith('#')) {
          const newHref = `${routes.PRIVACY_POLICY}${href}`;
          l.setAttribute('href', newHref);
        }
      });
    }, 1000);
  }, [contentLoaded]);
};
