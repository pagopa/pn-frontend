import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomPagination, PaginationData } from '@pagopa-pn/pn-commons';

import { RootState } from '../redux/store';
import { getSentNotifications } from '../redux/dashboard/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import dashboardSlice from '../redux/dashboard/reducers';
import NotificationsTable from './components/Notifications/NotificactionsTable';
import FilterNotificationsTable from './components/Notifications/FilterNotificationsTable';
import { Column, Row } from './components/Notifications/types';
import StatusTooltip from './components/Notifications/StatusTooltip';

// TODO: aggiungere i colori del tema
function getNotificationStatusLabelAndColor(status: NotificationStatus): {color: string; label: string; tooltip: string} {
  switch(status) {
    case NotificationStatus.DELIVERED:
      return {color: 'warning.states.outlined.restingBorder', label: 'Consegnata', tooltip: 'Consegnata: Il destinatario ha ricevuto la notifica'};
    case NotificationStatus.DELIVERING:
      return {color: 'warning.states.outlined.restingBorder', label: 'In inoltro', tooltip: 'In inoltro: L\'invio della notifica è in corso'};
    case NotificationStatus.UNREACHABLE:
      return {color: 'warning.states.outlined.restingBorder', label: 'Destinatario irreperibile', tooltip: 'Destinatario irreperibile: Il destinatario non risulta reperibile'};
    case NotificationStatus.PAID:
      return {color: 'warning.states.outlined.restingBorder', label: 'Pagata', tooltip: 'Pagata: Il destinatario ha pagato la notifica'};
    case NotificationStatus.RECEIVED:
      return {color: 'warning.states.outlined.restingBorder', label: 'Depositata', tooltip: 'Depositata: L’ente ha depositato la notifica'};
    case NotificationStatus.EFFECTIVE_DATE:
      return {color: 'warning.states.outlined.restingBorder', label: 'Perfezionata per decorrenza termini', tooltip: 'Perfezionata per decorrenza termini: Il destinatario non ha letto la notifica'};
    case NotificationStatus.VIEWED:
      return {color: 'warning.states.outlined.restingBorder', label: 'Perfezionata per visione', tooltip: 'Perfezionata per visione: Il destinatario ha letto la notifica'};
    case NotificationStatus.CANCELED:
      return {color: 'warning.states.outlined.restingBorder', label: 'Annullata', tooltip: 'Annullata: L\'ente ha annullato l\'invio della notifica'};
  }
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);
  const filters = useSelector((state: RootState) => state.dashboardState.filters);
  const pagination = useSelector((state: RootState) => state.dashboardState.pagination);
  const elementsPerPage = [10, 20, 50, 100, 200, 500];

  const columns: Array<Column> = [
    { id: 'sentAt', label: 'Data', width: '11%', sortable: true, getCellLabel(value: string) { return value; }},
    { id: 'recipientId', label: 'Destinatario', width: '13%', sortable: true, getCellLabel(value: string) {
      return value.length > 3 ? value.substring(0, 3) + '...' : value;
    } },
    { id: 'subject', label: 'Oggetto', width: '23%', getCellLabel(value: string) {
      return value.length > 65 ? value.substring(0, 65) + '...' : value;
    } },
    { id: 'iun', label: 'Codice IUN', width: '20%', getCellLabel(value: string) { return value; } },
    { id: 'groups', label: 'Gruppi', width: '15%', getCellLabel(value: string) { return value; } },
    { id: 'notificationStatus', label: 'Stato', width: '18%', align: 'center', sortable: true, getCellLabel(value: string) {
      const {label, tooltip} = getNotificationStatusLabelAndColor(value as NotificationStatus);
      return <StatusTooltip label={label} tooltip={tooltip}></StatusTooltip>;
    } }
  ];

  // TODO: rimuovere + i quando da be non arriveranno notifiche con stesso id
  const rows: Array<Row> = notifications.map((n, i) => ({
    ...n,
    id: n.paNotificationId + i.toString()
  }));

  // Pagination handlers
  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(dashboardSlice.actions.setPagination(paginationData));
  };
  
  useEffect(() => {
    dispatch(getSentNotifications(filters));
  }, [filters, pagination]);

  // TODO: Remove extra style and extra div
  return (
    <div style={{ padding: '20px', width: '100%', backgroundColor: '#F2F2F2' }}>
      <Fragment>
        {notifications && (
          <div>
            <FilterNotificationsTable />
            <NotificationsTable columns={columns} rows={rows}/>
            <CustomPagination paginationData={{size: pagination.size, page: pagination.page, totalElements: pagination.totalElements}} elementsPerPage={elementsPerPage} onPageRequest={handleChangePage} />
          </div>
        )}
      </Fragment>
    </div>
  );
};

export default Dashboard;
