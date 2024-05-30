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
import FiledNotificationsStatistics from '../components/Statistics/FiledNotificationsStatistics';
import FilterStatistics from '../components/Statistics/FilterStatistics';
import LastStateStatistics from '../components/Statistics/LastStateStatistics';
import { StatisticsDataTypes, StatisticsFilter } from '../models/Statistics';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getStatistics } from '../redux/statistics/actions';
import { RootState } from '../redux/store';

const cxType = 'PA';

const getFilterDates = (filter: StatisticsFilter | null) =>
  filter
    ? [filter.startDate, filter.endDate]
    : [formatToSlicedISOString(oneYearAgo), formatToSlicedISOString(today)];

const Statistics = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['statistics']);
  const statisticsData = useAppSelector((state: RootState) => state.statisticsState.statistics);
  const statisticsFilter = useAppSelector((state: RootState) => state.statisticsState.filter);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.user?.organization
  );

  const [startDate, endDate] = getFilterDates(statisticsFilter);

  const cxId = loggedUserOrganizationParty.id;

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
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
      <Typography variant="caption">{lastUpdateTxt}</Typography>
      <Typography variant="h6" component="h5" mt={8}>
        Panoramica
      </Typography>
      <Stack direction={'row'} display="flex" justifyContent="space-between" alignItems="center">
        <Box></Box>
        <Box>
          <FilterStatistics filter={statisticsFilter} />
        </Box>
        <Box></Box>
      </Stack>
      {statisticsData && (
        <Stack direction={'column'} spacing={4} mt={4}>
          <FiledNotificationsStatistics
            startDate={statisticsData?.startDate || formatToSlicedISOString(oneYearAgo)}
            endDate={statisticsData?.endDate || formatToSlicedISOString(today)}
            data={statisticsData?.data[StatisticsDataTypes.FiledStatistics]}
          />
          <Stack direction={{ lg: 'row', xs: 'column' }} spacing={4} mt={4}>
            <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
              <LastStateStatistics
                data={statisticsData?.data[StatisticsDataTypes.LastStateStatistics]}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
              <DeliveryModeStatistics
                startDate={statisticsData?.startDate || formatToSlicedISOString(oneYearAgo)}
                endDate={statisticsData?.endDate || formatToSlicedISOString(today)}
                data={statisticsData?.data[StatisticsDataTypes.DeliveryModeStatistics]}
              />
            </Box>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default Statistics;
