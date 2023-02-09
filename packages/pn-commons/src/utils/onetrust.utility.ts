export const ONE_TRUST_CDN = `https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices`;

export const compileOneTrustPath = (id: string, draftMode?: boolean): string => {
  const draft = (draftMode) ? `draft/` : '';
  return `${ONE_TRUST_CDN}/${draft}${id}.json`;
};