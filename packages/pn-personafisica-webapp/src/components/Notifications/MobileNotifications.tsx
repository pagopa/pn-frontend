import { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, Link, Typography } from '@mui/material';
import {
  CardAction,
  CardElement,
  CardSort,
  EmptyState,
  Item,
  ItemsCard,
  KnownSentiment,
  MobileNotificationsSort,
  Notification,
  NotificationStatus,
  Sort,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NotificationColumn } from '../../models/Notifications';
import * as routes from '../../navigation/routes.const';
import { Delegator } from '../../redux/delegation/types';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Card sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
  /** Delegator */
  currentDelegator?: Delegator;
};

/**
 * Refers to PN-1741
 * The following line has been added for the solely purpose of preventing
 * the MobileNotificationsSort component to be displayed, as commenting
 * out the relative code would have caused many "variable/prop declared
 * but never used" warnings to arise.
 *
 * To enable the sort functionality again remove the line below and any
 * reference to IS_SORT_ENABLED
 */
const IS_SORT_ENABLED = false;

const LinkRemoveFilters: React.FC<{ cleanFilters: () => void }> = ({ children, cleanFilters }) => {
  const { t } = useTranslation('notifiche');
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-remove-filters')}
      key="remove-filters"
      data-testid="link-remove-filters"
      onClick={cleanFilters}
    >
      {children}
    </Link>
  );
};

const LinkRouteContacts: React.FC = ({ children }) => {
  const { t } = useTranslation('notifiche');
  const navigate = useNavigate();
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-route-contacts')}
      key="route-contacts"
      data-testid="link-route-contacts"
      onClick={() => navigate(routes.RECAPITI)}
    >
      {children}
    </Link>
  );
};

const MobileNotifications = ({ notifications, sort, onChangeSorting, currentDelegator }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'notificationReadStatus',
      label: '',
      getLabel(_value: string, row: Item) {
        const badge = getNewNotificationBadge(row.notificationStatus as NotificationStatus);
        if (badge) {
          return (
            <Fragment>
              <Typography display="inline" sx={{ marginRight: '10px' }}>
                {badge}
              </Typography>
              <Typography display="inline" variant="body2">
                {formatDate(row.sentAt as string)}
              </Typography>
            </Fragment>
          );
        }
        return <Typography variant="body2">{formatDate(row.sentAt as string)}</Typography>;
      },
      gridProps: {
        xs: 4,
        sm: 5,
      },
    },
    {
      id: 'status',
      label: t('table.status'),
      getLabel(_, row: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(
          row.notificationStatus as NotificationStatus,
          { recipients: row.recipients as Array<string> }
        );
        return <StatusTooltip label={label} tooltip={tooltip} color={color}></StatusTooltip>;
      },
      gridProps: {
        xs: 8,
        sm: 7,
      },
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'sender',
      label: t('table.mittente'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
      getLabel(value: string) {
        return value.length > 65 ? value.substring(0, 65) + '...' : value;
      },
    },
    {
      id: 'iun',
      label: t('table.iun'),
      getLabel(value: string) {
        return value;
      },
    },
  ];

  const cardData: Array<Item> = notifications.map((n, i) => ({
    ...n,
    id: i.toString(),
  }));

  const sortFields: Array<CardSort<NotificationColumn>> = [
    { id: 'sentAt' as NotificationColumn, label: t('table.data') },
    { id: 'senderId' as NotificationColumn, label: t('table.mittente') },
  ].reduce((arr, item) => {
    /* eslint-disable functional/immutable-data */
    arr.push(
      {
        id: `${item.id}-asc`,
        label: `${item.label} ${t('sort.asc')}`,
        field: item.id,
        value: 'asc',
      },
      {
        id: `${item.id}-desc`,
        label: `${item.label} ${t('sort.desc')}`,
        field: item.id,
        value: 'desc',
      }
    );
    /* eslint-enable functional/immutable-data */
    return arr;
  }, [] as Array<CardSort<NotificationColumn>>);

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    if (currentDelegator) {
      navigate(
        routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun as string, currentDelegator.mandateId)
      );
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    }
  };

  const cardActions: Array<CardAction> = [
    {
      id: 'go-to-detail',
      component: (
        <ButtonNaked endIcon={<ArrowForwardIcon />} color="primary">
          {t('table.show-detail')}
        </ButtonNaked>
      ),
      onClick: handleRowClick,
    },
  ];

  const showFilters = notifications?.length > 0 || filtersApplied;

  return (
    <Fragment>
      <Grid container direction="row" sx={{ marginBottom: '16px' }}>
        <Grid item xs={6}>
          <FilterNotifications
            ref={filterNotificationsRef}
            showFilters={showFilters}
            currentDelegator={currentDelegator}
          />
        </Grid>
        <Grid item xs={6} textAlign="right">
          {/**
           * Refers to PN-1741
           * See the comment above, where IS_SORT_ENABLE is declared!
           * */}
          {IS_SORT_ENABLED && sort && showFilters && onChangeSorting && (
            <MobileNotificationsSort
              title={t('sort.title')}
              optionsTitle={t('sort.options')}
              cancelLabel={t('sort.cancel')}
              sortFields={sortFields}
              sort={sort}
              onChangeSorting={onChangeSorting}
            />
          )}
        </Grid>
      </Grid>
      {cardData.length ? (
        <ItemsCard
          cardHeader={cardHeader}
          cardBody={cardBody}
          cardData={cardData}
          cardActions={cardActions}
          headerGridProps={{
            direction: { xs: 'row', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        />
      ) : (
        <EmptyState
          sentimentIcon={filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE}
        >
          {filtersApplied && (
            <Trans
              ns={'notifiche'}
              i18nKey={'empty-state.filtered'}
              components={[
                <LinkRemoveFilters
                  key={'remove-filters'}
                  cleanFilters={filterNotificationsRef.current.cleanFilters}
                />,
              ]}
            />
          )}
          {!filtersApplied && currentDelegator && (
            <Trans
              values={{ name: currentDelegator.delegator?.displayName }}
              ns={'notifiche'}
              i18nKey={'empty-state.delegate'}
            />
          )}
          {!filtersApplied && !currentDelegator && (
            <Trans
              ns={'notifiche'}
              i18nKey={'empty-state.no-notifications'}
              components={[<LinkRouteContacts key={'route-contacts'} />]}
            />
          )}
        </EmptyState>
      )}
    </Fragment>
  );
};

export default MobileNotifications;
