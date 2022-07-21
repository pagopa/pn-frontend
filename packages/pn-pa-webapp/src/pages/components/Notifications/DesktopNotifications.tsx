import { Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Notification,
} from '@pagopa-pn/pn-commons';

import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import * as routes from '../../../navigation/routes.const';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
};

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  onManualSend,
  onApiKeys,
}: Props) => {
  const navigate = useNavigate();
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });
  const { t } = useTranslation(['notifiche']);

  const columns: Array<Column> = [
    {
      id: 'sentAt',
      label: t('table.date'),
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
      label: t('table.recipient'),
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
      label: t('table.subject'),
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
      label: t('table.iun'),
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
      label: t('table.groups'),
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
      label: t('table.status'),
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

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;
  const EmptyStateProps = {
    emptyMessage: filtersApplied ? undefined : t('empty-state.message'),
    emptyActionLabel: filtersApplied ? undefined : t('menu.api-key', {ns: 'common'}),
    disableSentimentDissatisfied: !filtersApplied,
    emptyActionCallback: filtersApplied ? filterNotificationsRef.current.cleanFilters : onApiKeys,
    secondaryMessage: filtersApplied ? undefined : {
      emptyMessage: t('empty-state.secondary-message'),
      emptyActionLabel: t('empty-state.secondary-action'),
      emptyActionCallback: () => {
        onManualSend();
      },
    },
  };

  const showFilters = notifications?.length > 0 || filtersApplied;

  return (
    <Fragment>
      {notifications && (
        <Fragment>
          <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters}/>
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
