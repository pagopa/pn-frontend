import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExitToApp } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Badge from '@mui/material/Badge';
import NotificationBadge from './NotificationBadge';
function renderIcon(Icon) {
    if (typeof Icon === 'object') {
        return _jsx(Icon, {});
    }
    else if (typeof Icon === 'function') {
        return Icon();
    }
    else {
        return null;
    }
}
/**
 * SideMenu List Item: rappresenta un item nel menu di navigazione laterale. Se goOutside è true al click viene aperta un'altra tab del browser.
 * @param item SideMenuItem
 * @param selected boolean, optional
 * @param style optional
 * @param goOutside boolean, default false
 * @param onSelect onSelect action
 * @param handleLinkClick navigation action
 */
const SideMenuListItem = ({ item, selected, style, goOutside = false, handleLinkClick, onSelect, }) => (_jsxs(ListItemButton, { id: `side-item-${item.label}`, selected: selected, onClick: () => {
        if (onSelect) {
            onSelect();
        }
        if (goOutside) {
            window.open(item.route);
        }
        else {
            handleLinkClick(item);
        }
    }, sx: style, "data-testid": `sideMenuItem-${item.label}`, children: [item.icon && (_jsx(ListItemIcon, { children: item.dotBadge ? (_jsx(Badge, { color: "primary", variant: "dot", id: `sideMenuItem-${item.label}-badge`, children: _jsx(item.icon, {}) })) : (renderIcon(item.icon)) })), _jsx(ListItemText, { id: `menu-item(${item.label.toLowerCase()})`, primary: item.label, "data-testid": `menu-item(${item.label.toLowerCase()})` }), item.rightBadgeNotification && (_jsx(NotificationBadge, { numberOfNotification: item.rightBadgeNotification })), goOutside && _jsx(ExitToApp, { color: "action" })] }));
export default SideMenuListItem;
