/* tslint:disable */
/* eslint-disable */
/**
 * PN BFF BE Microservice - Addresses
 * Documentation APIs v1.0
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: pn@pagopa.it
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * richiede value oppure requestId di un indirizzo in corso di validazione
 * @export
 * @interface AddressVerification
 */
export interface AddressVerification {
    /**
     * 
     * @type {string}
     * @memberof AddressVerification
     */
    'value'?: string;
    /**
     * 
     * @type {string}
     * @memberof AddressVerification
     */
    'requestId'?: string;
    /**
     * Verification Code
     * @type {string}
     * @memberof AddressVerification
     */
    'verificationCode'?: string;
}
/**
 * 
 * @export
 * @interface AddressVerificationResponse
 */
export interface AddressVerificationResponse {
    /**
     * Uno dei seguenti valori - CODE_VERIFICATION_REQUIRED: indica che è richiesto il codice di verifica - PEC_VALIDATION_REQUIRED: indica che il codice di verifica inserito è valido, ma che non è ancora arrivata la conferma PEC (solo per la PEC) 
     * @type {string}
     * @memberof AddressVerificationResponse
     */
    'result': AddressVerificationResponseResultEnum;
}

export const AddressVerificationResponseResultEnum = {
    CodeVerificationRequired: 'CODE_VERIFICATION_REQUIRED',
    PecValidationRequired: 'PEC_VALIDATION_REQUIRED'
} as const;

export type AddressVerificationResponseResultEnum = typeof AddressVerificationResponseResultEnum[keyof typeof AddressVerificationResponseResultEnum];

/**
 * 
 * @export
 * @enum {string}
 */

export const BffAddressType = {
    Legal: 'legal',
    Courtesy: 'courtesy'
} as const;

export type BffAddressType = typeof BffAddressType[keyof typeof BffAddressType];


/**
 * richiede value oppure requestId di un indirizzo in corso di validazione
 * @export
 * @interface BffAddressVerificationRequest
 */
export interface BffAddressVerificationRequest {
    /**
     * 
     * @type {string}
     * @memberof BffAddressVerificationRequest
     */
    'value'?: string;
    /**
     * 
     * @type {string}
     * @memberof BffAddressVerificationRequest
     */
    'requestId'?: string;
    /**
     * Verification Code
     * @type {string}
     * @memberof BffAddressVerificationRequest
     */
    'verificationCode'?: string;
}
/**
 * 
 * @export
 * @interface BffAddressVerificationResponse
 */
export interface BffAddressVerificationResponse {
    /**
     * Uno dei seguenti valori - CODE_VERIFICATION_REQUIRED: indica che è richiesto il codice di verifica - PEC_VALIDATION_REQUIRED: indica che il codice di verifica inserito è valido, ma che non è ancora arrivata la conferma PEC (solo per la PEC) 
     * @type {string}
     * @memberof BffAddressVerificationResponse
     */
    'result': BffAddressVerificationResponseResultEnum;
}

export const BffAddressVerificationResponseResultEnum = {
    CodeVerificationRequired: 'CODE_VERIFICATION_REQUIRED',
    PecValidationRequired: 'PEC_VALIDATION_REQUIRED'
} as const;

export type BffAddressVerificationResponseResultEnum = typeof BffAddressVerificationResponseResultEnum[keyof typeof BffAddressVerificationResponseResultEnum];

/**
 * 
 * @export
 * @enum {string}
 */

export const BffChannelType = {
    Email: 'EMAIL',
    Sms: 'SMS',
    Pec: 'PEC',
    Appio: 'APPIO'
} as const;

export type BffChannelType = typeof BffChannelType[keyof typeof BffChannelType];


/**
 * 
 * @export
 * @interface BffUserAddress
 */
export interface BffUserAddress {
    /**
     * 
     * @type {string}
     * @memberof BffUserAddress
     */
    'addressType': string;
    /**
     * 
     * @type {string}
     * @memberof BffUserAddress
     */
    'recipientId': string;
    /**
     * senderId or \'default\'
     * @type {string}
     * @memberof BffUserAddress
     */
    'senderId': string;
    /**
     * name of the sender
     * @type {string}
     * @memberof BffUserAddress
     */
    'senderName'?: string;
    /**
     * 
     * @type {BffChannelType}
     * @memberof BffUserAddress
     */
    'channelType': BffChannelType;
    /**
     * 
     * @type {string}
     * @memberof BffUserAddress
     */
    'value': string;
    /**
     * 
     * @type {boolean}
     * @memberof BffUserAddress
     */
    'pecValid'?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof BffUserAddress
     */
    'codeValid'?: boolean;
}


/**
 * 
 * @export
 * @interface Problem
 */
export interface Problem {
    /**
     * URI reference of type definition
     * @type {string}
     * @memberof Problem
     */
    'type'?: string;
    /**
     * The HTTP status code generated by the origin server for this occurrence of the problem.
     * @type {number}
     * @memberof Problem
     */
    'status': number;
    /**
     * A short, summary of the problem type. Written in english and readable
     * @type {string}
     * @memberof Problem
     */
    'title'?: string;
    /**
     * A human readable explanation of the problem.
     * @type {string}
     * @memberof Problem
     */
    'detail'?: string;
    /**
     * Internal support identifier associated to error
     * @type {string}
     * @memberof Problem
     */
    'traceId'?: string;
    /**
     * date and time referred to UTC
     * @type {string}
     * @memberof Problem
     */
    'timestamp'?: string;
    /**
     * 
     * @type {Array<ProblemError>}
     * @memberof Problem
     */
    'errors': Array<ProblemError>;
}
/**
 * 
 * @export
 * @interface ProblemError
 */
export interface ProblemError {
    /**
     * Internal code of the error, in human-readable format
     * @type {string}
     * @memberof ProblemError
     */
    'code': string;
    /**
     * Parameter or request body field name for validation error
     * @type {string}
     * @memberof ProblemError
     */
    'element'?: string;
    /**
     * A human readable explanation specific to this occurrence of the problem.
     * @type {string}
     * @memberof ProblemError
     */
    'detail'?: string;
}

/**
 * AddressesApi - axios parameter creator
 * @export
 */
export const AddressesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Creazione o aggiornamento di un recapito legale o di cortesia
         * @summary Creazione/Aggiornamento Recapito
         * @param {BffAddressType} addressType Address type
         * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
         * @param {BffChannelType} channelType Communication Channel type
         * @param {BffAddressVerificationRequest} bffAddressVerificationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrUpdateAddressV1: async (addressType: BffAddressType, senderId: string, channelType: BffChannelType, bffAddressVerificationRequest: BffAddressVerificationRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'addressType' is not null or undefined
            assertParamExists('createOrUpdateAddressV1', 'addressType', addressType)
            // verify required parameter 'senderId' is not null or undefined
            assertParamExists('createOrUpdateAddressV1', 'senderId', senderId)
            // verify required parameter 'channelType' is not null or undefined
            assertParamExists('createOrUpdateAddressV1', 'channelType', channelType)
            // verify required parameter 'bffAddressVerificationRequest' is not null or undefined
            assertParamExists('createOrUpdateAddressV1', 'bffAddressVerificationRequest', bffAddressVerificationRequest)
            const localVarPath = `/bff/v1/addresses/{addressType}/{senderId}/{channelType}`
                .replace(`{${"addressType"}}`, encodeURIComponent(String(addressType)))
                .replace(`{${"senderId"}}`, encodeURIComponent(String(senderId)))
                .replace(`{${"channelType"}}`, encodeURIComponent(String(channelType)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(bffAddressVerificationRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Eliminazione di un recapito legale o di cortesia
         * @summary Eliminazione Recapito
         * @param {BffAddressType} addressType Address type
         * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
         * @param {BffChannelType} channelType Communication Channel type
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteAddressV1: async (addressType: BffAddressType, senderId: string, channelType: BffChannelType, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'addressType' is not null or undefined
            assertParamExists('deleteAddressV1', 'addressType', addressType)
            // verify required parameter 'senderId' is not null or undefined
            assertParamExists('deleteAddressV1', 'senderId', senderId)
            // verify required parameter 'channelType' is not null or undefined
            assertParamExists('deleteAddressV1', 'channelType', channelType)
            const localVarPath = `/bff/v1/addresses/{addressType}/{senderId}/{channelType}`
                .replace(`{${"addressType"}}`, encodeURIComponent(String(addressType)))
                .replace(`{${"senderId"}}`, encodeURIComponent(String(senderId)))
                .replace(`{${"channelType"}}`, encodeURIComponent(String(channelType)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Restituisce i recapiti dell\'utente
         * @summary Recapiti
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAddressesV1: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/addresses`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AddressesApi - functional programming interface
 * @export
 */
export const AddressesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AddressesApiAxiosParamCreator(configuration)
    return {
        /**
         * Creazione o aggiornamento di un recapito legale o di cortesia
         * @summary Creazione/Aggiornamento Recapito
         * @param {BffAddressType} addressType Address type
         * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
         * @param {BffChannelType} channelType Communication Channel type
         * @param {BffAddressVerificationRequest} bffAddressVerificationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createOrUpdateAddressV1(addressType: BffAddressType, senderId: string, channelType: BffChannelType, bffAddressVerificationRequest: BffAddressVerificationRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BffAddressVerificationResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createOrUpdateAddressV1(addressType, senderId, channelType, bffAddressVerificationRequest, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AddressesApi.createOrUpdateAddressV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Eliminazione di un recapito legale o di cortesia
         * @summary Eliminazione Recapito
         * @param {BffAddressType} addressType Address type
         * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
         * @param {BffChannelType} channelType Communication Channel type
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteAddressV1(addressType: BffAddressType, senderId: string, channelType: BffChannelType, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteAddressV1(addressType, senderId, channelType, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AddressesApi.deleteAddressV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Restituisce i recapiti dell\'utente
         * @summary Recapiti
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAddressesV1(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BffUserAddress>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAddressesV1(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AddressesApi.getAddressesV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AddressesApi - factory interface
 * @export
 */
export const AddressesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AddressesApiFp(configuration)
    return {
        /**
         * Creazione o aggiornamento di un recapito legale o di cortesia
         * @summary Creazione/Aggiornamento Recapito
         * @param {BffAddressType} addressType Address type
         * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
         * @param {BffChannelType} channelType Communication Channel type
         * @param {BffAddressVerificationRequest} bffAddressVerificationRequest 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createOrUpdateAddressV1(addressType: BffAddressType, senderId: string, channelType: BffChannelType, bffAddressVerificationRequest: BffAddressVerificationRequest, options?: any): AxiosPromise<BffAddressVerificationResponse> {
            return localVarFp.createOrUpdateAddressV1(addressType, senderId, channelType, bffAddressVerificationRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * Eliminazione di un recapito legale o di cortesia
         * @summary Eliminazione Recapito
         * @param {BffAddressType} addressType Address type
         * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
         * @param {BffChannelType} channelType Communication Channel type
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteAddressV1(addressType: BffAddressType, senderId: string, channelType: BffChannelType, options?: any): AxiosPromise<void> {
            return localVarFp.deleteAddressV1(addressType, senderId, channelType, options).then((request) => request(axios, basePath));
        },
        /**
         * Restituisce i recapiti dell\'utente
         * @summary Recapiti
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAddressesV1(options?: any): AxiosPromise<Array<BffUserAddress>> {
            return localVarFp.getAddressesV1(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AddressesApi - object-oriented interface
 * @export
 * @class AddressesApi
 * @extends {BaseAPI}
 */
export class AddressesApi extends BaseAPI {
    /**
     * Creazione o aggiornamento di un recapito legale o di cortesia
     * @summary Creazione/Aggiornamento Recapito
     * @param {BffAddressType} addressType Address type
     * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
     * @param {BffChannelType} channelType Communication Channel type
     * @param {BffAddressVerificationRequest} bffAddressVerificationRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AddressesApi
     */
    public createOrUpdateAddressV1(addressType: BffAddressType, senderId: string, channelType: BffChannelType, bffAddressVerificationRequest: BffAddressVerificationRequest, options?: RawAxiosRequestConfig) {
        return AddressesApiFp(this.configuration).createOrUpdateAddressV1(addressType, senderId, channelType, bffAddressVerificationRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Eliminazione di un recapito legale o di cortesia
     * @summary Eliminazione Recapito
     * @param {BffAddressType} addressType Address type
     * @param {string} senderId sender Id or \&#39;default\&#39; for general addresses not associated to a sender
     * @param {BffChannelType} channelType Communication Channel type
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AddressesApi
     */
    public deleteAddressV1(addressType: BffAddressType, senderId: string, channelType: BffChannelType, options?: RawAxiosRequestConfig) {
        return AddressesApiFp(this.configuration).deleteAddressV1(addressType, senderId, channelType, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Restituisce i recapiti dell\'utente
     * @summary Recapiti
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AddressesApi
     */
    public getAddressesV1(options?: RawAxiosRequestConfig) {
        return AddressesApiFp(this.configuration).getAddressesV1(options).then((request) => request(this.axios, this.basePath));
    }
}



