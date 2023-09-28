import { parseJwt } from '../jwt-utils';

describe('jwt utility test', () => {
  it('Test valid token', () => {
    const testJSON = parseJwt('mock-token.eyJ0ZXN0IjogInRlc3QxMjMifQ==');
    expect(testJSON).toMatchObject({ test: 'test123' });
  });

  it('Test invalid token', () => {
    const testJSON = parseJwt('mock-invalid-token');
    expect(testJSON).toBeNull();
  });
});
