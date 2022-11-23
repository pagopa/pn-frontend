import { storageOpsBuilder } from '@pagopa-pn/pn-commons';

export const storageOnSuccessOps = storageOpsBuilder<string>('LOGIN:onSuccess', 'string', false);
/** An object containing a complete set of operation on the storage regarding the origin where the login portal should redirect the user * */
export const storageOriginOps = storageOpsBuilder<string>('origin', 'string', false);

export const storageSpidSelectedOps = storageOpsBuilder<string>('SPID_SELECTED', 'object', false);
