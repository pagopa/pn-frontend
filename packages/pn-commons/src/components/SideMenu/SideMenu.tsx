import { FC, Fragment, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Menu } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { useIsMobile } from '../../hooks/useIsMobile';
import { SideMenuItem } from '../../models/SideMenuItem';
import SideMenuList from './SideMenuList';

type Props = {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
  feedbackBanner?: ReactNode;
};

const SideMenu: FC<Props> = ({ menuItems, selfCareItems, feedbackBanner }) => {
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
    // eslint-disable-next-line functional/no-let
    let menuItemIndex = items.findIndex((m) => m.route === location.pathname && !m.notSelectable);
    if (menuItemIndex > -1) {
      return {
        index: menuItemIndex,
        label: items[menuItemIndex].label,
        route: items[menuItemIndex].route || '',
        parent,
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
        return findMenuItemSelectedRecursive(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          items[menuItemIndex].children!,
          items[menuItemIndex].label
        );
      }
      return {
        index: menuItemIndex,
        label: items[menuItemIndex].label,
        route: items[menuItemIndex].route || '',
        parent,
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

  useEffect(() => {
    if (isMobile) {
      setState(false);
    }
  }, [location]);

  const handleNavigation = (item: SideMenuItem) => {
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
      data-testid="sideMenu"
    >
      <Box alignItems="left" display="flex" flexDirection="column">
        {isMobile ? (
          <Fragment>
            <List
              component="nav"
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
            <Drawer
              anchor="left"
              open={state}
              onClose={toggleDrawer}
              PaperProps={{
                sx: {
                  width: 300,
                  boxSizing: 'border-box',
                },
              }}
            >
              <SideMenuList
                menuItems={menuItems}
                selfCareItems={selfCareItems}
                handleLinkClick={handleNavigation}
                selectedItem={menuItemSelected}
              />
              {feedbackBanner && (
                <>
                  <Divider sx={{ mb: 1 }} />
                  <Box p={2}>{feedbackBanner}</Box>
                </>
              )}
            </Drawer>
          </Fragment>
        ) : (
          <>
            <SideMenuList
              menuItems={menuItems}
              selfCareItems={selfCareItems}
              handleLinkClick={handleNavigation}
              selectedItem={menuItemSelected}
            />
            {feedbackBanner && (
              <>
                <Divider sx={{ mb: 1 }} />
                <Box p={2}>{feedbackBanner}</Box>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SideMenu;
