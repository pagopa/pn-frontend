import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Badge from '@mui/material/Badge';
import { SideMenuItem } from '../..';
import NotificationBadge from './NotificationBadge';

type Props = {
  item: SideMenuItem;
  style?: { [key: string]: string | number };
  handleLinkClick: (link: string) => void;
};

const SideMenuListItem = ({ item, style, handleLinkClick }: Props) => (
  <ListItem button onClick={() => handleLinkClick(item.route as string)} style={style}sx={style}>
    <ListItemIcon>
      {item.dotBadge ?
        <Badge color="primary" variant="dot">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          {<item.icon />}
        </Badge>
        :
        (
          <>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <item.icon />
          </>
        )
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
