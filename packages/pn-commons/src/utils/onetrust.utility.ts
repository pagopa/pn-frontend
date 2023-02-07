export const ONE_TRUST_INSTANCE_ID = '77f17844-04c3-4969-a11d-462ee77acbe1';
export const ONE_TRUST_BASEPATH = `https://privacyportalde-cdn.onetrust.com/${ONE_TRUST_INSTANCE_ID}/privacy-notices`;

export const compileOneTrustPath = (id: string, draftMode?: string): string => {
  const draft = (draftMode && draftMode !== '') ? `${draftMode}/` : '';
  return `${ONE_TRUST_BASEPATH}/${draft}${id}.json`;
};