import { UnavailableForLegalReasonsError } from '../UnavailableForLegalReasonsError';

describe('UnavailableForLegalReasonsError', () => {
  it('getMessage', () => {
    const unavailableForLegalReasonsError = new UnavailableForLegalReasonsError({
      code: 'mock-code',
    });

    expect(unavailableForLegalReasonsError.getMessage()).toStrictEqual({
      title: 'Piattaforma non accessibile',
      content: 'Non è possibile accedere alla piattaforma',
    });
  });
});
