import { compileOneTrustPath, ONE_TRUST_CDN } from '../onetrust.utility';

describe('OneTrust utility', () => {

  it('compileOneTrustPath', () => {
    const compiledPath = compileOneTrustPath('mock-id');
    expect(compiledPath).toStrictEqual(`${ONE_TRUST_CDN}/mock-id.json`);
  });

  it('compileOneTrustPath - draft mode', () => {
    const compiledPath = compileOneTrustPath('mock-id', true);
    expect(compiledPath).toStrictEqual(`${ONE_TRUST_CDN}/draft/mock-id.json`);
  });
})