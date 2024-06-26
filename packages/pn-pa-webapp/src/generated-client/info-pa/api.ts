/* tslint:disable */
/* eslint-disable */
/**
 * PN BFF BE Microservice - Institutions and Products
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
 * 
 * @export
 * @interface BffInstitution
 */
export interface BffInstitution {
    /**
     * The identifier of the institution
     * @type {string}
     * @memberof BffInstitution
     */
    'id': string;
    /**
     * The name of the institution
     * @type {string}
     * @memberof BffInstitution
     */
    'name': string;
    /**
     * The role of the product
     * @type {string}
     * @memberof BffInstitution
     */
    'productRole': string;
    /**
     * The URL of the logo
     * @type {string}
     * @memberof BffInstitution
     */
    'logoUrl'?: string;
    /**
     * The name of the parent institution
     * @type {string}
     * @memberof BffInstitution
     */
    'parentName'?: string;
    /**
     * The URL of the entity
     * @type {string}
     * @memberof BffInstitution
     */
    'entityUrl': string;
}
/**
 * 
 * @export
 * @interface BffInstitutionProduct
 */
export interface BffInstitutionProduct {
    /**
     * The identifier of the product
     * @type {string}
     * @memberof BffInstitutionProduct
     */
    'id': string;
    /**
     * The title of the product
     * @type {string}
     * @memberof BffInstitutionProduct
     */
    'title': string;
    /**
     * The URL of the product
     * @type {string}
     * @memberof BffInstitutionProduct
     */
    'productUrl': string;
}
/**
 * Contains the name list of groups defined in SelfCare
 * @export
 * @interface BffPaGroup
 */
export interface BffPaGroup {
    /**
     * 
     * @type {string}
     * @memberof BffPaGroup
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof BffPaGroup
     */
    'name'?: string;
}
/**
 * Contains the name list of groups defined in SelfCare
 * @export
 * @enum {string}
 */

export const BffPaGroupStatus = {
    Active: 'ACTIVE',
    Suspended: 'SUSPENDED',
    Deleted: 'DELETED'
} as const;

export type BffPaGroupStatus = typeof BffPaGroupStatus[keyof typeof BffPaGroupStatus];


/**
 * Contains the name list of groups defined in SelfCare
 * @export
 * @enum {string}
 */

export const PaGroupStatus = {
    Active: 'ACTIVE',
    Suspended: 'SUSPENDED',
    Deleted: 'DELETED'
} as const;

export type PaGroupStatus = typeof PaGroupStatus[keyof typeof PaGroupStatus];


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
 * InfoPaApi - axios parameter creator
 * @export
 */
export const InfoPaApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * This operation retrieves all active products associated with the specified institution and user.
         * @summary Get Products list of an Institution
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getInstitutionProductsV1: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/institutions/products`;
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
        /**
         * This operation retrieves the institutions from Self Care.
         * @summary Get Institutions list
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getInstitutionsV1: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/institutions`;
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
        /**
         * This operation retrieves the groups from Self Care.
         * @summary Get PA Groups list
         * @param {BffPaGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPAGroupsV1: async (status?: BffPaGroupStatus, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/pa/groups`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (status !== undefined) {
                localVarQueryParameter['status'] = status;
            }


    
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
 * InfoPaApi - functional programming interface
 * @export
 */
export const InfoPaApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = InfoPaApiAxiosParamCreator(configuration)
    return {
        /**
         * This operation retrieves all active products associated with the specified institution and user.
         * @summary Get Products list of an Institution
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getInstitutionProductsV1(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BffInstitutionProduct>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getInstitutionProductsV1(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['InfoPaApi.getInstitutionProductsV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * This operation retrieves the institutions from Self Care.
         * @summary Get Institutions list
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getInstitutionsV1(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BffInstitution>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getInstitutionsV1(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['InfoPaApi.getInstitutionsV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * This operation retrieves the groups from Self Care.
         * @summary Get PA Groups list
         * @param {BffPaGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPAGroupsV1(status?: BffPaGroupStatus, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BffPaGroup>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPAGroupsV1(status, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['InfoPaApi.getPAGroupsV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * InfoPaApi - factory interface
 * @export
 */
export const InfoPaApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = InfoPaApiFp(configuration)
    return {
        /**
         * This operation retrieves all active products associated with the specified institution and user.
         * @summary Get Products list of an Institution
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getInstitutionProductsV1(options?: any): AxiosPromise<Array<BffInstitutionProduct>> {
            return localVarFp.getInstitutionProductsV1(options).then((request) => request(axios, basePath));
        },
        /**
         * This operation retrieves the institutions from Self Care.
         * @summary Get Institutions list
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getInstitutionsV1(options?: any): AxiosPromise<Array<BffInstitution>> {
            return localVarFp.getInstitutionsV1(options).then((request) => request(axios, basePath));
        },
        /**
         * This operation retrieves the groups from Self Care.
         * @summary Get PA Groups list
         * @param {BffPaGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPAGroupsV1(status?: BffPaGroupStatus, options?: any): AxiosPromise<Array<BffPaGroup>> {
            return localVarFp.getPAGroupsV1(status, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * InfoPaApi - object-oriented interface
 * @export
 * @class InfoPaApi
 * @extends {BaseAPI}
 */
export class InfoPaApi extends BaseAPI {
    /**
     * This operation retrieves all active products associated with the specified institution and user.
     * @summary Get Products list of an Institution
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof InfoPaApi
     */
    public getInstitutionProductsV1(options?: RawAxiosRequestConfig) {
        return InfoPaApiFp(this.configuration).getInstitutionProductsV1(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * This operation retrieves the institutions from Self Care.
     * @summary Get Institutions list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof InfoPaApi
     */
    public getInstitutionsV1(options?: RawAxiosRequestConfig) {
        return InfoPaApiFp(this.configuration).getInstitutionsV1(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * This operation retrieves the groups from Self Care.
     * @summary Get PA Groups list
     * @param {BffPaGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof InfoPaApi
     */
    public getPAGroupsV1(status?: BffPaGroupStatus, options?: RawAxiosRequestConfig) {
        return InfoPaApiFp(this.configuration).getPAGroupsV1(status, options).then((request) => request(this.axios, this.basePath));
    }
}



