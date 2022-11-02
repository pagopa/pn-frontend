import { Box, Stack, Typography, Chip, Button, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import { CardElement, Column, EmptyState, formatDate, formatTimeHHMM, Item, ItemsCard, ItemsTable, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppCurrentStatus, DowntimeLogPage, DowntimeStatus, KnownFunctionality } from '../models/appStatus';
import { getCurrentStatus, getDowntimeLegalFactDocumentDetails, getDowntimeLogPage } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { clearLegalFactDocumentData } from '../redux/appStatus/reducers';


const StatusBar = ({ status }: { status: AppCurrentStatus }) => {
  const { t } = useTranslation(['appStatus']);
  const theme = useTheme();
  const mainColor = status.appIsFullyOperative ? theme.palette.success.main : theme.palette.error.main;
  const statusText = t(`appStatus.statusDescription.${status.appIsFullyOperative ? "ok" : "not-ok"}`);
  const IconComponent = status.appIsFullyOperative ? CheckCircleIcon : ErrorIcon;
  return (
    <Stack component="div" direction="row" justifyContent='center' alignItems="center" sx={(theme) => ({
      mt: '42px', py: '21px', px: '35px', width: '100%',
      backgroundColor: alpha(mainColor, theme.palette.action.hoverOpacity),
      borderColor: mainColor, borderWidth: '1px', borderStyle: 'solid', borderRadius: "10px",
    })}>
      <IconComponent sx={{ width: "20px", mr: "20px", color: mainColor }} />
      <Typography variant='body2'>
        {statusText}
      </Typography>
    </Stack>
  );
};



function downloadDocument(url: string) {
  /* eslint-disable functional/immutable-data */
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.click();
  /* eslint-enable functional/immutable-data */
};


type DowntimeLogColumn =
  | 'startDate'
  | 'endDate'
  | 'functionality'
  | 'legalFactId'
  | 'status'
  | '';

function booleanStringToBoolean(booleanString: string): boolean {
  return booleanString.toLowerCase() === "true";
}

/* eslint-disable-next-line arrow-body-style */
const DateAndTimeInTwoLines = ({ date }: { date: string }) => {
  console.log('in DateAndTimeInTwoLines per questo date');
  console.log(date);

  return date ? 
    <Stack direction="column">
      <Typography variant="body2">{formatDate(date)},</Typography>
      <Typography variant="body2">ore {formatTimeHHMM(date)}</Typography>
    </Stack> 
  : <Typography variant="body2">-</Typography>;
};


const DesktopDowntimeLog = ({ downtimeLog }: { downtimeLog?: DowntimeLogPage }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['appStatus']);
  const theme = useTheme();
  const legalFactDocumentDetails = useAppSelector((state: RootState) => state.appStatus.legalFactDocumentData);

  useEffect(() => {
    if (legalFactDocumentDetails && legalFactDocumentDetails.url) {
      downloadDocument(legalFactDocumentDetails.url);
      dispatch(clearLegalFactDocumentData());
    }
  }, [legalFactDocumentDetails]);

  const columns: Array<Column<DowntimeLogColumn>> = [
    {
      id: 'startDate',
      label: t('downtimeList.columnHeader.startDate'),
      width: '15%',
      sortable: false, 
      getCellLabel(value: string) {
        return <DateAndTimeInTwoLines date={value} />;
      },
    },
    {
      id: 'endDate',
      label: t('downtimeList.columnHeader.endDate'),
      width: '15%',
      sortable: false, 
      getCellLabel(value: string) {
        return <DateAndTimeInTwoLines date={value} />;
      },
    },
    {
      id: 'functionality',
      label: t('downtimeList.columnHeader.functionality'),
      width: '30%',
      sortable: false, 
      getCellLabel(_: string, i: Item) {
        return i.knownFunctionality 
          ? t(`legends.knownFunctionality.${i.knownFunctionality}`)
          : t('legends.unknownFunctionality', { functionality: i.rawFunctionality });
      },
    },
    {
      id: 'legalFactId',
      label: t('downtimeList.columnHeader.legalFactId'),
      width: '30%',
      sortable: false, 
      getCellLabel(_: string, i: Item) {
        if (booleanStringToBoolean(i.fileAvailable as string)) {
          return <Button
            sx={{ px: 0 }}
            startIcon={<DownloadIcon />}
            onClick={() => { void dispatch(getDowntimeLegalFactDocumentDetails(i.legalFactId as string)); } }
          >
            {t("legends.legalFactDownload")}
          </Button>;
        } else {
          return <Typography variant="body2" sx={{ color: theme.palette.text.secondary, }}>
            {t(`legends.noFileAvailableByStatus.${i.status}`)}
          </Typography>;
        }
      },
    },
    {
      id: 'status',
      label: t('downtimeList.columnHeader.status'),
      width: '15%',
      align: 'center',
      sortable: false, 
      getCellLabel(value: string) {
        return <Chip 
          label={t(`legends.status.${value}`)}
          sx={{backgroundColor: value === DowntimeStatus.OK ? theme.palette.error.light : theme.palette.success.light}}
        />;
      },
    },
  ];

  const rows: Array<Item> | undefined = downtimeLog?.downtimes.map((n, i) => ({
    ...n,
    fileAvailable: n.fileAvailable ? "true" : "false",
    id: n.startDate + i.toString(),
  }));

  return (downtimeLog && rows && downtimeLog.downtimes.length > 0) 
    ? <ItemsTable rows={rows} columns={columns} /> 
    : <EmptyState disableSentimentDissatisfied enableSentimentSatisfied emptyMessage={t('downtimeList.emptyMessage')} />
  ;
};


const MobileDowntimeLog = ({ downtimeLog }: { downtimeLog?: DowntimeLogPage }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['appStatus']);
  const theme = useTheme();
  // const legalFactDocumentDetails = useAppSelector((state: RootState) => state.appStatus.legalFactDocumentData);

  const cardHeader: [CardElement, CardElement | null] = [
    {
      id: 'status',
      label: '',
      /* eslint-disable-next-line sonarjs/no-identical-functions */
      getLabel(value: string) {
        return <Chip 
          label={t(`legends.status.${value}`)}
          sx={{backgroundColor: value === DowntimeStatus.OK ? theme.palette.error.light : theme.palette.success.light}}
        />;
      },
    },
    null,
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'downtimeList.columnHeader.legalFactId',
      label: t('downtimeList.columnHeader.legalFactId'),
      /* eslint-disable-next-line sonarjs/no-identical-functions */
      getLabel(_: string, i: Item) {
        if (booleanStringToBoolean(i.fileAvailable as string)) {
          return <Button
            sx={{ px: 0 }}
            startIcon={<DownloadIcon />}
            onClick={() => { void dispatch(getDowntimeLegalFactDocumentDetails(i.legalFactId as string)); } }
          >
            {t("legends.legalFactDownload")}
          </Button>;
        } else {
          return <Typography variant="body2" sx={{ color: theme.palette.text.secondary, }}>
            {t(`legends.noFileAvailableByStatus.${i.status}`)}
          </Typography>;
        }
      },
    }
  ];

  /* eslint-disable-next-line sonarjs/no-identical-functions */
  const rows: Array<Item> | undefined = downtimeLog?.downtimes.map((n, i) => ({
    ...n,
    fileAvailable: n.fileAvailable ? "true" : "false",
    id: n.startDate + i.toString(),
  }));

  return rows 
    ? <ItemsCard
        cardHeader={cardHeader}
        cardBody={cardBody}
        cardData={rows}
        headerGridProps={{ justifyContent: "center" }}
      />
    : null;
};


/* eslint-disable-next-line arrow-body-style */
const AppStatus = () => {
  const dispatch = useAppDispatch();
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const downtimeLog = useAppSelector((state: RootState) => state.appStatus.downtimeLogPage);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['appStatus']);

  const fetchCurrentStatus = useCallback(() => {
    void dispatch(getCurrentStatus());
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

      {currentStatus && <StatusBar status={currentStatus} />}

      <Typography variant="h6" sx={{ mt: "36px" }}>{t('downtimeList.title')}</Typography>

      { downtimeLog && (isMobile ? <MobileDowntimeLog downtimeLog={downtimeLog}/> : <DesktopDowntimeLog downtimeLog={downtimeLog}/>) }
    </Stack>
  </Box>;
};

export default AppStatus;
