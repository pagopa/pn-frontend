import UnknownAppError from '../UnknownAppError';

describe('UnknownAppError', () => {
  it('getMessage', () => {
    const unknownAppError = new UnknownAppError({ code: 'mock-code' });

    expect(unknownAppError.getMessage()).toStrictEqual({
      title: 'Si è verificato un errore',
      content:
        'Il servizio non è disponibile. Riprova più tardi. Se l’errore si ripete, contatta l’assistenza e comunica le informazioni errore.',
    });
  });
});
