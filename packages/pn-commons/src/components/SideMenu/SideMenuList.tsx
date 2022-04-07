import { Fragment, useRef, useState } from 'react';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
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
      width: '50vw',
    },
    ['@media only screen and (min-width: 577px) and (max-width: 992px)']: {
      width: '30vw',
    },
  },
}));

const SideMenuList = ({ menuItems, handleLinkClick }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<{ label: string; index: number }>();
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
    <Box
      sx={{
        height: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <List
        role="list"
        data-testid="menu-list"
        component="nav"
        aria-label="main piattaforma-notifiche sender"
        className={classes.root}
      >
        {menuItems.map((item: SideMenuItem, index: number) =>
          item.children ? (
            // accordion se ci sono children
            <Fragment key={item.label}>
              <ListItemButton
                selected={
                  selectedIndex &&
                  index === selectedIndex.index &&
                  selectedIndex.label === item.label
                }
                onClick={() => {
                  setSelectedIndex({ label: item.label, index });
                  handleLinkClick(item.route as string);
                  handleClick(item.label);
                }}
              >
                {item.icon && (
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                )}
                <ListItemText primary={item.label} />
                {openId === item.label && open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse
                in={openId === item.label && open}
                timeout="auto"
                unmountOnExit
                data-testid={`collapse-${item.label}`}
              >
                <List>
                  {item.children.map((child, childIndex) => (
                    <SideMenuListItem
                      key={child.label}
                      selected={
                        selectedIndex &&
                        childIndex === selectedIndex.index &&
                        selectedIndex.label === child.label
                      }
                      item={child}
                      handleLinkClick={handleLinkClick}
                      style={{ pl: 4 }}
                      onSelect={() => setSelectedIndex({ label: child.label, index: childIndex })}
                    />
                  ))}
                </List>
              </Collapse>
            </Fragment>
          ) : (
            <SideMenuListItem
              key={item.label}
              item={item}
              handleLinkClick={handleLinkClick}
              selected={
                selectedIndex && index === selectedIndex.index && selectedIndex.label === item.label
              }
              onSelect={() => setSelectedIndex({ label: item.label, index })}
            />
          )
        )}
      </List>
    </Box>
  );
};

export default SideMenuList;
