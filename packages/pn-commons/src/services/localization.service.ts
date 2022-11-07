type LocalizationNamespacesNames = 'common' | 'notifications' | 'appStatus';

type LocalizationNamespaces = {
  [key in LocalizationNamespacesNames]: string;
};

type LocalizationFunction = (namespace: string | Array<string>, path: string, data?: { [key: string]: string | undefined }) => string;

/* eslint-disable-next-line functional/no-let */
let localizationNamespaces: LocalizationNamespaces = {
  common: 'common',
  notifications: 'notifiche',
  appStatus: 'appStatus',
};

/* eslint-disable-next-line functional/no-let */
let translateFunction: LocalizationFunction | undefined;

export const initLocalization = (
  translateFn: LocalizationFunction,
  namespaces?: LocalizationNamespaces
) => {
  if (namespaces) {
    // eslint-disable-next-line functional/immutable-data
    localizationNamespaces = namespaces;
  }
  // eslint-disable-next-line functional/immutable-data
  translateFunction = translateFn;
};

export function getLocalizedOrDefaultLabel(
  namespaceName: string | Array<string>,
  path: string,
  defaultLabel: string,
  data?: { [key: string]: any }
): string {
  const namespace = Array.isArray(namespaceName)
    ? namespaceName.map((nm) => localizationNamespaces[nm as LocalizationNamespacesNames])
    : localizationNamespaces[namespaceName as LocalizationNamespacesNames];
  console.log({ namespaceName, path, namespace });
  if (translateFunction) {
    const localizedLabel = translateFunction(namespace, path, data);
    console.log({ branch: "found translataFunction", localizedLabel });
    if (!localizedLabel || localizedLabel === path) {
      return defaultLabel;
    }
    console.log({ branch: "not found translataFunction", localizedLabel });
    return localizedLabel;
  }
  return defaultLabel;
}