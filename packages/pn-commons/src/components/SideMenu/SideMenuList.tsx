import { Fragment, useRef, useState } from 'react';
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { SideMenuItem } from '../../types/SideMenuItem';
import SideMenuListItem from './SideMenuListItem';

type Props = {
  menuItems: Array<SideMenuItem>;
  handleLinkClick: (link: string) => void;
};

const useStyles = makeStyles(() => ({
  root: {
    ['@media only screen and (max-width: 576px)']: {
      width: '50vw'
    },
    ['@media only screen and (min-width: 577px) and (max-width: 992px)']: {
      width: '30vw'
    }
  },
})); 

const SideMenuList = ({ menuItems, handleLinkClick }: Props) => {
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState('');
  const classes = useStyles();
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
  return (
    <List className={classes.root}>
      {menuItems.map((item: SideMenuItem) =>
        item.children ? (
          <Fragment key={item.label}>
            <ListItem button onClick={() => handleClick(item.label)}>
              <ListItemIcon>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <item.icon/>
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {openId === item.label && open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openId === item.label && open}
              timeout="auto"
              unmountOnExit
              data-testid={`collapse-${item.label}`}
            >
              <List disablePadding>{item.children.map((child) => <SideMenuListItem key={child.label} item={child} style={{ pl: 4 }} handleLinkClick={handleLinkClick}/>)}</List>
            </Collapse>
          </Fragment>
        ) : (
          <SideMenuListItem key={item.label} item={item} handleLinkClick={handleLinkClick}/>
        )
      )}
    </List>
  );
};

export default SideMenuList;
