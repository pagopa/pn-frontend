import { compileOneTrustPath, ONE_TRUST_BASEPATH } from '../onetrust.utility';

describe('OneTrust utility', () => {

  it('compileOneTrustPath', () => {
    const compiledPath = compileOneTrustPath('mock-id');
    expect(compiledPath).toStrictEqual(`${ONE_TRUST_BASEPATH}/mock-id.json`);
  });

  it('compileOneTrustPath - draft mode', () => {
    const compiledPath = compileOneTrustPath('mock-id', 'mock-draft-mode');
    expect(compiledPath).toStrictEqual(`${ONE_TRUST_BASEPATH}/mock-draft-mode/mock-id.json`);
  });
})