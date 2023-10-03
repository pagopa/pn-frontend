import UnknownAppError from '../UnknownAppError';

describe('UnknownAppError', () => {
  it('getMessage', () => {
    const unknownAppError = new UnknownAppError({ code: 'mock-code' });

    expect(unknownAppError.getMessage()).toStrictEqual({
      title: 'Errore',
      content: 'Errore non previsto.',
    });
  });
});
