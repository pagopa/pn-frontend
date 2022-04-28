import { FC, Fragment, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Menu } from '@mui/icons-material';

import { SideMenuItem } from '../../types/SideMenuItem';
import { useIsMobile } from '../../hooks/IsMobile.hook';
import SideMenuList from './SideMenuList';

type Props = {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
};

const SideMenu: FC<Props> = ({ menuItems, selfCareItems }) => {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const menuItemsWithIndex = menuItems.map<{ index: number; label: string; route: string }>(
    (item, i) => ({
      index: i,
      label: item.label,
      route: item.route || '',
    })
  );
  const menuItemSelected = menuItemsWithIndex.find((m) => m.route === location.pathname) ||
    menuItemsWithIndex.find((m) => location.pathname.indexOf(m.route as string) > -1) || {
      index: -1,
      label: 'Menu',
      route: '',
    };

  const toggleDrawer = () => {
    setState(!state);
  };

  const handleNavigation = (link: string) => {
    if (isMobile) {
      setState(false);
    }
    navigate(link);
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
              aria-label="main piattaforma-notifiche sender mobile"
              sx={{
                boxShadow:
                  '0px 2px 4px -1px rgba(0, 43, 85, 0.1), 0px 4px 5px rgba(0, 43, 85, 0.05), 0px 1px 10px rgba(0, 43, 85, 0.1)',
              }}
            >
              <ListItemButton onClick={toggleDrawer}>
                <ListItemIcon>
                  <Menu />
                </ListItemIcon>
                <ListItemText primary={menuItemSelected?.label} />
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
