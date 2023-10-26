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
  Item,
  ItemsCard,
  ItemsCardAction,
  ItemsCardActions,
  ItemsCardBody,
  ItemsCardContent,
  ItemsCardContents,
  ItemsCardHeader,
  ItemsCardHeaderTitle,
  KnownSentiment,
  MobileNotificationsSort,
  Notification,
  NotificationStatus,
  Sort,
  StatusTooltip,
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
      position: 'left',
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
      position: 'right',
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
      notWrappedInTypography: true,
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
        <ItemsCard>
          {cardData.map((data) => (
            <ItemsCardBody key={data.id}>
              <ItemsCardHeader
                headerGridProps={{
                  direction: { xs: 'row', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <ItemsCardHeaderTitle
                  key={cardHeader[0].id}
                  gridProps={cardHeader[0].gridProps}
                  position={cardHeader[0].position}
                >
                  {cardHeader[0].getLabel(data[cardHeader[0].id], data)}
                </ItemsCardHeaderTitle>
                <ItemsCardHeaderTitle
                  key={cardHeader[1].id}
                  gridProps={cardHeader[1].gridProps}
                  position={cardHeader[1].position}
                >
                  {cardHeader[1].getLabel(data[cardHeader[1].id], data)}
                </ItemsCardHeaderTitle>
              </ItemsCardHeader>
              <ItemsCardContents>
                {cardBody.map((body) => (
                  <ItemsCardContent key={body.id} body={body}>
                    {body.getLabel(data[body.id], data)}
                  </ItemsCardContent>
                ))}
              </ItemsCardContents>
              <ItemsCardActions>
                {cardActions &&
                  cardActions.map((action) => (
                    <ItemsCardAction
                      testId="cardAction"
                      key={action.id}
                      handleOnClick={() => action.onClick(data)}
                    >
                      {action.component}
                    </ItemsCardAction>
                  ))}
              </ItemsCardActions>
            </ItemsCardBody>
          ))}
        </ItemsCard>
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
