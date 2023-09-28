import { ForbiddenAppError } from '../ForbiddenAppError';

describe('ForbiddenAppError', () => {
  it('getMessage', () => {
    const forbiddenAppError = new ForbiddenAppError({ code: 'mock-code' });

    expect(forbiddenAppError.getMessage()).toStrictEqual({
      title: 'La sessione è scaduta',
      content: 'Entra e accedi con SPID o CIE.',
    });
  });
});
