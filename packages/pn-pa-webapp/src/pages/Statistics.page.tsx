import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import DownloadIcon from '@mui/icons-material/Download';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CustomTooltip,
  TitleBox,
  formatDate,
  formatToSlicedISOString,
  getDateFromString,
  oneYearAgo,
  screenshot,
  today,
  twelveMonthsAgo,
} from '@pagopa-pn/pn-commons';

import DeliveryModeStatistics from '../components/Statistics/DeliveryModeStatistics';
import DigitalErrorsDetailStatistics from '../components/Statistics/DigitalErrorsDetailStatistics';
import DigitalMeanTimeStatistics from '../components/Statistics/DigitalMeanTimeStatistics';
import DigitalStateStatistics from '../components/Statistics/DigitalStateStatistics';
import EmptyStatistics from '../components/Statistics/EmptyStatistics';
import FiledNotificationsStatistics from '../components/Statistics/FiledNotificationsStatistics';
import FilterStatistics from '../components/Statistics/FilterStatistics';
import LastStateStatistics from '../components/Statistics/LastStateStatistics';
import { CxType, GraphColors, StatisticsDataTypes, StatisticsFilter } from '../models/Statistics';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { STATISTICS_ACTIONS, getStatistics } from '../redux/statistics/actions';
import { hasData } from '../redux/statistics/reducers';
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

const Statistics = () => {
  const exportJpgNode = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['statistics']);
  const statisticsData = useAppSelector((state: RootState) => state.statisticsState.statistics);
  const statisticsFilter = useAppSelector((state: RootState) => state.statisticsState.filter);
  const hasStatisticsData = useAppSelector(hasData);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.user?.organization
  );

  const getFilterDates = (filter: StatisticsFilter | null) =>
    filter
      ? [filter.startDate, filter.endDate]
      : [twelveMonthsAgo, statisticsData?.lastDate ?? today];

  const [startDate, endDate] = getFilterDates(statisticsFilter);

  const cxId = loggedUserOrganizationParty.id;

  const getLastUpdateText = (): string => {
    if (statisticsData) {
      const dateTime = formatDate(statisticsData?.lastDate ?? '', false);
      return t('last_update', { dateTime });
    }
    return '';
  };

  const Subtitle = (
    <Stack direction={'row'} display="flex" justifyContent="space-between" alignItems="center">
      <Typography>{t('subtitle', { organization: loggedUserOrganizationParty?.name })}</Typography>
      <Button
        onClick={() => handleDownloadJpeg(exportJpgNode.current)}
        variant="outlined"
        endIcon={<DownloadIcon />}
        sx={{ whiteSpace: 'nowrap' }}
        data-testid="exportJpgButton"
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

  if (!statisticsData?.lastDate) {
    return null;
  }

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
              {getLastUpdateText()}
            </Typography>
            <Box ref={exportJpgNode}>
              <Typography variant="h6" component="h5" mt={7}>
                {t('section_1')}
              </Typography>

              <Box display="flex" alignItems="center">
                <Typography>{t('subtitle_section_1')}</Typography>
                <CustomTooltip
                  openOnClick
                  tooltipContent={t('tooltip_section_1')}
                  sx={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '10px' }}
                >
                  <IconButton>
                    <InfoOutlinedIcon color="action" fontSize="small" />
                  </IconButton>
                </CustomTooltip>
              </Box>

              <FilterStatistics
                filter={statisticsFilter}
                sx={{ mb: 2 }}
                lastDate={getDateFromString(statisticsData.lastDate, 'yyyy-MM-dd')}
              />
              {!hasStatisticsData ? (
                <Paper sx={{ p: 3, mb: 3, height: '100%', mt: 3 }} elevation={0}>
                  <EmptyStatistics />
                </Paper>
              ) : (
                <>
                  <FiledNotificationsStatistics
                    startDate={statisticsData.startDate ?? formatToSlicedISOString(oneYearAgo)}
                    endDate={statisticsData.endDate ?? formatToSlicedISOString(today)}
                    data={statisticsData.data[StatisticsDataTypes.FiledStatistics]}
                  />
                  <Grid container mt={3}>
                    <Grid item sm={12} lg={6} pr={{ sm: 0, lg: 1.5 }} pb={{ xs: 1.5, lg: 0 }}>
                      <LastStateStatistics
                        data={statisticsData.data[StatisticsDataTypes.LastStateStatistics]}
                        sx={{ height: '100%' }}
                      />
                    </Grid>
                    <Grid item sm={12} lg={6} pl={{ sm: 0, lg: 1.5 }} pt={{ xs: 1.5, lg: 0 }}>
                      <DeliveryModeStatistics
                        startDate={statisticsData.startDate ?? formatToSlicedISOString(oneYearAgo)}
                        endDate={statisticsData.endDate ?? formatToSlicedISOString(today)}
                        data={statisticsData.data[StatisticsDataTypes.DeliveryModeStatistics]}
                        sx={{ height: '100%' }}
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6" component="h5" mt={9}>
                    {t('section_2')}
                  </Typography>
                  <FilterStatistics
                    className="filter"
                    filter={statisticsFilter}
                    lastDate={getDateFromString(statisticsData.lastDate, 'yyyy-MM-dd')}
                  />
                  <Grid container my={3}>
                    <Grid item sm={12} lg={6} pr={{ xs: 0, lg: 1.5 }} pb={{ xs: 1.5, lg: 0 }}>
                      <DigitalStateStatistics
                        data={statisticsData.data[StatisticsDataTypes.DigitalStateStatistics]}
                        sx={{ height: '100%' }}
                      />
                    </Grid>
                    <Grid item sm={12} lg={6} pl={{ xs: 0, lg: 1.5 }} pt={{ xs: 1.5, lg: 0 }}>
                      <DigitalMeanTimeStatistics
                        data={statisticsData.data[StatisticsDataTypes.DigitalMeanTimeStatistics]}
                        sx={{ height: '100%' }}
                      />
                    </Grid>
                  </Grid>
                  <DigitalErrorsDetailStatistics
                    data={statisticsData.data[StatisticsDataTypes.DigitalErrorsDetailStatistics]}
                  />
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <TitleBox title={t('title')} variantTitle="h4" subTitle={''} variantSubTitle="body1" />
            <Paper sx={{ p: 3, mb: 3, height: '100%', mt: 5 }} elevation={0}>
              <EmptyStatistics description="empty.not_enough_data" />
            </Paper>
          </>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default Statistics;
