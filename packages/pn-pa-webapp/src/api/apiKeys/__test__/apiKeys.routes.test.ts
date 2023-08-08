import { APIKEY_LIST, CREATE_APIKEY, DELETE_APIKEY, STATUS_APIKEY } from '../apiKeys.routes';

describe('ApiKeys routes', () => {
  it('should compile APIKEY_LIST', () => {
    const route = APIKEY_LIST();
    expect(route).toEqual('/api-key-self/api-keys/');
  });

  it('should compile CREATE_APIKEY', () => {
    const route = CREATE_APIKEY();
    expect(route).toEqual('/api-key-self/api-keys/');
  });

  it('should compile DELETE_APIKEY', () => {
    const route = DELETE_APIKEY('mocked-id');
    expect(route).toEqual('/api-key-self/api-keys/mocked-id');
  });

  it('should compile STATUS_APIKEY', () => {
    const route = STATUS_APIKEY('mocked-id');
    expect(route).toEqual('/api-key-self/api-keys/mocked-id/status');
  });
});
