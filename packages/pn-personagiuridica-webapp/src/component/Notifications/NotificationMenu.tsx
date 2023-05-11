import { MouseEvent, ReactNode, useState } from "react";
import { Box, IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type Props = {
  children: ReactNode;
};

const NotificationMenu = ({ children }: Props) => {
  const { t } = useTranslation(['notifiche']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box data-testid="contextMenu">
      <Box>
        <IconButton
          onClick={handleMenuClick}
          size="small"
          data-testid="contextMenuButton"
          aria-label={t('context-menu.title')}
          aria-controls={open ? 'context-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVert />
        </IconButton>
      </Box>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        {children}
      </Menu>
    </Box>
  );
};

export default NotificationMenu;