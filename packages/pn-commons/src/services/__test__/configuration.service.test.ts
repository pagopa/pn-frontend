import { Validator } from '@pagopa-pn/pn-validator';

import { Configuration } from '../configuration.service';

let mockFetchConfigurationResult: any;

const unmockedFetch = global.fetch;

interface TestConfiguration {
  a: number;
}

class TestConfigurationValidator extends Validator<TestConfiguration> {
  constructor() {
    super();
    this.ruleFor('a').isNumber().not().isNull().not().isUndefined();
  }
}

function getTestConfiguration(): TestConfiguration {
  return Configuration.get<TestConfiguration>();
}

describe('configuration service', () => {
  beforeAll(() => {
    global.fetch = () => {
      if (mockFetchConfigurationResult) {
        return Promise.resolve({
          json: () => Promise.resolve(mockFetchConfigurationResult),
        }) as Promise<Response>;
      }
      throw new Error('fetch.error');
    };
  });

  beforeEach(() => Configuration.clear());

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  it('fetchConfiguration lauches error', async () => {
    mockFetchConfigurationResult = undefined;
    await expect(Configuration.load(new TestConfigurationValidator())).rejects.toThrow(
      'fetch.error'
    );
  });

  it('wrong config contents - does not match the validator rules', async () => {
    mockFetchConfigurationResult = { b: 42 };
    await expect(Configuration.load(new TestConfigurationValidator())).rejects.toThrow(
      JSON.stringify({ a: `Value mustn't be undefined` })
    );
  });

  it('loadConfiguration called more than once', async () => {
    mockFetchConfigurationResult = { a: 42 };
    await expect(Configuration.load(new TestConfigurationValidator())).resolves;
    await expect(Configuration.load(new TestConfigurationValidator())).rejects.toThrow(
      'Configuration should be loaded just once'
    );
  });

  it('getConfiguration called without having called loadConfiguration before', async () => {
    mockFetchConfigurationResult = { a: 42 };
    expect(() => getTestConfiguration()).toThrow(
      'loadConfiguration must be called before any call to getConfiguration'
    );
  });

  it('happy path', async () => {
    mockFetchConfigurationResult = { a: 42 };
    await Configuration.load(new TestConfigurationValidator());
    const config = getTestConfiguration();
    expect(config.a).toBe(42);
  });

  it('set configuration for testing', () => {
    Configuration.setForTest({ a: 67 });
    const config = getTestConfiguration();
    expect(config.a).toBe(67);
  });

  it('clear configuration', async () => {
    mockFetchConfigurationResult = { a: 42 };
    await Configuration.load(new TestConfigurationValidator());
    const config = getTestConfiguration();
    expect(config.a).toBe(42);
    Configuration.clear();
    expect(() => getTestConfiguration()).toThrow(
      'loadConfiguration must be called before any call to getConfiguration'
    );
  });
});
