import * as yup from 'yup';
import { BasicUser } from '../models/User';
/**
 * Yup matcher contents (i.e. a suitable parameter for yup.object())
 * for the common traits of users.
 */
export declare const basicUserDataMatcherContents: {
    family_name: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    fiscal_number: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    name: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    uid: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    sessionToken: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    email: yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
};
/**
 * Produces the initial user object to set into the Redux store of a PN webapp.
 * If there is a (serialized) valid user object in the session storage, then it returns the corresponding (JSON-deserialized) object.
 * Otherwise, it returns an object which represent "no user logged", and also cleans the session storage.
 *
 * @param yupMatcher the matcher to validate the data in session storage.
 * @param noLoggedUserData the "no user logged" object to return if there is no, or invalid, data in the session storage.
 * @returns the suitable User object to set into the initial Redux store.
 */
export declare function basicInitialUserData<T extends BasicUser>(yupMatcher: yup.ObjectSchema<any>, noLoggedUserData: T): T;
export declare function adaptedTokenExchangeError(originalError: any): any;
export declare function removeNullProperties<T extends BasicUser>(obj: T): T;
