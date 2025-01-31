import { AppRouteParams, storageOpsBuilder } from '@pagopa-pn/pn-commons';

export const storageAarOps = storageOpsBuilder<string>(AppRouteParams.AAR, 'string', false);
export const storageRetrievalIdOps = storageOpsBuilder<string>(AppRouteParams.RETRIEVAL_ID, 'string', false);

export const storageDeleteAll = () => {
  storageAarOps.delete();
  storageRetrievalIdOps.delete();
};