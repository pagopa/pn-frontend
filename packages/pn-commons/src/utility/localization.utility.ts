type LocalizationNamespacesNames =
  | 'common'
  | 'notifications'
  | 'appStatus'
  | 'delegations'
  | 'recapiti';

type LocalizationNamespaces = {
  [key in LocalizationNamespacesNames]: string;
};

type LocalizationFunction = (
  namespace: string | Array<string>,
  path: string,
  data?: { [key: string]: string | undefined }
) => string;

type LocalizationExistsFunction = (namespace: string | Array<string>, path: string) => boolean;

/* eslint-disable-next-line functional/no-let */
let localizationNamespaces: LocalizationNamespaces = {
  common: 'common',
  notifications: 'notifiche',
  appStatus: 'appStatus',
  delegations: 'deleghe',
  recapiti: 'recapiti',
};

/* eslint-disable-next-line functional/no-let */
let translateFunction: LocalizationFunction | undefined;

/* eslint-disable-next-line functional/no-let */
let localizationExistsFunction: LocalizationExistsFunction | undefined;

const getLocalizationNamespace = (namespaceName: string | Array<string>): string | Array<string> =>
  Array.isArray(namespaceName)
    ? namespaceName.map((name) => localizationNamespaces[name as LocalizationNamespacesNames])
    : localizationNamespaces[namespaceName as LocalizationNamespacesNames];

export const initLocalizationExists = (existsFn?: LocalizationExistsFunction) => {
  // eslint-disable-next-line functional/immutable-data
  localizationExistsFunction = existsFn;
};

export function hasLocalizedLabel(namespaceName: string | Array<string>, path: string): boolean {
  if (!localizationExistsFunction) {
    return false;
  }

  return localizationExistsFunction(getLocalizationNamespace(namespaceName), path);
}

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
  defaultLabel?: string,
  data?: { [key: string]: any }
): string {
  const namespace = getLocalizationNamespace(namespaceName);
  if (translateFunction) {
    const localizedLabel = translateFunction(namespace, path, data);
    if (!localizedLabel || localizedLabel === path) {
      return defaultLabel ?? path;
    }
    return localizedLabel;
  }
  return defaultLabel ?? path;
}

export function getTranslationMessage(key: string, ns: string): { key: string; ns: string } {
  return {
    key,
    ns,
  };
}
