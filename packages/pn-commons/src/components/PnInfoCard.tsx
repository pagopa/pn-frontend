import { MouseEvent, ReactNode, useId, useState } from 'react';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type PnInfoCardAction = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  testId?: string;
  onClick: () => void;
};

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: Array<PnInfoCardAction>;
  mobileCollapsible?: boolean;
  slotProps?: {
    Card: CardProps & { 'data-testid'?: string };
  };
  children: ReactNode;
};

const PnInfoCardHeading: React.FC<TypographyProps> = ({ children, ...props }) => (
  <>
    {typeof children === 'string' ? (
      <Typography component="span" display="block" {...props}>
        {children}
      </Typography>
    ) : (
      children
    )}
  </>
);

const PnInfoCardActions: React.FC<Pick<Props, 'actions'>> = ({ actions }) => {
  const isMobile = useIsMobile();
  const generatedId = useId();
  const menuId = `pn-info-card-actions-${generatedId}`;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: PnInfoCardAction) => {
    handleClose();
    action.onClick();
  };

  return isMobile ? (
    <Box data-testid="contextMenu">
      <IconButton
        onClick={handleClick}
        size="small"
        color="primary"
        data-testid="contextMenuButton"
        aria-label="Context menu"
        aria-controls={open ? menuId : undefined}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={menuId}
        data-testid="menuContext"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
          <MenuItem
            key={action.key}
            data-testid={action.testId}
            onClick={() => handleActionClick(action)}
            sx={{
              p: '10px 16px',
              gap: 1,
              color: action.destructive ? 'error.main' : 'primary.main',
            }}
          >
            {action.icon && (
              <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
                {action.icon}
              </Box>
            )}

            <Box component="span">{action.label}</Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  ) : (
    <Stack direction="row" alignItems="end" spacing={3}>
      {actions?.map((action) => (
        <Button
          key={action.key}
          data-testid={action.testId}
          variant="naked"
          color={action.destructive ? 'error' : 'primary'}
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{ p: '10px 16px' }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  );
};

type PnInfoCardContentProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
};

const PnInfoCardAccordion: React.FC<PnInfoCardContentProps> = ({ title, subtitle, children }) => {
  const generatedId = useId();
  const [expanded, setExpanded] = useState(false);

  const headerId = `pn-info-card-header-${generatedId}`;
  const panelId = `pn-info-card-panel-${generatedId}`;

  return (
    <>
      <Box component="h5" data-testid="PnInfoCardHeader" sx={{ m: 0 }}>
        <ButtonBase
          id={headerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((currentValue) => !currentValue)}
          sx={{
            width: '100%',
            p: 0,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            textAlign: 'left',
            borderRadius: 1,
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: 1,
              minWidth: 0,
            }}
          >
            {title}
            {subtitle}
          </Box>

          <KeyboardArrowDownOutlinedIcon
            color="primary"
            sx={(theme) => ({
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
            })}
          />
        </ButtonBase>
      </Box>

      <Collapse in={expanded} timeout="auto">
        <CardContent
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          data-testid="PnInfoCardBody"
          sx={{ p: 0, paddingBottom: '0 !important' }}
        >
          {children}
        </CardContent>
      </Collapse>
    </>
  );
};

type PnInfoCardStaticContentProps = PnInfoCardContentProps & {
  actions?: Array<PnInfoCardAction>;
};

const PnInfoCardStaticContent: React.FC<PnInfoCardStaticContentProps> = ({
  title,
  subtitle,
  actions,
  children,
}) => (
  <>
    <CardHeader
      data-testid="PnInfoCardHeader"
      disableTypography
      sx={{ p: 0, '.MuiCardHeader-action': { m: 0 } }}
      title={
        <Box component="h5" sx={{ m: 0 }}>
          {title}
        </Box>
      }
      action={actions ? <PnInfoCardActions actions={actions} /> : undefined}
      subheader={subtitle}
    />

    <CardContent data-testid="PnInfoCardBody" sx={{ p: 0, paddingBottom: '0 !important' }}>
      {children}
    </CardContent>
  </>
);

const PnInfoCard: React.FC<Props> = ({
  title,
  subtitle,
  actions,
  mobileCollapsible = false,
  slotProps,
  children,
}) => {
  const isMobile = useIsMobile();

  const renderAsAccordion = isMobile && mobileCollapsible;

  const titleContent = (
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
  );

  const subtitleContent =
    subtitle !== undefined && subtitle !== null ? (
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
    ) : undefined;

  return (
    <Card sx={{ p: { xs: 2, lg: 3 }, ...slotProps?.Card.sx }} {...slotProps?.Card}>
      {renderAsAccordion ? (
        <PnInfoCardAccordion title={titleContent} subtitle={subtitleContent}>
          {children}
        </PnInfoCardAccordion>
      ) : (
        <PnInfoCardStaticContent title={titleContent} subtitle={subtitleContent} actions={actions}>
          {children}
        </PnInfoCardStaticContent>
      )}
    </Card>
  );
};

export default PnInfoCard;
