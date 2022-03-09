import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { SideMenuItem } from '../../types/SideMenuItem';

type Props = {
  item: SideMenuItem;
  style?: { [key: string]: string | number };
  handleLinkClick: (link: string) => void;
};

const SideMenuListItem = ({ item, style, handleLinkClick }: Props) => (
  <ListItem button onClick={() => handleLinkClick(item.route)} sx={style}>
    <ListItemIcon>
      <item.icon />
    </ListItemIcon>
    <ListItemText primary={item.label} />
  </ListItem>
);

export default SideMenuListItem;
