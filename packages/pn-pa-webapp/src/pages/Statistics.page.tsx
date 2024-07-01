import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  TitleBox,
  formatDate,
  formatDateTime,
  formatToSlicedISOString,
  oneYearAgo,
  screenshot,
  today,
} from '@pagopa-pn/pn-commons';

import DeliveryModeStatistics from '../components/Statistics/DeliveryModeStatistics';
import DigitalErrorsDetailStatistics from '../components/Statistics/DigitalErrorsDetailStatistics';
import DigitalMeanTimeStatistics from '../components/Statistics/DigitalMeanTimeStatistics';
import DigitalStateStatistics from '../components/Statistics/DigitalStateStatistics';
import EmptyStatistics from '../components/Statistics/EmptyStatistics';
import FiledNotificationsStatistics from '../components/Statistics/FiledNotificationsStatistics';
import FilterStatistics, {
  defaultValues as filterDefaultValues,
} from '../components/Statistics/FilterStatistics';
import LastStateStatistics from '../components/Statistics/LastStateStatistics';
import { CxType, GraphColors, StatisticsDataTypes, StatisticsFilter } from '../models/Statistics';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { STATISTICS_ACTIONS, getStatistics } from '../redux/statistics/actions';
import { RootState } from '../redux/store';

const cxType = CxType.PA;

const filter = (node: HTMLElement) => {
  const exclusionClasses = ['filter'];
  return !exclusionClasses.some((classname) => node.classList?.contains(classname));
};

const handleDownloadJpeg = (elem: HTMLDivElement | null) => {
  if (!elem) {
    return;
  }
  screenshot
    .toJpeg(elem, {
      quality: 0.95,
      backgroundColor: GraphColors.lightGrey,
      filter,
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      // eslint-disable-next-line functional/immutable-data
      link.download = `statistiche-${formatDate(formatToSlicedISOString(today), false, '-')}.jpeg`;
      // eslint-disable-next-line functional/immutable-data
      link.href = dataUrl;
      link.click();
    })
    .catch(() => {});
};

const getFilterDates = (filter: StatisticsFilter | null) =>
  filter
    ? [filter.startDate, filter.endDate]
    : [filterDefaultValues.startDate, filterDefaultValues.endDate];

const Statistics = () => {
  const exportJpgNode = useRef<HTMLDivElement>(null);
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
      const dateTime = formatDateTime(statisticsData?.genTimestamp.substring(0, 19) + 'Z');
      return t('last_update', { dateTime });
    }
    return '';
  };

  const lastUpdateTxt = getLastUpdateText();

  const Subtitle = (
    <Stack direction={'row'} display="flex" justifyContent="space-between" alignItems="center">
      <Typography>{t('subtitle', { organization: loggedUserOrganizationParty?.name })}</Typography>
      <Button
        onClick={() => handleDownloadJpeg(exportJpgNode.current)}
        variant="outlined"
        endIcon={<DownloadIcon />}
        sx={{ whiteSpace: 'nowrap' }}
      >
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
      <ApiErrorWrapper
        apiId={STATISTICS_ACTIONS.GET_STATISTICS}
        reloadAction={() => fetchStatistics()}
        mainText={t('error-fetch')}
        mt={3}
      >
        {statisticsData ? (
          <>
            <TitleBox
              title={t('title')}
              variantTitle="h4"
              subTitle={Subtitle}
              variantSubTitle="subtitle1"
            />
            <Typography variant="caption" sx={{ color: GraphColors.greyBlue }}>
              {lastUpdateTxt}
            </Typography>
            <Box ref={exportJpgNode}>
              <Typography variant="h6" component="h5" mt={7}>
                {t('section_1')}
              </Typography>
              <FilterStatistics filter={statisticsFilter} />
              <Stack direction={'column'} spacing={3} pt={2}>
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
                <Typography variant="h6" component="h5" mt={6}>
                  {t('section_2')}
                </Typography>
                <FilterStatistics className="filter" filter={statisticsFilter} />
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
            </Box>
          </>
        ) : (
          <>
            <TitleBox title={t('title')} variantTitle="h4" subTitle={''} variantSubTitle="body1" />
            <Paper sx={{ p: 3, mb: 3, height: '100%', mt: 5 }} elevation={0}>
              <EmptyStatistics />
            </Paper>
          </>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default Statistics;
