/* eslint-disable max-classes-per-file */
import { fetchConfiguration } from '../utility/fetch.configuration.utility';
class ConfigurationError extends Error {
}
export class Configuration {
    static clear() {
        this.storedConfiguration = null;
        this.configurationLoadingExecuted = false;
    }
    /**
     * Get current configuration of type <T> if loading has been already made, otherwise it throws a ConfigurationError
     * @returns Configuration of type T
     */
    static get() {
        if (!this.configurationLoadingExecuted) {
            throw new ConfigurationError('loadConfiguration must be called before any call to getConfiguration');
        }
        else if (this.storedConfiguration == null) {
            throw new ConfigurationError('error detected when loading configuration');
        }
        return this.storedConfiguration;
    }
    /**
     * This method loads and validates a Configuration of type T
     * @param validator for T, you should provide your validator based on your config object
     */
    static async load(validator) {
        if (this.configurationLoadingExecuted) {
            throw new ConfigurationError('Configuration should be loaded just once');
        }
        this.configurationLoadingExecuted = true;
        const readValue = (await fetchConfiguration());
        this.storedConfiguration = this.validate(readValue, validator);
    }
    static setForTest(fakeConfiguration) {
        this.configurationLoadingExecuted = true;
        this.storedConfiguration = fakeConfiguration;
    }
    static validate(readConfiguration, validator) {
        const validationResult = validator.validate(readConfiguration);
        if (validationResult == null) {
            return readConfiguration;
        }
        else {
            throw new ConfigurationError(JSON.stringify(validationResult));
        }
    }
}
Configuration.storedConfiguration = null;
Configuration.configurationLoadingExecuted = false;
