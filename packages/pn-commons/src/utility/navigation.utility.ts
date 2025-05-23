export const addParamToUrl = (baseUrl: string, paramName: string, paramValue: string): string =>
  paramValue
    ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${paramName}=${encodeURIComponent(paramValue)}`
    : baseUrl;
