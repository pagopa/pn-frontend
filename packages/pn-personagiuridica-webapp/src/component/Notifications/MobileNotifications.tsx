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
  KnownSentiment,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

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
  /** Card sort */
  sort?: Sort<NotificationColumn>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumn>) => void;
  /** Delegator */
  isDelegatedPage?: boolean;
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

const MobileNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  isDelegatedPage = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');
  const filterNotificationsRef = useRef({
    filtersApplied: false,
    cleanFilters: () => void 0,
  });

  const organization = useAppSelector((state: RootState) => state.userState.user.organization);

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

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
        return (
          <StatusTooltip
            label={label}
            tooltip={tooltip}
            color={color}
            eventTrackingCallback={handleEventTrackingTooltip}
          ></StatusTooltip>
        );
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

  if (isDelegatedPage) {
    const recipientField = {
      id: 'recipients',
      label: t('table.destinatario'),
      getLabel(value: Array<string>) {
        return value.map((v) => (
          <Typography key={v} variant="body2">
            {v}
          </Typography>
        ));
      },
    };

    // eslint-disable-next-line functional/immutable-data
    cardBody.splice(3, 0, recipientField);
  }

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

  const EmptyStateProps = {
    emptyActionCallback: filtersApplied ? filterNotificationsRef.current.cleanFilters : undefined,
    emptyMessage: mainEmptyMessage(filtersApplied, isDelegatedPage, organization, t),
    sentimentIcon: filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE,
  };

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
          <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
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
        <EmptyState {...EmptyStateProps} />
      )}
    </Fragment>
  );
};

export default MobileNotifications;
