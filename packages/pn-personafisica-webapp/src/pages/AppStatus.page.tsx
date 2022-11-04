import { Box, Stack, Typography, useTheme } from '@mui/material';
import { EmptyState, formatDate, formatTimeHHMM, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppStatusBar } from '../component/AppStatus/AppStatusBar';
import { DesktopDowntimeLog } from '../component/AppStatus/DesktopDowntimeLog';
import { MobileDowntimeLog } from '../component/AppStatus/MobileDowntimeLog';
import { KnownFunctionality } from '../models/appStatus';
import { getCurrentAppStatus, getDowntimeLogPage } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';


/* eslint-disable-next-line arrow-body-style */
const AppStatus = () => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const downtimeLog = useAppSelector((state: RootState) => state.appStatus.downtimeLogPage);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['appStatus']);

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentAppStatus());
  }, []);

  const fetchDowntimeLog = useCallback(() => {
    void dispatch(getDowntimeLogPage({ 
      startDate: "1900-01-01T00:00:00Z",
      functionality: [KnownFunctionality.NotificationCreate, KnownFunctionality.NotificationVisualization, KnownFunctionality.NotificationWorkflow],
    }));
  }, []);

  useEffect(() => {
    fetchCurrentStatus();
    fetchDowntimeLog();
  }, [fetchCurrentStatus, fetchDowntimeLog]);

  return <Box p={3}>
    <Stack direction="column">
      <TitleBox
        title={t('appStatus.title')} variantTitle='h4'
        subTitle={t('appStatus.subtitle')} variantSubTitle='body1'
      />

      {currentStatus && <AppStatusBar status={currentStatus} />}

      { currentStatus &&
        <Stack direction="row" justifyContent="center">
          <Typography variant="caption" sx={{ mt: 2, color: theme.palette.text.secondary }}>
            { t('appStatus.lastCheckLegend', 
              { lastCheckTimestamp: `${formatDate(currentStatus.lastCheckTimestamp)}, ore ${formatTimeHHMM(currentStatus.lastCheckTimestamp)}`})
            }
          </Typography>
        </Stack>
      }

      <Typography variant="h6" sx={{ mt: "36px", mb: 2 }}>{t('downtimeList.title')}</Typography>

      { downtimeLog && 
        (downtimeLog.downtimes.length > 0) 
          ? (isMobile 
              ? <Box sx={{ mt: 2 }}><MobileDowntimeLog downtimeLog={downtimeLog} /></Box>
              : <DesktopDowntimeLog downtimeLog={downtimeLog} />
            )
          : <EmptyState disableSentimentDissatisfied enableSentimentSatisfied emptyMessage={t('downtimeList.emptyMessage')} />      
      }
    </Stack>
  </Box>;
};

export default AppStatus;
