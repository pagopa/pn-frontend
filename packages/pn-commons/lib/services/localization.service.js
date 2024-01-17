/* eslint-disable-next-line functional/no-let */
let localizationNamespaces = {
    common: 'common',
    notifications: 'notifiche',
    appStatus: 'appStatus',
    delegations: 'deleghe',
};
/* eslint-disable-next-line functional/no-let */
let translateFunction;
export const initLocalization = (translateFn, namespaces) => {
    if (namespaces) {
        // eslint-disable-next-line functional/immutable-data
        localizationNamespaces = namespaces;
    }
    // eslint-disable-next-line functional/immutable-data
    translateFunction = translateFn;
};
export function getLocalizedOrDefaultLabel(namespaceName, path, defaultLabel, data) {
    const namespace = Array.isArray(namespaceName)
        ? namespaceName.map((nm) => localizationNamespaces[nm])
        : localizationNamespaces[namespaceName];
    if (translateFunction) {
        const localizedLabel = translateFunction(namespace, path, data);
        if (!localizedLabel || localizedLabel === path) {
            return defaultLabel;
        }
        return localizedLabel;
    }
    return defaultLabel;
}
