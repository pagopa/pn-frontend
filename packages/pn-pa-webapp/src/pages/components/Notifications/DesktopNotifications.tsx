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
  KnownSentiment,
} from '@pagopa-pn/pn-commons';

import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import * as routes from '../../../navigation/routes.const';
import { NotificationColumn } from '../../../models/Notifications';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
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

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

  const columns: Array<Column<NotificationColumn>> = [
    {
      id: 'sentAt',
      label: t('table.date'),
      width: '11%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item) {
        handleRowClick(row);
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
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'subject',
      label: t('table.subject'),
      width: '23%',
      getCellLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      width: '20%',
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item) {
        handleRowClick(row);
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
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'notificationStatus',
      label: t('table.status'),
      width: '18%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string, i: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(value as NotificationStatus, {
          recipients: i.recipients as Array<string>,
        });
        return (
          <StatusTooltip
            label={label}
            tooltip={tooltip}
            color={color}
            eventTrackingCallback={handleEventTrackingTooltip}
          />
        );
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
  ];

  const rows: Array<Item> = notifications.map((n: Notification, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    // log event
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION);
  };

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;
  const EmptyStateProps = {
    emptyMessage: filtersApplied ? undefined : t('empty-state.message'),
    emptyActionLabel: filtersApplied ? undefined : t('menu.api-key', { ns: 'common' }),
    sentimentIcon: filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE,
    emptyActionCallback: filtersApplied ? filterNotificationsRef.current.cleanFilters : onApiKeys,
    secondaryMessage: filtersApplied
      ? undefined
      : {
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
          <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
          {notifications.length > 0 ? (
            <ItemsTable
              columns={columns}
              sort={sort}
              rows={rows}
              onChangeSorting={onChangeSorting}
              ariaTitle={t('table.title')}
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
