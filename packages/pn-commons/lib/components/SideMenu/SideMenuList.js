import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useRef, useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import SideMenuListItem from './SideMenuListItem';
const useStyles = makeStyles(() => ({
    root: {
        maxWidth: '90vw',
        ['@media only screen and (max-width: 1200px)']: {
            width: '300px',
        },
    },
}));
const SideMenuList = ({ menuItems, selfCareItems, handleLinkClick, selectedItem }) => {
    const [open, setOpen] = useState(false);
    const [openId, setOpenId] = useState('');
    const [selectedIndex, setSelectedIndex] = useState();
    const classes = useStyles();
    // store previous values
    const prevOpenId = useRef(openId);
    const handleClick = (label) => {
        if (prevOpenId.current === label) {
            setOpen(!open);
        }
        else {
            setOpenId(label);
            /* eslint-disable functional/immutable-data */
            prevOpenId.current = label;
            /* eslint-enalbe functional/immutable-data */
            setOpen(true);
        }
    };
    useEffect(() => {
        setSelectedIndex(selectedItem);
        // open parent menù
        setOpenId(selectedItem.parent || '');
        setOpen(selectedItem.parent !== undefined);
        /* eslint-disable functional/immutable-data */
        prevOpenId.current = selectedItem.parent || '';
        /* eslint-enalbe functional/immutable-data */
    }, [selectedItem]);
    return (_jsxs(Box, { sx: {
            height: '100%',
            backgroundColor: 'background.paper',
        }, children: [_jsx(List, { role: "navigation", "data-testid": "menu-list", component: "nav", "aria-label": getLocalizedOrDefaultLabel('common', 'menu.aria-label', 'piattaforma-notifiche navigazione principale'), className: classes.root, children: menuItems.map((item, index) => item.children ? (
                // accordion se ci sono children
                _jsxs(Fragment, { children: [_jsxs(ListItemButton, { selected: selectedIndex &&
                                !item.notSelectable &&
                                index === selectedIndex.index &&
                                selectedIndex.label === item.label, onClick: () => {
                                if (!item.notSelectable) {
                                    setSelectedIndex({ label: item.label, index, route: item.route });
                                }
                                handleLinkClick(item, true);
                                handleClick(item.label);
                            }, "data-testid": `sideMenuItem-${item.label}`, id: `side-item-${item.label}`, children: [item.icon && (_jsx(ListItemIcon, { children: _jsx(item.icon, {}) })), _jsx(ListItemText, { primary: item.label, "data-testid": "collapsible-menu" }), openId === item.label && open ? _jsx(ExpandLess, {}) : _jsx(ExpandMore, {})] }), _jsx(Collapse, { in: openId === item.label && open, timeout: "auto", unmountOnExit: true, "data-testid": `collapse-${item.label}`, children: _jsx(List, { "data-testid": "collapsible-list", children: item.children.map((child, childIndex) => (_jsx(SideMenuListItem, { selected: selectedIndex &&
                                        childIndex === selectedIndex.index &&
                                        selectedIndex.label === child.label, item: child, handleLinkClick: handleLinkClick, style: { pl: 4 }, onSelect: () => setSelectedIndex({
                                        label: child.label,
                                        index: childIndex,
                                        route: item.route || '',
                                    }) }, child.label))) }) })] }, item.label)) : (_jsx(SideMenuListItem, { item: item, handleLinkClick: handleLinkClick, selected: selectedIndex && index === selectedIndex.index && selectedIndex.label === item.label, onSelect: () => setSelectedIndex({ label: item.label, index, route: item.route || '' }) }, item.label))) }), selfCareItems && _jsx(Divider, {}), selfCareItems && (_jsx(List, { component: "nav", "aria-label": getLocalizedOrDefaultLabel('common', 'menu.aria-label-inner', 'piattaforma-notifiche navigazione mittente'), className: classes.root, children: selfCareItems?.map((selfcareItem) => (_jsx(SideMenuListItem, { item: selfcareItem, handleLinkClick: handleLinkClick, goOutside: true }, selfcareItem.label))) }))] }));
};
export default SideMenuList;
