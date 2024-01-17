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
type StorageValue = string | number | object;
type StorageValueType = 'string' | 'number' | 'object';
type StorageOps<T> = {
    delete: () => void;
    read: () => T;
    write: (value: T) => void;
};
/** Build an object with a complete set of operation to perform on the same key */
export declare function storageOpsBuilder<T extends StorageValue>(key: string, type: StorageValueType, local: boolean): StorageOps<T>;
export {};
