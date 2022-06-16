import { Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Tag, TagGroup } from '@pagopa/mui-italia';
import {
  Column,
  getNotificationStatusInfos,
  Item,
  ItemsTable,
  NotificationStatus,
  Sort,
  StatusTooltip,
  EmptyState,
  Notification
} from '@pagopa-pn/pn-commons';

import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import * as routes from '../../../navigation/routes.const';
import FilterNotificationsTable from './FilterNotificationsTable';

type Props = {
  notifications: Array<Notification>;
  /** The function to be invoked if the user resets filters */
  onCancelSearch: () => void;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
};

const DesktopNotifications = ({ notifications, onCancelSearch, sort, onChangeSorting, onManualSend, onApiKeys }: Props) => {
  const navigate = useNavigate();
  const filterNotificationsTableRef = useRef({ filtersApplied: false });

  const columns: Array<Column> = [
    {
      id: 'sentAt',
      label: 'Data',
      width: '11%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'recipients',
      label: 'Destinatario',
      width: '13%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: Array<string>) {
        return value.map((v) => (
          <Typography key={v} variant="body2">
            {v}
          </Typography>
        ));
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'subject',
      label: 'Oggetto',
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'iun',
      label: 'Codice IUN',
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'group',
      label: 'Gruppi',
      width: '15%',
      getCellLabel(value: string) {
        return (
          value && (
            <TagGroup visibleItems={4}>
              <Tag value={value} />
            </TagGroup>
          )
        );
      },
      onClick(row: Item, column: Column) {
        handleRowClick(row, column);
      },
    },
    {
      id: 'notificationStatus',
      label: 'Stato',
      width: '18%',
      align: 'center',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        const { label, tooltip, color } = getNotificationStatusInfos(value as NotificationStatus);
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
    },
  ];

  const rows: Array<Item> = notifications.map((n: Notification, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  // Navigation handlers
  const handleRowClick = (row: Item, _column: Column) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    // log event
    trackEventByType(TrackEventType.NOTIFICATIONS_GO_TO_DETAIL);
  };

  const filtersApplied: boolean = filterNotificationsTableRef.current.filtersApplied;
  const emptyMessage: string = "L'ente non ha ancora inviato nessuna notifica. Usa le";
  const emptyActionLabel: string = 'Chiavi API';
  const secondaryMessage: object = {
    emptyMessage: 'o fai un',
    emptyActionLabel: 'invio manuale',
    emptyActionCallback: () => {
      onManualSend();
    },
  };
  const EmptyStateProps = {
    emptyMessage: filtersApplied ? undefined : emptyMessage,
    emptyActionLabel: filtersApplied ? undefined : emptyActionLabel,
    disableSentimentDissatisfied: !filtersApplied,
    emptyActionCallback: filtersApplied ? onCancelSearch : onApiKeys,
    secondaryMessage: filtersApplied ? undefined : secondaryMessage,
  };

  return (
    <Fragment>
      {notifications && (
        <Fragment>
          <FilterNotificationsTable ref={filterNotificationsTableRef} />
          {notifications.length > 0 ? (
            <ItemsTable
              columns={columns}
              sort={sort}
              rows={rows}
              onChangeSorting={onChangeSorting}
            />
          ) : (
            <EmptyState {...EmptyStateProps} />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default DesktopNotifications;
