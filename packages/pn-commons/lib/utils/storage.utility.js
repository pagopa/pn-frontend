/**
 * PN-2018
 *
 * This file defines the storageOpsBuilder "class" (defined as a function),
 * which can be "instantiated" (i.e. invoke the function)
 * to obtain an object which handles a single value in session/local storage.
 *
 * As of 2022.08.28, this feature was used in pn-personafisica-login, and furthermore
 * the usage was implemented only partially and had no effect in the behavior of that app.
 *
 * I prefer to keep this definition for eventual future uses, since it does provide
 * a simplified access to session/local storage, albeit is not currently used.
 *
 * Each of the other definitions in this file contribute eventually to that of storageOpsBuilder.
 * Many of them were previously exported. I left all of them local since in principle,
 * the only feature to be used should be storageOpsBuilder.
 * I remark that none of these auxiliary definitions had any reference outside this file.
 *
 * I'm deleting all references to storageOpsBuilder. For a detail of those previous references,
 * cfr. the comments to the JIRA Issue PN-2018.
 *
 * ---------------------------------------------------
 * Carlos Lombardi, 2022.08.18
 */
import { sanitizeString } from './string.utility';
/** It will delete a key from the session storage. If local is true, it will use the local session storage instead. */
function storageDelete(key, local) {
    const storage = local ? window.localStorage : window.sessionStorage;
    storage.removeItem(key);
}
/** It will store a key/value pair in the session storage. If local is true, it will use the local session storage instead. */
function storageWrite(key, value, type, local) {
    const stringifyFn = {
        string: () => value,
        number: () => String(value),
        object: () => JSON.stringify(value),
    };
    const stringified = stringifyFn[type]();
    const storage = local ? window.localStorage : window.sessionStorage;
    storage.setItem(key, sanitizeString(stringified));
}
/** It will read a key from the session storage. If local is true, it will use the local session storage instead. */
function storageRead(key, type, local) {
    const storage = local ? window.localStorage : window.sessionStorage;
    const value = storage.getItem(key);
    if (value === null) {
        return;
    }
    const parseFn = {
        string: () => sanitizeString(value),
        number: () => Number(sanitizeString(value)),
        object: () => JSON.parse(sanitizeString(value)),
    };
    return parseFn[type]();
}
/** Build an object with a complete set of operation to perform on the same key */
export function storageOpsBuilder(key, type, local) {
    return {
        delete: () => storageDelete(key, local),
        read: () => storageRead(key, type, local),
        write: (value) => storageWrite(key, value, type, local),
    };
}
