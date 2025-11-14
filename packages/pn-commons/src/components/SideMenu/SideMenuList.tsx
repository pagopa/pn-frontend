import { Fragment, useEffect, useRef, useState } from 'react';

import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { SideMenuItem } from '../../models/SideMenuItem';
import SideMenuListItem from './SideMenuListItem';

type Props = {
  menuItems: Array<SideMenuItem>;
  selfCareItems?: Array<SideMenuItem>;
  handleLinkClick: (item: SideMenuItem) => void;
  selectedItem: { index: number; label: string; route: string; parent?: string };
};

const style = {
  maxWidth: '90vw',
  ['@media only screen and (max-width: 1200px)']: {
    width: '300px',
  },
};

const SideMenuList = ({ menuItems, selfCareItems, handleLinkClick, selectedItem }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<{
    label: string;
    index: number;
    route: string;
  }>();
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
      <List data-testid="menu-list" sx={style}>
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
                  handleLinkClick(item);
                  handleClick(item.label);
                }}
                data-testid={`sideMenuItem-${item.label}`}
                id={`side-item-${item.label}`}
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
        <List data-testid="menu-list" sx={style}>
          {selfCareItems?.map((selfcareItem: SideMenuItem) => (
            <SideMenuListItem
              key={selfcareItem.label}
              item={selfcareItem}
              handleLinkClick={handleLinkClick}
              goOutside
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default SideMenuList;
