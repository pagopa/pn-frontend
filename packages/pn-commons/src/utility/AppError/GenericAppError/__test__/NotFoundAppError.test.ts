import { NotFoundAppError } from '../NotFoundAppError';

describe('NotFoundAppError', () => {
  it('getMessage', () => {
    const notFoundAppError = new NotFoundAppError({ code: 'mock-code' });

    expect(notFoundAppError.getMessage()).toStrictEqual({
      title: 'Risorsa non trovata',
      content: 'Si è verificato un errore. Si prega di riprovare più tardi.',
    });
  });
});
