import { UnhandledAppError } from '../UnhandledAppError';

describe('UnhandledAppError', () => {
  it('getMessage', () => {
    const unhandledAppError = new UnhandledAppError({
      code: 'mock-code',
    });

    expect(unhandledAppError.getMessage()).toStrictEqual({
      title: 'Si è verificato un errore',
      content:
        'Il servizio non è disponibile. Riprova più tardi. Se l’errore si ripete, contatta l’assistenza e comunica le informazioni errore.',
    });
  });
});
