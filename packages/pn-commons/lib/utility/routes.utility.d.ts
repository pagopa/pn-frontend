type ParameterValue = string | number | Date;
interface Parameters {
    [key: string]: ParameterValue;
}
interface QueryParameters {
    [key: string]: ParameterValue | Array<string>;
}
interface Route {
    prefix: string | Array<string>;
    path?: string;
    version?: string;
    params?: Parameters;
    query?: QueryParameters;
}
/**
 * NB: array query params are supported, the generated URL render them as follows:
 *     key=value1&key=value2&...
 *     As indicated in https://medium.com/@AADota/spring-passing-list-and-array-of-values-as-url-parameters-1ed9bbdf0cb2,
 *     this format is accepted by SpringBoot.
 *
 * @param route a route spec
 * @returns the URL to call for the given route
 */
export declare function compileRoute(route: Route): string;
export declare enum AppRouteParams {
    AAR = "aar"
}
export {};
