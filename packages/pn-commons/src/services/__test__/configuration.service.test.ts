import { Validator } from '@pagopa-pn/pn-validator';
import { clearConfig, getConfiguration, loadConfiguration } from '../configuration.service';

let mockFetchConfigurationResult: any;

jest.mock('../fetch.configuration.service', () => {
  const originalModule = jest.requireActual('../fetch.configuration.service');

  //Mock the default export and named export 'foo'
  return {
    ...originalModule,
    fetchConfiguration: async () => {
      if (mockFetchConfigurationResult) {
        return Promise.resolve(mockFetchConfigurationResult);
      } else {
        throw new Error('fetch.error');  
      }
    },
  };
});

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
  return getConfiguration<TestConfiguration>();
}

describe('configuration service', () => {
  beforeEach(() => clearConfig());
  
  it('fetchConfiguration lauches error', async () => {
    mockFetchConfigurationResult = undefined;
    await expect(loadConfiguration(new TestConfigurationValidator())).rejects.toThrow('fetch.error');
  });

  it('wrong config contents - does not match the validator rules', async () => {
    mockFetchConfigurationResult = {b: 42};
    await expect(loadConfiguration(new TestConfigurationValidator())).rejects.toThrow(
      JSON.stringify({ a: `Value mustn't be undefined`})
    );
  });

  it('loadConfiguration called more than once', async () => {
    mockFetchConfigurationResult = {a: 42};
    await expect(loadConfiguration(new TestConfigurationValidator())).resolves;
    await expect(loadConfiguration(new TestConfigurationValidator())).rejects.toThrow(
      'config should be loaded just once'
    );
  });

  it('getConfiguration called without having called loadConfiguration before', async () => {
    mockFetchConfigurationResult = {a: 42};
    expect(() => getTestConfiguration()).toThrow(
      'loadConfiguration must be called before any call to getConfiguration'
    );
  });

  it('happy path', async () => {
    mockFetchConfigurationResult = {a: 42};
    await loadConfiguration(new TestConfigurationValidator());
    const config = getTestConfiguration();
    expect(config.a).toBe(42);
  });
});
