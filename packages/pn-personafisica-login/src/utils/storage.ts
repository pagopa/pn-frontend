import { storageOpsBuilder, AppRouteType, AppRouteParams } from '@pagopa-pn/pn-commons';

export const storageOnSuccessOps = storageOpsBuilder<string>('LOGIN:onSuccess', 'string', false);
export const storageTypeOps = storageOpsBuilder<AppRouteType.PF | AppRouteType.PG>(
  AppRouteParams.TYPE,
  'string',
  false
);
export const storageAarOps = storageOpsBuilder<string>(AppRouteParams.AAR, 'string', false);

export const storageSpidSelectedOps = storageOpsBuilder<string>('SPID_SELECTED', 'object', false);
