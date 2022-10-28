import { Box, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Column, Item, ItemsTable, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppCurrentStatus, DowntimeLogPage, KnownFunctionality } from '../models/appStatus';
import { getCurrentStatus, getDowntimeLogPage } from '../redux/appStatus/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';


const StatusBar = ({ status }: { status: AppCurrentStatus }) => {
  const { t } = useTranslation(['appStatus']);
  const theme = useTheme();
  const mainColor = status.appIsFullyOperative ? theme.palette.success.main : theme.palette.error.main;
  const statusText = t(`appStatus.statusDescription.${status.appIsFullyOperative ? "ok" : "not-ok"}`);
  const IconComponent = status.appIsFullyOperative ? CheckCircleIcon : ErrorIcon;
  return (
    <Stack component="div" direction="row" justifyContent='center' alignItems="center" sx={(theme) => ({
      mt: '42px', py: '21px', width: '100%',
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


type DowntimeLogColumn =
  | 'startDate'
  | 'endDate'
  | 'functionality'
  | 'legalFactId'
  | 'status'
  | '';

const DesktopDowntimeLog = ({ downtimeLog }: { downtimeLog?: DowntimeLogPage }) => {
  const { t } = useTranslation(['appStatus']);
  const columns: Array<Column<DowntimeLogColumn>> = [
    {
      id: 'startDate',
      label: t('downtimeList.columnHeader.startDate'),
      width: '15%',
      sortable: false, 
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'endDate',
      label: t('downtimeList.columnHeader.endDate'),
      width: '15%',
      sortable: false, 
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'functionality',
      label: t('downtimeList.columnHeader.functionality'),
      width: '30%',
      sortable: false, 
      getCellLabel(_: string, i: Item) {
        return i.rawFunctionality;
      },
    },
    {
      id: 'legalFactId',
      label: t('downtimeList.columnHeader.legalFactId'),
      width: '30%',
      sortable: false, 
      getCellLabel() {
        return "L'attestazione sarà disponibile al termine del disservizio";
      },
      // onClick(row: Item) {
      //   handleRowClick(row);
      // },
    },
    {
      id: 'status',
      label: t('downtimeList.columnHeader.status'),
      width: '15%',
      align: 'center',
      sortable: false, 
      getCellLabel(value: string) {
        return value;
      },
      // getCellLabel(_: string, row: Item) {
      //   const { label, tooltip, color } = getNotificationStatusInfos(
      //     row.notificationStatus as NotificationStatus
      //   );
      //   return <StatusTooltip label={label} tooltip={tooltip} color={color} eventTrackingCallback={handleEventTrackingTooltip}></StatusTooltip>;
      // },
    },
  ];

  const rows: Array<Item> | undefined = downtimeLog?.downtimes.map((n, i) => ({
    ...n,
    fileAvailable: n.fileAvailable ? "true" : "false",
    id: n.startDate + i.toString(),
  }));

  return (downtimeLog && rows && downtimeLog.downtimes.length > 0) 
    ? <ItemsTable rows={rows} columns={columns} /> 
    : <div>Non trovo downtime</div>
  ;
};


const MobileDowntimeLog = () => <div>Go mobile go</div>;


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

      { downtimeLog && (isMobile ? <MobileDowntimeLog/> : <DesktopDowntimeLog downtimeLog={downtimeLog}/>) }
    </Stack>
  </Box>;
};

export default AppStatus;
