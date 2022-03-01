import { Typography } from '@mui/material';
import { useEffect } from 'react';
import FilterNotificationsTable from '../component/notification/FilterNotificationsTable';
import NotificationsTable from '../component/notification/NotificactionsTable';
import StatusTooltip from '../component/notification/StatusTooltip';
import { Column, Row, Sort } from '../component/notification/types';
import { getSentNotifications, setSorting } from '../redux/dashboard/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getNotificationStatusLabelAndColor } from '../utils/status.utility';

const Notifiche = () => {
  const notifications = useAppSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const sort = useAppSelector((state: RootState) => state.dashboardState.sort);

  const columns: Array<Column> = [
    {
      id: 'sentDate',
      label: 'Data',
      width: '11%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'senderId',
      label: 'Mittente',
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      width: '18%',
      align: 'center',
      sortable: true,
      getCellLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusLabelAndColor(
          value as NotificationStatus
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  const rows: Array<Row> = notifications.map((n, i) => ({
    ...n,
    id: n.paNotificationId + i.toString(),
  }));

  const dispatch = useAppDispatch();
  
  const handleChangeSorting = (s: Sort) => {
    dispatch(setSorting(s));
  };

  useEffect(() => {
    // assign the ref's current value to the pagination Hook
    const params = {
      ...filters,
    };
    void dispatch(getSentNotifications(params));
  }, [filters, sort]);

  return (
    <div>
      <Typography variant={'h4'}>Le tue notifiche</Typography>
      <FilterNotificationsTable />
      <NotificationsTable
        columns={columns}
        rows={rows}
        sort={sort}
        onChangeSorting={handleChangeSorting}
      />
    </div>
  );
};

export default Notifiche;
