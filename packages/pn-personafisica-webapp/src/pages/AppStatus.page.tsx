import { Box, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { TitleBox } from '@pagopa-pn/pn-commons';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppCurrentStatus } from '../models/appStatus';
import { getCurrentStatus } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const StatusBar = ({ status }: { status: AppCurrentStatus }) => {
  const { t } = useTranslation(['appStatus']);
  const theme = useTheme();
  const mainColor = status.appIsFullyOperative ? theme.palette.success.main : theme.palette.error.main;
  const statusText = t(`appStatus.statusDescription.${status.appIsFullyOperative ? "ok" : "not-ok"}`);
  const IconComponent = status.appIsFullyOperative ? CheckCircleIcon : ErrorIcon;
  return (
    <Stack component="div" direction="row" justifyContent='center' alignItems="center" sx={ (theme) => ({
      mt: '48px', py: '21px', width: '100%',
      backgroundColor: alpha(mainColor, theme.palette.action.hoverOpacity), 
      borderColor: mainColor, borderWidth: '1px', borderStyle: 'solid', borderRadius: "10px",
    })}>
      <IconComponent sx={{width: "20px", mr: "20px", color: mainColor}}/>
      <Typography variant='body2'>
        {statusText}
      </Typography>
    </Stack>
  );
};


/* eslint-disable-next-line arrow-body-style */
const AppStatus = () => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const { t } = useTranslation(['appStatus']);

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentStatus());
  }, []);

  useEffect(() => {
    fetchCurrentStatus();
  }, [fetchCurrentStatus]);

  return <Box p={3}>
    <TitleBox 
      title={t('appStatus.title')} variantTitle='h4'
      subTitle={t('appStatus.subtitle')} variantSubTitle='body1'
    />
    { currentStatus && <StatusBar status={currentStatus} />}
  </Box>;
};

export default AppStatus;
