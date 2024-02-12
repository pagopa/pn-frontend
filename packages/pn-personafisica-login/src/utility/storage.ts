import { AppRouteParams, storageOpsBuilder } from '@pagopa-pn/pn-commons';

export const storageAarOps = storageOpsBuilder<string>(AppRouteParams.AAR, 'string', false);
