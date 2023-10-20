import { UnauthorizedAppError } from '../UnauthorizedAppError';

describe('UnauthorizedAppError', () => {
  it('getMessage', () => {
    const unauthorizedAppError = new UnauthorizedAppError({ code: 'mock-code' });

    expect(unauthorizedAppError.getMessage()).toStrictEqual({
      title: 'Utente non autorizzato',
      content: "L'utente corrente non ha le autorizzazioni.",
    });
  });
});
