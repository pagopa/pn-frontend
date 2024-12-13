import { MouseEvent, ReactNode, useState } from 'react';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  header?: ReactNode;
  title: ReactNode;
  subtitle?: string | ReactNode;
  actions?: Array<ReactNode>;
  expanded?: boolean;
  sx?: SxProps;
  children: ReactNode;
};

const PnInfoCardTitle: React.FC<Pick<Props, 'title'>> = ({ title }) => (
  <>
    {typeof title === 'string' && (
      <Typography
        color="text.primary"
        fontWeight={700}
        fontSize={24}
        variant="body1"
        mb={2}
        data-testid="PnInfoCardTitle"
      >
        {title}
      </Typography>
    )}
    {typeof title !== 'string' && title}
  </>
);

const PnInfoCardSubtitle: React.FC<Pick<Props, 'subtitle'>> = ({ subtitle }) => (
  <>
    {typeof subtitle === 'string' && (
      <Typography
        color="text.primary"
        fontWeight={600}
        fontSize={14}
        variant="body1"
        mb={2}
        data-testid="PnInfoCardSubtitle"
      >
        {subtitle}
      </Typography>
    )}
    {typeof subtitle !== 'string' && subtitle}
  </>
);

const PnInfoCardActions: React.FC<Pick<Props, 'actions'> & { mobile: boolean }> = ({
  actions,
  mobile,
}) => (
  <>
    {mobile ? (
      <MobileContextMenu actions={actions} />
    ) : (
      <Stack direction="row" alignItems="end" spacing={3}>
        {actions?.map((action) => action)}
      </Stack>
    )}
  </>
);

const MobileContextMenu: React.FC<Pick<Props, 'actions'>> = ({ actions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box data-testid="contextMenu">
      <IconButton
        onClick={handleClick}
        size="small"
        color="primary"
        data-testid="contextMenuButton"
        aria-label="Context menu"
        aria-controls={open ? 'context-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVert />
      </IconButton>
      <Menu
        data-testid="menuContext"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions?.map((action, index) => (
          <MenuItem key={index}>{action}</MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const PnInfoCardContent: React.FC<
  Pick<Props, 'title' | 'subtitle' | 'actions' | 'children' | 'expanded'> & { sx?: SxProps }
> = ({ title, subtitle, actions, expanded, sx, children }) => {
  const isMobile = useIsMobile();
  const [showDescription, setShowDescription] = useState(expanded);
  return (
    <Box sx={sx}>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        {title && <PnInfoCardTitle title={title} />}
        {actions && <PnInfoCardActions actions={actions} mobile={isMobile} />}
        {isMobile && !actions && !showDescription && (
          <KeyboardArrowDownOutlinedIcon
            color="primary"
            onClick={() => setShowDescription(true)}
            sx={{ mb: 2 }}
          />
        )}
        {isMobile && !actions && showDescription && (
          <KeyboardArrowUpOutlinedIcon
            color="primary"
            onClick={() => setShowDescription(false)}
            sx={{ mb: 2 }}
          />
        )}
      </Stack>
      {subtitle && <PnInfoCardSubtitle subtitle={subtitle} />}
      {(!isMobile || (isMobile && showDescription)) && children}
    </Box>
  );
};

const PnInfoCard: React.FC<Props> = ({
  header,
  title,
  subtitle,
  actions,
  expanded = false,
  sx,
  children,
}) => (
  <Card sx={{ ...sx }}>
    {header && (
      <Stack direction="row">
        <CardHeader data-testid="PnInfoCardHeader" sx={{ p: 0 }} title={header} />
      </Stack>
    )}
    <CardContent data-testid="PnInfoCardBody" sx={{ p: 0, paddingBottom: '0 !important' }}>
      <PnInfoCardContent
        title={title}
        subtitle={subtitle}
        actions={actions}
        sx={{ p: { xs: 2, lg: 3 } }}
        expanded={expanded}
      >
        {children}
      </PnInfoCardContent>
    </CardContent>
  </Card>
);

export default PnInfoCard;
