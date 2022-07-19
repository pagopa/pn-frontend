import { parseJwt } from "../jwt-utils";

test('Test valid token', () => {
    const testJSON = parseJwt('mock-token.eyJ0ZXN0IjogInRlc3QxMjMifQ==');
    expect(testJSON).toMatchObject({ test: 'test123'});
});

test('Test invalid token', () => {
    const testJSON = parseJwt('mock-invalid-token');
    expect(testJSON).toBeNull();
});