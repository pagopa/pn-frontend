import { UnhandledAppError } from '../UnhandledAppError';

describe('UnhandledAppError', () => {
  it('getMessage', () => {
    const unhandledAppError = new UnhandledAppError({
      code: 'mock-code',
    });

    expect(unhandledAppError.getMessage()).toStrictEqual({
      title: 'Errore generico',
      content: 'Si è verificato un errore. Si prega di riprovare più tardi.',
    });
  });

  it('getResponseError includes showTechnicalData = true', () => {
    const unhandledAppError = new UnhandledAppError({
      code: 'mock-code',
      element: '',
      detail: 'mock-detail',
    });

    expect(unhandledAppError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      element: '',
      detail: 'mock-detail',
      showTechnicalData: true,
      message: {
        title: 'Errore generico',
        content: 'Si è verificato un errore. Si prega di riprovare più tardi.',
      },
    });
  });
});
