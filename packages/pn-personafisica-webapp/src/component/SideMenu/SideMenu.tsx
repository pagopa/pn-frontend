import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Link } from 'react-router-dom';
import * as routes from '../../navigation/routes.const';
import { SideMenuItem } from './SideMenuItem';

const menuItems: Array<SideMenuItem> = [
  { label: 'Notifiche', icon: MailOutlineIcon, route: routes.NOTIFICHE },
  { label: 'Deleghe', icon: PeopleOutlineIcon, route: routes.DELEGHE },
  { label: 'Profilo', icon: SettingsOutlinedIcon, route: routes.PROFILO },
];

const SideMenu = () => 
  (
    <Box height="100%" display="flex" flexDirection="column" bgcolor={'common.white'}>
      <Box alignItems="left" display="flex" flexDirection="column">
        <List>
          {menuItems.map((item: SideMenuItem) => (
            <ListItem button key={item.label} component={Link} to={item.route}>
              <ListItemIcon><item.icon/></ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );


export default SideMenu;
