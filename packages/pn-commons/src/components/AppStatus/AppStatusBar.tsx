import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { useIsMobile } from '../../hooks/useIsMobile';
import { AppCurrentStatus } from '../../models/AppStatus';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

export const AppStatusBar = ({ status }: { status: AppCurrentStatus }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  // labels
  const statusText = getLocalizedOrDefaultLabel(
    'appStatus',
    `appStatus.statusDescription.${status.appIsFullyOperative ? 'ok' : 'not-ok'}`,
    "Status dell'applicazione in questo momento: verde OK, rosso con problemi."
  );

  // ATTENTION - a similar logic to choose the icon and its color is implemented in App.tsx
  const mainColor = status.appIsFullyOperative
    ? theme.palette.success.main
    : theme.palette.error.main;
  const IconComponent = status.appIsFullyOperative ? CheckCircleIcon : ErrorIcon;

  return (
    <Stack
      component="div"
      data-testid="app-status-bar"
      id="appStatusBar"
      direction={isMobile ? 'column' : 'row'}
      justifyContent="center"
      alignItems="center"
      sx={(theme) => ({
        mt: isMobile ? '23px' : '42px',
        py: '21px',
        px: '35px',
        width: '100%',
        backgroundColor: alpha(mainColor, theme.palette.action.hoverOpacity),
        borderColor: mainColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '10px',
      })}
    >
      <IconComponent
        sx={{
          width: '20px',
          mr: isMobile ? 0 : '20px',
          mb: isMobile ? '12px' : 0,
          color: mainColor,
        }}
      />
      <Typography variant="body2">{statusText}</Typography>
    </Stack>
  );
};
