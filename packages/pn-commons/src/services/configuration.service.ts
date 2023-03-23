import { Validator } from "@pagopa-pn/pn-validator"
import { fetchConfiguration } from "./fetch.configuration.service";

// eslint-disable-next-line functional/no-let
let storedConfiguration: any = null;

// eslint-disable-next-line functional/no-let
let configurationLoadingExecuted = false;

export class ConfigurationError extends Error { }

// for test purposes only!!
export function clearConfig() {
  storedConfiguration = null;
  configurationLoadingExecuted = false;
}

export function validateConfiguration<T>(readConfiguration: T, validator: Validator<T>): T {
  const validationResult = validator.validate(readConfiguration);
  if (validationResult == null) {
    return readConfiguration;
  } else {
    throw new ConfigurationError(JSON.stringify(validationResult));
  }
}

export async function loadConfiguration<T>(validator: Validator<T>): Promise<void> {
  if (configurationLoadingExecuted) {
    throw new ConfigurationError('config should be loaded just once');
  }
  configurationLoadingExecuted = true;
  const readValue: T = (await fetchConfiguration()) as T;
  storedConfiguration = validateConfiguration(readValue, validator);
}

export function getConfiguration<T>(): T {
  if (!configurationLoadingExecuted) {
    throw new ConfigurationError('loadConfiguration must be called before any call to getConfiguration');
  } else if (storedConfiguration == null) {
    throw new ConfigurationError('error detected when loading configuration');
  }
  return storedConfiguration;
}
