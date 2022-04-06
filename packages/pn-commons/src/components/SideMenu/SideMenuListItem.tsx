import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Badge from '@mui/material/Badge';
import { SideMenuItem } from '../..';
import NotificationBadge from './NotificationBadge';

type Props = {
  item: SideMenuItem;
  selected?: boolean;
  style?: { [key: string]: string | number };
  onSelect: () => void;
  handleLinkClick: (link: string) => void;
};

const SideMenuListItem = ({ item, selected, style, handleLinkClick, onSelect }: Props) => {
  return (
    <ListItemButton
      selected={selected}
      onClick={() => {
        onSelect();
        handleLinkClick(item.route as string);
      }}
      sx={style}
    >
      {item.icon && <ListItemIcon>
        {item.dotBadge ? (
          <Badge color="primary" variant="dot">
            <item.icon />
          </Badge>
        ) : (
          <item.icon />
        )}
      </ListItemIcon>}
      <ListItemText primary={item.label} />
      {item.rightBadgeNotification && (
        <NotificationBadge numberOfNotification={item.rightBadgeNotification} />
      )}
    </ListItemButton>
  );
};

export default SideMenuListItem;
