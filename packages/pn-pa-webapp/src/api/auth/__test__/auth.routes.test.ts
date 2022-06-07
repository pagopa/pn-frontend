import { AUTH_TOKEN_EXCHANGE } from '../auth.routes';

describe('Authentication routes', () => {
  it('should compile AUTH_TOKEN_EXCHANGE', () => {
    const route = AUTH_TOKEN_EXCHANGE();
    expect(route).toEqual('/token-exchange');
  });
});
