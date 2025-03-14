import { AppRouteParams, storageOpsBuilder } from '@pagopa-pn/pn-commons';

const storageAarOps = storageOpsBuilder<string>(AppRouteParams.AAR, 'string', false);

const storageRetrievalIdOps = storageOpsBuilder<string>(
  AppRouteParams.RETRIEVAL_ID,
  'string',
  false
);

export const storageRapidAccessOps = {
  read: (): [AppRouteParams, string] | undefined => {
    const aar = storageAarOps.read();
    if (aar) {
      return [AppRouteParams.AAR, aar];
    }
    const retrievalId = storageRetrievalIdOps.read();
    if (retrievalId) {
      return [AppRouteParams.RETRIEVAL_ID, retrievalId];
    }
    return undefined;
  },
  write: ([key, value]: [AppRouteParams, string]) => {
    if (key === AppRouteParams.AAR) {
      storageAarOps.write(value);
      storageRetrievalIdOps.delete();
    } else if (key === AppRouteParams.RETRIEVAL_ID) {
      storageRetrievalIdOps.write(value);
      storageAarOps.delete();
    }
  },
  delete: () => {
    storageAarOps.delete();
    storageRetrievalIdOps.delete();
  },
};
