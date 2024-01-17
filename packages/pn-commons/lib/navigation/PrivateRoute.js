import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useHasPermissions } from '../hooks/useHasPermissions';
/**
 * Render current route or fallback route based on user permissions
 * @param {Props<TPermission>} props - component properties
 */
const PrivateRoute = ({ currentRoles, requiredRoles, redirectTo, additionalCondition = true, children, }) => {
    const accepted = useHasPermissions(currentRoles, requiredRoles) && additionalCondition;
    return accepted ? _jsx(_Fragment, { children: children }) : _jsx(_Fragment, { children: redirectTo });
};
export default PrivateRoute;
