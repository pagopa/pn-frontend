/* tslint:disable */
/* eslint-disable */
/**
 * PN BFF BE Microservice - Downtime logs
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
 * I due campi più importanti sono __url__ e __retryAfter__. <br/>   - __url__ è presente se il file è pronto per essere scaricato ed indica l\'url a cui fare GET. <br/>   - __retryAfter__ indica che il file non è stato archiviato e bisognerà aspettare un numero di     secondi non inferiore a quanto indicato dal campo _retryAfter_. <br/>
 * @export
 * @interface BffLegalFactDownloadMetadataResponse
 */
export interface BffLegalFactDownloadMetadataResponse {
    /**
     * 
     * @type {string}
     * @memberof BffLegalFactDownloadMetadataResponse
     */
    'filename': string;
    /**
     * dimensione, in byte, del contenuto.
     * @type {number}
     * @memberof BffLegalFactDownloadMetadataResponse
     */
    'contentLength': number;
    /**
     * URL preautorizzato a cui effettuare una richiesta GET per ottenere il  contenuto del documento. Presente solo se il documento è pronto per il download.
     * @type {string}
     * @memberof BffLegalFactDownloadMetadataResponse
     */
    'url'?: string;
    /**
     * Stima del numero di secondi da aspettare prima che il contenuto del  documento sia scaricabile.
     * @type {number}
     * @memberof BffLegalFactDownloadMetadataResponse
     */
    'retryAfter'?: number;
}
/**
 * Risposta a una query dello storico dei disservizi
 * @export
 * @interface BffPnDowntimeHistoryResponse
 */
export interface BffPnDowntimeHistoryResponse {
    /**
     * 
     * @type {Array<PnDowntimeEntry>}
     * @memberof BffPnDowntimeHistoryResponse
     */
    'result': Array<PnDowntimeEntry>;
    /**
     * Se questo attributo non è presente o valorizzato _null_ indica che la query eseguita non presenta ulteriori risultati. <br/> Se questo attributo è valorizzato indica che la query può contenere ulteriori  risultati. La richiesta va rieseguita inserendo nel parametro _page_ il valore  di questo campo.
     * @type {string}
     * @memberof BffPnDowntimeHistoryResponse
     */
    'nextPage'?: string;
}
/**
 * 
 * @export
 * @interface BffPnStatusResponse
 */
export interface BffPnStatusResponse {
    /**
     * data a cui corrisponde l\'ultimo check sullo stato della piattaforma
     * @type {string}
     * @memberof BffPnStatusResponse
     */
    'lastCheckTimestamp': string;
    /**
     * Flag per indicare se l\'applicazione è operativa
     * @type {boolean}
     * @memberof BffPnStatusResponse
     */
    'appIsFullyOperative': boolean;
}
/**
 * I due campi più importanti sono __url__ e __retryAfter__. <br/>   - __url__ è presente se il file è pronto per essere scaricato ed indica l\'url a cui fare GET. <br/>   - __retryAfter__ indica che il file non è stato archiviato e bisognerà aspettare un numero di     secondi non inferiore a quanto indicato dal campo _retryAfter_. <br/>
 * @export
 * @interface LegalFactDownloadMetadataResponse
 */
export interface LegalFactDownloadMetadataResponse {
    /**
     * 
     * @type {string}
     * @memberof LegalFactDownloadMetadataResponse
     */
    'filename': string;
    /**
     * dimensione, in byte, del contenuto.
     * @type {number}
     * @memberof LegalFactDownloadMetadataResponse
     */
    'contentLength': number;
    /**
     * URL preautorizzato a cui effettuare una richiesta GET per ottenere il  contenuto del documento. Presente solo se il documento è pronto per il download.
     * @type {string}
     * @memberof LegalFactDownloadMetadataResponse
     */
    'url'?: string;
    /**
     * Stima del numero di secondi da aspettare prima che il contenuto del  documento sia scaricabile.
     * @type {number}
     * @memberof LegalFactDownloadMetadataResponse
     */
    'retryAfter'?: number;
}
/**
 * 
 * @export
 * @interface PnDowntimeEntry
 */
export interface PnDowntimeEntry {
    /**
     * 
     * @type {PnFunctionality}
     * @memberof PnDowntimeEntry
     */
    'functionality': PnFunctionality;
    /**
     * 
     * @type {PnFunctionalityStatus}
     * @memberof PnDowntimeEntry
     */
    'status': PnFunctionalityStatus;
    /**
     * 
     * @type {string}
     * @memberof PnDowntimeEntry
     */
    'startDate': string;
    /**
     * se il disservizio è ancora attivo questo campo sarà assente o con valore _null_
     * @type {string}
     * @memberof PnDowntimeEntry
     */
    'endDate'?: string;
    /**
     * Se assente o valorizzato _null_ indica che l\'atto opponibile a terzi non è ancora disponibile. Questo avviene per i disservizi ancora aperti e per i disservizi  terminati da pochi minuti. <br/> Questo valore è da utilizzare con l\'API _getLegalFact_ di questo stesso servizio.
     * @type {string}
     * @memberof PnDowntimeEntry
     */
    'legalFactId'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PnDowntimeEntry
     */
    'fileAvailable'?: boolean;
}


/**
 * Risposta a una query dello storico dei disservizi
 * @export
 * @interface PnDowntimeHistoryResponse
 */
export interface PnDowntimeHistoryResponse {
    /**
     * 
     * @type {Array<PnDowntimeEntry>}
     * @memberof PnDowntimeHistoryResponse
     */
    'result': Array<PnDowntimeEntry>;
    /**
     * Se questo attributo non è presente o valorizzato _null_ indica che la query eseguita non presenta ulteriori risultati. <br/> Se questo attributo è valorizzato indica che la query può contenere ulteriori  risultati. La richiesta va rieseguita inserendo nel parametro _page_ il valore  di questo campo.
     * @type {string}
     * @memberof PnDowntimeHistoryResponse
     */
    'nextPage'?: string;
}
/**
 * - __NOTIFICATION_CREATE__: la possibilità di creare nuove notifiche. - __NOTIFICATION_VISUALIZATION__: la possibilità di visualizzare le notifiche e scaricare gli atti.  - __NOTIFICATION_WORKFLOW__: l\'avanzamento del processo di notifica. 
 * @export
 * @enum {string}
 */

export const PnFunctionality = {
    NOTIFICATION_CREATE: 'NOTIFICATION_CREATE',
    NOTIFICATION_VISUALIZATION: 'NOTIFICATION_VISUALIZATION',
    NOTIFICATION_WORKFLOW: 'NOTIFICATION_WORKFLOW'
} as const;

export type PnFunctionality = typeof PnFunctionality[keyof typeof PnFunctionality];


/**
 * 
 * @export
 * @enum {string}
 */

export const PnFunctionalityStatus = {
    Ko: 'KO',
    Ok: 'OK'
} as const;

export type PnFunctionalityStatus = typeof PnFunctionalityStatus[keyof typeof PnFunctionalityStatus];


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
 * DowntimeApi - axios parameter creator
 * @export
 */
export const DowntimeApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Metodo che restituisce l\'elenco delle funzionalità di Piattaforma Notifiche e l\'elenco dei disservizi presenti al momento dell\'invocazione.
         * @summary Stato attuale
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getCurrentStatusV1: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/downtime/status`;
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
         * Fornisce le informazioni per scaricare un atto opponibile a terzi o, se tale atto va  recuperato dagli archivi, fornisce una stima per eccesso di quanti secondi bisogna  attendere.
         * @summary Ottieni atto opponibile a terzi
         * @param {string} legalFactId Identificativo dell\&#39;atto opponibile a terzi che si vuole scaricare
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLegalFactV1: async (legalFactId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'legalFactId' is not null or undefined
            assertParamExists('getLegalFactV1', 'legalFactId', legalFactId)
            const localVarPath = `/bff/v1/downtime/legal-facts/{legalFactId}`
                .replace(`{${"legalFactId"}}`, encodeURIComponent(String(legalFactId)));
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
         * Elenco dei disservizi di Piattafoma Notifiche riscontrate nel lasso di tempo specificato  dai parametri _fromTime_ e _toTime_. <br/> Il parametro _functionality_ è opzionale e ripetibile; permette di filtrare i disservizi  estratti limitandoli a quelli impattanti le funzionalità elencate.
         * @summary Ricerca storico disservizi
         * @param {string} [page] Pagina di risultati a cui il client è interessato
         * @param {string} [size] Size della pagina di risultati a cui il client è interessato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStatusHistoryV1: async (page?: string, size?: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/bff/v1/downtime/history`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (size !== undefined) {
                localVarQueryParameter['size'] = size;
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
 * DowntimeApi - functional programming interface
 * @export
 */
export const DowntimeApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DowntimeApiAxiosParamCreator(configuration)
    return {
        /**
         * Metodo che restituisce l\'elenco delle funzionalità di Piattaforma Notifiche e l\'elenco dei disservizi presenti al momento dell\'invocazione.
         * @summary Stato attuale
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getCurrentStatusV1(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BffPnStatusResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getCurrentStatusV1(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DowntimeApi.getCurrentStatusV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Fornisce le informazioni per scaricare un atto opponibile a terzi o, se tale atto va  recuperato dagli archivi, fornisce una stima per eccesso di quanti secondi bisogna  attendere.
         * @summary Ottieni atto opponibile a terzi
         * @param {string} legalFactId Identificativo dell\&#39;atto opponibile a terzi che si vuole scaricare
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getLegalFactV1(legalFactId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BffLegalFactDownloadMetadataResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getLegalFactV1(legalFactId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DowntimeApi.getLegalFactV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Elenco dei disservizi di Piattafoma Notifiche riscontrate nel lasso di tempo specificato  dai parametri _fromTime_ e _toTime_. <br/> Il parametro _functionality_ è opzionale e ripetibile; permette di filtrare i disservizi  estratti limitandoli a quelli impattanti le funzionalità elencate.
         * @summary Ricerca storico disservizi
         * @param {string} [page] Pagina di risultati a cui il client è interessato
         * @param {string} [size] Size della pagina di risultati a cui il client è interessato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getStatusHistoryV1(page?: string, size?: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<BffPnDowntimeHistoryResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getStatusHistoryV1(page, size, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DowntimeApi.getStatusHistoryV1']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * DowntimeApi - factory interface
 * @export
 */
export const DowntimeApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DowntimeApiFp(configuration)
    return {
        /**
         * Metodo che restituisce l\'elenco delle funzionalità di Piattaforma Notifiche e l\'elenco dei disservizi presenti al momento dell\'invocazione.
         * @summary Stato attuale
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getCurrentStatusV1(options?: any): AxiosPromise<BffPnStatusResponse> {
            return localVarFp.getCurrentStatusV1(options).then((request) => request(axios, basePath));
        },
        /**
         * Fornisce le informazioni per scaricare un atto opponibile a terzi o, se tale atto va  recuperato dagli archivi, fornisce una stima per eccesso di quanti secondi bisogna  attendere.
         * @summary Ottieni atto opponibile a terzi
         * @param {string} legalFactId Identificativo dell\&#39;atto opponibile a terzi che si vuole scaricare
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getLegalFactV1(legalFactId: string, options?: any): AxiosPromise<BffLegalFactDownloadMetadataResponse> {
            return localVarFp.getLegalFactV1(legalFactId, options).then((request) => request(axios, basePath));
        },
        /**
         * Elenco dei disservizi di Piattafoma Notifiche riscontrate nel lasso di tempo specificato  dai parametri _fromTime_ e _toTime_. <br/> Il parametro _functionality_ è opzionale e ripetibile; permette di filtrare i disservizi  estratti limitandoli a quelli impattanti le funzionalità elencate.
         * @summary Ricerca storico disservizi
         * @param {string} [page] Pagina di risultati a cui il client è interessato
         * @param {string} [size] Size della pagina di risultati a cui il client è interessato
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStatusHistoryV1(page?: string, size?: string, options?: any): AxiosPromise<BffPnDowntimeHistoryResponse> {
            return localVarFp.getStatusHistoryV1(page, size, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DowntimeApi - object-oriented interface
 * @export
 * @class DowntimeApi
 * @extends {BaseAPI}
 */
export class DowntimeApi extends BaseAPI {
    /**
     * Metodo che restituisce l\'elenco delle funzionalità di Piattaforma Notifiche e l\'elenco dei disservizi presenti al momento dell\'invocazione.
     * @summary Stato attuale
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DowntimeApi
     */
    public getCurrentStatusV1(options?: RawAxiosRequestConfig) {
        return DowntimeApiFp(this.configuration).getCurrentStatusV1(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Fornisce le informazioni per scaricare un atto opponibile a terzi o, se tale atto va  recuperato dagli archivi, fornisce una stima per eccesso di quanti secondi bisogna  attendere.
     * @summary Ottieni atto opponibile a terzi
     * @param {string} legalFactId Identificativo dell\&#39;atto opponibile a terzi che si vuole scaricare
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DowntimeApi
     */
    public getLegalFactV1(legalFactId: string, options?: RawAxiosRequestConfig) {
        return DowntimeApiFp(this.configuration).getLegalFactV1(legalFactId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Elenco dei disservizi di Piattafoma Notifiche riscontrate nel lasso di tempo specificato  dai parametri _fromTime_ e _toTime_. <br/> Il parametro _functionality_ è opzionale e ripetibile; permette di filtrare i disservizi  estratti limitandoli a quelli impattanti le funzionalità elencate.
     * @summary Ricerca storico disservizi
     * @param {string} [page] Pagina di risultati a cui il client è interessato
     * @param {string} [size] Size della pagina di risultati a cui il client è interessato
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DowntimeApi
     */
    public getStatusHistoryV1(page?: string, size?: string, options?: RawAxiosRequestConfig) {
        return DowntimeApiFp(this.configuration).getStatusHistoryV1(page, size, options).then((request) => request(this.axios, this.basePath));
    }
}



