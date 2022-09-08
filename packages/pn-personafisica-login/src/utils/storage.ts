import { storageOpsBuilder } from '@pagopa-pn/pn-commons';

export const storageOnSuccessOps = storageOpsBuilder<string>('LOGIN:onSuccess', 'string', false);
export const storageSpidSelectedOps = storageOpsBuilder<string>('SPID_SELECTED', 'object', false);
/** An object containing a complete set of operation on the storage regarding the key used to store in the storage the loggedUser token in selfcare projects */
// export const storageTokenOps = storageOpsBuilder<string>('token', 'string', true);
/** An object containing a complete set of operation on the storage regarding the key used to store in the storage the loggedUser in selfcare projects */
// export const storageUserOps = storageOpsBuilder<User>('user', 'object', true);
/** An object containing a complete set of operation on the storage regarding the origin where the login portal should redirect the user * */
export const storageOriginOps = storageOpsBuilder<string>('origin', 'string', false);
