import { FC, Fragment, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { SideMenuItem } from '../../types/SideMenuItem';

interface Props {
  menuItems: Array<SideMenuItem>;
}

const SideMenu: FC<Props> = ({ menuItems }) => {
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState('');
  // store previous values
  const prevOpenId = useRef(openId);

  const handleClick = (label: string) => {
    if (prevOpenId.current === label) {
      setOpen(!open);
    } else {
      setOpenId(label);
      /* eslint-disable functional/immutable-data */
      prevOpenId.current = label;
      /* eslint-enalbe functional/immutable-data */
      setOpen(true);
    }
  };

  const itemList = (item: SideMenuItem, style?: {[key: string]: string | number}) => (
    <ListItem button key={item.label} component={Link} to={item.route} sx={style}>
      <ListItemIcon>
        <item.icon />
      </ListItemIcon>
      <ListItemText primary={item.label} />
    </ListItem>
  );

  return (
    <Box height="100%" display="flex" flexDirection="column" bgcolor={'common.white'}>
      <Box alignItems="left" display="flex" flexDirection="column">
        <List>
          {menuItems.map((item: SideMenuItem) =>
            item.children ? (
              <Fragment>
                <ListItem button key={item.label} onClick={() => handleClick(item.label)}>
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openId === item.label && open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openId === item.label && open} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.children.map(child => itemList(child, {pl: 4}))}
                  </List>
                </Collapse>
              </Fragment>
            ) : itemList(item)
          )}
        </List>
      </Box>
    </Box>
  );
};

export default SideMenu;
