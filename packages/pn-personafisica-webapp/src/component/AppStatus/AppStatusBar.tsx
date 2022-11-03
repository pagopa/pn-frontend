import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { useTranslation } from "react-i18next";
import { AppCurrentStatus } from "../../models/appStatus";

export const AppStatusBar = ({ status }: { status: AppCurrentStatus }) => {
    const { t } = useTranslation(['appStatus']);
    const theme = useTheme();
    const isMobile = useIsMobile();
  
    const mainColor = status.appIsFullyOperative ? theme.palette.success.main : theme.palette.error.main;
    const statusText = t(`appStatus.statusDescription.${status.appIsFullyOperative ? "ok" : "not-ok"}`);
    const IconComponent = status.appIsFullyOperative ? CheckCircleIcon : ErrorIcon;
  
    return (
      <Stack component="div" direction={isMobile ? "column" : "row"} justifyContent='center' alignItems="center" sx={(theme) => ({
        mt: isMobile ? '23px' : '42px', py: '21px', px: '35px', width: '100%',
        backgroundColor: alpha(mainColor, theme.palette.action.hoverOpacity),
        borderColor: mainColor, borderWidth: '1px', borderStyle: 'solid', borderRadius: "10px",
      })}>
        <IconComponent sx={{ width: "20px", mr: isMobile ? 0 : "20px", mb: isMobile ? "12px" : 0, color: mainColor }} />
        <Typography variant='body2'>
          {statusText}
        </Typography>
      </Stack>
    );
  };
  
  
  