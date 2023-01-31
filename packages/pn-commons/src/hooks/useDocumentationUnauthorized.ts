import { useLayoutEffect } from 'react';

export const useDocumentationUnauthorized = (contentLoaded: boolean, route: any) => {
  useLayoutEffect(() => {
    setTimeout(() => {
      const links = document.querySelectorAll('.otnotice-content a');
      links.forEach((l) => {
        const href = l.getAttribute('href');
        if (href?.startsWith('#')) {
          const newHref = `${route}${href}`;
          l.setAttribute('href', newHref);
        }
      });
    }, 1000);
  }, [contentLoaded]);
};
