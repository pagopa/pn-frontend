import { Validator } from "@pagopa-pn/pn-validator";
import { fetchConfiguration } from "./fetch.configuration.service";

export class ConfigurationError extends Error { }

export class Configuration {
  private static storedConfiguration: any = null;
  private static configurationLoadingExecuted = false;

  static clear() {
    this.storedConfiguration = null;
    this.configurationLoadingExecuted = false;
  }

  static get<T>(): T {
    if (!this.configurationLoadingExecuted) {
      throw new ConfigurationError('loadConfiguration must be called before any call to getConfiguration');
    } else if (this.storedConfiguration == null) {
      throw new ConfigurationError('error detected when loading configuration');
    }
    return this.storedConfiguration;
  }

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