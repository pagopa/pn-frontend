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
});
