export const ONE_TRUST_CDN = `https://privacyportalde-cdn.onetrust.com/storage-container/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices`;

export const compileOneTrustPath = (id: string, draftMode?: boolean): string => {
  const mode = draftMode ? `draft` : 'published';
  return `${ONE_TRUST_CDN}/${id}/${mode}/privacynotice.json`;
};

export const rewriteLinks = (route: any, selectorString: string) => {
  const links = document.querySelectorAll(selectorString);
  links.forEach((l) => {
    const href = l.getAttribute('href');
    if (href?.startsWith('#', 0)) {
      const newHref = `${route}${href}`;
      l.setAttribute('href', newHref);
    }
  });
};
