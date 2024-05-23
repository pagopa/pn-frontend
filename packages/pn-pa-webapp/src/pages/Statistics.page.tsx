import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Download } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import {
  TitleBox,
  formatDateTime,
  formatToSlicedISOString,
  oneYearAgo,
  today,
} from '@pagopa-pn/pn-commons';

import DeliveryModeStatistics from '../components/Statistics/DeliveryModeStatistics';
import DigitalErrorsDetailStatistics from '../components/Statistics/DigitalErrorsDetailStatistics';
import DigitalMeanTimeStatistics from '../components/Statistics/DigitalMeanTimeStatistics';
import DigitalStateStatistics from '../components/Statistics/DigitalStateStatistics';
import EmptyStatistics from '../components/Statistics/EmptyStatistics';
import FiledNotificationsStatistics from '../components/Statistics/FiledNotificationsStatistics';
import LastStateStatistics from '../components/Statistics/LastStateStatistics';
import { StatisticsDataTypes } from '../models/Statistics';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getStatistics } from '../redux/statistics/actions';
import { RootState } from '../redux/store';

const startDate = new Date('2024-01-01T00:00:00');
const endDate = new Date('2024-04-01T00:00:00');
const cxType = 'PA';
const cxId = '1c93d069-82c3-4903-a1ae-670353d9ad4d'; // loggedUserOrganizationParty.id;

const Statistics = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['statistics']);
  const statisticsData = useAppSelector((state: RootState) => state.statisticsState.statistics);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.user?.organization
  );

  const getLastUpdateText = (): string => {
    if (statisticsData) {
      const dateTime = formatDateTime(statisticsData?.genTimestamp.substring(0, 25) + 'Z');
      return t('last_update', { dateTime });
    }
    return '';
  };

  const lastUpdateTxt = getLastUpdateText();

  const Subtitle = (
    <Stack direction={'row'} display="flex" justifyContent="space-between" alignItems="center">
      <Typography>{t('subtitle', { organization: loggedUserOrganizationParty?.name })}</Typography>
      <Button variant="outlined" endIcon={<Download />} sx={{ whiteSpace: 'nowrap' }}>
        {t('export_all')}
      </Button>
    </Stack>
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
      {statisticsData ? (
        <>
          <TitleBox
            title={t('title')}
            variantTitle="h4"
            subTitle={Subtitle}
            variantSubTitle="subtitle1"
          />
          <Typography variant="caption" sx={{ color: '#5C6F82' }}>
            {lastUpdateTxt}
          </Typography>
          <Typography variant="h6" component="h5" mt={9}>
            {t('section_1')}
          </Typography>
          <Box sx={{ textAlign: 'center' }} mt={5}>
            Componente per il filtraggio
          </Box>
          <Stack direction={'column'} spacing={3} mt={4}>
            <FiledNotificationsStatistics
              startDate={statisticsData.startDate ?? formatToSlicedISOString(oneYearAgo)}
              endDate={statisticsData.endDate ?? formatToSlicedISOString(today)}
              data={statisticsData.data[StatisticsDataTypes.FiledStatistics]}
            />
            <Stack direction={{ lg: 'row', xs: 'column' }} spacing={3} mt={4}>
              <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                <LastStateStatistics
                  data={statisticsData.data[StatisticsDataTypes.LastStateStatistics]}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                <DeliveryModeStatistics
                  startDate={statisticsData.startDate ?? formatToSlicedISOString(oneYearAgo)}
                  endDate={statisticsData.endDate ?? formatToSlicedISOString(today)}
                  data={statisticsData.data[StatisticsDataTypes.DeliveryModeStatistics]}
                />
              </Box>
            </Stack>
            <Box>
              <Typography variant="h6" component="h5" mt={6}>
                {t('section_2')}
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 1 }}>Componente per il filtraggio</Box>
            </Box>
            <Stack direction={{ lg: 'row', xs: 'column' }} spacing={3} mt={4}>
              <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                <DigitalStateStatistics
                  data={statisticsData.data[StatisticsDataTypes.DigitalStateStatistics]}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
                <DigitalMeanTimeStatistics
                  data={statisticsData.data[StatisticsDataTypes.DigitalMeanTimeStatistics]}
                />
              </Box>
            </Stack>
            <DigitalErrorsDetailStatistics
              data={statisticsData.data[StatisticsDataTypes.DigitalErrorsDetailStatistics]}
            />
          </Stack>
        </>
      ) : (
        <>
          <TitleBox title={t('title')} variantTitle="h4" subTitle={''} variantSubTitle="body1" />
          <EmptyStatistics sx={{ mt: 5 }} />
        </>
      )}
    </Box>
  );
};

export default Statistics;
