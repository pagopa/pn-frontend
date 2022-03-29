import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Badge from '@mui/material/Badge';
import NotificationBadge from './NotificationBadge';

type Props = {
  item: SideMenuItem;
  style?: { [key: string]: string | number };
  handleLinkClick: (link: string) => void;
};

const SideMenuListItem = ({ item, style, handleLinkClick }: Props) => (
  <ListItem button onClick={() => handleLinkClick(item.route)} sx={style}>
    <ListItemIcon>
      {item.dotBadge ?
        <Badge color="primary" variant="dot">
          <item.icon />
        </Badge>
        :
        <item.icon />
      }
    </ListItemIcon>
    <ListItemText primary={item.label} />
    {item.rightBadgeNotification &&
      (
        <NotificationBadge numberOfNotification={item.rightBadgeNotification}/>
      ) 
    }

  </ListItem>
);

export default SideMenuListItem;
