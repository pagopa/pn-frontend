import { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Sort,
  Notification,
  CardElement,
  Item,
  getNotificationStatusInfos,
  NotificationStatus,
  StatusTooltip,
  ItemsCard,
  EmptyState,
  CardAction,
  MobileNotificationsSort,
  CardSort,
  KnownSentiment,
  CustomTagGroup,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked, Tag } from '@pagopa/mui-italia';

import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import * as routes from '../../../navigation/routes.const';
import { NotificationSortField } from '../../../models/Notifications';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<NotificationSortField>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationSortField>) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
};

const MobileNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  onManualSend,
  onApiKeys,
}: Props) => {
  const navigate = useNavigate();
  const filterNotificationsRef = useRef({ filtersApplied: false, cleanFilters: () => void 0 });
  const { t } = useTranslation(['notifiche', 'common']);

  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'sentAt',
      label: t('table.date'),
      getLabel(value: string) {
        return <Typography>{value}</Typography>;
      },
      gridProps: {
        xs: 4,
        sm: 5,
      },
    },
    {
      id: 'notificationStatus',
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
      id: 'recipients',
      label: t('table.recipient'),
      getLabel(value: Array<string>) {
        return value.map((v) => (
          <Typography key={v} variant="body2">
            {v}
          </Typography>
        ));
      },
      notWrappedInTypography: true,
    },
    {
      id: 'subject',
      label: t('table.subject'),
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
    {
      id: 'group',
      label: t('table.groups'),
      getLabel(value: string, row: Item) {
        return (
          <CustomTagGroup visibleItems={1}>
            {[
              <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }} key={row.id}>
                <Tag value={value} />
              </Box>,
            ]}
          </CustomTagGroup>
        );
      },
      hideIfEmpty: true,
    },
  ];

  // Navigation handlers
  const handleRowClick = (row: Item) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun as string));
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

  const cardData: Array<Item> = notifications.map((n: Notification, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  const sortFields: Array<CardSort<NotificationSortField>> = [
    { id: 'sentAt' as NotificationSortField, label: t('table.date') },
    { id: 'recipients' as NotificationSortField, label: t('table.recipient') },
    { id: 'notificationStatus' as NotificationSortField, label: t('table.status') },
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
  }, [] as Array<CardSort<NotificationSortField>>);

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
      <Grid container direction="row" sx={{ marginBottom: '16px' }}>
        <Grid item xs={6}>
          <FilterNotifications ref={filterNotificationsRef} showFilters={showFilters} />
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
          cardData={cardData}
          cardHeader={cardHeader}
          cardBody={cardBody}
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
