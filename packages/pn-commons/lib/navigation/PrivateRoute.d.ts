import { PropsWithChildren, ReactNode } from 'react';
/**
 * @typedef {Object} Props<TPermission>
 * @property {Array<TPermission>} currentRoles current user permissions
 * @property {Array<TPermission>} requiredRoles required permissions to access the route
 * @property {ReactNode} redirectTo react component where the user must be redirect if he doens't have the right permissions
 * @property {boolean} additionalCondition additional condition that must be checked to grant the access to the route
 */
type Props<TPermission> = {
    currentRoles: Array<TPermission>;
    requiredRoles: Array<TPermission>;
    redirectTo: ReactNode;
    additionalCondition?: boolean;
};
/**
 * Render current route or fallback route based on user permissions
 * @param {Props<TPermission>} props - component properties
 */
declare const PrivateRoute: <TPermission>({ currentRoles, requiredRoles, redirectTo, additionalCondition, children, }: PropsWithChildren<Props<TPermission>>) => JSX.Element;
export default PrivateRoute;
