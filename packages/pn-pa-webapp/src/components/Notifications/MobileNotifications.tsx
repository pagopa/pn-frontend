import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Grid, Link, Typography } from '@mui/material';
import {
  CardAction,
  CardElement,
  CardSort,
  CustomTagGroup,
  EmptyState,
  KnownSentiment,
  MobileNotificationsSort,
  Notification,
  NotificationStatus,
  PnCard,
  PnCardActions,
  PnCardContent,
  PnCardContentItem,
  PnCardHeader,
  PnCardHeaderTitle,
  PnCardsList,
  Row,
  Sort,
  StatusTooltip,
  formatDate,
  getNotificationStatusInfos,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked, Tag } from '@pagopa/mui-italia';

import { NotificationSortField } from '../../models/Notifications';
import * as routes from '../../navigation/routes.const';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
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

const LinkRemoveFilters: React.FC<{ cleanFilters: () => void }> = ({ children, cleanFilters }) => {
  const { t } = useTranslation(['notifiche']);
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

const LinkApiKey: React.FC<{ onApiKeys: () => void }> = ({ children, onApiKeys }) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-first"
      aria-label={t('empty-state.aria-label-api-keys')}
      key="api-keys"
      data-testid="link-api-keys"
      onClick={onApiKeys}
    >
      {children}
    </Link>
  );
};

const LinkCreateNotification: React.FC<{ onManualSend: () => void }> = ({
  children,
  onManualSend,
}) => {
  const { t } = useTranslation(['notifiche']);
  return (
    <Link
      component={'button'}
      variant="body1"
      id="call-to-action-second"
      aria-label={t('empty-state.aria-label-create-notification')}
      key="create-notification"
      data-testid="link-create-notification"
      onClick={onManualSend}
    >
      {children}
    </Link>
  );
};

const NotificationStatusChip: React.FC<{ data: Row<Notification> }> = ({ data }) => {
  const handleEventTrackingTooltip = () => {
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP);
  };
  const { label, tooltip, color } = getNotificationStatusInfos(data.notificationStatus, {
    recipients: data.recipients,
  });
  return (
    <StatusTooltip
      label={label}
      tooltip={tooltip}
      color={color}
      eventTrackingCallback={handleEventTrackingTooltip}
    ></StatusTooltip>
  );
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

  const cardHeader: [CardElement<Notification>, CardElement<Notification>] = [
    {
      id: 'sentAt',
      position: 'left',
      label: t('table.date'),
      gridProps: {
        xs: 4,
        sm: 5,
      },
    },
    {
      id: 'notificationStatus',
      position: 'right',
      label: t('table.status'),
      gridProps: {
        xs: 8,
        sm: 7,
      },
    },
  ];

  const cardBody: Array<CardElement<Notification>> = [
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
      wrappedInTypography: false,
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
        return value ? (
          <CustomTagGroup visibleItems={1}>
            {[
              <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }} key={row.id}>
                <Tag value={value} />
              </Box>,
            ]}
          </CustomTagGroup>
        ) : null;
      },
      hideIfEmpty: true,
      wrappedInTypography: true,
    },
  ];

  // Navigation handlers
  const handleRowClick = (row: Row<Notification>) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun));
    // log event
    trackEventByType(TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION);
  };

  const cardActions: Array<CardAction<Notification>> = [
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

  const cardData: Array<Row<Notification>> = notifications.map((n: Notification, i: number) => ({
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

  const showFilters = notifications?.length > 0 || filtersApplied;

  return (
    <>
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
        <PnCardsList>
          {cardData.map((data) => (
            <PnCard key={data.id}>
              <PnCardHeader
                headerGridProps={{
                  direction: { xs: 'row', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <PnCardHeaderTitle key="sentAt" gridProps={cardHeader[0].gridProps} position="left">
                  <Typography>{formatDate(data.sentAt)}</Typography>
                </PnCardHeaderTitle>
                <PnCardHeaderTitle
                  key="notificationStatus"
                  gridProps={cardHeader[1].gridProps}
                  position="right"
                >
                  <NotificationStatusChip data={data} />
                </PnCardHeaderTitle>
              </PnCardHeader>
              <PnCardContent>
                {cardBody.map((body) => (
                  <PnCardContentItem key={body.id} label={body.label}>
                    {body.getLabel(data[body.id], data)}
                  </PnCardContentItem>
                ))}
              </PnCardContent>
              <PnCardActions>
                {cardActions && cardActions.map((action) => action.component)}
              </PnCardActions>
            </PnCard>
          ))}
        </PnCardsList>
      ) : (
        <EmptyState
          sentimentIcon={filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE}
        >
          {filtersApplied ? (
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
          ) : (
            <Trans
              ns={'notifiche'}
              i18nKey={'empty-state.no-notifications'}
              components={[
                <LinkApiKey key={'api-keys'} onApiKeys={onApiKeys} />,
                <LinkCreateNotification key={'create-notification'} onManualSend={onManualSend} />,
              ]}
            />
          )}
        </EmptyState>
      )}
    </>
  );
};

export default MobileNotifications;
