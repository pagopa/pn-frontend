import { Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Sort,
  Notification,
  getNotificationStatusInfos,
  NotificationStatus,
  StatusTooltip,
  Item,
  ItemsTable,
  EmptyState,
  KnownSentiment,
} from '@pagopa-pn/pn-commons';

import { Typography } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Organization } from '../../redux/auth/types';
import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { NotificationColumn } from '../../models/Notifications';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
  /** Defines if the component is in delegated page */
  isDelegatedPage?: boolean;
};

// to avoid cognitive complexity warning - PN-5323
function mainEmptyMessage(
  filtersApplied: boolean,
  isDelegatedPage: boolean,
  organization: Organization,
  t: any
) {
  return filtersApplied
    ? undefined
    : isDelegatedPage
    ? t('empty-state.delegate', { name: organization.name })
    : t('empty-state.message', { name: organization.name });
}

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  isDelegatedPage = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche', 'common']);
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });

  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

  const columns: Array<Column<NotificationColumn>> = [
    {
      id: 'notificationStatus',
      label: '',
      width: '1%',
      getCellLabel(value: string) {
        return getNewNotificationBadge(value);
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'sentAt',
      label: t('table.data'),
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
      id: 'sender',
      label: t('table.mittente'),
      width: '13%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      width: '22%',
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
      id: 'status',
      label: t('table.status'),
      width: '18%',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(_: string, row: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(
          row.notificationStatus as NotificationStatus,
          { recipients: row.recipients as Array<string> }
        );
        return (
          <StatusTooltip
            label={label}
            tooltip={tooltip}
            color={color}
            eventTrackingCallback={handleEventTrackingTooltip}
          ></StatusTooltip>
        );
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
    },
  ];

  if (isDelegatedPage) {
    const recipientField = {
      id: 'recipients' as NotificationColumn,
      label: t('table.destinatario'),
      width: '15%',
      sortable: false,
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
      disableAccessibility: true,
    };
    // eslint-disable-next-line functional/immutable-data
    columns.splice(3, 0, recipientField);
  }

  const rows: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: n.paProtocolNumber + i.toString(),
  }));

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const EmptyStateProps = {
    emptyActionCallback: filtersApplied ? filterNotificationsRef.current.cleanFilters : undefined,
    emptyMessage: mainEmptyMessage(filtersApplied, isDelegatedPage, organization, t),
    sentimentIcon: filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE,
  };

  const showFilters = notifications?.length > 0 || filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    if (isDelegatedPage) {
      navigate(
        routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun as string, row.mandateId as string)
      );
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    }
    // log event
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION);
  };

  return (
    <Fragment>
      <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
      {rows.length ? (
        <ItemsTable columns={columns} rows={rows} sort={sort} onChangeSorting={onChangeSorting} />
      ) : (
        <EmptyState {...EmptyStateProps} />
      )}
    </Fragment>
  );
};

export default DesktopNotifications;
