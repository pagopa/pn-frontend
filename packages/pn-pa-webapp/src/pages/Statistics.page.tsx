import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Download } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

import FiledNotificationsStatistics from '../components/Statistics/FiledNotificationsStatistics';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getStatistics } from '../redux/statistics/actions';
import { RootState } from '../redux/store';

const Statistics = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['statistics']);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.user?.organization
  );

  const startDate = new Date('2024-01-01T00:00:00');
  const endDate = new Date('2024-04-01T00:00:00');
  const cxType = 'PA';
  const cxId = '1c93d069-82c3-4903-a1ae-670353d9ad4d'; // loggedUserOrganizationParty.id;

  const Subtitle = (
    <Grid item display="flex" flexDirection="row">
      <Typography>{t('subtitle', { organization: loggedUserOrganizationParty?.name })}</Typography>
      <Button variant="outlined" endIcon={<Download />} sx={{ whiteSpace: 'nowrap' }}>
        {t('export_all')}
      </Button>
    </Grid>
  );

  const fetchStatistics = useCallback(() => {
    const params = {
      startDate,
      endDate,
      cxType,
      cxId,
    };

    void dispatch(getStatistics(params));
  }, [startDate, endDate, cxId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <Box p={3}>
      <TitleBox title={t('title')} variantTitle="h4" subTitle={Subtitle} variantSubTitle="body1" />
      <FiledNotificationsStatistics />
      {/* <NotificationsEndStateStatistics />
      <NotificationsBySendTypeStatistics />
      <MeanTimeBySendTypeStatistics />
      <DigitalNotificationsTrendStatistics /> */}
    </Box>
  );
};

export default Statistics;
