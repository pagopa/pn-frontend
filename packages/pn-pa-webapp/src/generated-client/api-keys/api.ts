/* tslint:disable */
/* eslint-disable */
/**
 * PN BFF BE Microservice - ApiKeys Mittenti
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
 * Gruppo a cui appartiene l\'api key
 * @export
 * @interface BffApiKeyGroup
 */
export interface BffApiKeyGroup {
    /**
     * id del gruppo
     * @type {string}
     * @memberof BffApiKeyGroup
     */
    'id'?: string;
    /**
     * nome del gruppo
     * @type {string}
     * @memberof BffApiKeyGroup
     */
    'name'?: string;
}
/**
 * 
 * @export
 * @interface BffApiKeyRow
 */
export interface BffApiKeyRow {
    /**
     * Id dell\'api key
     * @type {string}
     * @memberof BffApiKeyRow
     */
    'id'?: string;
    /**
     * Nome dell\'api key
     * @type {string}
     * @memberof BffApiKeyRow
     */
    'name'?: string;
    /**
     * Valore dell\'api key
     * @type {string}
     * @memberof BffApiKeyRow
     */
    'value'?: string;
    /**
     * Data ultima modifica
     * @type {string}
     * @memberof BffApiKeyRow
     */
    'lastUpdate'?: string;
    /**
     * 
     * @type {Array<BffApiKeyGroup>}
     * @memberof BffApiKeyRow
     */
    'groups'?: Array<BffApiKeyGroup>;
    /**
     * 
     * @type {BffApiKeyStatus}
     * @memberof BffApiKeyRow
     */
    'status'?: BffApiKeyStatus;
    /**
     * Storico degli stati dell\'api key
     * @type {Array<BffApiKeyStatusHistory>}
     * @memberof BffApiKeyRow
     */
    'statusHistory'?: Array<BffApiKeyStatusHistory>;
}


/**
 * Stato dell\'api key
 * @export
 * @enum {string}
 */

export const BffApiKeyStatus = {
    Created: 'CREATED',
    Enabled: 'ENABLED',
    Blocked: 'BLOCKED',
    Rotated: 'ROTATED'
} as const;

export type BffApiKeyStatus = typeof BffApiKeyStatus[keyof typeof BffApiKeyStatus];


/**
 * 
 * @export
 * @interface BffApiKeyStatusHistory
 */
export interface BffApiKeyStatusHistory {
    /**
     * 
     * @type {BffApiKeyStatus}
     * @memberof BffApiKeyStatusHistory
     */
    'status'?: BffApiKeyStatus;
    /**
     * data a cui corrisponde il cambio di stato
     * @type {string}
     * @memberof BffApiKeyStatusHistory
     */
    'date'?: string;
    /**
     * nome dell\'utente che ha effettuato il cambio di stato
     * @type {string}
     * @memberof BffApiKeyStatusHistory
     */
    'changedByDenomination'?: string;
}


/**
 * Dto contenente la lista delle api keys associate ad un utente.
 * @export
 * @interface BffApiKeysResponse
 */
export interface BffApiKeysResponse {
    /**
     * 
     * @type {Array<BffApiKeyRow>}
     * @memberof BffApiKeysResponse
     */
    'items': Array<BffApiKeyRow>;
    /**
     * 
     * @type {string}
     * @memberof BffApiKeysResponse
     */
    'lastKey'?: string;
    /**
     * 
     * @type {string}
     * @memberof BffApiKeysResponse
     */
    'lastUpdate'?: string;
    /**
     * 
     * @type {number}
     * @memberof BffApiKeysResponse
     */
    'total'?: number;
}
/**
 * Richiesta di cambio stato per una api key
 * @export
 * @interface BffRequestApiKeyStatus
 */
export interface BffRequestApiKeyStatus {
    /**
     * Action per il cambio stato di un\'api key
     * @type {string}
     * @memberof BffRequestApiKeyStatus
     */
    'status': BffRequestApiKeyStatusStatusEnum;
}

export const BffRequestApiKeyStatusStatusEnum = {
    Block: 'BLOCK',
    Enable: 'ENABLE',
    Rotate: 'ROTATE'
} as const;

export type BffRequestApiKeyStatusStatusEnum = typeof BffRequestApiKeyStatusStatusEnum[keyof typeof BffRequestApiKeyStatusStatusEnum];

/**
 * Request per la creazione di una nuova api key
 * @export
 * @interface BffRequestNewApiKey
 */
export interface BffRequestNewApiKey {
    /**
     * nome dell\'api key
     * @type {string}
     * @memberof BffRequestNewApiKey
     */
    'name': string;
    /**
     * Gruppi a cui appartiene l\'api key (indicare l\'id dei gruppi)
     * @type {Array<string>}
     * @memberof BffRequestNewApiKey
     */
    'groups': Array<string>;
}
/**
 * Response per la creazione di una nuova api key
 * @export
 * @interface BffResponseNewApiKey
 */
export interface BffResponseNewApiKey {
    /**
     * id dell\'api key appena generata
     * @type {string}
     * @memberof BffResponseNewApiKey
     */
    'id': string;
    /**
     * Valore dell\'api key appena generata
     * @type {string}
     * @memberof BffResponseNewApiKey
     */
    'apiKey': string;
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
 * Richiesta di cambio stato per una api key
 * @export
 * @interface RequestApiKeyStatus
 */
export interface RequestApiKeyStatus {
    /**
     * Action per il cambio stato di un\'api key
     * @type {string}
     * @memberof RequestApiKeyStatus
     */
    'status': RequestApiKeyStatusStatusEnum;
}

export const RequestApiKeyStatusStatusEnum = {
    Block: 'BLOCK',
    Enable: 'ENABLE',
    Rotate: 'ROTATE'
} as const;

export type RequestApiKeyStatusStatusEnum = typeof RequestApiKeyStatusStatusEnum[keyof typeof RequestApiKeyStatusStatusEnum];

/**
 * Request per la creazione di una nuova api key
 * @export
 * @interface RequestNewApiKey
 */
export interface RequestNewApiKey {
    /**
     * nome dell\'api key
     * @type {string}
     * @memberof RequestNewApiKey
     */
    'name': string;
    /**
     * Gruppi a cui appartiene l\'api key (indicare l\'id dei gruppi)
     * @type {Array<string>}
     * @memberof RequestNewApiKey
     */
    'groups': Array<string>;
}
/**
 * Response per la creazione di una nuova api key
 * @export
 * @interface ResponseNewApiKey
 */
export interface ResponseNewApiKey {
    /**
     * id dell\'api key appena generata
     * @type {string}
     * @memberof ResponseNewApiKey
     */
    'id': string;
    /**
     * Valore dell\'api key appena generata
     * @type {string}
     * @memberof ResponseNewApiKey
     */
    'apiKey': string;
}

/**
 * ApiKeysApi - axios parameter creator
 * @export
 */
export const ApiKeysApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * servizio di cambio stato dell\'api key
         * @summary Cambia lo stato dell\'api key
         * @param {string} id Identificativo univoco dell\&#39;api key
         * @param {BffRequestApiKeyStatus} bffRequestApiKeyStatus 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        changeStatusApiKeyV1: async (id: string, bffRequestApiKeyStatus: BffRequestApiKeyStatus, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('changeStatusApiKeyV1', 'id', id)
            // verify required parameter 'bffRequestApiKeyStatus' is not null or undefined
            assertParamExists('changeStatusApiKeyV1', 'bffRequestApiKeyStatus', bffRequestApiKeyStatus)
            const localVarPath = `/bff/v1/api-keys/{id}/status`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(bffRequestApiKeyStatus, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * servizio di rimozione dell\'api key
         * @summary Rimozione api key
         * @param {string} id Identificativo univoco dell\&#39;api key
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteApiKeyV1: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteApiKeyV1', 'id', id)
            const localVarPath = `/bff/v1/api-keys/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
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
         * servizio di consultazione della lista delle api keys
         * @summary Ricerca api keys
         * @param {number} [limit] 
         * @param {string} [lastKey] 
         * @param {string} [lastUpdate] 
         * @param {boolean} [showVirtualKey] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiKeysV1: async (limit?: number, lastKey?: string, lastUpdate?: string, showVirtualKey?: boolean, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/api-keys`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (lastKey !== undefined) {
                localVarQueryParameter['lastKey'] = lastKey;
            }

            if (lastUpdate !== undefined) {
                localVarQueryParameter['lastUpdate'] = lastUpdate;
            }

            if (showVirtualKey !== undefined) {
                localVarQueryParameter['showVirtualKey'] = showVirtualKey;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * servizio di creazione di un\'api key
         * @summary Creazione api key
         * @param {BffRequestNewApiKey} bffRequestNewApiKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newApiKeyV1: async (bffRequestNewApiKey: BffRequestNewApiKey, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'bffRequestNewApiKey' is not null or undefined
            assertParamExists('newApiKeyV1', 'bffRequestNewApiKey', bffRequestNewApiKey)
            const localVarPath = `/bff/v1/api-keys`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(bffRequestNewApiKey, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ApiKeysApi - functional programming interface
 * @export
 */
export const ApiKeysApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = ApiKeysApiAxiosParamCreator(configuration)
    return {
        /**
         * servizio di cambio stato dell\'api key
         * @summary Cambia lo stato dell\'api key
         * @param {string} id Identificativo univoco dell\&#39;api key
         * @param {BffRequestApiKeyStatus} bffRequestApiKeyStatus 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async changeStatusApiKeyV1(id: string, bffRequestApiKeyStatus: BffRequestApiKeyStatus, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.changeStatusApiKeyV1(id, bffRequestApiKeyStatus, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ApiKeysApi.changeStatusApiKeyV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * servizio di rimozione dell\'api key
         * @summary Rimozione api key
         * @param {string} id Identificativo univoco dell\&#39;api key
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteApiKeyV1(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteApiKeyV1(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ApiKeysApi.deleteApiKeyV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * servizio di consultazione della lista delle api keys
         * @summary Ricerca api keys
         * @param {number} [limit] 
         * @param {string} [lastKey] 
         * @param {string} [lastUpdate] 
         * @param {boolean} [showVirtualKey] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getApiKeysV1(limit?: number, lastKey?: string, lastUpdate?: string, showVirtualKey?: boolean, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BffApiKeysResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getApiKeysV1(limit, lastKey, lastUpdate, showVirtualKey, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ApiKeysApi.getApiKeysV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * servizio di creazione di un\'api key
         * @summary Creazione api key
         * @param {BffRequestNewApiKey} bffRequestNewApiKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async newApiKeyV1(bffRequestNewApiKey: BffRequestNewApiKey, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BffResponseNewApiKey>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.newApiKeyV1(bffRequestNewApiKey, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['ApiKeysApi.newApiKeyV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * ApiKeysApi - factory interface
 * @export
 */
export const ApiKeysApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = ApiKeysApiFp(configuration)
    return {
        /**
         * servizio di cambio stato dell\'api key
         * @summary Cambia lo stato dell\'api key
         * @param {string} id Identificativo univoco dell\&#39;api key
         * @param {BffRequestApiKeyStatus} bffRequestApiKeyStatus 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        changeStatusApiKeyV1(id: string, bffRequestApiKeyStatus: BffRequestApiKeyStatus, options?: any): AxiosPromise<void> {
            return localVarFp.changeStatusApiKeyV1(id, bffRequestApiKeyStatus, options).then((request) => request(axios, basePath));
        },
        /**
         * servizio di rimozione dell\'api key
         * @summary Rimozione api key
         * @param {string} id Identificativo univoco dell\&#39;api key
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteApiKeyV1(id: string, options?: any): AxiosPromise<void> {
            return localVarFp.deleteApiKeyV1(id, options).then((request) => request(axios, basePath));
        },
        /**
         * servizio di consultazione della lista delle api keys
         * @summary Ricerca api keys
         * @param {number} [limit] 
         * @param {string} [lastKey] 
         * @param {string} [lastUpdate] 
         * @param {boolean} [showVirtualKey] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiKeysV1(limit?: number, lastKey?: string, lastUpdate?: string, showVirtualKey?: boolean, options?: any): AxiosPromise<BffApiKeysResponse> {
            return localVarFp.getApiKeysV1(limit, lastKey, lastUpdate, showVirtualKey, options).then((request) => request(axios, basePath));
        },
        /**
         * servizio di creazione di un\'api key
         * @summary Creazione api key
         * @param {BffRequestNewApiKey} bffRequestNewApiKey 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        newApiKeyV1(bffRequestNewApiKey: BffRequestNewApiKey, options?: any): AxiosPromise<BffResponseNewApiKey> {
            return localVarFp.newApiKeyV1(bffRequestNewApiKey, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ApiKeysApi - object-oriented interface
 * @export
 * @class ApiKeysApi
 * @extends {BaseAPI}
 */
export class ApiKeysApi extends BaseAPI {
    /**
     * servizio di cambio stato dell\'api key
     * @summary Cambia lo stato dell\'api key
     * @param {string} id Identificativo univoco dell\&#39;api key
     * @param {BffRequestApiKeyStatus} bffRequestApiKeyStatus 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiKeysApi
     */
    public changeStatusApiKeyV1(id: string, bffRequestApiKeyStatus: BffRequestApiKeyStatus, options?: RawAxiosRequestConfig) {
        return ApiKeysApiFp(this.configuration).changeStatusApiKeyV1(id, bffRequestApiKeyStatus, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * servizio di rimozione dell\'api key
     * @summary Rimozione api key
     * @param {string} id Identificativo univoco dell\&#39;api key
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiKeysApi
     */
    public deleteApiKeyV1(id: string, options?: RawAxiosRequestConfig) {
        return ApiKeysApiFp(this.configuration).deleteApiKeyV1(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * servizio di consultazione della lista delle api keys
     * @summary Ricerca api keys
     * @param {number} [limit] 
     * @param {string} [lastKey] 
     * @param {string} [lastUpdate] 
     * @param {boolean} [showVirtualKey] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiKeysApi
     */
    public getApiKeysV1(limit?: number, lastKey?: string, lastUpdate?: string, showVirtualKey?: boolean, options?: RawAxiosRequestConfig) {
        return ApiKeysApiFp(this.configuration).getApiKeysV1(limit, lastKey, lastUpdate, showVirtualKey, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * servizio di creazione di un\'api key
     * @summary Creazione api key
     * @param {BffRequestNewApiKey} bffRequestNewApiKey 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiKeysApi
     */
    public newApiKeyV1(bffRequestNewApiKey: BffRequestNewApiKey, options?: RawAxiosRequestConfig) {
        return ApiKeysApiFp(this.configuration).newApiKeyV1(bffRequestNewApiKey, options).then((request) => request(this.axios, this.basePath));
    }
}



