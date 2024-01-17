declare type LocalizationNamespacesNames = 'common' | 'notifications' | 'appStatus' | 'delegations';
declare type LocalizationNamespaces = {
    [key in LocalizationNamespacesNames]: string;
};
declare type LocalizationFunction = (namespace: string | Array<string>, path: string, data?: {
    [key: string]: string | undefined;
}) => string;
export declare const initLocalization: (translateFn: LocalizationFunction, namespaces?: LocalizationNamespaces | undefined) => void;
export declare function getLocalizedOrDefaultLabel(namespaceName: string | Array<string>, path: string, defaultLabel: string, data?: {
    [key: string]: any;
}): string;
export {};
