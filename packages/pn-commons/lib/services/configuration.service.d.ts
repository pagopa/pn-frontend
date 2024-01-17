import { Validator } from '@pagopa-pn/pn-validator';
export declare class Configuration {
    private static storedConfiguration;
    private static configurationLoadingExecuted;
    static clear(): void;
    /**
     * Get current configuration of type <T> if loading has been already made, otherwise it throws a ConfigurationError
     * @returns Configuration of type T
     */
    static get<T>(): T;
    /**
     * This method loads and validates a Configuration of type T
     * @param validator for T, you should provide your validator based on your config object
     */
    static load<T>(validator: Validator<T>): Promise<void>;
    static setForTest<T>(fakeConfiguration: T): void;
    private static validate;
}
