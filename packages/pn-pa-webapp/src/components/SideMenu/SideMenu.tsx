import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Component } from 'react';
import { Email, VpnKey, People, GroupWork } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import * as routes from '../../navigation/routes.const';

const menuItems = [
    { label: 'Notifiche', icon: <Email />, route: routes.DASHBOARD},
    { label: 'Chiavi API', icon: <VpnKey />,  route: routes.API_KEYS},
    { label: 'Ruoli', icon:<People />, route: routes.ROLES},
    { label: 'Gruppi', icon:<GroupWork />, route: routes.GROUPS}
];

export default class SideMenu extends Component {
  render() {
    return (
      <Box height="100%" display="flex" flexDirection="column" bgcolor={'common.white'}>
        <Box alignItems="left" display="flex" flexDirection="column">
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.label} component={Link} to={item.route}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    );
  }
}
    