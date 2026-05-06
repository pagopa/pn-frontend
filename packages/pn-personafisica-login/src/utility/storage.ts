import { AppRouteParams, storageOpsBuilder } from '@pagopa-pn/pn-commons';

const storageAarOps = (useLocalStorage: boolean) =>
  storageOpsBuilder<string>(AppRouteParams.AAR, 'string', useLocalStorage);

const storageRetrievalIdOps = (useLocalStorage: boolean) =>
  storageOpsBuilder<string>(AppRouteParams.RETRIEVAL_ID, 'string', useLocalStorage);

export const storageRapidAccessOps = {
  read: (): [AppRouteParams, string] | undefined => {
    const aar = storageAarOps(false).read() ?? storageAarOps(true).read();
    if (aar) {
      return [AppRouteParams.AAR, aar];
    }
    const retrievalId = storageRetrievalIdOps(false).read() ?? storageRetrievalIdOps(true).read();
    if (retrievalId) {
      return [AppRouteParams.RETRIEVAL_ID, retrievalId];
    }
    return undefined;
  },
  write: ([key, value]: [AppRouteParams, string], useLocalStorage = false) => {
    storageAarOps(false).delete();
    storageRetrievalIdOps(false).delete();
    storageAarOps(true).delete();
    storageRetrievalIdOps(true).delete();
    if (key === AppRouteParams.AAR) {
      storageAarOps(useLocalStorage).write(value);
    } else {
      storageRetrievalIdOps(useLocalStorage).write(value);
    }
  },
  delete: () => {
    storageAarOps(false).delete();
    storageRetrievalIdOps(false).delete();
    storageAarOps(true).delete();
    storageRetrievalIdOps(true).delete();
  },
};

export const storageOneIdentityState = storageOpsBuilder<string>('state', 'string', false);

export const storageOneIdentityNonce = storageOpsBuilder<string>('nonce', 'string', false);
