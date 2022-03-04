import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { SideMenuItem } from '../../types/SideMenuItem';

interface Props {
  menuItems: Array<SideMenuItem>;
}

const SideMenu: FC<Props> = ({ menuItems }) => 
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
