import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { RootState } from '../redux/store';
import { getSentNotifications } from '../redux/dashboard/actions';
import { NotificationStatus } from '../redux/dashboard/types';
import NotificationsTable from './components/NotificationsTable/NotificactionsTable';
import { Column, Row } from './components/NotificationsTable/types';

// TODO: aggiungere i colori del tema
function getNotificationStatusLabelAndColor(status: NotificationStatus): {color: string; label: string; tooltip: string} {
  switch(status) {
    case NotificationStatus.DELIVERED:
      return {color: 'warning.states.outlined.restingBorder', label: 'Consegnata', tooltip: 'Consegnata: Il destinatario ha ricevuto la notifica'};
    case NotificationStatus.DELIVERING:
      return {color: 'warning.states.outlined.restingBorder', label: 'In inoltro', tooltip: 'In inoltro: L\'invio della notifica è in corso'};
    case NotificationStatus.UNREACHABLE:
      return {color: 'warning.states.outlined.restingBorder', label: 'Destinatario irreperibile totale', tooltip: 'Destinatario irreperibile totale: Il destinatario non risulta reperibile'};
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

// TODO: utilizzare colori tema
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({ // { theme }
  [`& .${tooltipClasses.arrow}`]: {
    color: '#455B71',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#455B71'
  },
  [`& .${tooltipClasses.tooltip} .title`]: {
    textAlign: 'center'
  }
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.dashboardState.notifications);

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
      const [title, body] = tooltip.split(':');
      const tooltipContent = 
        <div>
          <div className="title">{title.trim().toUpperCase()}</div>
          <div>{body.trim()}</div>
        </div>;
      return (
        <BootstrapTooltip  
          title={tooltipContent}
          arrow
          placement="bottom"
        >
          <Chip label={label} />
        </BootstrapTooltip >
      );
    } }
  ];

  const rows: Array<Row> = notifications.map(n => ({
    ...n,
    id: n.paNotificationId
  }));
  
  useEffect(() => {
    dispatch(getSentNotifications({ startDate: '2022-01-01T00:00:00.000Z', endDate: '2022-12-31T00:00:00.000Z' }));
  }, []);

  // TODO: Remove extra style and extra div
  return (
    <div style={{padding: '20px', width: '100%', backgroundColor: '#F2F2F2'}}>
      <Fragment>
        {notifications && <NotificationsTable columns={columns} rows={rows}/>}
      </Fragment>
    </div>
  );
};

export default Dashboard;
