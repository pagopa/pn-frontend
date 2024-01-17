function compilePrefix(prefix) {
    return prefix instanceof Array ? prefix.join('/') : prefix;
}
function encode(param) {
    return encodeURIComponent(param.toString());
}
function formatQueryParam(key, value) {
    return `${key}=${encode(value)}&`;
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
export function compileRoute(route) {
    // eslint-disable-next-line functional/no-let
    let result = route.prefix ? `/${compilePrefix(route.prefix)}` : '';
    if (route.version) {
        result += `/${route.version}`;
    }
    if (route.path) {
        result += `/${route.path}`;
    }
    if (route.params) {
        result = Object.entries(route.params).reduce((agg, [k, v]) => agg.replace(`:${k}`, encode(v)), result);
    }
    if (route.query) {
        result = Object.entries(route.query)
            .filter(([, v]) => v)
            .reduce((agg, [k, v]) => {
            const paramsToAdd = Array.isArray(v)
                ? v.reduce((arrayQueryParam, elem) => arrayQueryParam.concat(formatQueryParam(k, elem)), '')
                : formatQueryParam(k, v);
            return agg.concat(paramsToAdd);
        }, `${result}?`)
            .slice(0, -1);
    }
    return result;
}
export var AppRouteParams;
(function (AppRouteParams) {
    AppRouteParams["AAR"] = "aar";
})(AppRouteParams || (AppRouteParams = {}));
