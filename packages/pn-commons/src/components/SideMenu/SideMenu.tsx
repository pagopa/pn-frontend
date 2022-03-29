import { FC, Fragment, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu } from '@mui/icons-material';

import { SideMenuItem } from '../../types/SideMenuItem';
import { useIsMobile } from '../../hooks/IsMobile.hook';
import SideMenuList from './SideMenuList';

interface Props {
  menuItems: Array<SideMenuItem>;
}

const CustomList = styled(List)(({ theme }) => ({
  boxShadow: '0px 2px 4px -1px rgba(0, 43, 85, 0.1), 0px 4px 5px rgba(0, 43, 85, 0.05), 0px 1px 10px rgba(0, 43, 85, 0.1)',
  '& .MuiListItemIcon-root': {
    color: `${theme.palette.primary.main} !important`
  },
  '& .MuiTypography-root': {
    color: `${theme.palette.primary.main} !important`
  }
}));

const SideMenu: FC<Props> = ({ menuItems }) => {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const menuItemSelected = menuItems.find(m => m.route === location.pathname) ||
    menuItems.find(m => location.pathname.indexOf(m.route) > -1) || {label: 'Menu'};

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
    <Box height={isMobile ? 'auto' : '100%'} display="flex" flexDirection="column" bgcolor={'common.white'}>
      <Box alignItems="left" display="flex" flexDirection="column">
        {isMobile ? (
          <Fragment>
            <CustomList>
              <ListItem button onClick={toggleDrawer}>
                <ListItemIcon>
                  <Menu />
                </ListItemIcon>
                <ListItemText primary={menuItemSelected?.label}/>
              </ListItem>
            </CustomList>
            <Drawer
              anchor="left"
              open={state}
              onClose={toggleDrawer}
            >
              {<SideMenuList menuItems={menuItems} handleLinkClick={handleNavigation}/>}
            </Drawer>
          </Fragment>
          ) : (
          <SideMenuList menuItems={menuItems} handleLinkClick={handleNavigation}/>
        )}
      </Box>
    </Box>
  );
};

export default SideMenu;
