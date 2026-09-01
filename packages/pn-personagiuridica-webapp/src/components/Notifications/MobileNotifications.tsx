import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Grid } from '@mui/material';
import {
  CardElement,
  CardSort,
  MobileNotificationsSort,
  NotificationColumnData,
  NotificationsRecipientDataSwitch,
  PnCard,
  PnCardActions,
  PnCardContent,
  PnCardContentItem,
  PnCardsList,
  RecipientNotification,
  Row,
  Sort,
} from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

import * as routes from '../../navigation/routes.const';
import NotificationsEmptyState from './NotificationsEmptyState';

type Props = {
  notifications: Array<RecipientNotification>;
  /** Card sort */
  sort?: Sort<NotificationColumnData<RecipientNotification>>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<NotificationColumnData<RecipientNotification>>) => void;
  /** Delegator */
  isDelegatedPage?: boolean;
  /** True when at least one filter is active */
  filtersApplied: boolean;
  /** The function to be invoked if the user clicks on clean filters button */
  onCleanFilters: () => void;
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

const MobileNotifications = ({
  notifications,
  sort,
  onChangeSorting,
  isDelegatedPage = false,
  filtersApplied,
  onCleanFilters,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');

  const cardBody: Array<CardElement<RecipientNotification>> = [
    {
      id: 'sentAt',
      label: t('table.data'),
    },
    {
      id: 'sender',
      label: t('table.mittente'),
      mode: 'truncate',
      wrapValueInTypography: false,
    },
    {
      id: 'subject',
      label: t('table.oggetto'),
    },
  ];

  if (isDelegatedPage) {
    const recipientField: CardElement<RecipientNotification> = {
      id: 'recipients',
      label: t('table.destinatario'),
      wrapValueInTypography: false,
    };

    // eslint-disable-next-line functional/immutable-data
    cardBody.splice(3, 0, recipientField);
  }

  const cardData: Array<Row<RecipientNotification>> = notifications.map((n) => ({
    ...n,
    id: n.iun,
  }));

  const sortFields = (
    [
      { id: 'sentAt', label: t('table.data') },
      { id: 'senderId', label: t('table.mittente') },
    ] as Array<{ id: keyof RecipientNotification; label: string }>
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
  }, [] as Array<CardSort<RecipientNotification>>);

  // Navigation handlers
  const handleRowClick = (row: Row<RecipientNotification>) => {
    const { iun, communicationType, mandateId } = row;

    if (isDelegatedPage && mandateId) {
      return navigate(routes.GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(iun, mandateId));
    }

    return communicationType === 'LEGAL'
      ? navigate(routes.GET_DETTAGLIO_NOTIFICA_PATH(iun))
      : navigate(routes.GET_DETTAGLIO_COMUNICAZIONE_PATH(iun));
  };

  const showFilters = notifications?.length > 0 || filtersApplied;

  return (
    <Fragment>
      <Grid container direction="row" sx={{ marginBottom: '16px' }}>
        <Grid item xs={12} textAlign="right">
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
              <PnCardContent sx={{ mt: 0 }}>
                {cardBody.map((body) => (
                  <PnCardContentItem
                    key={body.id}
                    label={body.label}
                    mode={body.mode}
                    wrapValueInTypography={body.wrapValueInTypography}
                  >
                    <NotificationsRecipientDataSwitch data={data} type={body.id} />
                  </PnCardContentItem>
                ))}
              </PnCardContent>
              <PnCardActions>
                <MIButton
                  variant="text"
                  onClick={() => handleRowClick(data)}
                  endIcon={<ArrowForwardRoundedIcon />}
                  data-testid="go-to-detail"
                >
                  {t('table.open')}
                </MIButton>
              </PnCardActions>
            </PnCard>
          ))}
        </PnCardsList>
      ) : (
        <NotificationsEmptyState
          filtersApplied={filtersApplied}
          onCleanFilters={onCleanFilters}
          isDelegatedPage={isDelegatedPage}
        />
      )}
    </Fragment>
  );
};

export default MobileNotifications;
