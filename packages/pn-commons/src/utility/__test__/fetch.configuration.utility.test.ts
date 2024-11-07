import { fetchConfiguration } from '../fetch.configuration.utility';

let mockFetchConfigurationResult: any;

const unmockedFetch = global.fetch;

describe('fetch configuration service', () => {
  beforeAll(() => {
    global.fetch = (path, options) => {
      if (mockFetchConfigurationResult) {
        return Promise.resolve({
          json: () => Promise.resolve({ response: mockFetchConfigurationResult, path, options }),
        }) as Promise<Response>;
      }
      throw new Error('fetch.error');
    };
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it('success', async () => {
    mockFetchConfigurationResult = { a: 42 };
    process.env.BASE_URL = '/';
    const result = await fetchConfiguration();
    expect(result.response).toStrictEqual(mockFetchConfigurationResult);
    expect(result.path).toBe('/conf/config.json');
    expect(result.options).toStrictEqual({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  });

  it('error', async () => {
    mockFetchConfigurationResult = undefined;
    await expect(fetchConfiguration()).rejects.toThrow('fetch.error');
  });
});
