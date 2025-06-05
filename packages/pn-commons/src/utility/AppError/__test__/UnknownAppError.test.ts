import UnknownAppError from '../UnknownAppError';

describe('UnknownAppError', () => {
  it('getMessage', () => {
    const unknownAppError = new UnknownAppError({ code: 'mock-code' });

    expect(unknownAppError.getMessage()).toStrictEqual({
      title: 'Errore',
      content: 'Errore non previsto.',
    });
  });

  it('getResponseError includes showTechnicalData = true', () => {
    const unknownAppError = new UnknownAppError({
      code: 'mock-code',
      element: '',
      detail: 'mock-detail',
    });

    expect(unknownAppError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      element: '',
      detail: 'mock-detail',
      showTechnicalData: true,
      message: {
        title: 'Errore',
        content: 'Errore non previsto.',
      },
    });
  });
});
