import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, Link, Typography } from '@mui/material';
import {
  CardElement,
  CardSort,
  EmptyState,
  KnownSentiment,
  MobileNotificationsSort,
  Notification,
  PnCard,
  PnCardActions,
  PnCardContent,
  PnCardContentItem,
  PnCardHeader,
  PnCardHeaderItem,
  PnCardsList,
  Row,
  Sort,
  formatDate,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';
import NotificationsDataSwitch from './NotificationsDataSwitch';

type Props = {
  notifications: Array<Notification>;
  /** Table sort */
  sort?: Sort<Notification>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<Notification>) => void;
  /** The function to be invoked if the user clicks on new notification link */
  onManualSend: () => void;
  /** The function to be invoked if the user clicks on api keys link */
  onApiKeys: () => void;
  /** True when at least one filter is active (non-default). Used to show the “filtered” EmptyState variant. */
  filtersApplied: boolean;
  /** The function to be invoked if the user clicks on clean filters button */
  onCleanFilters: () => void;
  /** True if the API returned a timeout error */
  hasTimeoutError?: boolean;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
  children?: React.ReactNode;
};

type LinkApiKeyProps = {
  onApiKeys: () => void;
  children?: React.ReactNode;
};

type LinkCreateNotificationProps = {
  onManualSend: () => void;
  children?: React.ReactNode;
};

const LinkRemoveFilters: React.FC<LinkRemoveFiltersProps> = ({ children, cleanFilters }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="remove-filters"
    data-testid="link-remove-filters"
    onClick={cleanFilters}
  >
    {children}
  </Link>
);

const LinkApiKey: React.FC<LinkApiKeyProps> = ({ children, onApiKeys }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="api-keys"
    data-testid="link-api-keys"
    onClick={onApiKeys}
  >
    {children}
  </Link>
);

const LinkCreateNotification: React.FC<LinkCreateNotificationProps> = ({
  children,
  onManualSend,
}) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-second"
    key="create-notification"
    data-testid="link-create-notification"
    onClick={onManualSend}
  >
    {children}
  </Link>
);

const MobileNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  onManualSend,
  onApiKeys,
  filtersApplied,
  onCleanFilters,
  hasTimeoutError = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche', 'common']);

  const cardBody: Array<CardElement<Notification>> = [
    {
      id: 'recipients',
      label: t('table.recipient'),
      wrapValueInTypography: false,
    },
    {
      id: 'subject',
      label: t('table.subject'),
    },
    {
      id: 'iun',
      label: t('table.iun'),
    },
    {
      id: 'group',
      label: t('table.groups'),
      wrapValueInTypography: false,
    },
  ];

  // Navigation handlers
  const handleRowClick = (row: Row<Notification>) => {
    navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun));
  };

  const cardData: Array<Row<Notification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const sortFields = (
    [
      { id: 'sentAt', label: t('table.date') },
      { id: 'recipients', label: t('table.recipient') },
      { id: 'notificationStatus', label: t('table.status') },
    ] as Array<{ id: keyof Notification; label: string }>
  ).reduce((arr, item) => {
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
  }, [] as Array<CardSort<Notification>>);

  const emptyStateContent = (() => {
    if (hasTimeoutError) {
      return <Trans ns="notifiche" i18nKey="empty-state.timeout" />;
    }

    if (filtersApplied) {
      return (
        <Trans
          ns={'notifiche'}
          i18nKey={'empty-state.filtered'}
          components={[<LinkRemoveFilters key={'remove-filters'} cleanFilters={onCleanFilters} />]}
        />
      );
    }

    return (
      <Trans
        ns={'notifiche'}
        i18nKey={'empty-state.no-notifications'}
        components={[
          <LinkApiKey key={'api-keys'} onApiKeys={onApiKeys} />,
          <LinkCreateNotification key={'create-notification'} onManualSend={onManualSend} />,
        ]}
      />
    );
  })();

  return (
    <>
      <Grid container direction="row" sx={{ marginBottom: '16px' }}>
        <Grid item xs={12} textAlign="right">
          {sort && onChangeSorting && (
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
            <PnCard key={data.id} testId="mobileCards">
              <PnCardHeader
                headerGridProps={{
                  direction: { xs: 'row', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <PnCardHeaderItem
                  gridProps={{
                    xs: 4,
                    sm: 5,
                  }}
                  position="left"
                >
                  <Typography>{formatDate(data.sentAt)}</Typography>
                </PnCardHeaderItem>
                <PnCardHeaderItem
                  gridProps={{
                    xs: 8,
                    sm: 7,
                  }}
                  position="right"
                >
                  <NotificationsDataSwitch data={data} type="notificationStatus" />
                </PnCardHeaderItem>
              </PnCardHeader>
              <PnCardContent>
                {cardBody
                  .filter((body) => data[body.id]?.length)
                  .map((body) => (
                    <PnCardContentItem
                      key={body.id}
                      label={body.label}
                      wrapValueInTypography={body.wrapValueInTypography}
                    >
                      <NotificationsDataSwitch data={data} type={body.id} />
                    </PnCardContentItem>
                  ))}
              </PnCardContent>
              <PnCardActions>
                <ButtonNaked
                  endIcon={<ArrowForwardIcon />}
                  color="primary"
                  id="go-to-detail"
                  onClick={() => handleRowClick(data)}
                >
                  {t('table.show-detail')}
                </ButtonNaked>
              </PnCardActions>
            </PnCard>
          ))}
        </PnCardsList>
      ) : (
        <EmptyState
          sentimentIcon={
            hasTimeoutError || filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE
          }
        >
          {emptyStateContent}
        </EmptyState>
      )}
    </>
  );
};

export default MobileNotifications;
