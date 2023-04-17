import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import { SideMenuItem } from '../../types';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import SideMenuListItem from './SideMenuListItem';

type Props = {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
  handleLinkClick: (item: SideMenuItem, flag?: boolean) => void;
  selectedItem: { index: number; label: string; route: string; parent?: string };
};

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '90vw',
    ['@media only screen and (max-width: 1200px)']: {
      width: '300px',
    },
  },
}));

const SideMenuList = ({ menuItems, selfCareItems, handleLinkClick, selectedItem }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string>('');
  const [selectedIndex, setSelectedIndex] =
    useState<{ label: string; index: number; route: string }>();
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

  useEffect(() => {
    setSelectedIndex(selectedItem);
    // open parent menù
    setOpenId(selectedItem.parent || '');
    setOpen(selectedItem.parent !== undefined);
    /* eslint-disable functional/immutable-data */
    prevOpenId.current = selectedItem.parent || '';
    /* eslint-enalbe functional/immutable-data */
  }, [selectedItem]);

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <List
        role="navigation"
        data-testid="menu-list"
        component="nav"
        aria-label={getLocalizedOrDefaultLabel(
          'common',
          'menu.aria-label',
          'piattaforma-notifiche navigazione principale'
        )}
        className={classes.root}
      >
        {menuItems.map((item: SideMenuItem, index: number) =>
          item.children ? (
            // accordion se ci sono children
            <Fragment key={item.label}>
              <ListItemButton
                selected={
                  selectedIndex &&
                  !item.notSelectable &&
                  index === selectedIndex.index &&
                  selectedIndex.label === item.label
                }
                onClick={() => {
                  if (!item.notSelectable) {
                    setSelectedIndex({ label: item.label, index, route: item.route });
                  }
                  handleLinkClick(item, true);
                  handleClick(item.label);
                }}
                data-testid={`sideMenuItem-${item.label}`}
              >
                {item.icon && (
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                )}
                <ListItemText primary={item.label} data-testid="collapsible-menu" />
                {openId === item.label && open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse
                in={openId === item.label && open}
                timeout="auto"
                unmountOnExit
                data-testid={`collapse-${item.label}`}
              >
                <List data-testid="collapsible-list">
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
                      onSelect={() =>
                        setSelectedIndex({
                          label: child.label,
                          index: childIndex,
                          route: item.route || '',
                        })
                      }
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
              onSelect={() =>
                setSelectedIndex({ label: item.label, index, route: item.route || '' })
              }
            />
          )
        )}
      </List>
      {selfCareItems && <Divider />}
      {selfCareItems && (
        <List
          component="nav"
          aria-label={getLocalizedOrDefaultLabel(
            'common',
            'menu.aria-label-inner',
            'piattaforma-notifiche navigazione mittente'
          )}
          className={classes.root}
        >
          {selfCareItems?.map((selfcareItem: SideMenuItem, sIndex: number) => (
            <SideMenuListItem
              key={selfcareItem.label}
              item={selfcareItem}
              handleLinkClick={handleLinkClick}
              selected={
                selectedIndex &&
                sIndex === selectedIndex.index &&
                selectedIndex.label === selfcareItem.label
              }
              onSelect={() =>
                setSelectedIndex({
                  label: selfcareItem.label,
                  index: sIndex,
                  route: selfcareItem.route || '',
                })
              }
              goOutside
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default SideMenuList;
