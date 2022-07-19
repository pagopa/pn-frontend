import { ExitToApp } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Badge from '@mui/material/Badge';

import { SideMenuItem } from '../../types';
import NotificationBadge from './NotificationBadge';

type Props = {
  item: SideMenuItem;
  selected?: boolean;
  style?: { [key: string]: string | number };
  goOutside?: boolean;
  onSelect: () => void;
  handleLinkClick: (item: SideMenuItem) => void;
};

/**
 * SideMenu List Item: rappresenta un item nel menu di navigazione laterale. Se goOutside è true al click viene aperta un'altra tab del browser.
 * @param item SideMenuItem
 * @param selected boolean, optional
 * @param style optional
 * @param goOutside boolean, default false
 * @param onSelect onSelect action
 * @param handleLinkClick navigation action
 */
const SideMenuListItem = ({
  item,
  selected,
  style,
  goOutside = false,
  handleLinkClick,
  onSelect,
}: Props) => (
    <ListItemButton
      selected={selected}
      onClick={() => {
        onSelect();
        if (goOutside) {
          window.open(item.route as string);
        } else {
          handleLinkClick(item);
        }
      }}
      sx={style}
    >
      {item.icon && (
        <ListItemIcon>
          {item.dotBadge ? (
            <Badge color="primary" variant="dot">
              <item.icon />
            </Badge>
          ) : (
            <item.icon />
          )}
        </ListItemIcon>
      )}
      <ListItemText primary={item.label} />
      {item.rightBadgeNotification && (
        <NotificationBadge numberOfNotification={item.rightBadgeNotification} />
      )}
      {goOutside && <ExitToApp color="action" />}
    </ListItemButton>
  );

export default SideMenuListItem;
