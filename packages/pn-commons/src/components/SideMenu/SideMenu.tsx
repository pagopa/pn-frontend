import { FC, Fragment, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Menu } from '@mui/icons-material';

import { SideMenuItem } from '../../types';
import { useIsMobile } from '../../hooks';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import SideMenuList from './SideMenuList';

type Props = {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
  eventTrackingCallback?: (target: string) => void;
};

const SideMenu: FC<Props> = ({ menuItems, selfCareItems, eventTrackingCallback }) => {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const findMenuItemSelectedRecursive = (
    items: Array<SideMenuItem>,
    parent?: string
  ): { index: number; label: string; route: string; parent?: string } | null => {
    // find if there is a menu item that matches current route
    // notSelectable flag indicates that the menu item is selectable
    let menuItemIndex = items.findIndex((m) => m.route === location.pathname && !m.notSelectable);
    if (menuItemIndex > -1) {
      return {
        index: menuItemIndex,
        label: items[menuItemIndex].label,
        route: items[menuItemIndex].route || '',
        parent
      };
    }
    // find if there is a menu item that has route as a part of current one
    items.forEach((item, index) => {
      if (
        location.pathname.startsWith(item.route) &&
        (menuItemIndex === -1 ||
          (menuItemIndex > -1 && item.route.length > items[menuItemIndex].route.length))
      ) {
        menuItemIndex = index;
      }
    });
    if (menuItemIndex > -1) {
      if (items[menuItemIndex].children && items[menuItemIndex].children?.length) {
        return findMenuItemSelectedRecursive(items[menuItemIndex].children!, items[menuItemIndex].label);
      }
      return {
        index: menuItemIndex,
        label: items[menuItemIndex].label,
        route: items[menuItemIndex].route || '',
        parent
      };
    }
    return null;
  };

  const findMenuItemSelected = (): { index: number; label: string; route: string } => {
    // first check if we can find menu item that matches current route
    // if not, we'll find into the children and so on
    const menuItem = findMenuItemSelectedRecursive(menuItems);
    if (menuItem) {
      return menuItem;
    }
    return {
      index: -1,
      label: 'Menu',
      route: '',
    };
  };

  const menuItemSelected = findMenuItemSelected();

  const toggleDrawer = () => {
    setState(!state);
  };

  const handleNavigation = (item: SideMenuItem, menuFlag?: boolean) => {
    if (eventTrackingCallback) {
      eventTrackingCallback(item.route)
    }
    if (isMobile && !menuFlag) {
      setState(false);
    }
    if (!item.notSelectable) {
      if (item.route && item.route.length > 0) { 
        navigate(item.route);
      } else if (item.action) {
        item.action();
      }
    }
  };

  return (
    <Box
      height={isMobile ? 'auto' : '100%'}
      display="flex"
      flexDirection="column"
      bgcolor={'common.white'}
    >
      <Box alignItems="left" display="flex" flexDirection="column">
        {isMobile ? (
          <Fragment>
            <List
              role="navigation"
              component="nav"
              aria-label={getLocalizedOrDefaultLabel('common', 'menu.aria-label', 'piattaforma-notifiche navigazione principale')}
              sx={{
                boxShadow:
                  '0px 2px 4px -1px rgba(0, 43, 85, 0.1), 0px 4px 5px rgba(0, 43, 85, 0.05)',
                paddingBottom: 0,
                paddingTop: 0,
              }}
            >
              <ListItemButton onClick={toggleDrawer}>
                <ListItemIcon>
                  <Menu color="primary" />
                </ListItemIcon>
                <ListItemText primary={menuItemSelected?.label} sx={{ color: 'primary.main' }} />
              </ListItemButton>
            </List>
            <Drawer anchor="left" open={state} onClose={toggleDrawer}>
              {
                <SideMenuList
                  menuItems={menuItems}
                  selfCareItems={selfCareItems}
                  handleLinkClick={handleNavigation}
                  selectedItem={menuItemSelected}
                />
              }
            </Drawer>
          </Fragment>
        ) : (
          <SideMenuList
            menuItems={menuItems}
            selfCareItems={selfCareItems}
            handleLinkClick={handleNavigation}
            selectedItem={menuItemSelected}
          />
        )}
      </Box>
    </Box>
  );
};

export default SideMenu;
