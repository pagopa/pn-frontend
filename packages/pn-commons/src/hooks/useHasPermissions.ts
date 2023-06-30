import { useMemo } from 'react';

/**
 * Check that the user has the right permissions
 * @param currentPermissions current user permissions
 * @param requiredPermissions required user permissions
 * @returns
 */
export function useHasPermissions<TPermission>(
  currentPermissions: Array<TPermission>,
  requiredPermissions: Array<TPermission>
) {
  // An anonymous (i.e. non logged) user cannot access to any route
  // which asks for permissions, even if the set of permissions is empty.
  // We recognize this for the !!currentPermissions condition.
  // In this way we can set the empty set of permissions to routes which can be accessible
  // for any logged user, but not for anonymous access.
  const hasAllPermissions: boolean = useMemo(
    () =>
      !!currentPermissions &&
      requiredPermissions.every((perm) => currentPermissions.includes(perm)),
    [currentPermissions, requiredPermissions]
  );

  return hasAllPermissions;
}
