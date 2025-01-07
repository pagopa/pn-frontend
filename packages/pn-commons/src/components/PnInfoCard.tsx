import { MouseEvent, ReactElement, ReactNode, useEffect, useState } from 'react';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: Array<ReactElement>;
  expanded?: boolean;
  slotProps?: {
    Card: CardProps;
  };
  children: ReactNode;
};

const PnInfoCardHeading: React.FC<TypographyProps> = ({ children, ...props }) => (
  <>{typeof children === 'string' ? <Typography {...props}>{children}</Typography> : children}</>
);

const PnInfoCardActions: React.FC<Pick<Props, 'actions'>> = ({ actions }) => {
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return isMobile ? (
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
        sx={{
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
        {actions?.map((action) => (
          <MenuItem key={action.key}>{action}</MenuItem>
        ))}
      </Menu>
    </Box>
  ) : (
    <Stack direction="row" alignItems="end" spacing={3}>
      {actions}
    </Stack>
  );
};

const PnInfoCard: React.FC<Props> = ({
  title,
  subtitle,
  actions,
  expanded = false,
  slotProps,
  children,
}) => {
  const isMobile = useIsMobile();
  const [showDescription, setShowDescription] = useState(expanded);

  const showContent = !isMobile || (isMobile && showDescription);

  const getExpandCollapseActions = () => {
    if (!isMobile) {
      return '';
    }
    if (!showDescription) {
      return (
        <KeyboardArrowDownOutlinedIcon
          color="primary"
          onClick={() => setShowDescription(true)}
          sx={{ mb: 2 }}
        />
      );
    }
    return (
      <KeyboardArrowUpOutlinedIcon
        color="primary"
        onClick={() => setShowDescription(false)}
        sx={{ mb: 2 }}
      />
    );
  };

  useEffect(() => {
    setShowDescription(expanded);
  }, [expanded]);

  return (
    <Card sx={{ p: { xs: 2, lg: 3 }, ...slotProps }}>
      <CardHeader
        data-testid="PnInfoCardHeader"
        sx={{ p: 0 }}
        title={
          <PnInfoCardHeading
            data-testid="PnInfoCardTitle"
            color="text.primary"
            fontWeight={700}
            fontSize="24"
            variant="body1"
            mb={2}
          >
            {title}
          </PnInfoCardHeading>
        }
        action={actions ? <PnInfoCardActions actions={actions} /> : getExpandCollapseActions()}
        subheader={
          <PnInfoCardHeading
            data-testid="PnInfoCardSubtitle"
            color="text.primary"
            fontWeight={600}
            fontSize={14}
            variant="body1"
            mb={2}
          >
            {subtitle}
          </PnInfoCardHeading>
        }
      />
      {showContent && (
        <CardContent data-testid="PnInfoCardBody" sx={{ p: 0, paddingBottom: '0 !important' }}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default PnInfoCard;
