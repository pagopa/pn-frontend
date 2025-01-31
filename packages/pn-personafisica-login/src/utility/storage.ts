import { AppRouteParams, storageOpsBuilder } from '@pagopa-pn/pn-commons';

export const STORAGE_RAPID_ACCESS_KEY = 'rapid_access';

export const storageRapidAccessOps = storageOpsBuilder<[AppRouteParams, string]>(
  STORAGE_RAPID_ACCESS_KEY,
  'object',
  false
);
