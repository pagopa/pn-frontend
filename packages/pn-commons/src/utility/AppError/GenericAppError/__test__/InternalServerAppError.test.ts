import { InternalServerAppError } from '../InternalServerAppError';

describe('InternalServerAppError', () => {
  it('getMessage', () => {
    const internalServerAppError = new InternalServerAppError({ code: 'mock-code' });

    expect(internalServerAppError.getMessage()).toStrictEqual({
      title: 'Si è verificato un errore',
      content:
        'Il servizio non è disponibile a causa di un problema tecnico. Riprova più tardi. Se l’errore si ripete, contatta l’assistenza e comunica le informazioni errore.',
    });
  });

  it('getResponseError includes showTechnicalData = true', () => {
    const internalServerAppError = new InternalServerAppError({
      code: 'mock-code',
      element: '',
      detail: 'mock-detail',
    });

    expect(internalServerAppError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      element: '',
      detail: 'mock-detail',
      showTechnicalData: true,
      message: {
        title: 'Il servizio non è disponibile',
        content:
          'Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi.',
      },
    });
  });
});
