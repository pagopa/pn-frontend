import { AUTH_LOGOUT, AUTH_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from '../auth.routes';

describe('Authentication routes', () => {
  it('should compile AUTH_TOKEN_EXCHANGE', () => {
    const route = AUTH_TOKEN_EXCHANGE();
    expect(route).toEqual('/token-exchange');
  });

  it('should compile ONE_IDENTITY_TOKEN_EXCHANGE', () => {
    const route = ONE_IDENTITY_TOKEN_EXCHANGE();
    expect(route).toEqual('/token-exchange-oidc');
  });

  it('should compile AUTH_LOGOUT', () => {
    const route = AUTH_LOGOUT();
    expect(route).toEqual('/logout');
  });
});
