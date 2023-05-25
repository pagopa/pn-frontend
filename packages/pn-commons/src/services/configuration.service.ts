import { Validator } from '@pagopa-pn/pn-validator';
import { fetchConfiguration } from './fetch.configuration.service';

class ConfigurationError extends Error {}

export class Configuration {
  private static storedConfiguration: any = null;
  private static configurationLoadingExecuted = false;

  static clear() {
    this.storedConfiguration = null;
    this.configurationLoadingExecuted = false;
  }

  /**
   * Get current configuration of type <T> if loading has been already made, otherwise it throws a ConfigurationError
   * @returns Configuration of type T
   */
  static get<T>(): T {
    if (!this.configurationLoadingExecuted) {
      throw new ConfigurationError(
        'loadConfiguration must be called before any call to getConfiguration'
      );
    } else if (this.storedConfiguration == null) {
      throw new ConfigurationError('error detected when loading configuration');
    }
    return this.storedConfiguration;
  }

  /**
   * This method loads and validates a Configuration of type T
   * @param validator for T, you should provide your validator based on your config object
   */
  static async load<T>(validator: Validator<T>): Promise<void> {
    if (this.configurationLoadingExecuted) {
      throw new ConfigurationError('Configuration should be loaded just once');
    }
    this.configurationLoadingExecuted = true;
    const readValue: T = (await fetchConfiguration()) as T;
    this.storedConfiguration = this.validate(readValue, validator);
  }

  static setForTest<T>(fakeConfiguration: T): void {
    this.configurationLoadingExecuted = true;
    this.storedConfiguration = fakeConfiguration;
  }

  private static validate<T>(readConfiguration: T, validator: Validator<T>): T {
    const validationResult = validator.validate(readConfiguration);
    if (validationResult == null) {
      return readConfiguration;
    } else {
      throw new ConfigurationError(JSON.stringify(validationResult));
    }
  }
}
