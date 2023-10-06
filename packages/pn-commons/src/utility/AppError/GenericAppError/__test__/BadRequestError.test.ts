import { BadRequestAppError } from '../BadRequestError';

describe('BadRequestAppError', () => {
  it('getMessage', () => {
    const badRequestAppError = new BadRequestAppError({ code: 'mock-code' });

    expect(badRequestAppError.getMessage()).toStrictEqual({
      title: "Errore nell'invio dei dati",
      content: 'Il formato della richiesta non è valido.',
    });
  });
});
