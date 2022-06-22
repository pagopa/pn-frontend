import { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  CardElement,
  CardSort,
  getNotificationStatusInfos,
  Notification,
  ItemsCard,
  EmptyState,
  NotificationStatus,
  Item,
  Sort,
  StatusTooltip,
  CardAction,
  MobileNotificationsSort,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';
import { getNewNotificationBadge } from '../NewNotificationBadge/NewNotificationBadge';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  onCancelSearch: () => void;
  /** Card sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

const MobileNotifications = ({ notifications, sort, onChangeSorting, onCancelSearch }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');
  const filterNotificationsRef = useRef({ filtersApplied: false });
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
                {row.sentAt}
              </Typography>
            </Fragment>
          );
        }
        return <Typography variant="body2">{row.sentAt}</Typography>;
      },
      gridProps: {
        xs: 12,
        sm: 5,
      },
    },
    {
      id: 'status',
      label: t('table.status'),
      getLabel(_, row: Item) {
        const { label, tooltip, color } = getNotificationStatusInfos(
          row.notificationStatus as NotificationStatus
        );
        return <StatusTooltip label={t(label)} tooltip={t(tooltip)} color={color}></StatusTooltip>;
      },
      gridProps: {
        xs: 12,
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

  const sortFields: Array<CardSort> = [
    { id: 'sentAt', label: t('table.data') },
    { id: 'senderId', label: t('table.mittente') },
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
  }, [] as Array<CardSort>);

  const handleRouteContacts = () => {
    navigate(routes.RECAPITI);
  };

  const filtersApplied: boolean = filterNotificationsRef?.current?.filtersApplied;

  const EmptyStateProps = {
    emptyActionLabel: filtersApplied ? undefined : 'Recapiti',
    emptyActionCallback: filtersApplied ? onCancelSearch : handleRouteContacts,
    emptyMessage: filtersApplied
      ? undefined
      : 'Non hai ricevuto nessuna notifica. Attiva il servizio "Piattaforma Notifiche" sull\'app IO o inserisci un recapito di cortesia nella sezione',
    disableSentimentDissatisfied: !filtersApplied,
    secondaryMessage: filtersApplied
      ? undefined
      : {
          emptyMessage: ': così, se riceverai una notifica, te lo comunicheremo.',
        },
  };

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
    // log event
    trackEventByType(TrackEventType.NOTIFICATIONS_GO_TO_DETAIL);
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
          {showFilters &&
          <FilterNotifications ref={filterNotificationsRef} />
          }
        </Grid>
        <Grid item xs={6} textAlign="right">
          {sort && showFilters && onChangeSorting && (
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
          headerGridProps={{ direction: { xs: 'column-reverse', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}
        />
      ) : (
        <EmptyState {...EmptyStateProps} />
      )}
    </Fragment>
  );
};

export default MobileNotifications;
