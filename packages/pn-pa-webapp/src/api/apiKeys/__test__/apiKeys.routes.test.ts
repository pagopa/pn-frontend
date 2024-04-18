import { DELETE_APIKEY, STATUS_APIKEY } from '../apiKeys.routes';

describe('ApiKeys routes', () => {
  it('should compile DELETE_APIKEY', () => {
    const route = DELETE_APIKEY('mocked-id');
    expect(route).toEqual('/api-key-self/api-keys/mocked-id');
  });

  it('should compile STATUS_APIKEY', () => {
    const route = STATUS_APIKEY('mocked-id');
    expect(route).toEqual('/api-key-self/api-keys/mocked-id/status');
  });
});
