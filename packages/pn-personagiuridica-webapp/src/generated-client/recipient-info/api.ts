/* tslint:disable */
/* eslint-disable */
/**
 * PN BFF BE Microservice - Recipient Info
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
 * Contains the name list of groups defined in SelfCare PG (Notifiche digitali)
 * @export
 * @interface BffPgGroup
 */
export interface BffPgGroup {
    /**
     * 
     * @type {string}
     * @memberof BffPgGroup
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof BffPgGroup
     */
    'name'?: string;
}
/**
 * Contains the status of groups defined in SelfCare PG (Notifiche digitali)
 * @export
 * @enum {string}
 */

export const BffPgGroupStatus = {
    Active: 'ACTIVE',
    Suspended: 'SUSPENDED',
    Deleted: 'DELETED'
} as const;

export type BffPgGroupStatus = typeof BffPgGroupStatus[keyof typeof BffPgGroupStatus];


/**
 * Contains the status of groups defined in SelfCare PG (Notifiche digitali)
 * @export
 * @enum {string}
 */

export const PgGroupStatus = {
    Active: 'ACTIVE',
    Suspended: 'SUSPENDED',
    Deleted: 'DELETED'
} as const;

export type PgGroupStatus = typeof PgGroupStatus[keyof typeof PgGroupStatus];


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
 * InfoRecipientApi - axios parameter creator
 * @export
 */
export const InfoRecipientApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * This operation retrieves the PG Groups from Self Care.
         * @summary Get PG Groups list
         * @param {BffPgGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPGGroupsV1: async (status?: BffPgGroupStatus, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/pg/groups`;
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
 * InfoRecipientApi - functional programming interface
 * @export
 */
export const InfoRecipientApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = InfoRecipientApiAxiosParamCreator(configuration)
    return {
        /**
         * This operation retrieves the PG Groups from Self Care.
         * @summary Get PG Groups list
         * @param {BffPgGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPGGroupsV1(status?: BffPgGroupStatus, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<BffPgGroup>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPGGroupsV1(status, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['InfoRecipientApi.getPGGroupsV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * InfoRecipientApi - factory interface
 * @export
 */
export const InfoRecipientApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = InfoRecipientApiFp(configuration)
    return {
        /**
         * This operation retrieves the PG Groups from Self Care.
         * @summary Get PG Groups list
         * @param {BffPgGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPGGroupsV1(status?: BffPgGroupStatus, options?: any): AxiosPromise<Array<BffPgGroup>> {
            return localVarFp.getPGGroupsV1(status, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * InfoRecipientApi - object-oriented interface
 * @export
 * @class InfoRecipientApi
 * @extends {BaseAPI}
 */
export class InfoRecipientApi extends BaseAPI {
    /**
     * This operation retrieves the PG Groups from Self Care.
     * @summary Get PG Groups list
     * @param {BffPgGroupStatus} [status] Se valorizzato indica di tornare solo i gruppi nello stato passato
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof InfoRecipientApi
     */
    public getPGGroupsV1(status?: BffPgGroupStatus, options?: RawAxiosRequestConfig) {
        return InfoRecipientApiFp(this.configuration).getPGGroupsV1(status, options).then((request) => request(this.axios, this.basePath));
    }
}



