import { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, Link } from '@mui/material';
import {
  CardElement,
  CardSort,
  EmptyState,
  KnownSentiment,
  MobileNotificationsSort,
  Notification,
  NotificationColumnData,
  NotificationsDataSwitch,
  PnCard,
  PnCardActions,
  PnCardContent,
  PnCardContentItem,
  PnCardHeader,
  PnCardHeaderItem,
  PnCardsList,
  Row,
  Sort,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import FilterNotifications from './FilterNotifications';

type Props = {
  notifications: Array<Notification>;
  /** Card sort */
  sort?: Sort<NotificationColumnData>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData>) => void;
  /** Delegator */
  isDelegatedPage?: boolean;
};

type LinkRemoveFiltersProps = {
  cleanFilters: () => void;
  children?: React.ReactNode;
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

  const cardBody: Array<CardElement<Notification>> = [
    {
      id: 'sender',
      label: t('table.mittente'),
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
    },
    {
      id: 'iun',
      label: t('table.iun'),
    },
  ];

  if (isDelegatedPage) {
    const recipientField: CardElement<Notification> = {
      id: 'recipients',
      label: t('table.destinatario'),
      wrapValueInTypography: false,
    };

    // eslint-disable-next-line functional/immutable-data
    cardBody.splice(3, 0, recipientField);
  }

  const cardData: Array<Row<Notification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const sortFields = (
    [
      { id: 'sentAt', label: t('table.data') },
      { id: 'senderId', label: t('table.mittente') },
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

  const filtersApplied: boolean = filterNotificationsRef.current.filtersApplied;

  // Navigation handlers
  const handleRowClick = (row: Row<Notification>) => {
    if (isDelegatedPage && row.mandateId) {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(row.iun, row.mandateId));
    } else {
      navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(row.iun));
    }
  };

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
        <PnCardsList>
          {cardData.map((data) => (
            <PnCard key={data.id} testId="mobileNotificationsCards">
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
                  <NotificationsDataSwitch data={data} type="sentAt" />
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
                {cardBody.map((body) => (
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
                  id="go-to-detail"
                  onClick={() => handleRowClick(data)}
                  endIcon={<ArrowForwardIcon />}
                  color="primary"
                >
                  {t('table.show-detail')}
                </ButtonNaked>
              </PnCardActions>
            </PnCard>
          ))}
        </PnCardsList>
      ) : (
        <EmptyState
          sentimentIcon={filtersApplied ? KnownSentiment.DISSATISFIED : KnownSentiment.NONE}
        >
          {filtersApplied && (
            <Trans
              i18nKey={'empty-state.filtered'}
              ns={'notifiche'}
              components={[
                <LinkRemoveFilters
                  key={'remove-filters'}
                  cleanFilters={filterNotificationsRef.current.cleanFilters}
                />,
              ]}
            />
          )}
          {!filtersApplied && isDelegatedPage && (
            <Trans
              i18nKey={'empty-state.delegate'}
              ns={'notifiche'}
              values={{ name: organization.name }}
            />
          )}
          {!filtersApplied && !isDelegatedPage && (
            <Trans
              i18nKey={'empty-state.no-notifications'}
              ns={'notifiche'}
              values={{ name: organization.name }}
            />
          )}
        </EmptyState>
      )}
    </Fragment>
  );
};

export default MobileNotifications;
