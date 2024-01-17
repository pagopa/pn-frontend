/**
 * Check that the user has the right permissions
 * @param currentPermissions current user permissions
 * @param requiredPermissions required user permissions
 * @returns
 */
export declare function useHasPermissions<TPermission>(currentPermissions: Array<TPermission>, requiredPermissions: Array<TPermission>): boolean;
