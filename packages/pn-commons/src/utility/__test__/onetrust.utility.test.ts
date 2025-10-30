import { ONE_TRUST_CDN, compileOneTrustPath } from '../onetrust.utility';

describe('OneTrust utility', () => {
  it('compileOneTrustPath', () => {
    const compiledPath = compileOneTrustPath('mock-id');
    expect(compiledPath).toStrictEqual(`${ONE_TRUST_CDN}/mock-id/published/privacynotice.json`);
  });

  it('compileOneTrustPath - draft mode', () => {
    const compiledPath = compileOneTrustPath('mock-id', true);
    expect(compiledPath).toStrictEqual(`${ONE_TRUST_CDN}/mock-id/draft/privacynotice.json`);
  });
});
