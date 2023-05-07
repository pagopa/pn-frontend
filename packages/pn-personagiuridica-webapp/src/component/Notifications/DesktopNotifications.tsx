import { Fragment, useRef, useState } from 'react';
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

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider, MenuItem,
  Typography
} from "@mui/material";

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { NotificationColumn } from '../../models/Notifications';
import FilterNotifications from './FilterNotifications';
import NotificationMenu from "./NotificationMenu";

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
  /** Defines if the component is in delegated page */
  isDelegatedPage?: boolean;
};

type GroupModalProps = {
  recipient: string;
  group?: string;
};

const DesktopNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  isDelegatedPage = false
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche', 'common']);
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });
  const [openGroupModal, setOpenGroupModal] = useState<undefined | GroupModalProps>(undefined);

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

  const handleModalClose = () => {
    setOpenGroupModal(undefined);
  };

  const handleShowGroup = (row: Item) => {
    setOpenGroupModal({ recipient: row.recipients as string, group: row.group as string});
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
      disableAccessibility: true,
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
      disableAccessibility: true,
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
      disableAccessibility: true,
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
      disableAccessibility: true,
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
      align: 'center',
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
    }
  ];

  if (isDelegatedPage) {
    const recipientField = {
      id: 'recipients' as NotificationColumn,
      label: t('table.destinatario'),
      width: '15%',
      sortable: false,
      getCellLabel(value: string) {
        return value;
      },
      onClick(row: Item) {
        handleRowClick(row);
      },
      disableAccessibility: true,
    };
    const menuField = {
      id: 'menu' as NotificationColumn,
      label: '',
      width: '18%',
      sortable: false,
      getCellLabel(_: string, row: Item) {
        return <NotificationMenu>
          <MenuItem
            data-testid="buttonView"
            onClick={() => handleShowGroup(row)}
          >
            {t('table.view-group')}
          </MenuItem>
        </NotificationMenu>;
      },
    };
    // eslint-disable-next-line functional/immutable-data
    columns.splice(3, 0, recipientField);
    // eslint-disable-next-line functional/immutable-data
    columns.splice(7, 0, menuField);
  }

  const rows: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: n.paProtocolNumber + i.toString(),
  }));

  const handleRouteContacts = () => {
    navigate(routes.RECAPITI);
  };

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  const EmptyStateProps = {
    emptyActionLabel: filtersApplied ? undefined : 'I tuoi Recapiti',
    emptyActionCallback: filtersApplied
      ? filterNotificationsRef.current.cleanFilters
      : handleRouteContacts,
    emptyMessage: filtersApplied
      ? undefined
      : 'Non hai ricevuto nessuna notifica. Vai alla sezione',
    sentimentIcon: filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE,
    secondaryMessage: filtersApplied
      ? undefined
      : {
          emptyMessage:
            'e inserisci uno più recapiti di cortesia: così, se riceverai una notifica, te lo comunicheremo.',
        },
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
      <FilterNotifications
        ref={filterNotificationsRef}
        showFilters={showFilters}
      />
      {rows.length ? (
        <ItemsTable columns={columns} rows={rows} sort={sort} onChangeSorting={onChangeSorting} />
      ) : (
        <EmptyState {...EmptyStateProps} />
      )}
      {openGroupModal !== undefined &&
        <Dialog
          open
          onClick={handleModalClose}
         >
          <Box p={3}>
            <DialogTitle>{t('table.group-modal.title', { recipient: openGroupModal.recipient })}</DialogTitle>
            <DialogContent>
              <Typography my={2} mx={4} fontWeight='bold'>{openGroupModal.group}</Typography>
              <Divider/>
              <Typography my={3}>{t('table.group-modal.body')}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={handleModalClose}
                data-testid="codeCancelButton"
              >
                {t('button.close', { ns: 'common' })}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      }
    </Fragment>
  );
};

export default DesktopNotifications;
