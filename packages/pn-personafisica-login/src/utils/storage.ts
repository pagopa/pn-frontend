import { storageOpsBuilder } from '@pagopa-pn/pn-commons';
import { User } from '../models/User';

export const storageOnSuccessOps = storageOpsBuilder<string>('LOGIN:onSuccess', 'string', false);
export const storageSpidSelectedOps = storageOpsBuilder<string>('SPID_SELECTED', 'object', false);
/** An object containing a complete set of operation on the storage regarding the key used to store in the storage the loggedUser token in selfcare projects */
export const storageTokenOps = storageOpsBuilder<string>('token', 'string', true);
/** An object containing a complete set of operation on the storage regarding the key used to store in the storage the loggedUser in selfcare projects */
export const storageUserOps = storageOpsBuilder<User>('user', 'object', true);
